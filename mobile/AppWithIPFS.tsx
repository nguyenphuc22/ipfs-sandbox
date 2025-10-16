import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { ThemeProvider, useTheme } from './src/styles';
import { IPFSConnectionStatus } from './src/components/ipfs/IPFSConnectionStatus';
import { IPFSFileUpload } from './src/components/ipfs/IPFSFileUpload';
import { IPFSFileList } from './src/components/ipfs/IPFSFileList';
import { AOTIdentity, FileData } from './src/types';
import { useAOTIdentity } from './src/hooks';
import { InitScreen } from './src/screens/InitScreen';

const formatKey = (key: string) => {
  if (key.length <= 12) {
    return key;
  }
  return `${key.slice(0, 10)}…${key.slice(-8)}`;
};

interface IPFSDemoProps {
  identity: AOTIdentity;
}

const IPFSDemo: React.FC<IPFSDemoProps> = ({ identity }) => {
  const { colors } = useTheme();

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




  const styles = useMemo(
    () =>
      StyleSheet.create({
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
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    identityCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    identityRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    identityLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    identityValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    keyLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 6,
    },
    keyValue: {
      fontFamily: 'monospace',
      fontSize: 12,
      color: colors.info,
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
    sectionTopAligned: {
      marginTop: 0,
    },
    privateKeyLabel: {
      marginTop: 12,
    },
  }),
    [colors],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>IPFS Mobile Demo</Text>
        <Text style={styles.subtitle}>
          Chào {identity.displayName}, đây là không gian làm việc của bạn.
        </Text>

        <View style={[styles.section, styles.sectionTopAligned]}>
          <View style={styles.identityCard}>
            <View style={styles.identityRow}>
              <Text style={styles.identityLabel}>Định danh</Text>
              <Text style={styles.identityValue}>{identity.identifier}</Text>
            </View>
            <Text style={styles.keyLabel}>Public key</Text>
            <Text style={styles.keyValue}>{formatKey(identity.publicKey)}</Text>
            <Text style={[styles.keyLabel, styles.privateKeyLabel]}>Private key (lưu trên máy)</Text>
            <Text style={styles.keyValue}>{formatKey(identity.privateKey)}</Text>
          </View>
        </View>

        {/* Connection Status */}
        <View style={styles.section}>
          <IPFSConnectionStatus />
        </View>

        {/* File Upload */}
        <View style={styles.section}>
          <IPFSFileUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
        </View>

        {/* File List with integrated CRUD */}
        <View style={styles.section}>
          <IPFSFileList
            ownerPublicKey={identity.publicKey}
            onFileDeleted={handleFileDeleted}
            externalFiles={allFiles}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const AppContainer: React.FC = () => {
  const { identity, isLoading, error, initializeIdentity, clearError } = useAOTIdentity();

  if (!identity || !identity.displayName || !identity.publicKey || !identity.privateKey) {
    return (
      <InitScreen
        loading={isLoading}
        error={error}
        onInitialize={initializeIdentity}
        onClearError={clearError}
      />
    );
  }

  return <IPFSDemo identity={identity} />;
};

const AppWithIPFS: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContainer />
    </ThemeProvider>
  );
};

export default AppWithIPFS;
