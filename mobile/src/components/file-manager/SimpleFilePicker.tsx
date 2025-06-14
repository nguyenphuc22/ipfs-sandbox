import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFilePicker } from '../../hooks/useFilePicker';
import { useTheme } from '../../styles';
import { PickedFile } from '../../types/filePicker';

interface SimpleFilePickerProps {
  onFilesSelected?: (files: PickedFile[]) => void;
}

export const SimpleFilePicker: React.FC<SimpleFilePickerProps> = ({ 
  onFilesSelected 
}) => {
  const { theme } = useTheme();
  const {
    pickFiles,
    clearFiles,
    state,
  } = useFilePicker({
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedExtensions: [
      // Documents
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'rtf',
      // Media
      'jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'mp3', 'wav',
      // Archives
      'zip', 'rar', '7z',
    ],
  });

  const handleSelectFiles = async () => {
    const files = await pickFiles({
      allowMultiSelection: true,
      type: ['allFiles'],
    });
    if (files.length > 0) {
      // Call callback to add files to My Files
      onFilesSelected?.(files);
      Alert.alert('Success', `Selected ${files.length} file(s) and added to My Files`);
      // Clear picker after successful selection
      clearFiles();
    }
  };


  const buttonStyle = [
    styles.selectButton,
    { 
      backgroundColor: theme.colors.primary,
      opacity: state.isLoading ? 0.6 : 1,
    }
  ];

  return (
    <View style={styles.container}>
      {state.error && (
        <View style={[styles.errorContainer, { borderColor: theme.colors.error, backgroundColor: theme.colors.errorBackground }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Error: {state.error.message}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={buttonStyle}
        onPress={handleSelectFiles}
        disabled={state.isLoading}
      >
        <Text style={styles.buttonText}>
          📁 {state.isLoading ? 'Selecting...' : 'Select Files'}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  selectButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});