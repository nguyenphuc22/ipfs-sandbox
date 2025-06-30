import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../../styles';
import { FileData } from '../../types';
import { createDefaultGatewayService, FileViewResponse } from '../../services/GatewayApiService';

interface FileViewerProps {
  file: FileData;
  visible: boolean;
  onClose: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  file,
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const gatewayService = createDefaultGatewayService();

  useEffect(() => {
    if (visible && file.ipfsHash) {
      loadFileContent();
    }
    
    // Reset state when modal closes
    if (!visible) {
      setFileContent(null);
      setError(null);
      setContentType('');
    }
  }, [visible, file.ipfsHash]);

  const loadFileContent = async () => {
    if (!file.ipfsHash) {
      setError('No IPFS hash available for this file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: FileViewResponse = await gatewayService.viewFile(
        file.ipfsHash, 
        file.name
      );

      if (response.success) {
        setContentType(response.contentType);
        
        // Handle different content types
        if (typeof response.content === 'string') {
          setFileContent(response.content);
        } else {
          // For binary files, show info instead of content
          setFileContent(`Binary file (${response.contentType})\nSize: ${response.contentLength} bytes\n\nThis file type is not yet supported for viewing in the app.`);
        }
      } else {
        setError('Failed to load file content');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load file';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileTypeDisplay = (): string => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
      'txt': 'Text File',
      'md': 'Markdown',
      'csv': 'CSV Spreadsheet',
      'json': 'JSON Data',
      'xml': 'XML Document',
      'pdf': 'PDF Document',
      'doc': 'Word Document',
      'docx': 'Word Document',
      'xls': 'Excel Spreadsheet',
      'xlsx': 'Excel Spreadsheet',
      'jpg': 'JPEG Image',
      'jpeg': 'JPEG Image',
      'png': 'PNG Image',
      'gif': 'GIF Image',
      'svg': 'SVG Image',
    };
    
    return typeMap[extension] || `${extension.toUpperCase()} File`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isTextContent = (): boolean => {
    return contentType.startsWith('text/') || 
           contentType === 'application/json' || 
           contentType === 'application/xml';
  };

  const canPreview = (): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const previewableTypes = ['txt', 'md', 'csv', 'json', 'xml'];
    return previewableTypes.includes(extension);
  };

  const { width, height } = Dimensions.get('window');

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: colors.surface,
      width: width * 0.95,
      height: height * 0.9,
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    header: {
      backgroundColor: colors.primary,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      color: colors.onPrimary,
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
      marginRight: 16,
    },
    closeButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    closeButtonText: {
      color: colors.onSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    fileInfo: {
      backgroundColor: colors.background,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.disabled,
    },
    fileName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    fileDetails: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    fileHash: {
      fontSize: 12,
      color: colors.info,
      fontFamily: 'monospace',
      marginTop: 4,
    },
    contentContainer: {
      flex: 1,
      padding: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: colors.text,
      fontSize: 16,
      marginTop: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    errorIcon: {
      fontSize: 48,
      marginBottom: 16,
      opacity: 0.5,
    },
    errorText: {
      color: colors.error,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    retryButtonText: {
      color: colors.onPrimary,
      fontSize: 14,
      fontWeight: '500',
    },
    textContent: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      fontFamily: 'monospace',
    },
    unsupportedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    unsupportedIcon: {
      fontSize: 64,
      marginBottom: 16,
      opacity: 0.6,
    },
    unsupportedTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    unsupportedText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {getFileTypeDisplay()}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* File Info */}
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{file.name}</Text>
            <Text style={styles.fileDetails}>
              Size: {formatFileSize(file.size)} • 
              Status: {file.status} • 
              Uploaded: {file.uploadTime.toLocaleDateString()}
            </Text>
            {file.ipfsHash && (
              <Text style={styles.fileHash}>
                IPFS: {file.ipfsHash}
              </Text>
            )}
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading file content...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadFileContent}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : !canPreview() ? (
              <View style={styles.unsupportedContainer}>
                <Text style={styles.unsupportedIcon}>📄</Text>
                <Text style={styles.unsupportedTitle}>Preview Not Available</Text>
                <Text style={styles.unsupportedText}>
                  This file type ({getFileTypeDisplay()}) is not yet supported for preview in the app.
                  {'\n\n'}You can download the file to view it with an external application.
                </Text>
              </View>
            ) : fileContent ? (
              <ScrollView style={{ flex: 1 }}>
                <Text style={styles.textContent}>{fileContent}</Text>
              </ScrollView>
            ) : (
              <View style={styles.unsupportedContainer}>
                <Text style={styles.unsupportedIcon}>📭</Text>
                <Text style={styles.unsupportedTitle}>No Content</Text>
                <Text style={styles.unsupportedText}>
                  File content could not be loaded.
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};