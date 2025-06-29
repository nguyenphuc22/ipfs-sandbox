import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FileData } from '../types';

const STORAGE_KEY = 'ipfs_uploaded_files';

export interface UseFileStorageReturn {
  storedFiles: FileData[];
  saveFile: (file: FileData) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  clearAllFiles: () => Promise<void>;
  refreshFiles: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useFileStorage = (): UseFileStorageReturn => {
  const [storedFiles, setStoredFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load files from AsyncStorage on mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedFiles: FileData[] = JSON.parse(storedData);
        // Convert string dates back to Date objects
        const processedFiles = parsedFiles.map(file => ({
          ...file,
          uploadTime: new Date(file.uploadTime),
        }));
        setStoredFiles(processedFiles);
      } else {
        setStoredFiles([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load files';
      setError(errorMessage);
      console.error('Error loading files from storage:', err);
      setStoredFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFile = useCallback(async (file: FileData) => {
    try {
      setError(null);
      
      // Update local state first for immediate UI update
      setStoredFiles(prevFiles => {
        // Check if file already exists (by ID or IPFS hash)
        const existingIndex = prevFiles.findIndex(f => 
          f.id === file.id || 
          (f.ipfsHash && file.ipfsHash && f.ipfsHash === file.ipfsHash)
        );
        
        if (existingIndex >= 0) {
          // Update existing file
          const updatedFiles = [...prevFiles];
          updatedFiles[existingIndex] = file;
          return updatedFiles;
        } else {
          // Add new file at the beginning (newest first)
          return [file, ...prevFiles];
        }
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
        // Add new file at the beginning
        filesArray.unshift(file);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filesArray));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save file';
      setError(errorMessage);
      console.error('Error saving file to storage:', err);
      throw err;
    }
  }, []);

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
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove file';
      setError(errorMessage);
      console.error('Error removing file from storage:', err);
      throw err;
    }
  }, []);

  const clearAllFiles = useCallback(async () => {
    try {
      setError(null);
      
      // Update local state first
      setStoredFiles([]);
      
      // Then clear storage
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear files';
      setError(errorMessage);
      console.error('Error clearing files from storage:', err);
      throw err;
    }
  }, []);

  const refreshFiles = useCallback(async () => {
    await loadFiles();
  }, []);

  return {
    storedFiles,
    saveFile,
    removeFile,
    clearAllFiles,
    refreshFiles,
    isLoading,
    error,
  };
};