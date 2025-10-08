/**
 * Chunked File Item Component
 * Display file with chunking information
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../styles';
import type { FileData } from '../../types';

interface ChunkedFileItemProps {
  file: FileData;
  onPress?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onRevoke?: () => void;
}

export const ChunkedFileItem: React.FC<ChunkedFileItemProps> = ({
  file,
  onPress,
  onDelete,
  onDownload,
  onRevoke,
}) => {
  const { colors } = useTheme();

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) {return `${bytes} B`;}
    if (bytes < 1024 * 1024) {return `${(bytes / 1024).toFixed(1)} KB`;}
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = () => {
    switch (file.status) {
      case 'completed':
      case 'active':
        return colors.success;
      case 'uploading':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'revoked':
        return colors.textSecondary;
      default:
        return colors.text;
    }
  };

  const getStatusLabel = () => {
    switch (file.status) {
      case 'completed':
        return '✓ Completed';
      case 'active':
        return '✓ Active';
      case 'uploading':
        return '⏳ Uploading';
      case 'error':
        return '❌ Error';
      case 'revoked':
        return '🚫 Revoked';
      default:
        return file.status;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      fontSize: 32,
      marginRight: 12,
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    fileSize: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    metaLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginRight: 8,
    },
    metaValue: {
      fontSize: 12,
      color: colors.text,
      fontFamily: 'monospace',
    },
    chunkInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      backgroundColor: colors.background,
      borderRadius: 6,
      marginBottom: 12,
    },
    chunkText: {
      fontSize: 13,
      color: colors.info,
      fontWeight: '600',
      marginLeft: 8,
    },
    aotBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      backgroundColor: colors.info,
      borderRadius: 6,
      marginBottom: 12,
    },
    aotText: {
      fontSize: 12,
      color: colors.white,
      fontWeight: '600',
      marginLeft: 8,
    },
    actions: {
      flexDirection: 'row',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      marginHorizontal: 4,
      alignItems: 'center',
    },
    downloadButton: {
      backgroundColor: colors.primary,
    },
    revokeButton: {
      backgroundColor: colors.warning,
    },
    deleteButton: {
      backgroundColor: colors.error,
    },
    actionText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.white,
    },
    timestamp: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 8,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>📄</Text>
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>
          <Text style={styles.fileSize}>{formatSize(file.size)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={[styles.statusText, { color: colors.white }]}>
            {getStatusLabel()}
          </Text>
        </View>
      </View>

      {/* AOT Badge */}
      {file.ownershipPublicKey && (
        <View style={styles.aotBadge}>
          <Text>🛡️</Text>
          <Text style={styles.aotText}>
            Anonymous Ownership Token (AOT)
          </Text>
        </View>
      )}

      {/* Chunk Info */}
      {file.chunkCount && file.chunkCount > 1 && (
        <View style={styles.chunkInfo}>
          <Text>🧩</Text>
          <Text style={styles.chunkText}>
            {file.chunkCount} encrypted chunks
          </Text>
        </View>
      )}

      {/* Metadata */}
      {file.metadataHash && (
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Hash:</Text>
          <Text style={styles.metaValue} numberOfLines={1}>
            {file.metadataHash.substring(0, 16)}...
          </Text>
        </View>
      )}

      {file.ringMembers && file.ringMembers.length > 0 && (
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Ring:</Text>
          <Text style={styles.metaValue}>
            {file.ringMembers.length} members
          </Text>
        </View>
      )}

      {/* Timestamp */}
      <Text style={styles.timestamp}>
        Uploaded: {formatDate(file.uploadTime)}
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        {onDownload && file.status === 'active' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={onDownload}
          >
            <Text style={styles.actionText}>⬇️ Download</Text>
          </TouchableOpacity>
        )}

        {onRevoke && file.status === 'active' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.revokeButton]}
            onPress={onRevoke}
          >
            <Text style={styles.actionText}>🚫 Revoke</Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Text style={styles.actionText}>🗑️ Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChunkedFileItem;
