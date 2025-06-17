import { useState, useEffect, useCallback, useRef } from 'react';
import { FileData, PickedFile } from '../types';
import { IPFSService, createIPFSService, IPFSServiceConfig } from '../services';

export interface UseIPFSOptions {
  config?: IPFSServiceConfig;
  autoConnect?: boolean;
}

export interface IPFSConnectionState {
  isConnected: boolean;
  isHealthy: boolean;
  isMockMode: boolean;
  isConnecting: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useIPFS = (options: UseIPFSOptions = {}) => {
  const { config, autoConnect = true } = options;
  
  // Service instance
  const serviceRef = useRef<IPFSService | null>(null);
  
  // Connection state
  const [connectionState, setConnectionState] = useState<IPFSConnectionState>({
    isConnected: false,
    isHealthy: false,
    isMockMode: config?.useMockApi || false,
    isConnecting: false,
    error: null,
    lastChecked: null,
  });
  
  // File operations state
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Initialize service
  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = createIPFSService(config);
      setConnectionState(prev => ({
        ...prev,
        isMockMode: serviceRef.current?.isMockMode() || false,
      }));
    }
  }, [config]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && serviceRef.current && !connectionState.isConnecting) {
      checkConnection();
    }
  }, [autoConnect]);

  // Check connection and health
  const checkConnection = useCallback(async () => {
    if (!serviceRef.current) return;

    setConnectionState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const [healthResult, connectionResult] = await Promise.all([
        serviceRef.current.checkHealth(),
        serviceRef.current.testConnection(),
      ]);

      setConnectionState(prev => ({
        ...prev,
        isHealthy: healthResult.isHealthy,
        isConnected: connectionResult.isConnected,
        isConnecting: false,
        error: healthResult.error || connectionResult.error || null,
        lastChecked: new Date(),
      }));

      return {
        isHealthy: healthResult.isHealthy,
        isConnected: connectionResult.isConnected,
        error: healthResult.error || connectionResult.error,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection check failed';
      setConnectionState(prev => ({
        ...prev,
        isHealthy: false,
        isConnected: false,
        isConnecting: false,
        error: errorMessage,
        lastChecked: new Date(),
      }));

      return {
        isHealthy: false,
        isConnected: false,
        error: errorMessage,
      };
    }
  }, []);

  // Upload file
  const uploadFile = useCallback(async (file: PickedFile): Promise<{
    success: boolean;
    data?: FileData;
    error?: string;
  }> => {
    if (!serviceRef.current) {
      return { success: false, error: 'IPFS service not initialized' };
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await serviceRef.current.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);

      return result;
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }, []);

  // Upload multiple files
  const uploadMultipleFiles = useCallback(async (files: PickedFile[]) => {
    if (!serviceRef.current) {
      return {
        success: false,
        results: [],
        totalSuccess: 0,
        totalFailed: files.length,
      };
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await serviceRef.current.uploadMultipleFiles(files);
      
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);

      return result;
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      throw error;
    }
  }, []);

  // Download file
  const downloadFile = useCallback(async (hash: string): Promise<{
    success: boolean;
    blob?: Blob;
    error?: string;
  }> => {
    if (!serviceRef.current) {
      return { success: false, error: 'IPFS service not initialized' };
    }

    setIsDownloading(true);

    try {
      const result = await serviceRef.current.downloadFile(hash);
      setIsDownloading(false);
      return result;
    } catch (error) {
      setIsDownloading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed',
      };
    }
  }, []);

  // Get file metadata
  const getFileMetadata = useCallback(async (hash: string) => {
    if (!serviceRef.current) {
      return { success: false, error: 'IPFS service not initialized' };
    }

    return serviceRef.current.getFileMetadata(hash);
  }, []);

  // List all files
  const listFiles = useCallback(async () => {
    if (!serviceRef.current) {
      return { success: false, error: 'IPFS service not initialized' };
    }

    return serviceRef.current.listFiles();
  }, []);

  // Delete file
  const deleteFile = useCallback(async (hash: string) => {
    if (!serviceRef.current) {
      return { success: false, error: 'IPFS service not initialized' };
    }

    return serviceRef.current.deleteFile(hash);
  }, []);

  // Get user files
  const getUserFiles = useCallback(async () => {
    if (!serviceRef.current) {
      return { success: false, error: 'IPFS service not initialized' };
    }

    return serviceRef.current.getUserFiles();
  }, []);

  // Signature operations
  const getSignatures = useCallback(async () => {
    if (!serviceRef.current) {
      return { success: false, error: 'IPFS service not initialized' };
    }

    return serviceRef.current.getSignatures();
  }, []);

  const createSignature = useCallback(async (data: any) => {
    if (!serviceRef.current) {
      return { success: false, error: 'IPFS service not initialized' };
    }

    return serviceRef.current.createSignature(data);
  }, []);

  const verifySignature = useCallback(async (signatureId: string) => {
    if (!serviceRef.current) {
      return { success: false, error: 'IPFS service not initialized' };
    }

    return serviceRef.current.verifySignature(signatureId);
  }, []);

  // Mode switching
  const switchToMockMode = useCallback((delay: number = 1000) => {
    if (serviceRef.current) {
      serviceRef.current.switchToMockApi(delay);
      setConnectionState(prev => ({
        ...prev,
        isMockMode: true,
        isConnected: true,
        isHealthy: true,
        error: null,
      }));
    }
  }, []);

  const switchToOnlineMode = useCallback((gatewayUrl?: string) => {
    if (serviceRef.current) {
      serviceRef.current.switchToRealApi(gatewayUrl);
      setConnectionState(prev => ({
        ...prev,
        isMockMode: false,
        isConnected: false,
        isHealthy: false,
        error: null,
      }));
      // Auto-check connection after switching
      setTimeout(checkConnection, 100);
    }
  }, [checkConnection]);

  // Mock data management (only in mock mode)
  const clearMockData = useCallback(() => {
    if (serviceRef.current && connectionState.isMockMode) {
      return serviceRef.current.clearMockData();
    }
    return false;
  }, [connectionState.isMockMode]);

  const getMockData = useCallback(() => {
    if (serviceRef.current && connectionState.isMockMode) {
      return serviceRef.current.getMockData();
    }
    return null;
  }, [connectionState.isMockMode]);

  // Get current config
  const getConfig = useCallback(() => {
    return serviceRef.current?.getConfig() || null;
  }, []);

  // Update config
  const updateConfig = useCallback((newConfig: Partial<IPFSServiceConfig>) => {
    if (serviceRef.current) {
      serviceRef.current.updateConfig(newConfig);
      setConnectionState(prev => ({
        ...prev,
        isMockMode: serviceRef.current?.isMockMode() || false,
      }));
    }
  }, []);

  return {
    // Connection state
    connectionState,
    
    // File operations
    uploadFile,
    uploadMultipleFiles,
    downloadFile,
    getFileMetadata,
    listFiles,
    deleteFile,
    getUserFiles,
    
    // Signature operations
    getSignatures,
    createSignature,
    verifySignature,
    
    // Connection management
    checkConnection,
    
    // Mode switching
    switchToMockMode,
    switchToOnlineMode,
    
    // Mock data management
    clearMockData,
    getMockData,
    
    // Config management
    getConfig,
    updateConfig,
    
    // Operation states
    isUploading,
    isDownloading,
    uploadProgress,
  };
};