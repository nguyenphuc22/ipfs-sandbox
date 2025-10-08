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

export interface AOTUploadPayload {
  file: PickedFile;
  metadataHash: string;
  ownershipPublicKey: string;
  ringSignature?: string;
  escrowedIdentity?: string;
  ringMembers?: string[];
  schnorr: {
    R: string;
    s: string;
    message: string;
    publicKey?: string;
  };
}

export interface AOTUploadResponse {
  success: boolean;
  fileId?: string;
  cid?: string;
  name?: string;
  fileName?: string;
  size?: number;
  totalSize?: number;
  metadataHash?: string;
  ownershipPublicKey?: string;
  chunkCount?: number;
  chunks?: Array<{
    index: number;
    cid: string;
    hash: string;
    size?: number;
  }>;
  error?: string;
}

export interface ChunkedUploadResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  totalSize: number;
  chunkCount: number;
  chunks: Array<{
    index: number;
    cid: string;
    hash: string;
  }>;
  metadataHash: string;
  ownershipPublicKey: string;
  secureKeyPackage: {
    masterKey: string;
    chunkKeys: Record<number, string>;
    keyPackageFingerprint: string;
  };
}

export interface GatewayUserFileRecord {
  id: string;
  cid?: string;
  fileName?: string;
  name?: string;
  totalSize?: number;
  size?: number;
  chunkCount?: number;
  mimeType?: string;
  status?: string;
  ownershipPublicKey?: string;
  grantedAt?: string;
  createdAt?: string;
  keyStatus?: string;
  hasLocalKey?: boolean;
  uploader?: {
    id?: string;
    username?: string;
  };
  metadataHash?: string;
  ownerIdentifier?: string | null;
  ownerUserId?: string | null;
}

export interface GatewayUserFilesResponse {
  success: boolean;
  files?: GatewayUserFileRecord[];
  error?: string;
}

export interface FileAccessResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  totalSize: number;
  chunkCount: number;
  chunkManifest: Array<{
    index: number;
    cid: string;
    hash: string;
    size: number;
  }>;
  ownershipPolicy: {
    ownershipPublicKey: string;
    status: string;
    revoked: boolean;
    lastRevocationAt?: string;
  };
  grantedAt: string;
  grantContext: {
    keyStatus: string;
    hasLocalKey: boolean;
    keyIssuedAt?: string;
    keyPackageFingerprint?: string;
  };
}

export interface IntegrityAlertPayload {
  chunkIndex: number;
  expectedHash: string;
  actualHash?: string;
  userId: string;
}

export interface AuditEventPayload {
  eventType: 'download' | 'view' | 'share' | 'delete_cache';
  userId: string;
  metadata?: Record<string, any>;
}

export interface AnonymousRevocationPayload {
  fileId: string;
  message: string;
  targetUserId?: string;
  ringSignature?: string;
  ownershipProof: {
    R: string;
    s: string;
    message: string;
    publicKey: string;
  };
}

export interface AnonymousRevocationResponse {
  success: boolean;
  revocationId?: string;
  chunksToReencrypt?: number[];
  note?: string;
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

  async uploadFileWithAOT(payload: AOTUploadPayload): Promise<AOTUploadResponse> {
    const { file, metadataHash, ownershipPublicKey, ringSignature, escrowedIdentity, ringMembers, schnorr } = payload;

    console.log('[Gateway API] Starting AOT upload with file:', {
      uri: file.uri,
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();

    // React Native requires this specific format
    const fileData = {
      uri: file.uri,
      type: file.type || 'application/octet-stream',
      name: file.name || 'unknown',
    } as any;

    console.log('[Gateway API] File data prepared:', fileData);

    formData.append('file', fileData);
    formData.append('metadataHash', metadataHash);
    formData.append('ownershipPublicKey', ownershipPublicKey);

    if (ringSignature) {
      formData.append('ringSignature', ringSignature);
    }

    if (escrowedIdentity) {
      formData.append('escrowedIdentity', escrowedIdentity);
    }

    if (ringMembers && ringMembers.length > 0) {
      console.log('[Gateway API] Appending ring members:', ringMembers);
      formData.append('ringMembers', JSON.stringify(ringMembers));
    }

    formData.append('ownershipProofR', schnorr.R);
    formData.append('ownershipProofS', schnorr.s);
    formData.append('ownershipProofMessage', schnorr.message);
    formData.append('ownershipProofPublicKey', schnorr.publicKey || ownershipPublicKey);

    const url = `${this.config.baseUrl}/api/files/aot-upload`;
    console.log('[Gateway API] Sending AOT upload request:', {
      url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUri: file.uri,
      metadataHashLength: metadataHash.length,
      ownershipPublicKeyLength: ownershipPublicKey.length,
      hasRingSignature: !!ringSignature,
      ringSignatureLength: ringSignature?.length,
      ringMembersCount: ringMembers?.length,
      schnorrRLength: schnorr.R.length,
      schnorrSLength: schnorr.s.length,
      schnorrMessageLength: schnorr.message.length,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('[Gateway API] Request timeout after 30s');
      controller.abort();
    }, this.config.timeout);

    try {
      console.log('[Gateway API] Making fetch request to:', url);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Don't set Content-Type header - let browser/RN set it with boundary
      });

      console.log('[Gateway API] Received response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: {
          contentType: response.headers.get('content-type'),
        },
      });

      clearTimeout(timeoutId);

      // Try to read response as text first for debugging
      const responseText = await response.text();
      console.log('[Gateway API] Response text:', responseText.substring(0, 500));

      let json;
      try {
        json = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[Gateway API] Failed to parse response as JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      console.log('[Gateway API] Parsed JSON:', json);

      if (!response.ok) {
        console.error('[Gateway API] Upload failed:', {
          status: response.status,
          error: json?.error,
          fullResponse: json,
        });
        throw new Error(json?.error || `Upload failed with status: ${response.status}`);
      }

      console.log('[Gateway API] Upload successful!');
      return json;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('[Gateway API] Upload error details:', {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Upload request timed out after 30 seconds');
        }
        throw error;
      }
      throw new Error('AOT upload failed');
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
  const contentLength = parseInt(response.headers.get('content-length') || '0', 10);

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

  async getUserFiles(
    input: string | { userId?: string; publicKey?: string }
  ): Promise<GatewayUserFilesResponse> {
    let userId: string | undefined;
    let publicKey: string | undefined;

    if (typeof input === 'string') {
      userId = input;
    } else if (input) {
      userId = input.userId;
      publicKey = input.publicKey;
    }

    const query = new URLSearchParams();
    if (publicKey) {
      query.set('publicKey', publicKey);
    }

    const resolvedUserId = userId ?? 'self';
    const encoded = encodeURIComponent(resolvedUserId);
    const endpoint = `/api/files/user/${encoded}/files${query.toString() ? `?${query.toString()}` : ''}`;

    return this.makeRequest<GatewayUserFilesResponse>(endpoint);
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

  async submitAnonymousRevocation(
    payload: AnonymousRevocationPayload
  ): Promise<AnonymousRevocationResponse> {
    return this.makeRequest<AnonymousRevocationResponse>('/api/files/aot/revoke', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ============================================================================
  // CHUNKED UPLOAD & DOWNLOAD (Thesis Implementation)
  // ============================================================================

  async uploadFileWithChunks(payload: AOTUploadPayload): Promise<ChunkedUploadResponse> {
    const { file, metadataHash, ownershipPublicKey, ringSignature, escrowedIdentity, ringMembers, schnorr } = payload;

    const formData = new FormData();
    const fileData = {
      uri: file.uri,
      type: file.type || 'application/octet-stream',
      name: file.name || 'unknown',
    } as any;

    formData.append('file', fileData);
    formData.append('metadataHash', metadataHash);
    formData.append('ownershipPublicKey', ownershipPublicKey);

    if (ringSignature) {
      formData.append('ringSignature', ringSignature);
    }

    if (escrowedIdentity) {
      formData.append('escrowedIdentity', escrowedIdentity);
    }

    if (ringMembers && ringMembers.length > 0) {
      formData.append('ringMembers', JSON.stringify(ringMembers));
    }

    formData.append('ownershipProofR', schnorr.R);
    formData.append('ownershipProofS', schnorr.s);
    formData.append('ownershipProofMessage', schnorr.message);
    formData.append('ownershipProofPublicKey', schnorr.publicKey || ownershipPublicKey);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/api/files/chunked-upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearTimeout(timeoutId);

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error || `Chunked upload failed with status: ${response.status}`);
      }

      return json;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Chunked upload failed');
    }
  }

  async getFileAccess(fileId: string, userId: string): Promise<FileAccessResponse> {
    return this.makeRequest<FileAccessResponse>(
      `/api/files/${fileId}/access?userId=${encodeURIComponent(userId)}`
    );
  }

  async reportIntegrityAlert(
    fileId: string,
    payload: IntegrityAlertPayload
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(
      `/api/files/${fileId}/integrity-alert`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  async logAuditEvent(
    fileId: string,
    payload: AuditEventPayload
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(
      `/api/files/${fileId}/audit`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  async listUserFiles(userId: string): Promise<FileData[]> {
    const response = await this.makeRequest<{ success: boolean; files: FileData[] }>(
      `/api/files/user/${encodeURIComponent(userId)}/files`
    );
    return response.files || [];
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
