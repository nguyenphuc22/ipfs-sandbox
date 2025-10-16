import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../styles';

interface InitScreenProps {
  loading?: boolean;
  error?: string | null;
  onInitialize: (displayName: string) => Promise<unknown>;
  onClearError?: () => void;
}

export const InitScreen: React.FC<InitScreenProps> = ({
  loading = false,
  error,
  onInitialize,
  onClearError,
}) => {
  const { colors } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 32,
        },
        card: {
          flex: 1,
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 24,
          justifyContent: 'center',
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.08,
          shadowRadius: 24,
          elevation: 6,
        },
        title: {
          fontSize: 24,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 12,
        },
        subtitle: {
          fontSize: 16,
          color: colors.textSecondary,
          marginBottom: 32,
          lineHeight: 22,
        },
        inputLabel: {
          fontSize: 14,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 8,
        },
        input: {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 16,
          color: colors.text,
        },
        inputError: {
          borderColor: colors.error,
        },
        helperText: {
          fontSize: 13,
          color: colors.textSecondary,
          marginTop: 8,
        },
        errorText: {
          fontSize: 13,
          color: colors.error,
          marginTop: 8,
        },
        button: {
          marginTop: 32,
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: 'center',
        },
        buttonDisabled: {
          backgroundColor: colors.disabled,
        },
        buttonText: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.onPrimary,
        },
        loaderRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 16,
        },
        loaderText: {
          marginLeft: 12,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );

  const activeError = localError || error || null;
  const hasValidationError = submitted && displayName.trim().length === 0;
  const isBusy = loading || isSubmitting;

  const handleInitialize = async () => {
    setSubmitted(true);
    onClearError?.();
    setLocalError(null);

    const value = displayName.trim();
    if (!value) {
      setLocalError('Vui lòng nhập tên hiển thị');
      return;
    }

    setIsSubmitting(true);
    try {
      await onInitialize(value);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể khởi tạo danh tính';
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Chào mừng bạn</Text>
        <Text style={styles.subtitle}>
          Hãy tạo danh tính đầu tiên để bắt đầu sử dụng hệ thống. Thông tin này chỉ hiển thị
          cho những người khác thông qua public key của bạn.
        </Text>

        <Text style={styles.inputLabel}>Tên hiển thị</Text>
        <TextInput
          value={displayName}
          onChangeText={(text) => {
            if (localError) {
              setLocalError(null);
            }
            if (error) {
              onClearError?.();
            }
            setDisplayName(text);
          }}
          editable={!isBusy}
          onBlur={() => setSubmitted(true)}
          placeholder="Ví dụ: Nguyễn Văn A"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, (hasValidationError || activeError) && styles.inputError]}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleInitialize}
        />

        {hasValidationError && !activeError ? (
          <Text style={styles.errorText}>Tên hiển thị không được để trống</Text>
        ) : null}

        {activeError ? <Text style={styles.errorText}>{activeError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isBusy && styles.buttonDisabled]}
          onPress={handleInitialize}
          disabled={isBusy}
        >
          <Text style={styles.buttonText}>
            {isBusy ? 'Đang khởi tạo...' : 'Khởi tạo danh tính'}
          </Text>
        </TouchableOpacity>

        {isBusy ? (
          <View style={styles.loaderRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loaderText}>Đang tạo khóa và đăng ký với máy chủ…</Text>
          </View>
        ) : (
          <Text style={styles.helperText}>
            Bạn sẽ nhận được bộ khóa riêng biệt và chỉ public key được gửi lên máy chủ.
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
