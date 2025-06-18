import { FileData, PickedFile } from '../types';

export interface GatewayApiConfig {
  baseUrl: string;
  timeout?: number;
}

export interface UploadResponse {
  success: boolean;
  hash?: string;
  name?: string;
  size?: number;
  ipfsUrl?: string;
  apiUrl?: string;
  error?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

export interface IPFSTestResponse {
  success: boolean;
  ipfsApiUrl: string;
  ipfsVersion: {
    Version: string;
    Commit: string;
    Repo: string;
    System: string;
    Golang: string;
  };
}

export class GatewayApiService {
  private config: GatewayApiConfig;

  constructor(config: GatewayApiConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  async checkHealth(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>('/health');
  }

  async testIPFSConnection(): Promise<IPFSTestResponse> {
    return this.makeRequest<IPFSTestResponse>('/api/files/test-ipfs');
  }

  async uploadFile(file: PickedFile): Promise<UploadResponse> {
    const formData = new FormData();
    
    // Create file object for upload
    const fileData = {
      uri: file.uri,
      type: file.type || 'application/octet-stream',
      name: file.name || 'unknown',
    } as any;

    formData.append('file', fileData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/api/files/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('File upload failed');
    }
  }

  async downloadFile(hash: string): Promise<Blob> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/api/files/${hash}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('File download failed');
    }
  }

  async getFileMetadata(hash: string): Promise<any> {
    return this.makeRequest<any>(`/api/files/${hash}/metadata`);
  }

  async listFiles(): Promise<FileData[]> {
    // Backend doesn't have file listing yet, return empty array
    // In production, uncomment this: return this.makeRequest<FileData[]>('/api/files');
    return [];
  }

  async deleteFile(hash: string): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(`/api/files/${hash}`, {
      method: 'DELETE',
    });
  }

  async getUserFiles(): Promise<FileData[]> {
    return this.makeRequest<FileData[]>('/api/users/files');
  }

  async getSignatures(): Promise<any[]> {
    return this.makeRequest<any[]>('/api/signatures');
  }

  async createSignature(data: any): Promise<any> {
    return this.makeRequest<any>('/api/signatures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifySignature(signatureId: string): Promise<any> {
    return this.makeRequest<any>(`/api/signatures/${signatureId}/verify`);
  }
}

// Default configuration for localhost development
export const createDefaultGatewayService = () => {
  return new GatewayApiService({
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
  });
};

// Configuration for production or custom endpoints
export const createGatewayService = (baseUrl: string, timeout?: number) => {
  return new GatewayApiService({
    baseUrl,
    timeout,
  });
};