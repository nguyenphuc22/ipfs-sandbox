import { FileData, FileStatus, PickedFile } from '../types';
import {
  GatewayApiService,
  createDefaultGatewayService,
  AOTUploadPayload,
  AOTUploadResponse,
  AnonymousRevocationPayload,
  AnonymousRevocationResponse,
} from './GatewayApiService';
import { 
  AnonymousFileAccessService, 
  AccessibleFile,
  createAnonymousFileAccessService 
} from './AnonymousFileAccessService';
import { API_CONFIG } from '../config/api';

export interface IPFSServiceConfig {
  gatewayUrl?: string;
  timeout?: number;
}

export class IPFSService {
  private apiService: GatewayApiService;
  private anonymousService: AnonymousFileAccessService;
  private config: IPFSServiceConfig;

  constructor(config: IPFSServiceConfig = {}) {
    this.config = {
      gatewayUrl: API_CONFIG.baseUrl,
      timeout: API_CONFIG.timeout || 30000,
      ...config,
    };

    this.apiService = this.config.gatewayUrl === API_CONFIG.baseUrl
      ? createDefaultGatewayService()
      : new GatewayApiService({
          baseUrl: this.config.gatewayUrl!,
          timeout: this.config.timeout,
        });
        
    this.anonymousService = createAnonymousFileAccessService();
  }

  // Health and connectivity
  async checkHealth(): Promise<{ isHealthy: boolean; response?: any; error?: string }> {
    try {
      const response = await this.apiService.checkHealth();
      return { isHealthy: true, response };
    } catch (error) {
      return {
        isHealthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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
        error: error instanceof Error ? error.message : 'Unknown error',
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
      error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async uploadFileWithAOT(payload: AOTUploadPayload): Promise<AOTUploadResponse> {
    try {
      return await this.apiService.uploadFileWithAOT(payload);
    } catch (error) {
      throw error instanceof Error ? error : new Error('AOT upload failed');
    }
  }

  async downloadFile(hash: string): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    try {
      const blob = await this.apiService.downloadFile(hash);
      return { success: true, blob };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed',
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
        error: error instanceof Error ? error.message : 'Failed to get metadata',
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
        error: error instanceof Error ? error.message : 'Failed to list files',
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
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }

  // User-specific file operations (now uses anonymous service with explicit parameters)
  async getUserFiles(
    options: { 
      publicKey?: string; 
      ringSignature?: string; 
      timestamp?: number; 
      nonce?: string 
    },
  ): Promise<{ success: boolean; files?: FileData[]; error?: string }> {
    const { publicKey, ringSignature, timestamp, nonce } = options;

    // For anonymous access, all required parameters must be provided
    if (!publicKey || !ringSignature || timestamp === undefined || !nonce) {
      return { 
        success: false, 
        error: 'Public key, ring signature, timestamp, and nonce are required for anonymous access' 
      };
    }

    try {
      // Use anonymous service's new method that accepts explicit parameters
      const records = await this.anonymousService.listAccessibleFilesWithParams({
        publicKey,
        ringSignature,
        timestamp,
        nonce
      });
      
      const allowedStatuses: FileStatus[] = ['uploading', 'completed', 'error', 'active', 'revoked'];

      const files: FileData[] = records.map((record: AccessibleFile) => {
        const status = record.ownershipStatus as FileStatus || 'active';
        return {
          id: record.fileId,
          name: record.fileName,
          size: record.fileSize,
          uploadTime: record.grantedAt ? new Date(record.grantedAt) : new Date(),
          status: allowedStatuses.includes(status) ? status : 'active',
          ownershipPublicKey: record.ownerPublicKey,
          mimeType: undefined, // Anonymous access doesn't expose full details
          grantedAt: record.grantedAt || undefined,
          keyStatus: undefined,
          hasLocalKey: undefined,
          chunkCount: record.chunkCount,
          uploaderName: undefined, // Anonymous access - no user details
          metadataHash: undefined, // Anonymous access - no metadata hash
        };
      });

      return { success: true, files };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user files',
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
        error: error instanceof Error ? error.message : 'Failed to get signatures',
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
      error: error instanceof Error ? error.message : 'Failed to create signature',
      };
    }
  }

  async submitAnonymousRevocation(
    payload: AnonymousRevocationPayload
  ): Promise<{ success: boolean; response?: AnonymousRevocationResponse; error?: string }> {
    try {
      const response = await this.apiService.submitAnonymousRevocation(payload);
      if (!response.success) {
        return { success: false, error: response.error || 'Revocation failed' };
      }
      return { success: true, response };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Revocation failed',
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
        error: error instanceof Error ? error.message : 'Failed to verify signature',
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
          error: error instanceof Error ? error.message : 'Upload failed',
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
    this.apiService = this.config.gatewayUrl === API_CONFIG.baseUrl
      ? createDefaultGatewayService()
      : new GatewayApiService({
          baseUrl: this.config.gatewayUrl!,
          timeout: this.config.timeout,
        });
  }
}

// Default service instance
export const createIPFSService = (config?: IPFSServiceConfig) => {
  return new IPFSService(config);
};

export const createOnlineIPFSService = (gatewayUrl: string = API_CONFIG.baseUrl) => {
  return new IPFSService({ gatewayUrl });
};
