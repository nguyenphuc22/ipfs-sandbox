import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {FileListProps} from '../../types';
import {useTheme} from '../../styles';
import {FileItem} from './FileItem';

export const FileList: React.FC<FileListProps> = ({
  files,
  onDeleteFile,
}) => {
  const {theme} = useTheme();

  if (files.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📂</Text>
        <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
          No files uploaded yet
        </Text>
        <Text
          style={[styles.emptySubtext, {color: theme.colors.textSecondary}]}>
          Upload your first file to get started
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={files}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <FileItem file={item} onDelete={onDeleteFile} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.fileListContainer}
    />
  );
};

const styles = StyleSheet.create({
  fileListContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
