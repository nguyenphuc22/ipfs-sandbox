import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ThemeProvider, useTheme } from './src/styles';
import { IPFSConnectionStatus, IPFSFileUpload, IPFSFileList } from './src/components';
import { useIPFS } from './src/hooks';
import { FileData } from './src/types';

const IPFSDemo: React.FC = () => {
  const { colors } = useTheme();
  const { 
    connectionState,
  } = useIPFS({
    config: { 
      useMockApi: false, // Use real API - upload works, list returns empty array
      gatewayUrl: 'http://localhost:3000' // Using adb reverse port forwarding
    },
    autoConnect: true,
  });

  const [allFiles, setAllFiles] = useState<FileData[]>([]);

  const handleUploadComplete = (files: FileData[]) => {
    console.log('Upload completed:', files);
    // Add uploaded files to main list
    setAllFiles(prev => [...files, ...prev]);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  // Removed handleFilesLoaded - no longer needed since IPFSFileList manages its own state

  const handleFileDeleted = (fileId: string) => {
    setAllFiles(prev => prev.filter(f => f.id !== fileId));
  };




  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    button: {
      backgroundColor: colors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 6,
      marginRight: 8,
      marginBottom: 8,
    },
    buttonText: {
      color: colors.onSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    fileList: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 16,
    },
    fileItem: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 6,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
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
      marginBottom: 4,
    },
    fileHash: {
      fontSize: 11,
      color: colors.info,
      fontFamily: 'monospace',
      marginBottom: 8,
    },
    deleteButton: {
      backgroundColor: colors.error,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    deleteButtonText: {
      color: colors.onError,
      fontSize: 12,
      fontWeight: '500',
    },
    emptyState: {
      padding: 20,
      alignItems: 'center',
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>IPFS Mobile Demo</Text>

        {/* Connection Status */}
        <View style={styles.section}>
          <IPFSConnectionStatus />
        </View>

        {/* File Upload */}
        <View style={styles.section}>
          <IPFSFileUpload
            multiple={true}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
        </View>

        {/* File List with integrated CRUD */}
        <View style={styles.section}>
          <IPFSFileList
            onFileDeleted={handleFileDeleted}
            externalFiles={allFiles}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const AppWithIPFS: React.FC = () => {
  return (
    <ThemeProvider>
      <IPFSDemo />
    </ThemeProvider>
  );
};

export default AppWithIPFS;