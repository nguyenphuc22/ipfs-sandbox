import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';

import { useTheme } from '../../styles';
import { FileData } from '../../types';
import {
  AnonymousGrantRecord,
  GrantAccessResponse,
  RevokeAccessResponse,
  anonymousFileAccessService,
} from '../../services/AnonymousFileAccessService';
import { FilePickerService } from '../../services/FilePickerService';
import { getKeyPackage, saveKeyPackage, StoredKeyPackage } from '../../services/KeyPackageStorage';
import { normalizeHex, toCompressedPublicKey } from '../../utils/aotCrypto';

interface AccessManagerModalProps {
  visible: boolean;
  file: FileData | null;
  onClose: () => void;
  onGranted?: (response: GrantAccessResponse) => void;
  onRevoked?: (response: RevokeAccessResponse) => void;
}

const truncate = (value: string | null | undefined, prefix = 10, suffix = 6) => {
  if (!value) {
    return '';
  }
  const normalized = value.trim();
  if (normalized.length <= prefix + suffix) {
    return normalized;
  }
  return `${normalized.slice(0, prefix)}…${normalized.slice(-suffix)}`;
};

const serializeKeyPackage = (fileId: string, keyPackage: StoredKeyPackage | null) => {
  if (!keyPackage) {
    return null;
  }

  return JSON.stringify(
    {
      fileId,
      masterKey: keyPackage.masterKey,
      chunkKeys: keyPackage.chunkKeys,
      fingerprint: keyPackage.fingerprint,
      storedAt: keyPackage.storedAt,
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  );
};

const DEFAULT_EXPIRY_DAYS = '30';

export const AccessManagerModal: React.FC<AccessManagerModalProps> = ({
  visible,
  file,
  onClose,
  onGranted,
  onRevoked,
}) => {
  const { colors } = useTheme();

  const [recipientKey, setRecipientKey] = useState('');
  const [expiryDays, setExpiryDays] = useState<string>(DEFAULT_EXPIRY_DAYS);
  const [includeKeyPackage, setIncludeKeyPackage] = useState(true);
  const [storedKeyPackage, setStoredKeyPackage] = useState<StoredKeyPackage | null>(null);
  const [grantResult, setGrantResult] = useState<AnonymousGrantRecord | null>(null);
  const [grantError, setGrantError] = useState<string | null>(null);
  const [grantLoading, setGrantLoading] = useState(false);

  const [grants, setGrants] = useState<AnonymousGrantRecord[]>([]);
  const [grantsLoading, setGrantsLoading] = useState(false);
  const [grantsError, setGrantsError] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<'active' | 'revoked'>('active');
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const filePicker = useMemo(() => new FilePickerService(), []);

  const keyPackageJson = useMemo(
    () => (file ? serializeKeyPackage(file.id, storedKeyPackage) : null),
    [file, storedKeyPackage],
  );

  const loggedKeyPackageRef = useRef<string | null>(null);
  useEffect(() => {
    if (visible && keyPackageJson && includeKeyPackage) {
      if (loggedKeyPackageRef.current !== keyPackageJson) {
        console.log('[AccessManagerModal] Key package JSON ready to share:\n', keyPackageJson);
        loggedKeyPackageRef.current = keyPackageJson;
      }
    } else if (!visible) {
      loggedKeyPackageRef.current = null;
    }
  }, [visible, keyPackageJson, includeKeyPackage]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: '#00000088',
          justifyContent: 'flex-end',
        },
        container: {
          maxHeight: '90%',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 36,
          backgroundColor: colors.surface,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        },
        title: {
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
        },
        subtitle: {
          fontSize: 12,
          color: colors.textSecondary,
        },
        section: {
          marginBottom: 20,
        },
        sectionTitleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        },
        sectionTitle: {
          fontSize: 14,
          fontWeight: '600',
          color: colors.text,
        },
        sectionAction: {
          fontSize: 12,
          color: colors.primary,
        },
        pillRow: {
          flexDirection: 'row',
          borderRadius: 16,
          backgroundColor: colors.background,
          padding: 4,
          gap: 6,
        },
        pillButton: {
          flex: 1,
          paddingVertical: 6,
          borderRadius: 12,
          alignItems: 'center',
        },
        pillButtonActive: {
          backgroundColor: colors.primary,
        },
        pillButtonText: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.primary,
        },
        pillButtonTextActive: {
          color: colors.onPrimary,
        },
        grantCard: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 14,
          padding: 12,
          marginBottom: 12,
          backgroundColor: colors.background,
        },
        grantHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 6,
        },
        grantHash: {
          fontFamily: 'monospace',
          fontSize: 12,
          color: colors.text,
        },
        grantBadge: {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 10,
        },
        badgeActive: {
          backgroundColor: colors.success + '1F',
        },
        badgeRevoked: {
          backgroundColor: colors.error + '1F',
        },
        badgePending: {
          backgroundColor: colors.warning + '1F',
        },
        badgeText: {
          fontSize: 11,
          fontWeight: '600',
        },
        badgeActiveText: {
          color: colors.success,
        },
        badgeRevokedText: {
          color: colors.error,
        },
        badgePendingText: {
          color: colors.warning,
        },
        grantMeta: {
          fontSize: 11,
          color: colors.textSecondary,
          marginBottom: 2,
        },
        grantActions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 12,
          marginTop: 10,
        },
        ghostButton: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
        },
        ghostButtonText: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.text,
        },
        dangerButton: {
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 10,
          backgroundColor: colors.error,
        },
        dangerButtonDisabled: {
          opacity: 0.6,
        },
        dangerButtonText: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.onError,
        },
        inputLabel: {
          fontSize: 13,
          fontWeight: '600',
          color: colors.textSecondary,
          marginBottom: 6,
        },
        textInput: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 14,
          color: colors.text,
          minHeight: 50,
        },
        helperRow: {
          flexDirection: 'row',
          gap: 12,
          marginTop: 10,
        },
        helperButton: {
          flex: 1,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          paddingVertical: 10,
          alignItems: 'center',
        },
        helperButtonText: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.text,
        },
        toggleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        },
        toggleLabel: {
          flex: 1,
          fontSize: 13,
          color: colors.text,
          marginRight: 12,
        },
        expiryRow: {
          marginTop: 12,
        },
        errorText: {
          fontSize: 12,
          color: colors.error,
          marginTop: 8,
        },
        footer: {
          flexDirection: 'row',
          gap: 12,
          marginTop: 28,
        },
        secondaryButton: {
          flex: 1,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          paddingVertical: 14,
          alignItems: 'center',
        },
        secondaryButtonText: {
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
        },
        primaryButton: {
          flex: 1,
          borderRadius: 12,
          backgroundColor: colors.primary,
          paddingVertical: 14,
          alignItems: 'center',
        },
        primaryButtonDisabled: {
          opacity: 0.6,
        },
        primaryButtonText: {
          fontSize: 15,
          fontWeight: '600',
          color: colors.onPrimary,
        },
        grantSummary: {
          marginTop: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.success + '40',
          backgroundColor: colors.success + '18',
          padding: 12,
        },
        grantSummaryText: {
          fontSize: 12,
          color: colors.text,
        },
        emptyState: {
          paddingVertical: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          backgroundColor: colors.background,
        },
        emptyIcon: {
          fontSize: 32,
          marginBottom: 6,
        },
        emptyText: {
          fontSize: 13,
          color: colors.textSecondary,
          textAlign: 'center',
        },
      }),
    [colors],
  );

  const resetDraftState = useCallback(() => {
    setRecipientKey('');
    setExpiryDays(DEFAULT_EXPIRY_DAYS);
    setIncludeKeyPackage(true);
    setGrantResult(null);
    setGrantError(null);
  }, []);

  const hydrateKeyPackage = useCallback(async () => {
    if (!visible || !file) {
      return;
    }
    try {
      const pkg = await getKeyPackage(file.id);
      setStoredKeyPackage(pkg);
      setIncludeKeyPackage(!!pkg);
    } catch (error) {
      console.warn('[AccessManagerModal] Failed to load key package', error);
      setStoredKeyPackage(null);
      setIncludeKeyPackage(false);
    }
  }, [file, visible]);

  const loadGrants = useCallback(async () => {
    if (!visible || !file) {
      return;
    }
    setGrantsError(null);
    try {
      setGrantsLoading(true);
      const cached = await anonymousFileAccessService.getCachedOwnerGrants(file.id);
      if (cached) {
        setGrants(cached);
      }
      const fresh = await anonymousFileAccessService.syncGrantJournal(file.id);
      setGrants(fresh);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể tải danh sách quyền.';
      setGrantsError(message);
    } finally {
      setGrantsLoading(false);
    }
  }, [file, visible]);

  useEffect(() => {
    if (visible && file) {
      resetDraftState();
      void hydrateKeyPackage();
      void loadGrants();
    } else {
      setGrants([]);
      setSelectedSegment('active');
      setGrantsError(null);
    }
  }, [visible, file, resetDraftState, hydrateKeyPackage, loadGrants]);

  const extractKeyFromContent = useCallback((raw: string): string | null => {
    if (!raw) {
      return null;
    }
    const trimmed = raw.trim();
    if (!trimmed) {
      return null;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const candidate =
        parsed?.publicKey ||
        parsed?.targetPublicKey ||
        parsed?.recipientPublicKey ||
        parsed?.ownerPublicKey ||
        parsed?.key;
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate.trim();
      }
    } catch (error) {
      // ignore JSON parse error
    }

    if (trimmed.includes('\n')) {
      const lines = trimmed
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const hexLine = lines.find((line) => /^[0-9a-fA-F]{64,130}$/.test(line));
      if (hexLine) {
        return hexLine;
      }
    }

    if (/^[0-9a-fA-F]{64,130}$/.test(trimmed)) {
      return trimmed;
    }

    return null;
  }, []);

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const clipboardText = await Clipboard.getString();
      const key = extractKeyFromContent(clipboardText);
      if (!key) {
        Alert.alert('Clipboard', 'Không tìm thấy public key hợp lệ trong clipboard.');
        return;
      }
      setRecipientKey(key);
      setGrantError(null);
    } catch (error) {
      Alert.alert('Clipboard', 'Không thể đọc dữ liệu từ clipboard.');
    }
  }, [extractKeyFromContent]);

  const handleImportFromFile = useCallback(async () => {
    try {
      const pickedFile = await filePicker.pickSingleFile({
        type: ['plainText', 'txt', 'csv', 'allFiles'],
        copyTo: 'cachesDirectory',
      });

      if (!pickedFile || !pickedFile.uri) {
        return;
      }

      const uri = pickedFile.fileCopyUri || pickedFile.uri;
      const normalizedUri = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
      const content = await RNFS.readFile(normalizedUri, 'utf8');
      const key = extractKeyFromContent(content);

      if (!key) {
        Alert.alert('Import', 'Không tìm thấy public key hợp lệ trong tệp đã chọn.');
        return;
      }

      setRecipientKey(key);
      setGrantError(null);
    } catch (error: any) {
      if (error?.code === 'DOCUMENT_PICKER_CANCELED' || error?.code === 'OPERATION_CANCELED') {
        return;
      }
      const message = error instanceof Error ? error.message : 'Không thể nhập public key từ tệp.';
      setGrantError(message);
      Alert.alert('Import thất bại', message);
    }
  }, [extractKeyFromContent, filePicker]);

  const formatGrantDate = useCallback((value: string | null) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleString('vi-VN');
  }, []);

  const activeGrants = useMemo(
    () => grants.filter((grant) => grant.status === 'active'),
    [grants],
  );

  const revokedGrants = useMemo(
    () => grants.filter((grant) => grant.status !== 'active'),
    [grants],
  );

  const grantsToRender = selectedSegment === 'active' ? activeGrants : revokedGrants;

  const handleGrantAccess = useCallback(async () => {
    if (!file) {
      return;
    }

    const trimmedKey = recipientKey.trim();
    if (!trimmedKey) {
      setGrantError('Vui lòng nhập public key của người nhận.');
      return;
    }

    try {
      toCompressedPublicKey(trimmedKey);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Public key không hợp lệ.';
      setGrantError(message);
      return;
    }

    let expiresAt: Date | undefined;
    if (expiryDays) {
      const parsed = Number(expiryDays);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        setGrantError('Thời hạn hết hạn phải là số dương.');
        return;
      }
      expiresAt = new Date(Date.now() + parsed * 24 * 60 * 60 * 1000);
    }

    try {
      setGrantLoading(true);
      setGrantError(null);

      const fingerprint = includeKeyPackage
        ? storedKeyPackage?.fingerprint || file.keyPackageFingerprint || null
        : null;

      const response = await anonymousFileAccessService.grantAccess({
        fileId: file.id,
        targetPublicKey: trimmedKey,
        keyPackageFingerprint: fingerprint || undefined,
        expiresAt,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          grantedFrom: 'mobile-app',
        },
      });

      setGrantResult(response.grant);
      setRecipientKey('');
      onGranted?.(response);

      const updated = await anonymousFileAccessService.syncGrantJournal(file.id);
      setGrants(updated);

      if (includeKeyPackage && keyPackageJson) {
        Clipboard.setString(keyPackageJson);
        Alert.alert(
          'Cấp quyền thành công',
          'Key package đã được copy vào clipboard. Bạn có thể dán vào ứng dụng chia sẻ hoặc tạo QR code để gửi cho người nhận.',
        );
      } else {
        Alert.alert('Cấp quyền thành công', 'Đã thêm public key vào danh sách truy cập.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cấp quyền truy cập.';
      setGrantError(message);
    } finally {
      setGrantLoading(false);
    }
  }, [file, recipientKey, expiryDays, includeKeyPackage, storedKeyPackage, keyPackageJson, onGranted]);

  const performReencryptRevoke = useCallback(
    async (grant: AnonymousGrantRecord) => {
      if (!file) {
        return;
      }

      if (!storedKeyPackage) {
        Alert.alert(
          'Thiếu key package',
          'Không tìm thấy key package trên thiết bị. Vui lòng bật "Đính kèm key package" khi upload để lưu lại.',
        );
        return;
      }

      try {
        setRevokingId(grant.id);
        const response = await anonymousFileAccessService.revokeAccessWithReencryption({
          fileId: file.id,
          grant,
          keyPackage: {
            masterKey: storedKeyPackage.masterKey,
            chunkKeys: storedKeyPackage.chunkKeys,
          },
        });

        const normalizedChunkKeys: Record<number, string> = {};
        Object.entries(response.rotatedKeyPackage.chunkKeys).forEach(([index, value]) => {
          const numericIndex = Number(index);
          if (Number.isNaN(numericIndex)) {
            return;
          }
          normalizedChunkKeys[numericIndex] = value;
        });

        const updatedPackage: StoredKeyPackage = {
          masterKey: response.rotatedKeyPackage.masterKey,
          chunkKeys: normalizedChunkKeys,
          fingerprint: response.newKeyFingerprint,
          storedAt: new Date().toISOString(),
        };

        await saveKeyPackage(file.id, updatedPackage);
        setStoredKeyPackage(updatedPackage);
        setIncludeKeyPackage(true);

        const updatedGrants = await anonymousFileAccessService.syncGrantJournal(file.id);
        setGrants(updatedGrants);

        const prettyPackage = serializeKeyPackage(file.id, updatedPackage);
        if (prettyPackage) {
          Clipboard.setString(prettyPackage);
        }

        Alert.alert(
          'Thu hồi & mã hóa lại',
          `Đã mã hóa lại ${response.chunksReencrypted.length}/${response.totalChunks} chunks (${response.percentage}%).\nFingerprint mới: ${truncate(response.newKeyFingerprint, 12, 8)}.\nKey package mới đã được copy vào clipboard.`,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Không thể thu hồi và mã hóa lại.';
        Alert.alert('Thu hồi thất bại', message);
      } finally {
        setRevokingId(null);
      }
    },
    [file, storedKeyPackage],
  );

  const handleRevokeGrant = useCallback(
    (grant: AnonymousGrantRecord) => {
      if (!file || grant.status !== 'active') {
        return;
      }

      if (!storedKeyPackage) {
        Alert.alert(
          'Thiếu key package',
          'Không tìm thấy key package đã lưu cho file này. Vui lòng bật “Đính kèm key package” khi upload để lưu lại khóa trước khi thu hồi.',
        );
        return;
      }

      Alert.alert(
        'Thu hồi & mã hóa lại',
        'Hành động này sẽ mã hóa lại file và tạo key package mới. Tiếp tục?',
        [
          { text: 'Huỷ', style: 'cancel' },
          {
            text: 'Thu hồi',
            style: 'destructive',
            onPress: () => {
              void performReencryptRevoke(grant);
            },
          },
        ],
      );
    },
    [file, performReencryptRevoke, storedKeyPackage],
  );

  const renderGrantCard = (grant: AnonymousGrantRecord) => {
    const statusLower = grant.status.toLowerCase();
    const isActive = statusLower === 'active';
    const isPending = statusLower === 'pending';

    const badgeStyle = [styles.grantBadge];
    const badgeTextStyle = [styles.badgeText];
    if (isActive) {
      badgeStyle.push(styles.badgeActive);
      badgeTextStyle.push(styles.badgeActiveText);
    } else if (statusLower === 'revoked') {
      badgeStyle.push(styles.badgeRevoked);
      badgeTextStyle.push(styles.badgeRevokedText);
    } else {
      badgeStyle.push(styles.badgePending);
      badgeTextStyle.push(styles.badgePendingText);
    }

    return (
      <View key={grant.id} style={styles.grantCard}>
        <View style={styles.grantHeader}>
          <Text style={styles.grantHash}>#{truncate(grant.accessorPublicKeyHash, 14, 10)}</Text>
          <View style={badgeStyle}>
            <Text style={badgeTextStyle}>{statusLower === 'revoked' ? 'Đã thu hồi' : isActive ? 'Đang hoạt động' : 'Đang xử lý'}</Text>
          </View>
        </View>

        <Text style={styles.grantMeta}>Được cấp: {formatGrantDate(grant.grantedAt)}</Text>
        <Text style={styles.grantMeta}>Hết hạn: {formatGrantDate(grant.expiresAt)}</Text>
        <Text style={styles.grantMeta}>
          Fingerprint: {grant.keyPackageFingerprint ? truncate(grant.keyPackageFingerprint, 12, 8) : '—'}
        </Text>
        <Text style={styles.grantMeta}>Lần truy cập: {grant.accessCount ?? 0}</Text>

        {grant.revokedAt && (
          <Text style={styles.grantMeta}>Thu hồi lúc: {formatGrantDate(grant.revokedAt)}</Text>
        )}

        <View style={styles.grantActions}>
          <TouchableOpacity
            style={styles.ghostButton}
            onPress={() => Clipboard.setString(grant.accessorPublicKeyHash)}
          >
            <Text style={styles.ghostButtonText}>Copy Hash</Text>
          </TouchableOpacity>
          {isActive && (
            <TouchableOpacity
              style={[
                styles.dangerButton,
                revokingId === grant.id && styles.dangerButtonDisabled,
              ]}
              disabled={revokingId === grant.id}
              onPress={() => handleRevokeGrant(grant)}
            >
              {revokingId === grant.id ? (
                <ActivityIndicator color={colors.onError} size="small" />
              ) : (
                <Text style={styles.dangerButtonText}>Thu hồi</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Quản lý truy cập ẩn danh</Text>
              <Text style={styles.subtitle}>
                {file ? `${file.name} • ${normalizeHex(file.ownershipPublicKey || '')}` : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Danh sách quyền truy cập</Text>
                <TouchableOpacity onPress={() => loadGrants()}>
                  <Text style={styles.sectionAction}>Làm mới</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pillRow}>
                <TouchableOpacity
                  style={[
                    styles.pillButton,
                    selectedSegment === 'active' && styles.pillButtonActive,
                  ]}
                  onPress={() => setSelectedSegment('active')}
                >
                  <Text
                    style={[
                      styles.pillButtonText,
                      selectedSegment === 'active' && styles.pillButtonTextActive,
                    ]}
                  >
                    Đang có quyền ({activeGrants.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pillButton,
                    selectedSegment === 'revoked' && styles.pillButtonActive,
                  ]}
                  onPress={() => setSelectedSegment('revoked')}
                >
                  <Text
                    style={[
                      styles.pillButtonText,
                      selectedSegment === 'revoked' && styles.pillButtonTextActive,
                    ]}
                  >
                    Đã thu hồi ({revokedGrants.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {grantsLoading && (
                <View style={{ paddingVertical: 16 }}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              )}

              {grantsError && <Text style={styles.errorText}>{grantsError}</Text>}

              {!grantsLoading && grantsToRender.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text style={styles.emptyText}>
                    {selectedSegment === 'active'
                      ? 'Chưa có public key nào được cấp quyền.'
                      : 'Chưa có quyền truy cập nào bị thu hồi.'}
                  </Text>
                </View>
              )}

              {grantsToRender.map(renderGrantCard)}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thêm quyền truy cập mới</Text>
              <Text style={styles.inputLabel}>Public key người nhận</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập hoặc dán public key"
                value={recipientKey}
                onChangeText={setRecipientKey}
                autoCapitalize="none"
                autoCorrect={false}
                multiline
                numberOfLines={3}
              />

              <View style={styles.helperRow}>
                <TouchableOpacity style={styles.helperButton} onPress={handlePasteFromClipboard}>
                  <Text style={styles.helperButtonText}>Dán từ clipboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.helperButton} onPress={handleImportFromFile}>
                  <Text style={styles.helperButtonText}>Nhập từ file</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Đính kèm key package (tự động copy sau khi cấp quyền)</Text>
                <Switch
                  value={includeKeyPackage}
                  onValueChange={setIncludeKeyPackage}
                  trackColor={{ false: colors.border, true: colors.primary + '55' }}
                  thumbColor={includeKeyPackage ? colors.primary : colors.border}
                />
              </View>

              <View style={styles.expiryRow}>
                <Text style={styles.inputLabel}>Thời hạn (ngày)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ví dụ: 30"
                  keyboardType="number-pad"
                  value={expiryDays}
                  onChangeText={setExpiryDays}
                />
              </View>

              {grantError && <Text style={styles.errorText}>{grantError}</Text>}

              {grantResult && (
                <View style={styles.grantSummary}>
                  <Text style={styles.grantSummaryText}>
                    ✓ Đã cấp quyền cho hash {truncate(grantResult.accessorPublicKeyHash, 10, 8)}.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                grantLoading && styles.primaryButtonDisabled,
              ]}
              disabled={grantLoading}
              onPress={handleGrantAccess}
            >
              {grantLoading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.primaryButtonText}>Cấp quyền</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
