import React, {useCallback, useEffect, useMemo, useState} from 'react';
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

import {useTheme} from '../../styles';
import {FileData} from '../../types';
import {
  anonymousFileAccessService,
  GrantAccessParams,
  GrantAccessResponse,
  RevokeAccessResponse,
} from '../../services/AnonymousFileAccessService';
import {FilePickerService} from '../../services/FilePickerService';
import {
  getKeyPackage,
  StoredKeyPackage,
} from '../../services/KeyPackageStorage';
import {normalizeHex, toCompressedPublicKey} from '../../utils/aotCrypto';

interface GrantAccessModalProps {
  visible: boolean;
  file: FileData | null;
  onClose: () => void;
  onGranted?: (response: GrantAccessResponse) => void;
  onRevoked?: (response: RevokeAccessResponse) => void; // Legacy signature compatibility
}

const DEFAULT_EXPIRY_DAYS = '30';

const serializeKeyPackage = (
  fileId: string,
  keyPackage: StoredKeyPackage | null,
) => {
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

const truncate = (
  value: string | null | undefined,
  prefix = 10,
  suffix = 6,
) => {
  if (!value) {
    return '';
  }
  const normalized = value.trim();
  if (normalized.length <= prefix + suffix) {
    return normalized;
  }
  return `${normalized.slice(0, prefix)}…${normalized.slice(-suffix)}`;
};

export const GrantAccessModal: React.FC<GrantAccessModalProps> = ({
  visible,
  file,
  onClose,
  onGranted,
}) => {
  const {colors} = useTheme();

  const [recipientKey, setRecipientKey] = useState('');
  const [expiryDays, setExpiryDays] = useState<string>(DEFAULT_EXPIRY_DAYS);
  const [includeKeyPackage, setIncludeKeyPackage] = useState(true);
  const [storedKeyPackage, setStoredKeyPackage] =
    useState<StoredKeyPackage | null>(null);
  const [grantResult, setGrantResult] = useState<GrantAccessResponse | null>(
    null,
  );
  const [grantError, setGrantError] = useState<string | null>(null);
  const [grantLoading, setGrantLoading] = useState(false);

  const filePicker = useMemo(() => new FilePickerService(), []);

  const keyPackageJson = useMemo(
    () => (file ? serializeKeyPackage(file.id, storedKeyPackage) : null),
    [file, storedKeyPackage],
  );

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
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 32,
          backgroundColor: colors.surface,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
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
        closeIcon: {
          fontSize: 18,
          color: colors.text,
        },
        section: {
          marginBottom: 20,
        },
        label: {
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
          minHeight: 48,
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
          backgroundColor: colors.background,
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
          marginTop: 14,
        },
        toggleLabel: {
          flex: 1,
          fontSize: 13,
          color: colors.text,
          marginRight: 12,
        },
        expiryInput: {
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        },
        expiryField: {
          flex: 0,
          width: 80,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 8,
          fontSize: 14,
          color: colors.text,
          textAlign: 'center',
        },
        expiryHint: {
          fontSize: 12,
          color: colors.textSecondary,
          flex: 1,
        },
        errorText: {
          fontSize: 12,
          color: colors.error,
          marginTop: 10,
        },
        successBox: {
          marginTop: 16,
          borderWidth: 1,
          borderColor: colors.success + '40',
          borderRadius: 12,
          padding: 14,
          backgroundColor: colors.success + '18',
        },
        successText: {
          fontSize: 12,
          color: colors.text,
        },
        footer: {
          flexDirection: 'row',
          gap: 12,
          marginTop: 24,
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
      console.warn('[GrantAccessModal] Failed to load key package', error);
      setStoredKeyPackage(null);
      setIncludeKeyPackage(false);
    }
  }, [file, visible]);

  useEffect(() => {
    if (visible && file) {
      resetDraftState();
  hydrateKeyPackage().catch(() => {});
    } else {
      setStoredKeyPackage(null);
    }
  }, [visible, file, resetDraftState, hydrateKeyPackage]);

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
        .map(line => line.trim())
        .filter(line => line.length > 0);
      const hexLine = lines.find(line => /^[0-9a-fA-F]{64,130}$/.test(line));
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
        Alert.alert(
          'Clipboard',
          'Không tìm thấy public key hợp lệ trong clipboard.',
        );
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
      const normalizedUri = uri.startsWith('file://')
        ? uri.replace('file://', '')
        : uri;
      const content = await RNFS.readFile(normalizedUri, 'utf8');
      const key = extractKeyFromContent(content);

      if (!key) {
        Alert.alert(
          'Import',
          'Không tìm thấy public key hợp lệ trong tệp đã chọn.',
        );
        return;
      }

      setRecipientKey(key);
      setGrantError(null);
    } catch (error: any) {
      if (
        error?.code === 'DOCUMENT_PICKER_CANCELED' ||
        error?.code === 'OPERATION_CANCELED'
      ) {
        return;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể nhập public key từ tệp.';
      setGrantError(message);
      Alert.alert('Import thất bại', message);
    }
  }, [extractKeyFromContent, filePicker]);

  const buildGrantPayload = useCallback((): GrantAccessParams | null => {
    if (!file) {
      return null;
    }

    const trimmedKey = recipientKey.trim();
    if (!trimmedKey) {
      setGrantError('Vui lòng nhập public key của người nhận.');
      return null;
    }

    try {
      toCompressedPublicKey(trimmedKey);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Public key không hợp lệ.';
      setGrantError(message);
      return null;
    }

    let expiresAt: Date | null = null;
    if (expiryDays && expiryDays.trim().length > 0) {
      const parsed = Number(expiryDays);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        setGrantError('Thời hạn hết hạn phải là số dương.');
        return null;
      }
      expiresAt = new Date(Date.now() + parsed * 24 * 60 * 60 * 1000);
    }

    const payload: GrantAccessParams = {
      fileId: file.id,
      targetPublicKey: trimmedKey,
      keyPackageFingerprint: includeKeyPackage
        ? storedKeyPackage?.fingerprint ||
          file.keyPackageFingerprint ||
          undefined
        : undefined,
      expiresAt: expiresAt ?? undefined,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        grantedFrom: 'mobile-app',
      },
    };

    return payload;
  }, [file, recipientKey, expiryDays, includeKeyPackage, storedKeyPackage]);

  const handleGrantAccess = useCallback(async () => {
    const payload = buildGrantPayload();
    if (!payload) {
      return;
    }

    try {
      setGrantLoading(true);
      setGrantError(null);
      const response = await anonymousFileAccessService.grantAccess(payload);
      setGrantResult(response);
      setRecipientKey('');
      onGranted?.(response);

      if (includeKeyPackage && keyPackageJson) {
        Clipboard.setString(keyPackageJson);
        Alert.alert(
          'Cấp quyền thành công',
          'Key package đã được copy vào clipboard. Hãy gửi cho người nhận để họ nhập vào thiết bị.',
        );
      } else {
        Alert.alert(
          'Cấp quyền thành công',
          'Đã thêm public key vào danh sách truy cập.',
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể cấp quyền truy cập.';
      setGrantError(message);
    } finally {
      setGrantLoading(false);
    }
  }, [buildGrantPayload, includeKeyPackage, keyPackageJson, onGranted]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Cấp quyền truy cập ẩn danh</Text>
              <Text style={styles.subtitle}>
                {file
                  ? `${file.name} • ${normalizeHex(
                      file.ownershipPublicKey || '',
                    )}`
                  : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Public key của người nhận</Text>
              <TextInput
                style={styles.textInput}
                value={recipientKey}
                placeholder="0x..."
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                multiline
                onChangeText={setRecipientKey}
              />

              <View style={styles.helperRow}>
                <TouchableOpacity
                  style={styles.helperButton}
                  onPress={handlePasteFromClipboard}>
                  <Text style={styles.helperButtonText}>Dán từ clipboard</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.helperButton}
                  onPress={handleImportFromFile}>
                  <Text style={styles.helperButtonText}>Nhập từ tệp</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>
                  Chia sẻ Key Package ngay sau khi cấp quyền
                  {storedKeyPackage?.fingerprint &&
                    ` • ${truncate(storedKeyPackage.fingerprint, 12, 6)}`}
                </Text>
                <Switch
                  value={includeKeyPackage}
                  onValueChange={setIncludeKeyPackage}
                />
              </View>

              <View style={styles.expiryInput}>
                <TextInput
                  value={expiryDays}
                  style={styles.expiryField}
                  keyboardType="numeric"
                  onChangeText={setExpiryDays}
                />
                <Text style={styles.expiryHint}>
                  Số ngày hiệu lực (để trống để không giới hạn)
                </Text>
              </View>

              {grantError && <Text style={styles.errorText}>{grantError}</Text>}

              {grantResult && (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>
                    ✅ Đã cấp quyền cho hash #
                    {truncate(grantResult.grant.accessorPublicKeyHash)}
                  </Text>
                  <Text style={styles.successText}>
                    Trạng thái:{' '}
                    {grantResult.operation === 'created'
                      ? 'tạo mới'
                      : 'cập nhật'}{' '}
                    • Hết hạn:{' '}
                    {grantResult.grant.expiresAt
                      ? new Date(grantResult.grant.expiresAt).toLocaleString(
                          'vi-VN',
                        )
                      : 'Không giới hạn'}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                onClose();
                resetDraftState();
              }}>
              <Text style={styles.secondaryButtonText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                grantLoading && styles.primaryButtonDisabled,
              ]}
              disabled={grantLoading}
              onPress={handleGrantAccess}>
              {grantLoading ? (
                <ActivityIndicator color={colors.onPrimary} size="small" />
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

export default GrantAccessModal;
