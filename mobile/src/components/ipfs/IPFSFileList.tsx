import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { useIPFS, useEnhancedStorage } from '../../hooks';
import { useTheme } from '../../styles';
import { FileData } from '../../types';
import { FileViewer } from './FileViewer';
import { normalizeHex } from '../../utils/aotCrypto';
import { createAnonymousFileAccessService } from '../../services/AnonymousFileAccessService';

interface IPFSFileListProps {
  onFileDeleted?: (fileId: string) => void;
  externalFiles?: FileData[];
  ownerPublicKey?: string;
  anonymousAuth?: {
    ringSignature: string;
    timestamp: number;
    nonce: string;
  };
}

export const IPFSFileList: React.FC<IPFSFileListProps> = ({
  onFileDeleted,
  externalFiles = [],
  ownerPublicKey,
  anonymousAuth,
}) => {
  const { colors } = useTheme();
  const { listFiles, deleteFile, getUserFiles } = useIPFS();

  // Add enhanced storage hook for persistence
  const {
    storedFiles,
    removeFile,
    clearAllFiles: clearStoredFiles,
    isLoading: isStorageLoading,
    metadata,
  } = useEnhancedStorage();

  const [apiFiles, setApiFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // File viewer state
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  const normalizedOwnerKey = useMemo(
    () => (ownerPublicKey ? normalizeHex(ownerPublicKey) : null),
    [ownerPublicKey],
  );

  const allFiles = useMemo(() => {
    const combined = [...externalFiles, ...apiFiles, ...storedFiles];

    const uniqueFiles = combined.reduce((acc: FileData[], current) => {
      const existingFile = acc.find(
        (file) =>
          (file.ipfsHash && current.ipfsHash && file.ipfsHash === current.ipfsHash) ||
          file.id === current.id,
      );

      if (!existingFile) {
        acc.push(current);
      }

      return acc;
    }, []);

    return uniqueFiles.sort(
      (a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime(),
    );
  }, [apiFiles, externalFiles, storedFiles]);

  const isMountedRef = useRef(true);
  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  const fetchFiles = useCallback(
    async (showLoading = true) => {
      if (!isMountedRef.current) {
        return;
      }

      if (showLoading) {
        setIsLoading(true);
      }

      try {
        let result;
        if (ownerPublicKey && anonymousAuth) {
          // Use anonymous authentication with provided parameters
          result = await getUserFiles({
            publicKey: ownerPublicKey,
            ringSignature: anonymousAuth.ringSignature,
            timestamp: anonymousAuth.timestamp,
            nonce: anonymousAuth.nonce
          });
        } else if (ownerPublicKey) {
          // Use AnonymousFileAccessService to generate proper auth parameters
          console.log('IPFSFileList: Using AnonymousFileAccessService to fetch files');
          const anonymousService = createAnonymousFileAccessService();

          // Check if identity is set up
          const hasIdentity = await anonymousService.hasIdentity();
          if (!hasIdentity) {
            console.warn('IPFSFileList: No anonymous identity found, falling back to listFiles');
            result = await listFiles();
          } else {
            // Get files using proper anonymous authentication
            const accessibleFiles = await anonymousService.listAccessibleFiles();

            // Transform to match expected format
            result = {
              success: true,
              files: accessibleFiles.map(file => ({
                id: file.fileId,
                name: file.fileName,
                size: file.fileSize,
                ipfsHash: file.fileId, // fileId is the IPFS hash
                uploadTime: new Date(file.uploadedAt),
                status: 'active' as const,
                ownershipPublicKey: file.ownerPublicKey,
                chunkCount: file.chunkCount,
                mimeType: file.mimeType,
                grantedAt: file.grantedAt,
              }))
            };
          }
        } else {
          result = await listFiles();
        }

        if (!isMountedRef.current) {
          return;
        }

        if (result.success && result.files) {
          const filesList: FileData[] = Array.isArray(result.files) ? result.files : [];
          const filtered: FileData[] = normalizedOwnerKey
            ? filesList.filter((file: FileData) =>
                file.ownershipPublicKey
                  ? normalizeHex(file.ownershipPublicKey) === normalizedOwnerKey
                  : true,
              )
            : filesList;
          setApiFiles(filtered);
        } else {
          console.warn('Failed to load files:', result?.error);
          setApiFiles([]);
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error('Error loading files:', error);
          setApiFiles([]);
        }
      } finally {
        if (isMountedRef.current && showLoading) {
          setIsLoading(false);
        }
      }
    },
    [getUserFiles, listFiles, normalizedOwnerKey, ownerPublicKey, anonymousAuth],
  );

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchFiles(false);
    setIsRefreshing(false);
  }, [fetchFiles]);

  const handleViewFile = (file: FileData) => {
    if (!file.ipfsHash) {
      Alert.alert('Error', 'Cannot view file: No IPFS hash available');
      return;
    }
    setSelectedFile(file);
    setViewerVisible(true);
  };

  const handleCloseViewer = () => {
    setViewerVisible(false);
    setSelectedFile(null);
  };

  const handleDeleteFile = async (file: FileData) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${file.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete from server if IPFS hash exists
              if (file.ipfsHash) {
                const result = await deleteFile(file.ipfsHash);
                if (result.success) {
                  // Remove from API files state
                  const updatedApiFiles = apiFiles.filter(f => f.ipfsHash !== file.ipfsHash);
                  setApiFiles(updatedApiFiles);
                }
              }

              // Always remove from local storage
              await removeFile(file.id);
              onFileDeleted?.(file.id);

              Alert.alert('Success', 'File deleted successfully');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleClearAllFiles = async () => {
    Alert.alert(
      'Clear All Files',
      'Are you sure you want to clear all files? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearStoredFiles();
              setApiFiles([]);
              Alert.alert('Success', 'All files cleared');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to clear files';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {return '0 Bytes';}
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const iconMap: Record<string, string> = {
      pdf: '📄', doc: '📄', docx: '📄', txt: '📄',
      jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', svg: '🖼️',
      mp4: '🎥', avi: '🎥', mov: '🎥', mkv: '🎥',
      mp3: '🎵', wav: '🎵', flac: '🎵',
      zip: '📦', rar: '📦',
      xls: '📊', xlsx: '📊', csv: '📊',
    };
    return iconMap[extension] || '📄';
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 16,
      elevation: 2,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    actionButtons: {
      flexDirection: 'row',
    },
    actionButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      marginLeft: 8,
    },
    actionButtonText: {
      color: colors.onSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    refreshButton: {
      backgroundColor: colors.primary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    refreshButtonText: {
      color: colors.onPrimary,
      fontSize: 12,
      fontWeight: '500',
    },
    clearButton: {
      backgroundColor: colors.error,
    },
    fileList: {
      maxHeight: 400,
    },
    fileItem: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 6,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    fileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    fileIcon: {
      fontSize: 20,
      marginRight: 8,
    },
    fileName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      flex: 1,
    },
    viewButton: {
      backgroundColor: colors.primary,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    viewButtonText: {
      color: colors.onPrimary,
      fontSize: 10,
      fontWeight: '500',
    },
    deleteButton: {
      backgroundColor: colors.error,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    deleteButtonText: {
      color: colors.onError,
      fontSize: 10,
      fontWeight: '500',
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
    },
    fileKey: {
      fontSize: 11,
      color: colors.success,
      fontFamily: 'monospace',
      marginTop: 2,
    },
    fileMeta: {
      fontSize: 11,
      color: colors.textSecondary,
      fontFamily: 'monospace',
      marginTop: 2,
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 16,
      opacity: 0.5,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtext: {
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
      opacity: 0.7,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      padding: 20,
    },
    migrationText: {
      color: colors.info,
      fontSize: 12,
      textAlign: 'center',
      paddingHorizontal: 20,
      marginTop: 8,
    },
  });

  if (isLoading || isStorageLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Files (Loading...)</Text>
        </View>
        <Text style={styles.loadingText}>Loading files...</Text>
        {metadata && (
          <Text style={styles.migrationText}>
            {metadata.totalFiles} files • Enhanced storage v{metadata.version}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Files ({allFiles.length})</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Text style={styles.refreshButtonText}>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Text>
          </TouchableOpacity>

          {allFiles.length > 0 && (
            <TouchableOpacity
              style={[styles.actionButton, styles.clearButton]}
              onPress={handleClearAllFiles}
            >
              <Text style={styles.actionButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {allFiles.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📁</Text>
          <Text style={styles.emptyText}>No files found</Text>
          <Text style={styles.emptySubtext}>
            Upload some files or tap refresh to load existing files
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.fileList}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          {(allFiles || []).map((file) => (
            <View key={file.id} style={styles.fileItem}>
              <View style={styles.fileHeader}>
                <Text style={styles.fileIcon}>{getFileIcon(file.name)}</Text>
                <Text style={styles.fileName}>{file.name}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewFile(file)}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteFile(file)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.fileDetails}>
                Size: {formatFileSize(file.size)} •
                Status: {file.status} •
                Uploaded: {file.uploadTime.toLocaleString()}
              </Text>

              {file.ipfsHash && (
                <Text style={styles.fileHash}>
                  IPFS: {file.ipfsHash}
                </Text>
              )}

              {file.masterKey && (
                <Text style={styles.fileKey}>
                  Master Key: {file.masterKey}
                </Text>
              )}

              {file.metadataHash && (
                <Text style={styles.fileMeta}>
                  Metadata Hash: {file.metadataHash}
                </Text>
              )}

              {file.ownershipPublicKey && (
                <Text style={styles.fileMeta}>
                  Owner Key: {file.ownershipPublicKey}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* File Viewer Modal */}
      {selectedFile && (
        <FileViewer
          file={selectedFile}
          visible={viewerVisible}
          onClose={handleCloseViewer}
        />
      )}
    </View>
  );
};
