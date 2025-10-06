import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../styles';
import { FileData, PickedFile, RegisteredRingMember } from '../../types';
import { useAOTIdentity } from '../../hooks';
import {
  AOTUploadPayload,
  AOTUploadResponse,
} from '../../services/GatewayApiService';
import {
  computeMetadataHash,
  createLsagRingSignature,
  createSchnorrProof,
  generateMasterKey,
  normalizeHex,
} from '../../utils/aotCrypto';

interface AOTUploadModalProps {
  visible: boolean;
  file: PickedFile | null;
  onClose: () => void;
  uploadFileWithAOT: (
    payload: AOTUploadPayload,
  ) => Promise<{ success: boolean; response?: AOTUploadResponse; error?: string }>;
  onUploaded?: (file: FileData) => void;
  onError?: (error: string) => void;
}

const formatKey = (key: string) => `${key.slice(0, 8)}…${key.slice(-6)}`;

const isHexString = (value: string | null | undefined): value is string =>
  typeof value === 'string' && /^[0-9a-f]+$/i.test(value);

export const AOTUploadModal: React.FC<AOTUploadModalProps> = ({
  visible,
  file,
  onClose,
  uploadFileWithAOT,
  onUploaded,
  onError,
}) => {
  const { colors } = useTheme();
  const {
    identity,
    otherMembers,
    ringContext,
    ensureIdentity,
    refreshContext,
    isLoading,
    error: identityError,
    clearError,
  } = useAOTIdentity();

  const [selectedMemberKeys, setSelectedMemberKeys] = useState<string[]>([]);
  const [initializing, setInitializing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [metadataHash, setMetadataHash] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState<string | null>(null);

  const resetState = () => {
    setSelectedMemberKeys([]);
    setSubmitting(false);
    setLocalError(null);
    setMetadataHash(null);
    setMasterKey(null);
    clearError();
  };

  const selectableMembers = useMemo(() => {
    if (!identity) {
      return otherMembers;
    }

    const unique = new Map<string, RegisteredRingMember>();
    [...(ringContext?.users ?? []), ...otherMembers].forEach((member) => {
      if (member.publicKey !== identity.publicKey) {
        unique.set(member.publicKey, member);
      }
    });

    return Array.from(unique.values());
  }, [identity, otherMembers, ringContext?.users]);

  useEffect(() => {
    if (!visible) {
      resetState();
      return;
    }

    if (!file) {
      return;
    }

    let cancelled = false;
    const initialize = async () => {
      try {
        setInitializing(true);
        const ensuredIdentity = await ensureIdentity();
        const context = await refreshContext();
        if (cancelled) {
          return;
        }

        const defaultSelection = (context.ringMemberPublicKeys || [])
          .map((key) => normalizeHex(key))
          .filter((key) => key !== normalizeHex(ensuredIdentity.publicKey));
        setSelectedMemberKeys(defaultSelection);
      } catch (err) {
        if (cancelled) {
          return;
        }
        const message = err instanceof Error ? err.message : 'Không thể khởi tạo AOT';
        setLocalError(message);
        onError?.(message);
        Alert.alert('AOT', message);
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, file]);

  const ringMembers = useMemo(() => {
    if (!identity) {
      return [] as string[];
    }
    const normalizedOwner = normalizeHex(identity.publicKey);
    const unique = new Set<string>([normalizedOwner, ...selectedMemberKeys.map(normalizeHex)]);
    return Array.from(unique);
  }, [identity, selectedMemberKeys]);

  const toggleMember = (publicKey: string) => {
    setSelectedMemberKeys((prev) => {
      const normalized = normalizeHex(publicKey);
      if (prev.map(normalizeHex).includes(normalized)) {
        return prev.filter((key) => normalizeHex(key) !== normalized);
      }
      return [...prev, publicKey];
    });
  };

  const handleUpload = async () => {
    if (!identity || !file) {
      return;
    }

    try {
      setSubmitting(true);
      setLocalError(null);

      const orderedRing = ringMembers;
      if (orderedRing.length < 1) {
        throw new Error('Không thể xác định vòng ký');
      }

      const metadataPayload = {
        fileName: file.name || 'unnamed',
        fileSize: file.size ?? 0,
        mimeType: file.type || 'application/octet-stream',
        createdAt: new Date().toISOString(),
        ownerIdentifier: identity.identifier,
        ownerPublicKey: identity.publicKey,
        ringMembers: orderedRing,
      };

      const { metadataHash: computedHash } = await computeMetadataHash(metadataPayload);
      const schnorrProof = await createSchnorrProof(computedHash, identity.privateKey);

      let ringSignaturePayload: Record<string, any> | null = null;
      if (orderedRing.length >= 2) {
        const signerIndex = orderedRing.findIndex(
          (key) => normalizeHex(key) === normalizeHex(identity.publicKey),
        );

        ringSignaturePayload = await createLsagRingSignature({
          message: computedHash,
          ringPublicKeys: orderedRing,
          signerIndex: signerIndex === -1 ? 0 : signerIndex,
          signerPrivateKey: identity.privateKey,
        });
      }

      const masterKeyValue = generateMasterKey();

      const response = await uploadFileWithAOT({
        file,
        metadataHash: computedHash,
        ownershipPublicKey: identity.publicKey,
        ringSignature: ringSignaturePayload ? JSON.stringify(ringSignaturePayload) : undefined,
        escrowedIdentity: identity.escrowedIdentity || `escrow:${identity.identifier}`,
        ringMembers: orderedRing,
        schnorr: {
          R: schnorrProof.R,
          s: schnorrProof.s,
          message: computedHash,
          publicKey: identity.publicKey,
        },
      });

      if (!response.success || !response.response) {
        throw new Error(response.error || 'Upload thất bại');
      }

      const uploadResponse = response.response;
      const fileData: FileData = {
        id: uploadResponse.fileId || `${Date.now()}`,
        name: uploadResponse.name || file.name || 'unnamed',
        size: uploadResponse.size || file.size || 0,
        uploadTime: new Date(),
        status: 'completed',
        ipfsHash: uploadResponse.cid,
        metadataHash: computedHash,
        ownershipPublicKey: identity.publicKey,
        masterKey: masterKeyValue,
        ringMembers: orderedRing,
      };

      setMetadataHash(computedHash);
      setMasterKey(masterKeyValue);
      onUploaded?.(fileData);
      Alert.alert('AOT', 'Upload thành công với AOT!');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload thất bại';
      setLocalError(message);
      onError?.(message);
      Alert.alert('AOT', message);
    } finally {
      setSubmitting(false);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: colors.background,
        },
        container: {
          flex: 1,
          padding: 24,
        },
        title: {
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 12,
        },
        section: {
          marginBottom: 20,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 8,
        },
        keyContainer: {
          backgroundColor: colors.surface,
          borderRadius: 8,
          padding: 12,
        },
        keyLabel: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.textSecondary,
        },
        keyValue: {
          fontFamily: 'monospace',
          fontSize: 12,
          color: colors.info,
          marginTop: 4,
        },
        memberItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        memberInfo: {
          flex: 1,
          marginRight: 12,
        },
        memberName: {
          fontSize: 14,
          fontWeight: '500',
          color: colors.text,
        },
        memberKey: {
          fontFamily: 'monospace',
          fontSize: 12,
          color: colors.textSecondary,
          marginTop: 4,
        },
        checkbox: {
          width: 20,
          height: 20,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
        },
        checkboxFilled: {
          backgroundColor: colors.primary,
        },
        checkboxIndicator: {
          width: 10,
          height: 10,
          borderRadius: 3,
          backgroundColor: colors.onPrimary,
        },
        footer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
        },
        button: {
          flex: 1,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: 'center',
        },
        buttonPrimary: {
          backgroundColor: colors.primary,
          marginLeft: 8,
        },
        buttonSecondary: {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          marginRight: 8,
        },
        buttonText: {
          color: colors.onPrimary,
          fontWeight: '600',
        },
        buttonSecondaryText: {
          color: colors.text,
          fontWeight: '600',
        },
        errorText: {
          color: colors.error,
          marginBottom: 12,
        },
        pill: {
          alignSelf: 'flex-start',
          borderRadius: 999,
          backgroundColor: colors.info,
          paddingHorizontal: 8,
          paddingVertical: 4,
          marginTop: 6,
        },
        pillText: {
          color: colors.white,
          fontSize: 12,
          fontWeight: '600',
        },
      }),
    [colors],
  );

  if (!visible || !file) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Hoàn tất Upload với AOT</Text>

          {identityError ? <Text style={styles.errorText}>{identityError}</Text> : null}
          {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Khóa của bạn</Text>
            <View style={styles.keyContainer}>
              <Text style={styles.keyLabel}>Public Key</Text>
              <Text style={styles.keyValue}>{identity ? identity.publicKey : 'Đang tạo...'}</Text>
              <Text style={[styles.keyLabel, { marginTop: 12 }]}>Secret Key</Text>
              <Text style={styles.keyValue}>{identity ? identity.privateKey : 'Đang tạo...'}</Text>
              {masterKey ? (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>Master Key: {formatKey(masterKey)}</Text>
                </View>
              ) : null}
              {metadataHash ? (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>Metadata Hash: {formatKey(metadataHash)}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Chọn Public Key tham gia vòng ký ({ringMembers.length} người)
            </Text>
            {selectableMembers.map((member) => {
              const normalized = normalizeHex(member.publicKey);
              const isSelected = ringMembers.includes(normalized);
              return (
                <TouchableOpacity
                  key={member.userId || member.publicKey}
                  style={styles.memberItem}
                  onPress={() => toggleMember(member.publicKey)}
                >
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.displayName || member.identifier}</Text>
                    <Text style={styles.memberKey}>{formatKey(member.publicKey)}</Text>
                  </View>
                  <View style={[styles.checkbox, isSelected && styles.checkboxFilled]}>
                    {isSelected ? <View style={styles.checkboxIndicator} /> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
            {selectableMembers.length === 0 ? (
              <Text style={{ color: colors.textSecondary }}>
                Chưa có người dùng khác trong vòng ký. Bạn có thể upload với 1 thành viên.
              </Text>
            ) : null}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => {
                resetState();
                onClose();
              }}
              disabled={submitting}
            >
              <Text style={styles.buttonSecondaryText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleUpload}
              disabled={submitting || initializing || isLoading}
            >
              {submitting ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.buttonText}>Upload</Text>
              )}
            </TouchableOpacity>
          </View>

          {(initializing || isLoading) && !submitting ? (
            <ActivityIndicator style={{ marginTop: 16 }} color={colors.primary} />
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AOTUploadModal;
