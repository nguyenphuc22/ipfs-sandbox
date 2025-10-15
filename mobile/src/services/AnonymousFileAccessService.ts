/**
 * Anonymous File Access Service
 *
 * Handles anonymous file access using publicKeyHash and ring signatures.
 * This replaces the userId-based access control with true anonymous access.
 *
 * @module AnonymousFileAccessService
 */

import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AccessibleFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  chunkCount: number;
  mimeType?: string;
  ownerPublicKey: string;
  ownershipStatus: string;
  grantedAt: string;
  expiresAt: string | null;
  accessCount: number;
  uploadedAt: string;
}

export interface FileAccessManifest {
  success: boolean;
  file: {
    id: string;
    name: string;
    size: number;
    chunkCount: number;
    mimeType?: string;
  };
  chunkManifest: Array<{
    index: number;
    cid: string;
    size: number;
    hash: string;
  }>;
  ownershipPolicy: {
    publicKey: string;
    status: string;
    revoked: boolean;
  };
  grantContext: {
    grantedAt: string;
    expiresAt: string | null;
    accessCount: number;
  };
}

export interface AnonymousListResponse {
  success: boolean;
  files: AccessibleFile[];
  totalCount: number;
  error?: string;
}

export interface IntegrityAlertParams {
  fileId: string;
  chunkIndex: number;
  expectedHash: string;
  actualHash: string | null;
  retryCount: number;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class AnonymousFileAccessService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl?: string, timeout: number = 30000) {
    this.baseUrl = baseUrl || API_CONFIG.baseUrl;
    this.timeout = timeout;
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  /**
   * Get user's public key from secure storage
   */
  private async getPublicKey(): Promise<string> {
    const publicKey = await AsyncStorage.getItem('aot_public_key');
    if (!publicKey) {
      throw new Error('Public key not found. Please initialize your identity first.');
    }
    return publicKey;
  }

  /**
   * Get user's secret key from secure storage
   */
  private async getSecretKey(): Promise<string> {
    const secretKey = await AsyncStorage.getItem('aot_secret_key');
    if (!secretKey) {
      throw new Error('Secret key not found. Please initialize your identity first.');
    }
    return secretKey;
  }

  /**
   * Generate random nonce for replay attack prevention
   */
  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Create ring signature (simplified for demo)
   *
   * In production: Implement full LSAG or Borromean ring signature
   * For demo: Simple JSON signature with timestamp and nonce
   */
  private async createRingSignature(message: string): Promise<string> {
    // For demo: Create a simple signature structure
    // In production: Use actual ring signature algorithm

    const publicKey = await this.getPublicKey();
    const secretKey = await this.getSecretKey();

    const signature = {
      message,
      publicKey,
      timestamp: Date.now(),
      nonce: this.generateNonce(),
      // For demo: Just include hash of secret key as "proof"
      // In production: This would be the actual ring signature components
      proof: `demo-sig-${message.substring(0, 16)}`,
    };

    return JSON.stringify(signature);
  }

  /**
   * Make HTTP request with timeout
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  // ==========================================================================
  // PUBLIC API METHODS
  // ==========================================================================

  /**
   * List files accessible by current user's public key (anonymous)
   *
   * @returns Array of accessible files
   * @throws Error if authentication fails or network error occurs
   */
  async listAccessibleFiles(): Promise<AccessibleFile[]> {
    try {
      console.log('[Anonymous Access] Listing accessible files...');

      // Get user's public key
      const publicKey = await this.getPublicKey();

      // Prepare request parameters
      const timestamp = Date.now();
      const nonce = this.generateNonce();
      const message = `list-files:${timestamp}:${nonce}`;

      // Create ring signature
      const ringSignature = await this.createRingSignature(message);

      // Make request to anonymous-list endpoint
      const response = await this.makeRequest<AnonymousListResponse>(
        '/api/files/anonymous-list',
        {
          method: 'POST',
          body: JSON.stringify({
            publicKey,
            ringSignature,
            timestamp,
            nonce,
          }),
        }
      );

      console.log(`[Anonymous Access] Found ${response.files.length} accessible files`);
      return response.files;

    } catch (error) {
      console.error('[Anonymous Access] Error listing files:', error);
      throw error;
    }
  }

  /**
   * Negotiate access to specific file (anonymous)
   *
   * Gets the chunk manifest and access policy for a file
   *
   * @param fileId - File ID to access
   * @returns File access manifest with chunks
   * @throws Error if access denied or network error occurs
   */
  async negotiateAccess(fileId: string): Promise<FileAccessManifest> {
    try {
      console.log(`[Access Negotiation] Negotiating access to file: ${fileId}`);

      // Get user's public key
      const publicKey = await this.getPublicKey();

      // Prepare request parameters
      const timestamp = Date.now();
      const nonce = this.generateNonce();
      const message = `access:${fileId}:${timestamp}:${nonce}`;

      // Create ring signature
      const ringSignature = await this.createRingSignature(message);

      // Make request to anonymous-access endpoint
      const response = await this.makeRequest<FileAccessManifest>(
        `/api/files/${fileId}/anonymous-access`,
        {
          method: 'POST',
          body: JSON.stringify({
            publicKey,
            ringSignature,
            timestamp,
            nonce,
          }),
        }
      );

      console.log(`[Access Negotiation] Got manifest with ${response.chunkManifest.length} chunks`);
      return response;

    } catch (error) {
      console.error('[Access Negotiation] Error:', error);

      if (error instanceof Error) {
        if (error.message.includes('Access denied')) {
          throw new Error('You do not have permission to access this file');
        }
        if (error.message.includes('Access expired')) {
          throw new Error('Your access to this file has expired');
        }
        if (error.message.includes('Invalid ring signature')) {
          throw new Error('Authentication failed. Please try again.');
        }
      }

      throw error;
    }
  }

  /**
   * Report chunk integrity issue (anonymous)
   *
   * Reports when a downloaded chunk's hash doesn't match expected hash
   *
   * @param params - Integrity alert parameters
   * @throws Error if report fails (non-critical, best-effort)
   */
  async reportIntegrityAlert(params: IntegrityAlertParams): Promise<void> {
    try {
      console.log(
        `[Integrity Alert] Reporting chunk ${params.chunkIndex} mismatch for file ${params.fileId}`
      );

      // Get user's public key
      const publicKey = await this.getPublicKey();

      // Prepare request parameters
      const timestamp = Date.now();
      const nonce = this.generateNonce();
      const message = `integrity-alert:${params.fileId}:${params.chunkIndex}:${timestamp}:${nonce}`;

      // Create ring signature
      const ringSignature = await this.createRingSignature(message);

      // Make request to integrity-alert endpoint
      await this.makeRequest(
        `/api/files/${params.fileId}/anonymous-integrity-alert`,
        {
          method: 'POST',
          body: JSON.stringify({
            publicKey,
            ringSignature,
            chunkIndex: params.chunkIndex,
            expectedHash: params.expectedHash,
            actualHash: params.actualHash,
            retryCount: params.retryCount,
            timestamp,
            nonce,
          }),
        }
      );

      console.log('[Integrity Alert] Report submitted successfully');

    } catch (error) {
      // Don't throw - integrity alert is best-effort
      console.error('[Integrity Alert] Error (non-critical):', error);
    }
  }

  /**
   * Check if user has anonymous identity set up
   *
   * @returns true if public/secret keys exist in storage
   */
  async hasIdentity(): Promise<boolean> {
    try {
      const publicKey = await AsyncStorage.getItem('aot_public_key');
      const secretKey = await AsyncStorage.getItem('aot_secret_key');
      return !!(publicKey && secretKey);
    } catch (error) {
      console.error('[Anonymous Access] Error checking identity:', error);
      return false;
    }
  }

  /**
   * Get current user's public key (for display purposes)
   *
   * @returns Public key string or null if not set
   */
  async getCurrentPublicKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('aot_public_key');
    } catch (error) {
      console.error('[Anonymous Access] Error getting public key:', error);
      return null;
    }
  }
  
  /**
   * List files accessible by a specific public key (anonymous) - with explicit parameters
   * 
   * This method allows passing parameters directly instead of retrieving from storage
   * 
   * @param params - Explicit parameters for the request
   * @returns Array of accessible files
   */
  async listAccessibleFilesWithParams(params: {
    publicKey: string;
    ringSignature: string;
    timestamp: number;
    nonce: string;
  }): Promise<AccessibleFile[]> {
    try {
      console.log('[Anonymous Access] Listing accessible files with explicit parameters...');
      
      // Make request to anonymous-list endpoint with provided parameters
      const response = await this.makeRequest<AnonymousListResponse>(
        '/api/files/anonymous-list',
        {
          method: 'POST',
          body: JSON.stringify(params),
        }
      );

      console.log(`[Anonymous Access] Found ${response.files.length} accessible files`);
      return response.files;

    } catch (error) {
      console.error('[Anonymous Access] Error listing files with params:', error);
      throw error;
    }
  }
  
  /**
   * Log an audit event anonymously
   * 
   * @param eventType - Type of event (download, view, share, etc.)
   * @param fileId - File ID for the event
   * @param metadata - Additional event metadata
   * @returns Promise<void>
   */
  async logAnonymousAuditEvent(
    eventType: 'download' | 'view' | 'share' | 'delete_cache' | 'access_request',
    fileId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      console.log(`[Anonymous Audit] Logging event: ${eventType} for file ${fileId}`);
      
      // Get user's public key from storage
      const publicKey = await this.getPublicKey();
      
      // Prepare request parameters
      const timestamp = Date.now();
      const nonce = this.generateNonce();
      const message = `${eventType}:${fileId}:${timestamp}:${nonce}`;
      
      // Create ring signature
      const ringSignature = await this.createRingSignature(message);
      
      // Make request to anonymous audit endpoint
      await this.makeRequest(
        `/api/files/audit/anonymous-log`,
        {
          method: 'POST',
          body: JSON.stringify({
            eventType,
            fileId,
            publicKey,
            ringSignature,
            timestamp,
            nonce,
            metadata: metadata || {}
          }),
        }
      );
      
      console.log(`[Anonymous Audit] Event ${eventType} logged successfully`);
    } catch (error) {
      console.error('[Anonymous Audit] Error logging event:', error);
      // Don't throw - audit logging is best-effort
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Create default anonymous file access service using API_CONFIG
 */
export const createAnonymousFileAccessService = (): AnonymousFileAccessService => {
  return new AnonymousFileAccessService(API_CONFIG.baseUrl);
};

/**
 * Create anonymous file access service with custom configuration
 */
export const createCustomAnonymousFileAccessService = (
  baseUrl: string,
  timeout?: number
): AnonymousFileAccessService => {
  return new AnonymousFileAccessService(baseUrl, timeout);
};

/**
 * Default singleton instance
 */
export const anonymousFileAccessService = createAnonymousFileAccessService();
