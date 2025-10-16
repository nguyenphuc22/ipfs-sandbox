import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../styles';
import { FileData, LocalKeyPackage } from '../../types';
import { createDefaultGatewayService, FileViewResponse } from '../../services/GatewayApiService';
import {
  anonymousFileAccessService,
  FileAccessManifest,
} from '../../services/AnonymousFileAccessService';
import { useChunkDownloader } from '../../hooks';
import { ChunkMonitorPanel } from './ChunkMonitorPanel';
import { getKeyPackage } from '../../services/KeyPackageStorage';
import type { ChunkProgressState } from '../../types/download';

type FileViewerProps = {
  file: FileData;
  visible: boolean;
  onClose: () => void;
};

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
  const [reloadToken, setReloadToken] = useState(0);
  const [manifest, setManifest] = useState<FileAccessManifest | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [isManifestLoading, setIsManifestLoading] = useState(false);
  const manifestCacheRef = useRef<Record<string, FileAccessManifest>>({});
  const [hasLoggedView, setHasLoggedView] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'monitor'>('preview');
  const [localKeyPackage, setLocalKeyPackage] = useState<LocalKeyPackage | null>(
    file.localKeyPackage ?? null,
  );

  const demoModeEnabled = useMemo(
    () => __DEV__ || (typeof process !== 'undefined' && process.env?.KEY_MONITOR_DEMO === 'true'),
    [],
  );
  const isChunkedFile = (file.chunkCount ?? 0) > 1;
  const { session: downloadSession, actions: downloadActions } = useChunkDownloader(file.id);
  const chunkProgressState: ChunkProgressState = useMemo(() => {
    const progress = downloadSession.chunkProgress;
    if (progress.length === 0) {
      return {
        chunkProgress: progress,
        progressPercent: 0,
      };
    }

    const completed = progress.filter(chunk => chunk.status === 'completed').length;
    return {
      chunkProgress: progress,
      progressPercent: (completed / progress.length) * 100,
    };
  }, [downloadSession.chunkProgress]);
  const monitorError = manifestError ?? downloadSession.error;

  const gatewayService = useMemo(() => createDefaultGatewayService(), []);

  useEffect(() => {
    if (visible) {
      const chunkCount = file.chunkCount ?? 0;
      const isChunkedFileSession = chunkCount > 1;
      const totalSize = file.size ?? 0;
      const statusLabel = file.status ?? 'unknown';
      const sizeInMb = (totalSize / (1024 * 1024)).toFixed(2);

      if (isChunkedFileSession) {
        setIsLoading(false);
        setContentType('text/plain');
        setFileContent(
          '🧩 Chunked File\n\n' +
            `This file is split into ${chunkCount} encrypted chunks.\n\n` +
            `File: ${file.name}\n` +
            `Size: ${sizeInMb} MB\n` +
            `Chunks: ${chunkCount}\n` +
            `Status: ${statusLabel}\n\n` +
            (file.ownershipPublicKey ? '🛡️ Protected with Anonymous Ownership Token (AOT)\n\n' : '') +
            'To download this file, use the secure 4-phase download flow:\n' +
            '1. Access Negotiation\n' +
            '2. Key Orchestration\n' +
            '3. Chunk Retrieval & Integrity Verification\n' +
            '4. File Reconstruction\n\n' +
            'Tap "Download" button to start the secure download process.'
        );
      }

      if (!file.ipfsHash) {
        setIsLoading(false);
        setError('No IPFS hash available for this file');
        return;
      }

      let isCancelled = false;

      const fetchFileContent = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response: FileViewResponse = await gatewayService.viewFile(
            file.ipfsHash as string,
            file.name
          );

          if (isCancelled) {
            return;
          }

          if (response.success) {
            setContentType(response.contentType);

            if (typeof response.content === 'string') {
              setFileContent(response.content);
            } else {
              setFileContent(
                `Binary file (${response.contentType})\n` +
                  `Size: ${response.contentLength} bytes\n\n` +
                  'This file type is not yet supported for viewing in the app.'
              );
            }
          } else {
            setError('Failed to load file content');
          }
        } catch (err) {
          if (isCancelled) {
            return;
          }
          const errorMessage = err instanceof Error ? err.message : 'Failed to load file';
          setError(errorMessage);
          Alert.alert('Error', errorMessage);
        } finally {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
      };

      fetchFileContent();

      let cancelledManifest = false;

      if (isChunkedFileSession) {
        const cached = manifestCacheRef.current[file.id];

        if (cached) {
          setManifest(cached);
          setManifestError(null);
          downloadActions.ensureSession(cached);
        } else {
          const fetchManifest = async () => {
            setIsManifestLoading(true);
            setManifestError(null);
            try {
              const response = await anonymousFileAccessService.negotiateAccess(file.id);
              if (cancelledManifest) {return;}
              downloadActions.ensureSession(response);
              manifestCacheRef.current[file.id] = response;
              setManifest(response);
            } catch (manifestErr) {
              if (cancelledManifest) {return;}
              const message =
                manifestErr instanceof Error
                  ? manifestErr.message
                  : 'Failed to retrieve chunk manifest';
              setManifest(null);
              setManifestError(message);
            } finally {
              if (!cancelledManifest) {
                setIsManifestLoading(false);
              }
            }
          };

          fetchManifest();
        }
      } else {
        setManifest(null);
        setManifestError(null);
      }

      if (!hasLoggedView) {
        anonymousFileAccessService.logAnonymousAuditEvent('view', file.id).catch((loggingError: unknown) => {
          console.warn('[FileViewer] Failed to log anonymous audit event:', loggingError);
        });
        setHasLoggedView(true);
      }

      return () => {
        isCancelled = true;
        cancelledManifest = true;
      };
    } else {
      setFileContent(null);
      setError(null);
      setContentType('');
      setIsLoading(false);
      setManifestError(null);
      setManifest(null);
      setHasLoggedView(false);
      setLocalKeyPackage(file.localKeyPackage ?? null);
      setActiveTab('preview');
      downloadActions.resetSession();
    }
  }, [
    visible,
    gatewayService,
    file.id,
    file.chunkCount,
    file.size,
    file.status,
    file.ownershipPublicKey,
    file.name,
    file.ipfsHash,
    file.localKeyPackage,
    reloadToken,
    hasLoggedView,
    downloadActions,
  ]);

  useEffect(() => {
    if (manifest) {
      downloadActions.ensureSession(manifest);
    }
  }, [manifest, downloadActions]);

  useEffect(() => {
    let cancelled = false;

    const hydrateKeyPackage = async () => {
      if (!demoModeEnabled) {
        if (!cancelled) {
          setLocalKeyPackage(null);
        }
        return;
      }

      if (!visible) {
        if (!cancelled) {
          setLocalKeyPackage(file.localKeyPackage ?? null);
        }
        return;
      }

      if (file.localKeyPackage) {
        if (!cancelled) {
          setLocalKeyPackage(file.localKeyPackage);
        }
        return;
      }

      try {
        const stored = await getKeyPackage(file.id);
        if (!cancelled && stored) {
          setLocalKeyPackage({
            masterKey: stored.masterKey,
            chunkKeys: stored.chunkKeys,
            fingerprint: stored.fingerprint,
            storedAt: stored.storedAt,
          });
        }
      } catch (storageError) {
        if (!cancelled) {
          console.warn('[FileViewer] Failed to load stored key package', storageError);
        }
      }
    };

    hydrateKeyPackage();

    return () => {
      cancelled = true;
    };
  }, [demoModeEnabled, visible, file.id, file.localKeyPackage]);

  const handleRetry = () => {
    setReloadToken((token) => token + 1);
  };

  const getFileTypeDisplay = (): string => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
      txt: 'Text File',
      md: 'Markdown',
      csv: 'CSV Spreadsheet',
      json: 'JSON Data',
      xml: 'XML Document',
      pdf: 'PDF Document',
      doc: 'Word Document',
      docx: 'Word Document',
      xls: 'Excel Spreadsheet',
      xlsx: 'Excel Spreadsheet',
      jpg: 'JPEG Image',
      jpeg: 'JPEG Image',
      png: 'PNG Image',
      gif: 'GIF Image',
      svg: 'SVG Image',
    };

    return typeMap[extension] || `${extension.toUpperCase()} File`;
  };

  const formatFileSize = (bytes?: number | null): string => {
    if (!bytes) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const isTextPreview = useMemo(() => {
    if (!contentType) {
      return false;
    }
    return (
      contentType.startsWith('text/') ||
      contentType === 'application/json' ||
      contentType === 'application/xml'
    );
  }, [contentType]);

  const canPreview = useMemo(() => {
    if (isTextPreview) {
      return true;
    }
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const previewableTypes = ['txt', 'md', 'csv', 'json', 'xml'];
    return previewableTypes.includes(extension);
  }, [file.name, isTextPreview]);

  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading file content...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!canPreview) {
      return (
        <View style={styles.unsupportedContainer}>
          <Text style={styles.unsupportedIcon}>📄</Text>
          <Text style={styles.unsupportedTitle}>Preview Not Available</Text>
          <Text style={styles.unsupportedText}>
            This file type ({getFileTypeDisplay()}) is not yet supported for preview in the app.
            {'\n\n'}You can download the file to view it with an external application.
          </Text>
        </View>
      );
    }

    if (fileContent) {
      return (
        <ScrollView style={styles.textScroll}>
          <Text style={styles.textContent}>{fileContent}</Text>
        </ScrollView>
      );
    }

    return (
      <View style={styles.unsupportedContainer}>
        <Text style={styles.unsupportedIcon}>📭</Text>
        <Text style={styles.unsupportedTitle}>No Content</Text>
        <Text style={styles.unsupportedText}>File content could not be loaded.</Text>
      </View>
    );
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
    tabWrapper: {
      flex: 1,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 4,
      marginBottom: 12,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabButtonActive: {
      backgroundColor: colors.primary + '20',
    },
    tabButtonLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    tabButtonLabelActive: {
      color: colors.primary,
    },
    tabContent: {
      flex: 1,
    },
    textScroll: {
      flex: 1,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
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
              Size: {formatFileSize(file.size)} • Status: {file.status} • Uploaded: {file.uploadTime.toLocaleDateString()}
            </Text>
            {file.ipfsHash ? (
              <Text style={styles.fileHash}>IPFS: {file.ipfsHash}</Text>
            ) : null}
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {isChunkedFile ? (
              <View style={styles.tabWrapper}>
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'preview' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('preview')}
                  >
                    <Text
                      style={[
                        styles.tabButtonLabel,
                        activeTab === 'preview' && styles.tabButtonLabelActive,
                      ]}
                    >
                      Preview
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'monitor' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('monitor')}
                  >
                    <Text
                      style={[
                        styles.tabButtonLabel,
                        activeTab === 'monitor' && styles.tabButtonLabelActive,
                      ]}
                    >
                      Storage Monitor
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.tabContent}>
                  {activeTab === 'preview'
                    ? renderPreviewContent()
                    : (
                      <ChunkMonitorPanel
                        manifest={manifest}
                        chunkState={chunkProgressState}
                        isLoading={isManifestLoading}
                        error={monitorError}
                        localKeyPackage={localKeyPackage}
                        demoModeEnabled={demoModeEnabled}
                        fingerprint={file.keyPackageFingerprint ?? undefined}
                        phase={downloadSession.phase}
                      />
                    )}
                </View>
              </View>
            ) : (
              renderPreviewContent()
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};
