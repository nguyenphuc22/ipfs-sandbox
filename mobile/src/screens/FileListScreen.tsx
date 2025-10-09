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
  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[File List] Loading accessible files (anonymous)...');

      // Check if user has identity
      const hasIdentity = await anonymousFileAccessService.hasIdentity();
      if (!hasIdentity) {
        throw new Error('Please initialize your identity first');
      }

      // Fetch files using anonymous API
      const accessibleFiles = await anonymousFileAccessService.listAccessibleFiles();

      setFiles(accessibleFiles);
      console.log(`[File List] Loaded ${accessibleFiles.length} files`);

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
  }, []);

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFiles();
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
