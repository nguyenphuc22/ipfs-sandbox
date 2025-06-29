import { FileData, PickedFile } from '../types';
import { GatewayApiService, createDefaultGatewayService } from './GatewayApiService';
import { MockApiService, createMockGatewayService } from './MockApiService';
import { API_CONFIG } from '../config/api';

export interface IPFSServiceConfig {
  useMockApi?: boolean;
  gatewayUrl?: string;
  mockDelay?: number;
  timeout?: number;
}

export class IPFSService {
  private apiService: GatewayApiService;
  private config: IPFSServiceConfig;

  constructor(config: IPFSServiceConfig = {}) {
    this.config = {
      useMockApi: false,
      gatewayUrl: API_CONFIG.baseUrl,
      mockDelay: 1000,
      timeout: API_CONFIG.timeout || 30000,
      ...config,
    };

    // Initialize appropriate service based on configuration
    if (this.config.useMockApi) {
      this.apiService = createMockGatewayService(this.config.mockDelay);
    } else {
      this.apiService = this.config.gatewayUrl === API_CONFIG.baseUrl 
        ? createDefaultGatewayService()
        : new GatewayApiService({
            baseUrl: this.config.gatewayUrl!,
            timeout: this.config.timeout,
          });
    }
  }

  // Switch between mock and real API
  switchToMockApi(delay: number = 1000): void {
    this.config.useMockApi = true;
    this.config.mockDelay = delay;
    this.apiService = createMockGatewayService(delay);
  }

  switchToRealApi(gatewayUrl?: string): void {
    this.config.useMockApi = false;
    if (gatewayUrl) {
      this.config.gatewayUrl = gatewayUrl;
    }
    
    this.apiService = this.config.gatewayUrl === API_CONFIG.baseUrl 
      ? createDefaultGatewayService()
      : new GatewayApiService({
          baseUrl: this.config.gatewayUrl!,
          timeout: this.config.timeout,
        });
  }

  isMockMode(): boolean {
    return this.config.useMockApi || false;
  }

  // Health and connectivity
  async checkHealth(): Promise<{ isHealthy: boolean; response?: any; error?: string }> {
    try {
      const response = await this.apiService.checkHealth();
      return { isHealthy: true, response };
    } catch (error) {
      return { 
        isHealthy: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async testConnection(): Promise<{ isConnected: boolean; response?: any; error?: string }> {
    try {
      const response = await this.apiService.testIPFSConnection();
      return { isConnected: response.success, response };
    } catch (error) {
      return { 
        isConnected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // File operations - CRUD
  async uploadFile(file: PickedFile): Promise<{ success: boolean; data?: FileData; error?: string }> {
    try {
      const response = await this.apiService.uploadFile(file);
      
      if (response.success && response.hash) {
        const fileData: FileData = {
          id: file.id,
          name: response.name || file.name || 'Unknown',
          size: response.size || file.size || 0,
          uploadTime: new Date(),
          status: 'completed',
          ipfsHash: response.hash,
        };
        
        return { success: true, data: fileData };
      } else {
        return { success: false, error: response.error || 'Upload failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  async downloadFile(hash: string): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    try {
      const blob = await this.apiService.downloadFile(hash);
      return { success: true, blob };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Download failed' 
      };
    }
  }

  async getFileMetadata(hash: string): Promise<{ success: boolean; metadata?: any; error?: string }> {
    try {
      const metadata = await this.apiService.getFileMetadata(hash);
      return { success: true, metadata };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get metadata' 
      };
    }
  }

  async listFiles(): Promise<{ success: boolean; files?: FileData[]; error?: string }> {
    try {
      const files = await this.apiService.listFiles();
      return { success: true, files };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to list files' 
      };
    }
  }

  async deleteFile(hash: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.apiService.deleteFile(hash);
      return { success: result.success };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      };
    }
  }

  // User-specific file operations
  async getUserFiles(): Promise<{ success: boolean; files?: FileData[]; error?: string }> {
    try {
      const files = await this.apiService.getUserFiles();
      return { success: true, files };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get user files' 
      };
    }
  }

  // Signature operations
  async getSignatures(): Promise<{ success: boolean; signatures?: any[]; error?: string }> {
    try {
      const signatures = await this.apiService.getSignatures();
      return { success: true, signatures };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get signatures' 
      };
    }
  }

  async createSignature(data: any): Promise<{ success: boolean; signature?: any; error?: string }> {
    try {
      const signature = await this.apiService.createSignature(data);
      return { success: true, signature };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create signature' 
      };
    }
  }

  async verifySignature(signatureId: string): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      const result = await this.apiService.verifySignature(signatureId);
      return { success: true, result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to verify signature' 
      };
    }
  }

  // Batch operations
  async uploadMultipleFiles(files: PickedFile[]): Promise<{
    success: boolean;
    results: Array<{ file: PickedFile; data?: FileData; error?: string }>;
    totalSuccess: number;
    totalFailed: number;
  }> {
    const results: Array<{ file: PickedFile; data?: FileData; error?: string }> = [];
    let totalSuccess = 0;
    let totalFailed = 0;

    for (const file of files) {
      try {
        const result = await this.uploadFile(file);
        if (result.success && result.data) {
          results.push({ file, data: result.data });
          totalSuccess++;
        } else {
          results.push({ file, error: result.error });
          totalFailed++;
        }
      } catch (error) {
        results.push({ 
          file, 
          error: error instanceof Error ? error.message : 'Upload failed' 
        });
        totalFailed++;
      }
    }

    return {
      success: totalSuccess > 0,
      results,
      totalSuccess,
      totalFailed,
    };
  }

  // Utility methods
  getConfig(): IPFSServiceConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<IPFSServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Reinitialize service if API type changed
    if (newConfig.useMockApi !== undefined) {
      if (newConfig.useMockApi) {
        this.switchToMockApi(this.config.mockDelay);
      } else {
        this.switchToRealApi(this.config.gatewayUrl);
      }
    }
  }

  // Mock-specific methods (only available in mock mode)
  clearMockData(): boolean {
    if (this.apiService instanceof MockApiService) {
      this.apiService.clearMockFiles();
      return true;
    }
    return false;
  }

  getMockData(): FileData[] | null {
    if (this.apiService instanceof MockApiService) {
      return this.apiService.getMockFiles();
    }
    return null;
  }
}

// Default service instance
export const createIPFSService = (config?: IPFSServiceConfig) => {
  return new IPFSService(config);
};

// Predefined configurations
export const createOfflineIPFSService = () => {
  return new IPFSService({ useMockApi: true, mockDelay: 500 });
};

export const createOnlineIPFSService = (gatewayUrl: string = API_CONFIG.baseUrl) => {
  return new IPFSService({ useMockApi: false, gatewayUrl });
};