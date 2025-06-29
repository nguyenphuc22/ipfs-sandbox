import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FileData } from '../types';

const STORAGE_KEY = 'ipfs_files_enhanced';
const INDEX_KEY = 'ipfs_files_index';
const METADATA_KEY = 'ipfs_storage_metadata';

interface StorageMetadata {
  version: string;
  lastSync: string;
  totalFiles: number;
  lastBackup: string;
}

interface FileIndex {
  [fileId: string]: {
    ipfsHash?: string;
    status: string;
    uploadTime: string;
    size: number;
  };
}

export interface UseEnhancedStorageReturn {
  storedFiles: FileData[];
  saveFile: (file: FileData) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  clearAllFiles: () => Promise<void>;
  refreshFiles: () => Promise<void>;
  getFilesByStatus: (status: string) => FileData[];
  getUnsyncedFiles: () => FileData[];
  isLoading: boolean;
  error: string | null;
  metadata: StorageMetadata | null;
}

export const useEnhancedStorage = (): UseEnhancedStorageReturn => {
  const [storedFiles, setStoredFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<StorageMetadata | null>(null);

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load metadata
      const metadataStr = await AsyncStorage.getItem(METADATA_KEY);
      const currentMetadata: StorageMetadata = metadataStr 
        ? JSON.parse(metadataStr)
        : {
            version: '1.0',
            lastSync: '',
            totalFiles: 0,
            lastBackup: '',
          };
      setMetadata(currentMetadata);

      // Load main files data
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedData) {
        const parsedFiles: FileData[] = JSON.parse(storedData);
        // Convert string dates back to Date objects
        const processedFiles = parsedFiles.map(file => ({
          ...file,
          uploadTime: new Date(file.uploadTime),
        })).sort((a, b) => 
          new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
        );
        
        setStoredFiles(processedFiles);
        
        // Update metadata if needed
        if (currentMetadata.totalFiles !== processedFiles.length) {
          await updateMetadata({ totalFiles: processedFiles.length });
        }
      } else {
        setStoredFiles([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load files';
      setError(errorMessage);
      console.error('Error loading files from enhanced storage:', err);
      setStoredFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMetadata = async (updates: Partial<StorageMetadata>) => {
    try {
      const currentMeta = metadata || {
        version: '1.0',
        lastSync: '',
        totalFiles: 0,
        lastBackup: '',
      };
      
      const updatedMeta = { ...currentMeta, ...updates };
      await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(updatedMeta));
      setMetadata(updatedMeta);
    } catch (err) {
      console.error('Error updating metadata:', err);
    }
  };

  const saveFile = useCallback(async (file: FileData) => {
    try {
      setError(null);
      
      // Update local state first for immediate UI update
      setStoredFiles(prevFiles => {
        const existingIndex = prevFiles.findIndex(f => 
          f.id === file.id || 
          (f.ipfsHash && file.ipfsHash && f.ipfsHash === file.ipfsHash)
        );
        
        let updatedFiles: FileData[];
        if (existingIndex >= 0) {
          // Update existing file
          updatedFiles = [...prevFiles];
          updatedFiles[existingIndex] = file;
        } else {
          // Add new file at the beginning (newest first)
          updatedFiles = [file, ...prevFiles];
        }
        
        // Sort by upload time
        return updatedFiles.sort((a, b) => 
          new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
        );
      });

      // Then persist to storage
      const currentFiles = await AsyncStorage.getItem(STORAGE_KEY);
      const filesArray: FileData[] = currentFiles ? JSON.parse(currentFiles) : [];
      
      // Check if file already exists
      const existingIndex = filesArray.findIndex(f => 
        f.id === file.id || 
        (f.ipfsHash && file.ipfsHash && f.ipfsHash === file.ipfsHash)
      );
      
      if (existingIndex >= 0) {
        // Update existing file
        filesArray[existingIndex] = file;
      } else {
        // Add new file
        filesArray.push(file);
      }
      
      // Sort and save
      const sortedFiles = filesArray.sort((a, b) => 
        new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
      );
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sortedFiles));
      
      // Update index for quick lookups
      await updateFileIndex(file);
      
      // Update metadata
      await updateMetadata({ 
        totalFiles: sortedFiles.length,
        lastSync: new Date().toISOString() 
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save file';
      setError(errorMessage);
      console.error('Error saving file to enhanced storage:', err);
      throw err;
    }
  }, [metadata]);

  const updateFileIndex = async (file: FileData) => {
    try {
      const indexStr = await AsyncStorage.getItem(INDEX_KEY);
      const index: FileIndex = indexStr ? JSON.parse(indexStr) : {};
      
      index[file.id] = {
        ipfsHash: file.ipfsHash,
        status: file.status,
        uploadTime: file.uploadTime.toISOString(),
        size: file.size,
      };
      
      await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
    } catch (err) {
      console.error('Error updating file index:', err);
    }
  };

  const removeFile = useCallback(async (fileId: string) => {
    try {
      setError(null);
      
      // Update local state first
      setStoredFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));

      // Then persist to storage
      const currentFiles = await AsyncStorage.getItem(STORAGE_KEY);
      if (currentFiles) {
        const filesArray: FileData[] = JSON.parse(currentFiles);
        const updatedFiles = filesArray.filter(f => f.id !== fileId);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
        
        // Update index
        const indexStr = await AsyncStorage.getItem(INDEX_KEY);
        if (indexStr) {
          const index: FileIndex = JSON.parse(indexStr);
          delete index[fileId];
          await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
        }
        
        // Update metadata
        await updateMetadata({ 
          totalFiles: updatedFiles.length,
          lastSync: new Date().toISOString() 
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove file';
      setError(errorMessage);
      console.error('Error removing file from enhanced storage:', err);
      throw err;
    }
  }, [metadata]);

  const clearAllFiles = useCallback(async () => {
    try {
      setError(null);
      
      // Backup before clearing
      const backupKey = `${STORAGE_KEY}_backup_${Date.now()}`;
      const currentData = await AsyncStorage.getItem(STORAGE_KEY);
      if (currentData) {
        await AsyncStorage.setItem(backupKey, currentData);
      }
      
      // Clear storage
      await AsyncStorage.multiRemove([STORAGE_KEY, INDEX_KEY]);
      
      // Update local state
      setStoredFiles([]);
      
      // Update metadata
      await updateMetadata({ 
        totalFiles: 0,
        lastSync: new Date().toISOString(),
        lastBackup: new Date().toISOString() 
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear files';
      setError(errorMessage);
      console.error('Error clearing files from enhanced storage:', err);
      throw err;
    }
  }, [metadata]);

  const refreshFiles = useCallback(async () => {
    await loadFiles();
  }, []);

  const getFilesByStatus = useCallback((status: string): FileData[] => {
    return storedFiles.filter(file => file.status === status);
  }, [storedFiles]);

  const getUnsyncedFiles = useCallback((): FileData[] => {
    return storedFiles.filter(file => 
      !file.ipfsHash || file.status === 'uploading' || file.status === 'failed'
    );
  }, [storedFiles]);

  return {
    storedFiles,
    saveFile,
    removeFile,
    clearAllFiles,
    refreshFiles,
    getFilesByStatus,
    getUnsyncedFiles,
    isLoading,
    error,
    metadata,
  };
};