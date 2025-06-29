import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useIPFS, useEnhancedStorage } from '../../hooks';
import { useFilePicker } from '../../hooks';
import { useTheme } from '../../styles';
import { FileData } from '../../types';

interface IPFSFileUploadProps {
  onUploadComplete?: (files: FileData[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
}

export const IPFSFileUpload: React.FC<IPFSFileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  multiple = false,
}) => {
  const { uploadFile, uploadMultipleFiles, isUploading, uploadProgress, connectionState } = useIPFS();
  const { pickFiles } = useFilePicker();
  const { saveFile } = useEnhancedStorage();
  const { colors } = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  const handleFilePick = async () => {
    try {
      const result = await pickFiles({ 
        allowMultiSelection: multiple,
        type: ['allFiles', 'pdf', 'images', 'doc', 'docx', 'txt', 'csv', 'zip'] 
      });

      if (result.success && result.files && result.files.length > 0) {
        if (multiple && result.files.length > 1) {
          await handleMultipleFileUpload(result.files);
        } else {
          await handleSingleFileUpload(result.files[0]);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to pick files';
      onUploadError?.(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleSingleFileUpload = async (file: any) => {
    try {
      const result = await uploadFile(file);
      
      if (result.success && result.data) {
        // Save to AsyncStorage for persistence
        await saveFile(result.data);
        
        const newUploadedFiles = [result.data, ...uploadedFiles];
        setUploadedFiles(newUploadedFiles);
        onUploadComplete?.(newUploadedFiles);
        
        Alert.alert(
          'Upload Successful',
          `File "${result.data.name}" uploaded successfully!\nIPFS Hash: ${result.data.ipfsHash}`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
      Alert.alert('Upload Error', errorMessage);
    }
  };

  const handleMultipleFileUpload = async (files: any[]) => {
    try {
      const result = await uploadMultipleFiles(files);
      
      if (result.success && result.totalSuccess > 0) {
        const successfulFiles = result.results
          .filter(r => r.data)
          .map(r => r.data!);
        
        // Save all successful files to AsyncStorage for persistence
        for (const file of successfulFiles) {
          await saveFile(file);
        }
        
        const newUploadedFiles = [...successfulFiles, ...uploadedFiles];
        setUploadedFiles(newUploadedFiles);
        onUploadComplete?.(newUploadedFiles);
        
        Alert.alert(
          'Upload Complete',
          `Successfully uploaded ${result.totalSuccess} out of ${files.length} files.${
            result.totalFailed > 0 ? `\n${result.totalFailed} files failed to upload.` : ''
          }`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('All uploads failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
      Alert.alert('Upload Error', errorMessage);
    }
  };

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      elevation: 2,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    uploadButton: {
      backgroundColor: isUploading ? colors.disabled : colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    uploadButtonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '500',
    },
    progressContainer: {
      marginBottom: 16,
    },
    progressText: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.disabled,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    fileList: {
      marginTop: 16,
    },
    fileListTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    fileItem: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 6,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.success,
    },
    fileName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    fileDetails: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    fileHash: {
      fontSize: 11,
      color: colors.info,
      fontFamily: 'monospace',
      marginTop: 4,
    },
    clearButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignSelf: 'flex-end',
      marginTop: 8,
    },
    clearButtonText: {
      color: colors.onSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    loadingText: {
      marginLeft: 8,
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {multiple ? 'Upload Multiple Files' : 'Upload File'} to IPFS
      </Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleFilePick}
        disabled={isUploading}
      >
        <Text style={styles.uploadButtonText}>
          {isUploading 
            ? 'Uploading...' 
            : `Select ${multiple ? 'Files' : 'File'} to Upload`
          }
        </Text>
      </TouchableOpacity>

      {isUploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>
            Uploading to IPFS... {uploadProgress}%
          </Text>
        </View>
      )}

      {isUploading && uploadProgress > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Upload Progress</Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${uploadProgress}%` }]} 
            />
          </View>
        </View>
      )}

      {/* Uploaded files section removed - files will appear in main file list below */}
    </View>
  );
};