import React from 'react';
import {StyleSheet, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {FileUploadButtonProps} from '../../types';
import {useTheme} from '../../styles';
import {SHADOW} from '../../constants';

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
}) => {
  const {theme} = useTheme();

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.uploadButton,
        {
          backgroundColor: isDisabled
            ? theme.colors.textSecondary
            : theme.colors.primary,
        },
        SHADOW.MEDIUM,
      ]}
      onPress={onPress}
      disabled={isDisabled}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.white}
          style={styles.loadingIcon}
        />
      ) : (
        <Text style={styles.uploadIcon}>📁</Text>
      )}
      <Text style={[styles.uploadText, {color: theme.colors.white}]}>
        {loading ? 'Opening File Picker...' : 'Select Files'}
      </Text>
      <Text style={[styles.uploadSubtext, {color: theme.colors.white}]}>
        {loading
          ? 'Please wait...'
          : 'Tap to choose files from your device'
        }
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  loadingIcon: {
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  uploadSubtext: {
    fontSize: 14,
    opacity: 0.8,
  },
});
