import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { PickedFile } from '../types/filePicker';
import { FileData } from '../types';
import { generateMockIPFSHash } from '../utils';

export const useSimpleFiles = () => {
  const [files, setFiles] = useState<FileData[]>([]);

  const convertPickedFileToFileData = useCallback((pickedFile: PickedFile): FileData => {
    return {
      id: pickedFile.id,
      name: pickedFile.name || 'Unknown file',
      size: pickedFile.size || 0,
      uploadTime: new Date(),
      status: 'uploading',
      ipfsHash: undefined,
    };
  }, []);

  const simulateUpload = useCallback((fileId: string) => {
    // Simulate upload after 1-3 seconds
    const uploadDuration = 1000 + Math.random() * 2000;

    setTimeout(() => {
      setFiles(prevFiles =>
        prevFiles.map(file =>
          file.id === fileId
            ? {
                ...file,
                status: 'completed' as const,
                ipfsHash: generateMockIPFSHash(),
              }
            : file,
        ),
      );
    }, uploadDuration);
  }, []);

  const addFiles = useCallback((pickedFiles: PickedFile[]) => {
    const newFiles = pickedFiles.map(convertPickedFileToFileData);
    
    setFiles(prevFiles => [...newFiles, ...prevFiles]);
    
    // Start mock upload simulation for each file
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  }, [convertPickedFileToFileData, simulateUpload]);

  const deleteFile = useCallback((fileId: string) => {
    const fileToDelete = files.find(f => f.id === fileId);
    if (!fileToDelete) {
      return;
    }

    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${fileToDelete.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
          },
        },
      ],
    );
  }, [files]);

  const clearAllFiles = useCallback(() => {
    Alert.alert(
      'Clear All Files',
      'Are you sure you want to remove all files?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setFiles([]);
          },
        },
      ],
    );
  }, []);

  const getFilesByStatus = useCallback(
    (status: FileData['status']) => {
      return files.filter(file => file.status === status);
    },
    [files],
  );

  const getTotalFileSize = useCallback(() => {
    return files.reduce((total, file) => total + file.size, 0);
  }, [files]);

  return {
    files,
    addFiles,
    deleteFile,
    clearAllFiles,
    getFilesByStatus,
    getTotalFileSize,
    isLoading: false, // Not needed for simple implementation
  };
};