/**
 * File List Screen - Anonymous Access
 *
 * Displays files accessible by the current user using anonymous API.
 * Uses publicKeyHash instead of userId for true anonymity.
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../styles';
import {
  anonymousFileAccessService,
  AccessibleFile,
  AnonymousListMeta,
} from '../services/AnonymousFileAccessService';

interface FileListScreenProps {
  onFilePress?: (file: AccessibleFile) => void;
  onUploadPress?: () => void;
}

export const FileListScreen: React.FC<FileListScreenProps> = ({
  onFilePress,
  onUploadPress,
}) => {
  const { colors } = useTheme();
  const [files, setFiles] = useState<AccessibleFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listMetadata, setListMetadata] = useState<AnonymousListMeta | null>(null);
  const [newGrantNotice, setNewGrantNotice] = useState<AccessibleFile[] | null>(null);
  const [revokedNotice, setRevokedNotice] = useState<{
    files: AccessibleFile[];
    removedKeyPackages: string[];
  } | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        },
        headerTitle: {
          fontSize: 24,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 4,
        },
        headerSubtitle: {
          fontSize: 14,
          color: colors.textSecondary,
        },
        anonymousBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: colors.primary + '20',
          borderRadius: 8,
          alignSelf: 'flex-start',
        },
        anonymousBadgeText: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.primary,
        },
        banner: {
          marginHorizontal: 16,
          marginTop: 12,
          padding: 14,
          borderRadius: 12,
          position: 'relative',
        },
        bannerPositive: {
          backgroundColor: colors.success + '20',
          borderLeftWidth: 3,
          borderLeftColor: colors.success,
        },
        bannerNegative: {
          backgroundColor: colors.error + '15',
          borderLeftWidth: 3,
          borderLeftColor: colors.error,
        },
        bannerTitle: {
          fontSize: 15,
          fontWeight: '700',
          color: colors.text,
        },
        bannerText: {
          marginTop: 6,
          fontSize: 13,
          color: colors.textSecondary,
          lineHeight: 18,
        },
        bannerListItem: {
          marginTop: 4,
          fontSize: 13,
          color: colors.textSecondary,
        },
        bannerInlineBadge: {
          marginLeft: 6,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 6,
          backgroundColor: colors.error + '20',
          color: colors.error,
          fontSize: 11,
          fontWeight: '700',
        },
        bannerBadge: {
          marginTop: 8,
          alignSelf: 'flex-start',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
          backgroundColor: colors.error + '25',
        },
        bannerBadgeText: {
          fontSize: 12,
          fontWeight: '700',
          color: colors.error,
        },
        bannerClose: {
          position: 'absolute',
          top: 10,
          right: 12,
          padding: 4,
        },
        bannerCloseText: {
          fontSize: 18,
          lineHeight: 18,
          color: colors.textSecondary,
        },
        listContent: {
          padding: 16,
        },
        emptyListContent: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        fileCard: {
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        },
        fileCardRevoked: {
          opacity: 0.5,
        },
        fileName: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 6,
        },
        fileInfo: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 8,
        },
        fileInfoItem: {
          fontSize: 13,
          color: colors.textSecondary,
        },
        fileMetadata: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        accessCount: {
          fontSize: 12,
          color: colors.textSecondary,
        },
        statusBadge: {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 6,
        },
        activeBadge: {
          backgroundColor: colors.success + '20',
        },
        revokedBadge: {
          backgroundColor: colors.error + '20',
        },
        statusText: {
          fontSize: 11,
          fontWeight: '600',
        },
        activeText: {
          color: colors.success,
        },
        revokedText: {
          color: colors.error,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        },
        loadingText: {
          marginTop: 12,
          fontSize: 14,
          color: colors.textSecondary,
        },
        emptyContainer: {
          alignItems: 'center',
          padding: 48,
        },
        emptyIcon: {
          fontSize: 64,
          marginBottom: 16,
        },
        emptyTitle: {
          fontSize: 18,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 8,
        },
        emptyText: {
          fontSize: 14,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
        },
        errorContainer: {
          padding: 16,
          margin: 16,
          backgroundColor: colors.error + '20',
          borderRadius: 12,
        },
        errorText: {
          fontSize: 14,
          color: colors.error,
          textAlign: 'center',
        },
        uploadButton: {
          margin: 16,
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
        },
        uploadButtonText: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.onPrimary,
        },
      }),
    [colors],
  );

  /**
   * Load files from anonymous API
   */
  const loadFiles = useCallback(
    async ({ bypassCache = false }: { bypassCache?: boolean } = {}) => {
      try {
        setLoading(true);
        setError(null);

        console.log('[File List] Loading accessible files (anonymous)...');

        const hasIdentity = await anonymousFileAccessService.hasIdentity();
        if (!hasIdentity) {
          throw new Error('Please initialize your identity first');
        }

        const result = await anonymousFileAccessService.listAccessibleFiles({ bypassCache });

        setFiles(result.files);
        setListMetadata(result.metadata);

        if (result.metadata.hadCache && result.changes.newFiles.length > 0) {
          setNewGrantNotice(result.changes.newFiles);
        } else if (result.changes.newFiles.length === 0 && !result.metadata.fromCache) {
          setNewGrantNotice(null);
        }

        if (
          result.changes.revokedFiles.length > 0 ||
          result.changes.removedKeyPackages.length > 0
        ) {
          setRevokedNotice({
            files: result.changes.revokedFiles,
            removedKeyPackages: result.changes.removedKeyPackages,
          });
        } else if (
          result.changes.revokedFiles.length === 0 &&
          result.changes.removedKeyPackages.length === 0 &&
          !result.metadata.fromCache
        ) {
          setRevokedNotice(null);
        }

        console.log(
          `[File List] Loaded ${result.files.length} active files (status ${result.metadata.responseStatus})`,
        );
      } catch (err) {
        console.error('[File List] Error loading files:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load files';
        setError(errorMessage);

        if (err instanceof Error && err.message.includes('ring signature')) {
          Alert.alert(
            'Authentication Error',
            'Ring signature verification failed. Please try again.',
            [{ text: 'OK' }]
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFiles({ bypassCache: true });
  }, [loadFiles]);

  /**
   * Handle file press
   */
  const handleFilePress = useCallback(
    (file: AccessibleFile) => {
      if (file.ownershipStatus === 'revoked') {
        Alert.alert(
          'File Revoked',
          'This file has been revoked by the owner and is no longer accessible.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (onFilePress) {
        onFilePress(file);
      } else {
        // Default: Show file details
        Alert.alert(
          file.fileName,
          `Size: ${formatFileSize(file.fileSize)}\nChunks: ${file.chunkCount}\nAccess count: ${file.accessCount}`,
          [{ text: 'OK' }]
        );
      }
    },
    [onFilePress],
  );

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /**
   * Format date
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString('vi-VN');
  };

  const handleDismissGrantBanner = useCallback(() => {
    setNewGrantNotice(null);
  }, []);

  const handleDismissRevokedBanner = useCallback(() => {
    setRevokedNotice(null);
  }, []);

  /**
   * Render file item
   */
  const renderFileItem = ({ item }: { item: AccessibleFile }) => (
    <TouchableOpacity
      style={[styles.fileCard, item.ownershipStatus === 'revoked' && styles.fileCardRevoked]}
      onPress={() => handleFilePress(item)}
      disabled={item.ownershipStatus === 'revoked'}
    >
      <Text style={styles.fileName} numberOfLines={1}>
        {item.fileName}
      </Text>

      <View style={styles.fileInfo}>
        <Text style={styles.fileInfoItem}>📦 {formatFileSize(item.fileSize)}</Text>
        <Text style={styles.fileInfoItem}>🧩 {item.chunkCount} chunks</Text>
        {item.mimeType && (
          <Text style={styles.fileInfoItem} numberOfLines={1}>
            📄 {item.mimeType}
          </Text>
        )}
      </View>

      <View style={styles.fileMetadata}>
        <Text style={styles.accessCount}>
          {item.accessCount} access{item.accessCount !== 1 ? 'es' : ''} • Granted{' '}
          {formatDate(item.grantedAt)}
        </Text>

        <View
          style={[
            styles.statusBadge,
            item.ownershipStatus === 'active' ? styles.activeBadge : styles.revokedBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.ownershipStatus === 'active' ? styles.activeText : styles.revokedText,
            ]}
          >
            {item.ownershipStatus === 'active' ? '✓ Active' : '⚠️ Revoked'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No files yet</Text>
      <Text style={styles.emptyText}>
        Upload a file or wait for someone to share a file with you
      </Text>
    </View>
  );

  /**
   * Render loading state
   */
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading files...</Text>
    </View>
  );

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Files</Text>
        <Text style={styles.headerSubtitle}>
          {files.length} file{files.length !== 1 ? 's' : ''} accessible
          {listMetadata?.lastModified
            ? ` • Cập nhật ${formatDateTime(listMetadata.lastModified)}`
            : ''}
        </Text>
        <View style={styles.anonymousBadge}>
          <Text style={styles.anonymousBadgeText}>🔒 Anonymous Access</Text>
        </View>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Notifications */}
      {newGrantNotice && newGrantNotice.length > 0 && (
        <View style={[styles.banner, styles.bannerPositive]}>
          <TouchableOpacity style={styles.bannerClose} onPress={handleDismissGrantBanner}>
            <Text style={styles.bannerCloseText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.bannerTitle}>Bạn vừa được cấp quyền mới</Text>
          <Text style={styles.bannerText}>
            {newGrantNotice.length === 1
              ? 'File sau đã xuất hiện trong danh sách của bạn:'
              : 'Các file sau đã xuất hiện trong danh sách của bạn:'}
          </Text>
          {newGrantNotice.map((file) => (
            <Text key={file.fileId} style={styles.bannerListItem}>
              • {file.fileName}
            </Text>
          ))}
        </View>
      )}

      {revokedNotice && revokedNotice.files.length > 0 && (
        <View style={[styles.banner, styles.bannerNegative]}>
          <TouchableOpacity style={styles.bannerClose} onPress={handleDismissRevokedBanner}>
            <Text style={styles.bannerCloseText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.bannerTitle}>Quyền truy cập đã bị thu hồi</Text>
          <Text style={styles.bannerText}>
            {revokedNotice.files.length === 1
              ? 'Bạn vừa mất quyền truy cập vào file:'
              : 'Bạn vừa mất quyền truy cập vào các file:'}
          </Text>
          {revokedNotice.files.map((file) => (
            <Text key={`revoked-${file.fileId}`} style={styles.bannerListItem}>
              • {file.fileName}
              <Text style={styles.bannerInlineBadge}>Revoked</Text>
            </Text>
          ))}
          {revokedNotice.removedKeyPackages.length > 0 && (
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>
                Đã xoá {revokedNotice.removedKeyPackages.length} key package cục bộ
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Upload button */}
      {onUploadPress && (
        <TouchableOpacity style={styles.uploadButton} onPress={onUploadPress}>
          <Text style={styles.uploadButtonText}>+ Upload File</Text>
        </TouchableOpacity>
      )}

      {/* File list */}
      {loading && files.length === 0 ? (
        renderLoadingState()
      ) : (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.fileId}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            files.length === 0 ? styles.emptyListContent : styles.listContent
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};
