import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {
  FilePickerOptions,
  FilePickerState,
  UseFilePickerReturn,
  PickedFile,
  FilePickerError,
  FileValidationRules,
} from '../types/filePicker';
import {FilePickerService, PermissionService} from '../services';
import {FileValidationService} from '../utils/fileValidation';

export const useFilePicker = (
  validationRules?: FileValidationRules,
): UseFilePickerReturn => {
  const [state, setState] = useState<FilePickerState>({
    isLoading: false,
    error: null,
    pickedFiles: [],
  });

  const filePickerService = new FilePickerService();
  const permissionService = new PermissionService();

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({...prev, isLoading}));
  }, []);

  const setError = useCallback((error: FilePickerError | null) => {
    setState(prev => ({...prev, error}));
  }, []);

  const setPickedFiles = useCallback((pickedFiles: PickedFile[]) => {
    setState(prev => ({...prev, pickedFiles}));
  }, []);

  const addPickedFiles = useCallback((newFiles: PickedFile[]) => {
    setState(prev => ({
      ...prev,
      pickedFiles: [...prev.pickedFiles, ...newFiles],
    }));
  }, []);

  const validateFiles = useCallback(
    (files: PickedFile[]): {valid: PickedFile[]; invalid: PickedFile[]} => {
      if (!validationRules) {
        return {valid: files, invalid: []};
      }

      const valid: PickedFile[] = [];
      const invalid: PickedFile[] = [];

      files.forEach(file => {
        const validation = FileValidationService.validateFile(file, validationRules);
        if (validation.isValid) {
          valid.push(file);
        } else {
          invalid.push(file);
          // Show error for invalid files
          Alert.alert(
            'Invalid File',
            `${file.name}: ${validation.errors.join(', ')}`,
            [{text: 'OK'}],
          );
        }
      });

      return {valid, invalid};
    },
    [validationRules],
  );

  const handleFilePickerError = useCallback((error: any) => {
    console.error('File picker error in useFilePicker:', error);

    const filePickerError: FilePickerError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      userInfo: error,
    };

    setError(filePickerError);

    // Don't show alert for user cancellation
    if (filePickerError.code !== 'DOCUMENT_PICKER_CANCELED') {
      const detailedMessage = `${filePickerError.message}\n\nError Code: ${filePickerError.code}`;
      Alert.alert(
        'File Selection Error',
        detailedMessage,
        [
          {text: 'OK'},
          {
            text: 'Debug Info',
            onPress: () => {
              console.log('Full error object:', error);
              Alert.alert('Debug Info', JSON.stringify(error, null, 2));
            },
          },
        ],
      );
    }
  }, [setError]);

  const pickFiles = useCallback(
    async (options: FilePickerOptions = {}): Promise<PickedFile[]> => {
      try {
        setLoading(true);
        setError(null);

        // Check permissions if needed
        if (options.type?.includes('images')) {
          const hasPermission = await permissionService.ensureImagePickerPermissions();
          if (!hasPermission) {
            throw new Error('Photo library permission is required to select images');
          }
        }

        const files = await filePickerService.pickFiles(options);

        if (files.length === 0) {
          return [];
        }

        // Validate files
        const {valid, invalid} = validateFiles(files);

        if (valid.length > 0) {
          addPickedFiles(valid);
        }

        if (invalid.length > 0) {
          console.warn(`${invalid.length} files were rejected due to validation errors`);
        }

        return valid;
      } catch (error) {
        handleFilePickerError(error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, addPickedFiles, validateFiles, handleFilePickerError, permissionService, filePickerService],
  );

  const pickSingleFile = useCallback(
    async (
      options: Omit<FilePickerOptions, 'allowMultiSelection'> = {},
    ): Promise<PickedFile | null> => {
      const files = await pickFiles({...options, allowMultiSelection: false});
      return files.length > 0 ? files[0] : null;
    },
    [pickFiles],
  );

  const pickMixedFiles = useCallback(
    async (options: FilePickerOptions = {}): Promise<PickedFile[]> => {
      try {
        setLoading(true);
        setError(null);

        const files = await filePickerService.pickMixedFiles(options);

        if (files.length === 0) {
          return [];
        }

        // Validate files
        const {valid, invalid} = validateFiles(files);

        if (valid.length > 0) {
          addPickedFiles(valid);
        }

        if (invalid.length > 0) {
          console.warn(`${invalid.length} files were rejected due to validation errors`);
        }

        return valid;
      } catch (error) {
        handleFilePickerError(error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, addPickedFiles, validateFiles, handleFilePickerError, filePickerService],
  );

  const pickDocuments = useCallback(
    async (options: Omit<FilePickerOptions, 'type'> = {}): Promise<PickedFile[]> => {
      try {
        setLoading(true);
        setError(null);

        const files = await filePickerService.pickDocuments(options);

        if (files.length === 0) {
          return [];
        }

        // Validate files
        const {valid, invalid} = validateFiles(files);

        if (valid.length > 0) {
          addPickedFiles(valid);
        }

        if (invalid.length > 0) {
          console.warn(`${invalid.length} files were rejected due to validation errors`);
        }

        return valid;
      } catch (error) {
        handleFilePickerError(error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, addPickedFiles, validateFiles, handleFilePickerError, filePickerService],
  );

  const pickMedia = useCallback(
    async (options: Omit<FilePickerOptions, 'type'> = {}): Promise<PickedFile[]> => {
      try {
        setLoading(true);
        setError(null);

        // Check permissions for media files
        const hasPermission = await permissionService.ensureImagePickerPermissions();
        if (!hasPermission) {
          throw new Error('Photo library permission is required to select media files');
        }

        const files = await filePickerService.pickMedia(options);

        if (files.length === 0) {
          return [];
        }

        // Validate files
        const {valid, invalid} = validateFiles(files);

        if (valid.length > 0) {
          addPickedFiles(valid);
        }

        if (invalid.length > 0) {
          console.warn(`${invalid.length} files were rejected due to validation errors`);
        }

        return valid;
      } catch (error) {
        handleFilePickerError(error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, addPickedFiles, validateFiles, handleFilePickerError, permissionService, filePickerService],
  );

  const clearFiles = useCallback(() => {
    setPickedFiles([]);
    setError(null);
  }, [setPickedFiles, setError]);

  const removeFile = useCallback(
    (fileId: string) => {
      setState(prev => ({
        ...prev,
        pickedFiles: prev.pickedFiles.filter(file => file.id !== fileId),
      }));
    },
    [],
  );

  const updateFileStatus = useCallback(
    (fileId: string, status: PickedFile['status'], progress?: number, ipfsHash?: string) => {
      setState(prev => ({
        ...prev,
        pickedFiles: prev.pickedFiles.map(file =>
          file.id === fileId
            ? {
                ...file,
                status,
                ...(progress !== undefined && {progress}),
                ...(ipfsHash && {ipfsHash}),
              }
            : file,
        ),
      }));
    },
    [],
  );

  // Additional utility functions
  const getFilesByStatus = useCallback(
    (status: PickedFile['status']) => {
      return state.pickedFiles.filter(file => file.status === status);
    },
    [state.pickedFiles],
  );

  const getTotalFileSize = useCallback(() => {
    return state.pickedFiles.reduce((total, file) => total + (file.size || 0), 0);
  }, [state.pickedFiles]);

  const hasFiles = useCallback(() => {
    return state.pickedFiles.length > 0;
  }, [state.pickedFiles]);

  const isUploading = useCallback(() => {
    return state.pickedFiles.some(file => file.status === 'uploading');
  }, [state.pickedFiles]);

  return {
    pickFiles,
    pickSingleFile,
    pickMixedFiles,
    pickDocuments,
    pickMedia,
    clearFiles,
    removeFile,
    state,
    // Additional utility functions not in the interface but useful
    updateFileStatus,
    getFilesByStatus,
    getTotalFileSize,
    hasFiles,
    isUploading,
  } as UseFilePickerReturn & {
    pickMixedFiles: (options?: FilePickerOptions) => Promise<PickedFile[]>;
    pickDocuments: (options?: Omit<FilePickerOptions, 'type'>) => Promise<PickedFile[]>;
    pickMedia: (options?: Omit<FilePickerOptions, 'type'>) => Promise<PickedFile[]>;
    updateFileStatus: (fileId: string, status: PickedFile['status'], progress?: number, ipfsHash?: string) => void;
    getFilesByStatus: (status: PickedFile['status']) => PickedFile[];
    getTotalFileSize: () => number;
    hasFiles: () => boolean;
    isUploading: () => boolean;
  };
};
