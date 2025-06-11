import {useState, useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {FileData, PickedFile, FileType} from '../types';
import {generateRandomId, generateMockIPFSHash} from '../utils';
import {MOCK_FILE_NAMES, FILE_SIZE_LIMITS} from '../constants';
import {FileValidationService} from '../utils/fileValidation';
import {useFilePicker} from './useFilePicker';

interface UseFilesOptions {
  enableRealFilePicker?: boolean;
  allowMultipleFiles?: boolean;
  allowedFileTypes?: FileType[];
  maxFileSizeMB?: number;
}

export const useFiles = (options: UseFilesOptions = {}) => {
  const {
    enableRealFilePicker = true,
    allowMultipleFiles = true,
    allowedFileTypes = ['allFiles'],
    maxFileSizeMB = 50,
  } = options;

  const [files, setFiles] = useState<FileData[]>([]);

  // Use real file picker if enabled
  const validationRules = enableRealFilePicker
    ? FileValidationService.createValidationRules({
        maxSizeMB: maxFileSizeMB,
        allowedExtensions: allowedFileTypes.includes('allFiles')
          ? undefined
          : FileValidationService.getExtensionsForFileTypes(allowedFileTypes),
      })
    : undefined;

  const filePicker = useFilePicker(validationRules);

  // Convert PickedFile to FileData
  const convertPickedFileToFileData = useCallback((pickedFile: PickedFile): FileData => {
    return {
      id: pickedFile.id,
      name: pickedFile.name || 'Unknown file',
      size: pickedFile.size || 0,
      uploadTime: pickedFile.uploadTime,
      status: pickedFile.status,
      ipfsHash: pickedFile.ipfsHash,
    };
  }, []);

  // Sync picked files with files state
  useEffect(() => {
    if (enableRealFilePicker) {
      const convertedFiles = filePicker.state.pickedFiles.map(convertPickedFileToFileData);
      setFiles(convertedFiles);
    }
  }, [filePicker.state.pickedFiles, convertPickedFileToFileData, enableRealFilePicker]);

  // Mock file generation (fallback)
  const generateMockFile = useCallback((): FileData => {
    const randomName =
      MOCK_FILE_NAMES[Math.floor(Math.random() * MOCK_FILE_NAMES.length)];
    const randomSize =
      Math.floor(Math.random() * (FILE_SIZE_LIMITS.MAX - FILE_SIZE_LIMITS.MIN)) +
      FILE_SIZE_LIMITS.MIN;

    return {
      id: generateRandomId(),
      name: randomName,
      size: randomSize,
      uploadTime: new Date(),
      status: 'uploading',
      ipfsHash: undefined,
    };
  }, []);

  const simulateUpload = useCallback((fileId: string) => {
    const uploadDuration = 2000 + Math.random() * 3000; // 2-5 seconds

    setTimeout(() => {
      if (enableRealFilePicker) {
        // Update picked file status via filePicker
        (filePicker as any).updateFileStatus(fileId, 'completed', 100, generateMockIPFSHash());
      } else {
        // Update local files state
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
      }
    }, uploadDuration);
  }, [enableRealFilePicker, filePicker]);

  const uploadFile = useCallback(async () => {
    if (enableRealFilePicker) {
      try {
        const pickedFiles = await filePicker.pickFiles({
          allowMultiSelection: allowMultipleFiles,
          type: allowedFileTypes,
        });

        if (pickedFiles.length > 0) {
          // Start upload simulation for each picked file
          pickedFiles.forEach(file => {
            simulateUpload(file.id);
          });

          Alert.alert(
            'Files Selected',
            `${pickedFiles.length} file${pickedFiles.length > 1 ? 's' : ''} selected and uploading to IPFS...`,
            [{text: 'OK'}],
          );
        }
      } catch (error) {
        console.error('File picker error:', error);
      }
    } else {
      // Fallback to mock file generation
      const newFile = generateMockFile();
      setFiles(prevFiles => [newFile, ...prevFiles]);
      simulateUpload(newFile.id);

      Alert.alert(
        'Mock File Upload Started',
        `Uploading ${newFile.name} to IPFS...`,
        [{text: 'OK'}],
      );
    }
  }, [
    enableRealFilePicker,
    filePicker,
    allowMultipleFiles,
    allowedFileTypes,
    simulateUpload,
    generateMockFile,
  ]);

  const deleteFile = useCallback((fileId: string) => {
    const fileToDelete = files.find(f => f.id === fileId);
    if (!fileToDelete) {
      return;
    }

    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${fileToDelete.name}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (enableRealFilePicker) {
              filePicker.removeFile(fileId);
            } else {
              setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
            }
          },
        },
      ],
    );
  }, [files, enableRealFilePicker, filePicker]);

  const getFilesByStatus = useCallback(
    (status: FileData['status']) => {
      return files.filter(file => file.status === status);
    },
    [files],
  );

  const getTotalFileSize = useCallback(() => {
    return files.reduce((total, file) => total + file.size, 0);
  }, [files]);

  const clearAllFiles = useCallback(() => {
    if (enableRealFilePicker) {
      filePicker.clearFiles();
    } else {
      setFiles([]);
    }
  }, [enableRealFilePicker, filePicker]);

  return {
    files,
    uploadFile,
    deleteFile,
    getFilesByStatus,
    getTotalFileSize,
    clearAllFiles,
    // File picker state
    isLoading: enableRealFilePicker ? filePicker.state.isLoading : false,
    error: enableRealFilePicker ? filePicker.state.error : null,
    // Configuration
    isUsingRealFilePicker: enableRealFilePicker,
  };
};
