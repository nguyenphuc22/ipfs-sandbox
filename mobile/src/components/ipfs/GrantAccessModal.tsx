import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  anonymousFileAccessService,
} from '../../services/AnonymousFileAccessService';
import { FilePickerService } from '../../services/FilePickerService';
import { getKeyPackage, StoredKeyPackage } from '../../services/KeyPackageStorage';
import { normalizeHex, toCompressedPublicKey } from '../../utils/aotCrypto';

interface GrantAccessModalProps {
  visible: boolean;
  file: FileData | null;
  onClose: () => void;
  onGranted?: (response: GrantAccessResponse) => void;
}

const truncateKey = (key: string, prefix = 10, suffix = 8) => {
  if (!key) {
    return '';
  }
  if (key.length <= prefix + suffix) {
    return key;
  }
  return `${key.slice(0, prefix)}…${key.slice(-suffix)}`;
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

export const GrantAccessModal: React.FC<GrantAccessModalProps> = ({
  visible,
  file,
  onClose,
  onGranted,
}) => {
  const { colors } = useTheme();
  const [recipientKey, setRecipientKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [includeKeyPackage, setIncludeKeyPackage] = useState(true);
  const [storedKeyPackage, setStoredKeyPackage] = useState<StoredKeyPackage | null>(null);
  const [grantResult, setGrantResult] = useState<AnonymousGrantRecord | null>(null);

  const filePicker = useMemo(() => new FilePickerService(), []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: '#00000080',
          justifyContent: 'flex-end',
        },
        container: {
          maxHeight: '82%',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 40,
          backgroundColor: colors.surface,
        },
        title: {
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 8,
        },
        subtitle: {
          fontSize: 14,
          color: colors.textSecondary,
          marginBottom: 16,
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
        input: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 14,
          color: colors.text,
          minHeight: 48,
        },
        helperText: {
          fontSize: 12,
          color: colors.textSecondary,
          marginTop: 6,
        },
        warningText: {
          fontSize: 12,
          color: colors.warning,
          marginTop: 6,
        },
        errorText: {
          fontSize: 12,
          color: colors.error,
          marginTop: 8,
        },
        buttonRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 12,
        },
        smallButton: {
          backgroundColor: colors.secondary,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 10,
        },
        smallButtonText: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.onSecondary,
        },
        toggleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 8,
        },
        toggleLabel: {
          flex: 1,
          fontSize: 13,
          color: colors.text,
          marginRight: 12,
        },
        fingerprintBox: {
          marginTop: 8,
          padding: 12,
          borderRadius: 10,
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
        },
        fingerprintText: {
          fontSize: 12,
          color: colors.textSecondary,
        },
        footer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 24,
          gap: 16,
        },
        cancelButton: {
          flex: 1,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          paddingVertical: 14,
          alignItems: 'center',
        },
        cancelButtonText: {
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
          marginTop: 12,
          borderRadius: 10,
          padding: 12,
          backgroundColor: colors.success + '15',
          borderWidth: 1,
          borderColor: colors.success + '40',
        },
        grantSummaryText: {
          fontSize: 12,
          color: colors.text,
        },
      }),
    [colors],
  );

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      if (!visible || !file) {
        return;
      }

      try {
        setLoading(false);
        setError(null);
        setGrantResult(null);
        setRecipientKey('');

        const packageData = await getKeyPackage(file.id);
        if (mounted) {
          setStoredKeyPackage(packageData);
          setIncludeKeyPackage(!!packageData);
        }
      } catch (err) {
        console.warn('[GrantAccessModal] Failed to load key package', err);
        if (mounted) {
          setStoredKeyPackage(null);
          setIncludeKeyPackage(false);
        }
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, [visible, file]);

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
      // Not JSON, fallback to raw text
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
      setError(null);
    } catch (err) {
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
      setError(null);
    } catch (err: any) {
      if (err?.code === 'DOCUMENT_PICKER_CANCELED' || err?.code === 'OPERATION_CANCELED') {
        return;
      }
      const message = err instanceof Error ? err.message : 'Không thể nhập public key từ tệp.';
      setError(message);
      Alert.alert('Import thất bại', message);
    }
  }, [extractKeyFromContent, filePicker]);

  const handleGrantAccess = useCallback(async () => {
    if (!file) {
      return;
    }

    const trimmedKey = recipientKey.trim();
    if (!trimmedKey) {
      setError('Vui lòng nhập public key của người nhận.');
      return;
    }

    try {
      toCompressedPublicKey(trimmedKey);
    } catch (validationError) {
      const message = validationError instanceof Error ? validationError.message : 'Public key không hợp lệ.';
      setError(message);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fingerprint = includeKeyPackage
        ? storedKeyPackage?.fingerprint || file.keyPackageFingerprint || null
        : null;

      const response = await anonymousFileAccessService.grantAccess({
        fileId: file.id,
        targetPublicKey: trimmedKey,
        keyPackageFingerprint: fingerprint || undefined,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          grantedFrom: 'mobile-app',
        },
      });

      setGrantResult(response.grant);

      const summaryMessage = `Đã cấp quyền cho public key mới. Mã giao dịch: ${response.operation.toUpperCase()}.`;
      Alert.alert('Thành công', summaryMessage);

      if (includeKeyPackage && storedKeyPackage) {
        const serialized = serializeKeyPackage(file.id, storedKeyPackage);
        if (serialized) {
          Clipboard.setString(serialized);
          Alert.alert(
            'Key package đã được sao chép',
            'Gửi JSON vừa được sao chép cho người nhận để họ có thể tải file.',
          );
        }
      }

      onGranted?.(response);
      onClose();
    } catch (err) {
      console.error('[GrantAccessModal] Grant error', err);
      const message = err instanceof Error ? err.message : 'Không thể cấp quyền truy cập.';
      setError(message);
      Alert.alert('Grant thất bại', message);
    } finally {
      setLoading(false);
    }
  }, [
    file,
    includeKeyPackage,
    onClose,
    onGranted,
    recipientKey,
    storedKeyPackage,
  ]);

  const fileNameDisplay = file ? `${file.name} (${truncateKey(file.id, 6, 6)})` : '';
  const grantSummary = useMemo(() => {
    if (!grantResult) {
      return null;
    }

    return `Đã grant cho hash ${truncateKey(grantResult.accessorPublicKeyHash)} • trạng thái ${grantResult.status}`;
  }, [grantResult]);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Cấp quyền truy cập ẩn danh</Text>
          <Text style={styles.subtitle}>
            {file
              ? `File: ${fileNameDisplay}`
              : 'Chọn file để cấp quyền truy cập.'}
          </Text>

          <View style={styles.section}>
            <Text style={styles.label}>Public key của người nhận</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập hoặc dán public key (hex)"
              placeholderTextColor={colors.textSecondary}
              value={recipientKey}
              onChangeText={(text) => setRecipientKey(text)}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
            />
            <Text style={styles.helperText}>
              Hỗ trợ key dạng compressed (66 ký tự) hoặc x-only (64 ký tự).
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.smallButton} onPress={handlePasteFromClipboard}>
                <Text style={styles.smallButtonText}>Dán từ clipboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={handleImportFromFile}>
                <Text style={styles.smallButtonText}>Quét / nhập từ tệp</Text>
              </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {storedKeyPackage ? (
            <View style={styles.section}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Đính kèm fingerprint key package</Text>
                <Switch
                  value={includeKeyPackage}
                  onValueChange={setIncludeKeyPackage}
                  trackColor={{ false: colors.border, true: colors.success + '80' }}
                  thumbColor={includeKeyPackage ? colors.white : colors.border}
                />
              </View>
              <View style={styles.fingerprintBox}>
                <Text style={styles.fingerprintText}>
                  Fingerprint: {storedKeyPackage.fingerprint || 'Không có'}
                </Text>
                <Text style={styles.fingerprintText}>
                  Lưu tại: {new Date(storedKeyPackage.storedAt).toLocaleString()}
                </Text>
              </View>
              {!includeKeyPackage && (
                <Text style={styles.warningText}>
                  Người nhận sẽ cần key package được chia sẻ thủ công để giải mã file.
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.label}>Chưa tìm thấy key package cục bộ</Text>
              <Text style={styles.helperText}>
                Tải lại file bằng quyền chủ sở hữu để tạo và lưu key package trước khi grant.
              </Text>
            </View>
          )}

          {grantSummary && (
            <View style={styles.grantSummary}>
              <Text style={styles.grantSummaryText}>{grantSummary}</Text>
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelButtonText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (loading || !recipientKey.trim()) && styles.primaryButtonDisabled,
              ]}
              onPress={handleGrantAccess}
              disabled={loading || !recipientKey.trim()}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.primaryButtonText}>Grant quyền</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default GrantAccessModal;
