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
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../styles';
import { FileData, PickedFile, RegisteredRingMember } from '../../types';
import { useAOTIdentity } from '../../hooks';
import {
  AOTUploadPayload,
  AOTUploadResponse,
  ClientChunkedUploadPayload,
} from '../../services/GatewayApiService';
import { saveKeyPackage } from '../../services/KeyPackageStorage';
import { createEscrowedIdentity } from '../../services/crypto/escrow';
import {
  computeMetadataHash,
  createLsagRingSignature,
  createSchnorrProof,
  generateMasterKey,
  isValidPublicKeyHex,
  normalizeHex,
  toCompressedPublicKey,
} from '../../utils/aotCrypto';
import { API_CONFIG } from '../../config/api';
import { processAndUploadFile, ProgressCallback } from '../../services/ChunkEncryptionService';
import { bytesToHex, randomBytes } from '@noble/hashes/utils';

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
  const [ringWarning, setRingWarning] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const shouldPersistKeyPackage = useMemo(
    () => __DEV__ || (typeof process !== 'undefined' && process.env?.KEY_MONITOR_DEMO === 'true'),
    [],
  );

  const resetState = () => {
    setSelectedMemberKeys([]);
    setSubmitting(false);
    setLocalError(null);
    setMetadataHash(null);
    setMasterKey(null);
    setRingWarning(null);
    setUploadProgress('');
    clearError();
  };

  const selectableMembers = useMemo(() => {
    if (!identity?.publicKey) {
      return otherMembers.filter((member) => isValidPublicKeyHex(member.publicKey));
    }

    const ownerKey = normalizeHex(identity.publicKey);
    const unique = new Map<string, RegisteredRingMember>();

    [...(ringContext?.users ?? []), ...otherMembers].forEach((member) => {
      if (!member?.publicKey) {
        return;
      }
      const normalized = normalizeHex(member.publicKey);
      if (!isValidPublicKeyHex(normalized) || normalized === ownerKey) {
        return;
      }
      if (!unique.has(normalized)) {
        unique.set(normalized, member);
      }
    });

    return Array.from(unique.values());
  }, [identity?.publicKey, otherMembers, ringContext?.users]);

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

        const ownerKey = normalizeHex(ensuredIdentity.publicKey);
        if (!isValidPublicKeyHex(ownerKey)) {
          const message = 'Khóa công khai của bạn không hợp lệ. Vui lòng tạo lại danh tính.';
          setLocalError(message);
          onError?.(message);
          Alert.alert('AOT', message);
          return;
        }

        const contextMembers = Array.from(
          new Set(
            (context.ringMemberPublicKeys || [])
              .map((key) => normalizeHex(key))
              .filter(Boolean),
          ),
        );

        const validMembers = contextMembers.filter(
          (key) => key !== ownerKey && isValidPublicKeyHex(key),
        );
        const invalidCount = contextMembers.length - validMembers.length;

        if (invalidCount > 0) {
          const warningMessage = `Đã bỏ qua ${invalidCount} khóa công khai không hợp lệ khỏi vòng ký.`;
          setRingWarning(warningMessage);
          console.warn('[AOT] Invalid ring member keys filtered', { invalidCount });
        } else {
          setRingWarning(null);
        }

        setSelectedMemberKeys(validMembers);
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
    if (!identity?.publicKey) {
      return [] as string[];
    }
    const normalizedOwner = normalizeHex(identity.publicKey);
    if (!isValidPublicKeyHex(normalizedOwner)) {
      return [] as string[];
    }

    const unique = new Set<string>([normalizedOwner]);
    selectedMemberKeys.forEach((key) => {
      const normalized = normalizeHex(key);
      if (isValidPublicKeyHex(normalized) && normalized !== normalizedOwner) {
        unique.add(normalized);
      }
    });

    // IMPORTANT: Normalize to compressed format BEFORE sorting
    // This ensures the sorting order matches what will be embedded in the signature
    const compressed = Array.from(unique).map((key) => {
      try {
        return toCompressedPublicKey(key);
      } catch (error) {
        console.error('[AOT Upload Modal] Failed to compress key in useMemo:', key, error);
        return null;
      }
    }).filter((key): key is string => key !== null);

    // IMPORTANT: Sort ring members lexicographically to ensure deterministic order
    // This order MUST match the order used during signature creation and backend verification
    return compressed.sort((a, b) => a.localeCompare(b));
  }, [identity?.publicKey, selectedMemberKeys]);

  const toggleMember = (publicKey: string) => {
    const normalized = normalizeHex(publicKey);
    if (!isValidPublicKeyHex(normalized)) {
      console.warn('[AOT] Attempted to toggle invalid ring member key', { publicKey });
      return;
    }

    setSelectedMemberKeys((prev) => {
      if (prev.includes(normalized)) {
        return prev.filter((key) => key !== normalized);
      }
      return [...prev, normalized];
    });
  };

  const handleUpload = async () => {
    if (!identity || !file) {
      return;
    }

    try {
      setSubmitting(true);
      setLocalError(null);
      setUploadProgress('Đang chuẩn bị...');

      // Normalize owner key to compressed format
      const ownerKey = toCompressedPublicKey(identity.publicKey);
      console.log('[AOT Upload Modal] Owner key normalized:', {
        original: identity.publicKey,
        originalLength: identity.publicKey.length,
        compressed: ownerKey,
        compressedLength: ownerKey.length,
      });

      // ringMembers is already compressed and sorted in the useMemo above
      // Just validate and use directly
      const orderedRing = ringMembers.filter((key) => isValidPublicKeyHex(key));

      if (orderedRing.length === 0) {
        throw new Error('Không thể xác định vòng ký hợp lệ');
      }

      console.log('[AOT Upload Modal] Using pre-sorted ring members:', {
        totalCount: orderedRing.length,
        allKeysAreCompressed: orderedRing.every(k => k.length === 66),
      });

      // ========================================================================
      // CLIENT-SIDE CHUNKING & ENCRYPTION (Task A Implementation)
      // ========================================================================
      console.log('[AOT Upload Modal] Starting client-side chunking and encryption...');

      // Progress callback
      const onProgress: ProgressCallback = (progress) => {
        if (progress.stage === 'reading') {
          setUploadProgress('Đang đọc file...');
        } else if (progress.stage === 'chunking') {
          setUploadProgress('Đang chia nhỏ file...');
        } else if (progress.stage === 'encrypting') {
          setUploadProgress(
            `Đang mã hóa (${progress.chunkIndex! + 1}/${progress.totalChunks})...`
          );
        } else if (progress.stage === 'uploading') {
          setUploadProgress(
            `Đang tải lên IPFS (${progress.chunkIndex! + 1}/${progress.totalChunks})...`
          );
        }
      };

      // Process file: chunk, encrypt, and upload to IPFS
      const chunkUploadResult = await processAndUploadFile(
        file,
        API_CONFIG.ipfsGatewayUrl,
        undefined, // Use default chunk size
        onProgress
      );

      console.log('[AOT Upload Modal] Client-side chunking complete:', {
        chunkCount: chunkUploadResult.manifest.length,
        masterKeyLength: chunkUploadResult.masterKey.length,
        keyPackageFingerprint: chunkUploadResult.keyPackageFingerprint,
      });

      const metadataForHash = {
        fileName: file.name || 'unnamed',
        fileSize: file.size ?? 0,
        chunkCount: chunkUploadResult.manifest.length,
      };

      const { metadataHash: computedHash } = await computeMetadataHash(metadataForHash);
      const schnorrProof = await createSchnorrProof(computedHash, identity.privateKey);

      console.log('[AOT Upload Modal] Schnorr proof created:', {
        metadataHash: computedHash,
      });

      let ringSignaturePayload: Record<string, any> | null = null;
      if (orderedRing.length >= 2) {
        const signerIndex = orderedRing.findIndex(
          (key) => normalizeHex(key) === normalizeHex(ownerKey),
        );

        if (signerIndex === -1) {
          throw new Error('Owner key not found in ring members');
        }

        ringSignaturePayload = await createLsagRingSignature({
          message: computedHash,
          ringPublicKeys: orderedRing,
          signerIndex,
          signerPrivateKey: identity.privateKey,
        });

        console.log('[AOT Upload Modal] Ring signature created');
      }


      // ========================================================================
      // Send manifest to backend
      // ========================================================================
      setUploadProgress('Đang gửi thông tin đến server...');

      const { createDefaultGatewayService } = await import('../../services/GatewayApiService');
      const gatewayService = createDefaultGatewayService();

      setUploadProgress('Đang xin ValidationToken...');
      const nonce = bytesToHex(randomBytes(16));
      const tokenTimestamp = Date.now();
      const validationToken = await gatewayService.requestValidationToken({
        userPublicKey: ownerKey,
        fileMetadataHash: computedHash,
        timestamp: tokenTimestamp,
        nonce,
      });

      setUploadProgress('Đang mã hóa danh tính...');
      const escrowedIdentity = await createEscrowedIdentity(
        identity.publicKey,
        validationToken.adjudicatorPublicKey,
      );

      const uploadPayload: ClientChunkedUploadPayload = {
        fileName: file.name || 'unnamed',
        fileSize: file.size ?? 0,
        mimeType: file.type || 'application/octet-stream',
        chunkCount: chunkUploadResult.manifest.length,
        chunks: chunkUploadResult.manifest,
        metadataHash: computedHash,
        ownershipPublicKey: ownerKey,
        encryptedChunkKeys: chunkUploadResult.encryptedChunkKeys,
        keyPackageFingerprint: chunkUploadResult.keyPackageFingerprint,
        ringSignature: ringSignaturePayload ? JSON.stringify(ringSignaturePayload) : undefined,
        escrowedIdentity,
        ringMembers: orderedRing,
        validationToken,
        timestamp: tokenTimestamp,
        nonce,
        schnorr: {
          R: schnorrProof.R,
          s: schnorrProof.s,
          message: computedHash,
          publicKey: ownerKey,
        },
      };

      console.log('[AOT Upload Modal] About to call uploadWithClientChunking, payload keys:', Object.keys(uploadPayload));
      const uploadResponse = await gatewayService.uploadWithClientChunking(uploadPayload);

      console.log('[AOT Upload Modal] Backend response received:', {
        fileId: uploadResponse.fileId,
        success: uploadResponse.success,
      });

      // ========================================================================
      // Save key package locally (IMPORTANT for decryption)
      // ========================================================================
      if (shouldPersistKeyPackage) {
        try {
          const keyPackageForSharing = {
            fileId: uploadResponse.fileId,
            masterKey: chunkUploadResult.masterKey,
            chunkKeys: chunkUploadResult.chunkKeys,
            fingerprint: chunkUploadResult.keyPackageFingerprint,
          };
          await saveKeyPackage(uploadResponse.fileId, {
            masterKey: chunkUploadResult.masterKey,
            chunkKeys: chunkUploadResult.chunkKeys,
            fingerprint: chunkUploadResult.keyPackageFingerprint,
          });
          console.log('[AOT Upload Modal] Key package saved locally');
          if (__DEV__) {
            console.log('[AOT Upload Modal] Share this key package JSON:\n', JSON.stringify(keyPackageForSharing, null, 2));
            console.log('[AOT Upload Modal] Paste on device B console:\n',
              `await saveKeyPackage("${uploadResponse.fileId}", ${JSON.stringify({
                masterKey: chunkUploadResult.masterKey,
                chunkKeys: chunkUploadResult.chunkKeys,
                fingerprint: chunkUploadResult.keyPackageFingerprint,
              }, null, 2)});`
            );
          }
        } catch (storageError) {
          console.warn('[AOT Upload Modal] Failed to persist key package', storageError);
        }
      }

      // Create file data for UI
      const fileData: FileData = {
        id: uploadResponse.fileId,
        name: uploadResponse.fileName,
        size: uploadResponse.totalSize,
        uploadTime: new Date(),
        status: 'completed',
        ipfsHash: uploadResponse.chunks?.[0]?.cid,
        metadataHash: computedHash,
        ownershipPublicKey: ownerKey,
        masterKey: chunkUploadResult.masterKey,
        hasLocalKey: true,
        keyStatus: 'client-managed',
        keyPackageFingerprint: chunkUploadResult.keyPackageFingerprint,
        localKeyPackage: {
          masterKey: chunkUploadResult.masterKey,
          chunkKeys: chunkUploadResult.chunkKeys,
          fingerprint: chunkUploadResult.keyPackageFingerprint,
          storedAt: new Date().toISOString(),
        },
        ringMembers: orderedRing,
        chunkCount: uploadResponse.chunkCount,
        chunks: uploadResponse.chunks,
      };

      setMetadataHash(computedHash);
      setMasterKey(chunkUploadResult.masterKey);
      setUploadProgress('Hoàn tất!');

      onUploaded?.(fileData);
      Alert.alert('AOT', 'Upload thành công với AOT!\n\nFile đã được chia nhỏ, mã hóa và lưu trữ an toàn trên IPFS.');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload thất bại';
      setLocalError(message);
      onError?.(message);
      Alert.alert('AOT', message);
      console.error('[AOT Upload Modal] Upload error:', err);
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: colors.background,
        },
        sheet: {
          flex: 1,
        },
        scroll: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
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
        keyLabelSpacing: {
          marginTop: 12,
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
        },
        footerContainer: {
          paddingHorizontal: 24,
          paddingBottom: 24,
          paddingTop: 12,
          backgroundColor: colors.background,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
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
        warningText: {
          color: colors.warning,
          marginBottom: 12,
        },
        progressText: {
          color: colors.info,
          marginBottom: 12,
          fontWeight: '500',
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
        emptyMemberText: {
          color: colors.textSecondary,
        },
        loaderSpacing: {
          marginTop: 16,
        },
      }),
    [colors],
  );

  if (!visible || !file) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Hoàn tất Upload với AOT</Text>

            {identityError ? <Text style={styles.errorText}>{identityError}</Text> : null}
            {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
            {ringWarning ? <Text style={styles.warningText}>{ringWarning}</Text> : null}
            {uploadProgress ? <Text style={styles.progressText}>{uploadProgress}</Text> : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Khóa của bạn</Text>
              <View style={styles.keyContainer}>
                <Text style={styles.keyLabel}>Public Key</Text>
                <Text style={styles.keyValue}>{identity ? identity.publicKey : 'Đang tạo...'}</Text>
                <Text style={[styles.keyLabel, styles.keyLabelSpacing]}>Secret Key</Text>
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
                    key={member.publicKey}
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
                <Text style={styles.emptyMemberText}>
                  Chưa có người dùng khác trong vòng ký. Bạn có thể upload với 1 thành viên.
                </Text>
              ) : null}
            </View>
            {(initializing || isLoading) && !submitting ? (
              <ActivityIndicator style={styles.loaderSpacing} color={colors.primary} />
            ) : null}
          </ScrollView>

          <View style={styles.footerContainer}>
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
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AOTUploadModal;
