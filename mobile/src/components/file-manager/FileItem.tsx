import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {FileItemProps} from '../../types';
import {useTheme} from '../../styles';
import {formatFileSize, formatDateTime, getFileIcon} from '../../utils';

export const FileItem: React.FC<FileItemProps> = ({
  file,
  onDelete,
}) => {
  const {theme} = useTheme();

  const getStatusColor = () => {
    switch (file.status) {
      case 'uploading':
        return theme.colors.warning;
      case 'completed':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (file.status) {
      case 'uploading':
        return 'Uploading...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <View
      style={[
        styles.fileItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <View style={styles.fileInfo}>
        <Text
          style={[styles.fileName, {color: theme.colors.text}]}
          numberOfLines={1}>
          {getFileIcon(file.name)} {file.name}
        </Text>
        <Text style={[styles.fileDetails, {color: theme.colors.textSecondary}]}>
          {formatFileSize(file.size)} • {formatDateTime(file.uploadTime)}
        </Text>
        <View style={styles.statusContainer}>
          <View
            style={[styles.statusDot, {backgroundColor: getStatusColor()}]}
          />
          <Text
            style={[styles.statusText, {color: theme.colors.textSecondary}]}>
            {getStatusText()}
          </Text>
          {file.status === 'uploading' && (
            <ActivityIndicator size="small" color={getStatusColor()} />
          )}
        </View>
        {file.ipfsHash && (
          <Text
            style={[styles.ipfsHash, {color: theme.colors.primary}]}
            numberOfLines={1}>
            IPFS: {file.ipfsHash}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(file.id)}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fileItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  fileDetails: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    marginRight: 10,
  },
  ipfsHash: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  deleteButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 20,
  },
});
