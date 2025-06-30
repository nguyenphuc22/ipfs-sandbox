import { FileData, PickedFile } from '../types';
import { API_CONFIG } from '../config/api';

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

export interface FileViewResponse {
  success: boolean;
  content: string | ArrayBuffer;
  contentType: string;
  contentLength: number;
  filename: string;
}

export interface FileMetadataResponse {
  success: boolean;
  hash: string;
  metadata: {
    [key: string]: string;
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
      const response = await fetch(`${this.config.baseUrl}/api/files/${hash}?download=true`, {
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

  async viewFile(hash: string, filename?: string): Promise<FileViewResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      // Use query parameter instead of route parameter (works around routing issue)
      let url = `${this.config.baseUrl}/api/files/${hash}?view=true`;
      if (filename) {
        const encodedFilename = encodeURIComponent(filename);
        url += `&filename=${encodedFilename}`;
      }

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`View failed with status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const contentLength = parseInt(response.headers.get('content-length') || '0');

      // Handle different content types
      let content: string | ArrayBuffer;
      if (contentType.startsWith('text/') || contentType === 'application/json') {
        content = await response.text();
      } else {
        content = await response.arrayBuffer();
      }

      return {
        success: true,
        content,
        contentType,
        contentLength,
        filename: filename || hash,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('File view failed');
    }
  }

  async getFileMetadata(hash: string): Promise<FileMetadataResponse> {
    return this.makeRequest<FileMetadataResponse>(`/api/files/metadata/${hash}`);
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

// Default configuration using auto-detected API config
export const createDefaultGatewayService = () => {
  return new GatewayApiService(API_CONFIG);
};

// Configuration for production or custom endpoints
export const createGatewayService = (baseUrl: string, timeout?: number) => {
  return new GatewayApiService({
    baseUrl,
    timeout,
  });
};