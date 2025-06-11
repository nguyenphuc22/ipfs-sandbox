import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFilePicker } from '../../hooks/useFilePicker';
import { PickedFile } from '../../types/filePicker';

export const DocumentPickerDemo: React.FC = () => {
  const {
    pickFiles,
    pickSingleFile,
    pickMixedFiles,
    pickDocuments,
    pickMedia,
    clearFiles,
    removeFile,
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

  const handlePickAllFiles = async () => {
    const files = await pickFiles({
      allowMultiSelection: true,
      type: ['allFiles'],
    });
    if (files.length > 0) {
      Alert.alert('Success', `Selected ${files.length} file(s)`);
    }
  };

  const handlePickDocuments = async () => {
    const files = await pickDocuments({
      allowMultiSelection: true,
    });
    if (files.length > 0) {
      Alert.alert('Success', `Selected ${files.length} document(s)`);
    }
  };

  const handlePickMedia = async () => {
    const files = await pickMedia({
      allowMultiSelection: true,
    });
    if (files.length > 0) {
      Alert.alert('Success', `Selected ${files.length} media file(s)`);
    }
  };

  const handlePickMixed = async () => {
    const files = await pickMixedFiles({
      allowMultiSelection: true,
    });
    if (files.length > 0) {
      Alert.alert('Success', `Selected ${files.length} file(s)`);
    }
  };

  const handlePickSinglePDF = async () => {
    const file = await pickSingleFile({
      type: ['pdf'],
    });
    if (file) {
      Alert.alert('Success', `Selected: ${file.name}`);
    }
  };

  const handlePickSpecificDocuments = async () => {
    const files = await pickFiles({
      allowMultiSelection: true,
      type: ['pdf', 'docx', 'xlsx'],
    });
    if (files.length > 0) {
      Alert.alert('Success', `Selected ${files.length} document(s)`);
    }
  };

  const getFileIcon = (file: PickedFile): string => {
    if (!file.name) {return '📄';}

    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf': return '📕';
      case 'doc':
      case 'docx': return '📘';
      case 'xls':
      case 'xlsx': return '📗';
      case 'ppt':
      case 'pptx': return '📙';
      case 'txt':
      case 'rtf': return '📝';
      case 'csv': return '📊';
      case 'zip':
      case 'rar':
      case '7z': return '🗜️';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      case 'mp4':
      case 'mov':
      case 'avi': return '🎬';
      case 'mp3':
      case 'wav':
      case 'flac': return '🎵';
      default: return '📄';
    }
  };

  const formatFileSize = (size: number | null): string => {
    if (!size) {return 'Unknown size';}

    if (size < 1024) {return `${size} B`;}
    if (size < 1024 * 1024) {return `${(size / 1024).toFixed(1)} KB`;}
    if (size < 1024 * 1024 * 1024) {return `${(size / (1024 * 1024)).toFixed(1)} MB`;}
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const renderFileItem = (file: PickedFile) => (
    <View key={file.id} style={styles.fileItem}>
      <View style={styles.fileInfo}>
        <Text style={styles.fileIcon}>{getFileIcon(file)}</Text>
        <View style={styles.fileDetails}>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name || 'Unknown file'}
          </Text>
          <Text style={styles.fileSize}>
            {formatFileSize(file.size)}
          </Text>
          {file.type && (
            <Text style={styles.fileType}>
              {file.type}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFile(file.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Document Picker Demo</Text>

      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error: {state.error.message}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePickAllFiles}
          disabled={state.isLoading}
        >
          <Text style={styles.buttonText}>Pick All Files</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handlePickDocuments}
          disabled={state.isLoading}
        >
          <Text style={styles.buttonText}>Pick Documents Only</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handlePickMedia}
          disabled={state.isLoading}
        >
          <Text style={styles.buttonText}>Pick Media Only</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handlePickMixed}
          disabled={state.isLoading}
        >
          <Text style={styles.buttonText}>Pick Mixed Files</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handlePickSinglePDF}
          disabled={state.isLoading}
        >
          <Text style={styles.buttonText}>Pick Single PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handlePickSpecificDocuments}
          disabled={state.isLoading}
        >
          <Text style={styles.buttonText}>Pick PDF/DOCX/XLSX</Text>
        </TouchableOpacity>

        {state.pickedFiles.length > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearFiles}
            disabled={state.isLoading}
          >
            <Text style={styles.buttonText}>Clear All Files</Text>
          </TouchableOpacity>
        )}
      </View>

      {state.isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {state.pickedFiles.length > 0 && (
        <View style={styles.filesContainer}>
          <Text style={styles.sectionTitle}>
            Selected Files ({state.pickedFiles.length})
          </Text>
          {state.pickedFiles.map(renderFileItem)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  filesContainer: {
    marginTop: 20,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  fileType: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
