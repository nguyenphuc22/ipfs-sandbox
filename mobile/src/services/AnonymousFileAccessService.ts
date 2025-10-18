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
import {
  createLsagRingSignature,
  createSchnorrProof,
  isValidPublicKeyHex,
  normalizeHex,
  toCompressedPublicKey,
} from '../utils/aotCrypto';
import { sha256Hex } from './crypto/hash';
import { RingContext } from '../types';

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
  cid?: string | null;
  chunkHash?: string | null;
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
    keyPackageFingerprint?: string;
    keyStatus?: string;
    hasLocalKey?: boolean;
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

export interface AnonymousGrantRecord {
  id: string;
  accessorPublicKeyHash: string;
  fileId: string;
  grantedAt: string;
  expiresAt: string | null;
  status: string;
  keyStatus: string;
  keyPackageFingerprint: string | null;
  revokedAt: string | null;
  lastOwnerProof?: string | null;
  accessCount?: number;
}

export interface GrantAccessResponse {
  success: boolean;
  operation: 'created' | 'updated';
  grant: AnonymousGrantRecord;
}

export interface OwnerGrantListResponse {
  success: boolean;
  fileId: string;
  grants: AnonymousGrantRecord[];
  total: number;
}

export interface RevokeAccessResponse {
  success: boolean;
  operation: 'revoked' | 'noop';
  grant: AnonymousGrantRecord;
}

export interface GrantAccessParams {
  fileId: string;
  targetPublicKey: string;
  keyPackageFingerprint?: string | null;
  expiresAt?: string | Date | null;
  metadata?: Record<string, any>;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class AnonymousFileAccessService {
  private baseUrl: string;
  private timeout: number;
  private cachedRingMembers: string[] | null = null;
  private cachedRingMembersFetchedAt = 0;

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

  private static readonly RING_MEMBERS_STORAGE_KEY = 'aot_ring_members_cache_v1';
  private static readonly RING_CONTEXT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly GRANT_JOURNAL_PREFIX = 'aot_grant_journal_v1_';

  private async loadPersistedRingMembers(): Promise<string[] | null> {
    try {
      const stored = await AsyncStorage.getItem(AnonymousFileAccessService.RING_MEMBERS_STORAGE_KEY);
      if (!stored) {
        return null;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.filter((key): key is string => typeof key === 'string');
      }
    } catch (error) {
      console.warn('[Anonymous Access] Failed to parse cached ring members:', error);
    }
    return null;
  }

  private async persistRingMembers(members: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        AnonymousFileAccessService.RING_MEMBERS_STORAGE_KEY,
        JSON.stringify(members),
      );
    } catch (error) {
      console.warn('[Anonymous Access] Failed to persist ring members cache:', error);
    }
  }

  private getGrantJournalStorageKey(fileId: string): string {
    return `${AnonymousFileAccessService.GRANT_JOURNAL_PREFIX}${fileId}`;
  }

  private normalizeGrantRecord(raw: any): AnonymousGrantRecord {
    const toIso = (value: any): string | null => {
      if (!value) {
        return null;
      }
      const date = value instanceof Date ? value : new Date(value);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    };

    return {
      id: String(raw.id ?? ''),
      accessorPublicKeyHash: String(raw.accessorPublicKeyHash ?? ''),
      fileId: String(raw.fileId ?? ''),
      grantedAt: toIso(raw.grantedAt) ?? new Date().toISOString(),
      expiresAt: toIso(raw.expiresAt),
      status: String(raw.status ?? 'active'),
      keyStatus: String(raw.keyStatus ?? 'client-managed'),
      keyPackageFingerprint: raw.keyPackageFingerprint ?? null,
      revokedAt: toIso(raw.revokedAt),
      lastOwnerProof: raw.lastOwnerProof ?? null,
      accessCount: typeof raw.accessCount === 'number' ? raw.accessCount : undefined,
    };
  }

  private normalizeGrantRecords(rawGrants: any[]): AnonymousGrantRecord[] {
    if (!Array.isArray(rawGrants)) {
      return [];
    }
    return rawGrants.map((grant) => this.normalizeGrantRecord(grant));
  }

  private async persistGrantJournal(fileId: string, grants: AnonymousGrantRecord[]): Promise<void> {
    const key = this.getGrantJournalStorageKey(fileId);
    try {
      const payload = {
        fileId,
        updatedAt: new Date().toISOString(),
        grants,
      };
      await AsyncStorage.setItem(key, JSON.stringify(payload));
    } catch (error) {
      console.warn('[Anonymous Access] Failed to persist grant journal:', error);
    }
  }

  private async readGrantJournal(fileId: string): Promise<AnonymousGrantRecord[] | null> {
    const key = this.getGrantJournalStorageKey(fileId);
    try {
      const stored = await AsyncStorage.getItem(key);
      if (!stored) {
        return null;
      }
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.grants)) {
        return this.normalizeGrantRecords(parsed.grants);
      }
    } catch (error) {
      console.warn('[Anonymous Access] Failed to read grant journal:', error);
    }
    return null;
  }

  private normalizeRingMembers(rawMembers: string[], ownCompressedKey: string): string[] {
    const seen = new Set<string>();
    const normalized: string[] = [];

    const appendIfValid = (key: string) => {
      try {
        const compressed = toCompressedPublicKey(key);
        if (!seen.has(compressed)) {
          seen.add(compressed);
          normalized.push(compressed);
        }
      } catch (error) {
        console.warn('[Anonymous Access] Ignoring invalid ring member key:', key, error);
      }
    };

    rawMembers.forEach((key) => {
      if (typeof key === 'string' && key.trim().length > 0) {
        appendIfValid(key);
      }
    });

    if (!seen.has(ownCompressedKey)) {
      normalized.push(ownCompressedKey);
    }

    return normalized;
  }

  private async fetchRingContext(): Promise<RingContext | null> {
    try {
      const response = await this.makeRequest<{ success: boolean; context: RingContext }>(
        '/api/auth/context',
        { method: 'GET' },
      );

      if (response?.success && response.context) {
        return response.context;
      }
    } catch (error) {
      console.warn('[Anonymous Access] Failed to fetch ring context:', error);
    }
    return null;
  }

  private extractRingMembers(context: RingContext | null | undefined): string[] {
    if (!context) {
      return [];
    }

    const configMembers = Array.isArray(context.ringMemberPublicKeys)
      ? context.ringMemberPublicKeys
      : [];
    const userMembers = Array.isArray(context.users)
      ? context.users.map((user) => user.publicKey)
      : [];

    return [...configMembers, ...userMembers].filter(
      (key): key is string => typeof key === 'string' && key.trim().length > 0,
    );
  }

  private ensureSufficientRing(members: string[], ownKey: string): string[] {
    if (members.includes(ownKey)) {
      return members;
    }
    return [...members, ownKey];
  }

  private async getRingMembersForSigning(ownPublicKey: string): Promise<string[]> {
    const now = Date.now();
    const ownCompressedKey = toCompressedPublicKey(ownPublicKey);

    const isCacheValid =
      this.cachedRingMembers &&
      now - this.cachedRingMembersFetchedAt < AnonymousFileAccessService.RING_CONTEXT_CACHE_TTL &&
      Array.isArray(this.cachedRingMembers);

    if (isCacheValid && this.cachedRingMembers) {
      const ensured = this.ensureSufficientRing(this.cachedRingMembers, ownCompressedKey);
      this.cachedRingMembers = ensured;
      if (ensured.length >= 2) {
        return ensured;
      }
    }

    let ringMembers: string[] = [];

    const context = await this.fetchRingContext();
    if (context) {
      const normalized = this.normalizeRingMembers(
        this.extractRingMembers(context),
        ownCompressedKey,
      );
      if (normalized.length >= 2) {
        ringMembers = normalized;
        this.cachedRingMembers = normalized;
        this.cachedRingMembersFetchedAt = now;
        await this.persistRingMembers(normalized);
      }
    }

    if (ringMembers.length < 2) {
      const persisted = await this.loadPersistedRingMembers();
      if (persisted && persisted.length > 0) {
        const normalizedPersisted = this.normalizeRingMembers(persisted, ownCompressedKey);
        if (normalizedPersisted.length >= 2) {
          ringMembers = normalizedPersisted;
          this.cachedRingMembers = normalizedPersisted;
          this.cachedRingMembersFetchedAt = now;
        }
      }
    }

    if (ringMembers.length < 2) {
      throw new Error('Không tìm thấy đủ thành viên vòng ký để tạo chữ ký LSAG. Vui lòng làm mới danh sách thành viên hoặc thử lại sau.');
    }

    return ringMembers;
  }

  /**
   * Create LSAG ring signature for anonymous requests
   */
  private async createRingSignature(message: string): Promise<string> {
    const [publicKey, secretKey] = await Promise.all([
      this.getPublicKey(),
      this.getSecretKey(),
    ]);

    const normalizedPublicKey = toCompressedPublicKey(publicKey);
    const ringMembers = await this.getRingMembersForSigning(normalizedPublicKey);

    const normalizedRing = ringMembers.map((member) => normalizeHex(member));
    const signerIndex = normalizedRing.findIndex(
      (member) => member === normalizeHex(normalizedPublicKey),
    );

    const finalRing = signerIndex === -1 ? [...ringMembers, normalizedPublicKey] : ringMembers;
    const finalSignerIndex = signerIndex === -1 ? finalRing.length - 1 : signerIndex;

    const signaturePayload = await createLsagRingSignature({
      message,
      ringPublicKeys: finalRing,
      signerIndex: finalSignerIndex,
      signerPrivateKey: secretKey,
    });

    return JSON.stringify(signaturePayload);
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
   * Grant anonymous access to a recipient public key
   *
   * @param params Grant parameters (fileId, targetPublicKey, optional metadata)
   * @returns Grant operation response from backend
   */
  async grantAccess(params: GrantAccessParams): Promise<GrantAccessResponse> {
    const { fileId, targetPublicKey, keyPackageFingerprint, expiresAt, metadata } = params;

    if (!fileId || typeof fileId !== 'string') {
      throw new Error('fileId is required');
    }

    if (!targetPublicKey || typeof targetPublicKey !== 'string') {
      throw new Error('targetPublicKey is required');
    }

    const trimmedTarget = targetPublicKey.trim();
    if (!isValidPublicKeyHex(trimmedTarget)) {
      throw new Error('Invalid target public key');
    }

    const [ownerPublicKey, ownerPrivateKey] = await Promise.all([
      this.getPublicKey(),
      this.getSecretKey(),
    ]);

    const compressedOwnerKey = toCompressedPublicKey(ownerPublicKey);
    const compressedTargetKey = toCompressedPublicKey(trimmedTarget);

    const timestamp = Date.now();
    const nonce = this.generateNonce();
    const recipientHash = sha256Hex(normalizeHex(compressedTargetKey));
    const grantMessage = `grant:${fileId}:${recipientHash}:${timestamp}:${nonce}`;

    const ringMembers = await this.getRingMembersForSigning(compressedOwnerKey);
    const normalizedOwnerKey = normalizeHex(compressedOwnerKey);
    const signerIndex = ringMembers.findIndex(
      (member) => normalizeHex(member) === normalizedOwnerKey,
    );

    if (signerIndex === -1) {
      throw new Error('Owner key missing from ring membership');
    }

    const ringSignaturePayload = await createLsagRingSignature({
      message: grantMessage,
      ringPublicKeys: ringMembers,
      signerIndex,
      signerPrivateKey: ownerPrivateKey,
    });
    const ringSignature = JSON.stringify(ringSignaturePayload);

    const schnorrMessageHex = sha256Hex(grantMessage);
    const schnorrProof = await createSchnorrProof(schnorrMessageHex, ownerPrivateKey);

    const body: Record<string, any> = {
      targetPublicKey: compressedTargetKey,
      ringSignature,
      timestamp,
      nonce,
      ownershipProof: {
        R: schnorrProof.R,
        s: schnorrProof.s,
        message: schnorrMessageHex,
        publicKey: compressedOwnerKey,
      },
      metadata: {
        source: 'mobile-app',
        ringSize: ringMembers.length,
        ownerPublicKey: compressedOwnerKey,
        recipientHash,
        ...(metadata ?? {}),
      },
    };

    if (keyPackageFingerprint) {
      body.keyPackageFingerprint = keyPackageFingerprint.trim().toLowerCase();
    }

    if (expiresAt) {
      const expiration = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
      if (Number.isNaN(expiration.getTime())) {
        throw new Error('Invalid expiresAt value');
      }
      body.expiresAt = expiration.toISOString();
    }

    const response = await this.makeRequest<GrantAccessResponse>(
      `/api/files/${fileId}/anonymous-grants`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );

    const normalizedGrant = this.normalizeGrantRecord(response.grant);
    const snapshot = (await this.readGrantJournal(fileId)) ?? [];
    const updated = [normalizedGrant, ...snapshot.filter((entry) => entry.id !== normalizedGrant.id)];
    await this.persistGrantJournal(fileId, updated);

    return {
      ...response,
      grant: normalizedGrant,
    };
  }

  async getCachedOwnerGrants(fileId: string): Promise<AnonymousGrantRecord[] | null> {
    return this.readGrantJournal(fileId);
  }

  async listOwnerGrants(fileId: string, options: { useCache?: boolean } = {}): Promise<AnonymousGrantRecord[]> {
    if (!fileId || typeof fileId !== 'string') {
      throw new Error('fileId is required');
    }

    const { useCache = true } = options;
    if (useCache) {
      const cached = await this.readGrantJournal(fileId);
      if (cached) {
        return cached;
      }
    }

    const [ownerPublicKey, ownerPrivateKey] = await Promise.all([
      this.getPublicKey(),
      this.getSecretKey(),
    ]);

    const compressedOwnerKey = toCompressedPublicKey(ownerPublicKey);
    const timestamp = Date.now();
    const nonce = this.generateNonce();
    const ringMembers = await this.getRingMembersForSigning(compressedOwnerKey);
    const normalizedOwnerKey = normalizeHex(compressedOwnerKey);
    const signerIndex = ringMembers.findIndex(
      (member) => normalizeHex(member) === normalizedOwnerKey,
    );

    if (signerIndex === -1) {
      throw new Error('Owner key missing from ring membership');
    }

    const message = `list-grants:${fileId}:${timestamp}:${nonce}`;
    const ringSignaturePayload = await createLsagRingSignature({
      message,
      ringPublicKeys: ringMembers,
      signerIndex,
      signerPrivateKey: ownerPrivateKey,
    });
    const ringSignature = JSON.stringify(ringSignaturePayload);

    const schnorrMessageHex = sha256Hex(message);
    const schnorrProof = await createSchnorrProof(schnorrMessageHex, ownerPrivateKey);

    const response = await this.makeRequest<OwnerGrantListResponse>(
      `/api/files/${fileId}/anonymous-grants/list`,
      {
        method: 'POST',
        body: JSON.stringify({
          ringSignature,
          timestamp,
          nonce,
          ownershipProof: {
            R: schnorrProof.R,
            s: schnorrProof.s,
            message: schnorrMessageHex,
            publicKey: compressedOwnerKey,
          },
        }),
      }
    );

    if (!response.success) {
      throw new Error('Không thể tải danh sách grant.');
    }

    const normalized = this.normalizeGrantRecords(response.grants ?? []);
    await this.persistGrantJournal(fileId, normalized);
    return normalized;
  }

  async revokeAccess(params: { fileId: string; grantId: string; reason?: string }): Promise<RevokeAccessResponse> {
    const { fileId, grantId, reason } = params;

    if (!fileId || typeof fileId !== 'string') {
      throw new Error('fileId is required');
    }
    if (!grantId || typeof grantId !== 'string') {
      throw new Error('grantId is required');
    }

    const [ownerPublicKey, ownerPrivateKey] = await Promise.all([
      this.getPublicKey(),
      this.getSecretKey(),
    ]);

    const compressedOwnerKey = toCompressedPublicKey(ownerPublicKey);
    const timestamp = Date.now();
    const nonce = this.generateNonce();
    const ringMembers = await this.getRingMembersForSigning(compressedOwnerKey);
    const normalizedOwnerKey = normalizeHex(compressedOwnerKey);
    const signerIndex = ringMembers.findIndex(
      (member) => normalizeHex(member) === normalizedOwnerKey,
    );

    if (signerIndex === -1) {
      throw new Error('Owner key missing from ring membership');
    }

    const message = `revoke:${fileId}:${grantId}:${timestamp}:${nonce}`;
    const ringSignaturePayload = await createLsagRingSignature({
      message,
      ringPublicKeys: ringMembers,
      signerIndex,
      signerPrivateKey: ownerPrivateKey,
    });
    const ringSignature = JSON.stringify(ringSignaturePayload);

    const schnorrMessageHex = sha256Hex(message);
    const schnorrProof = await createSchnorrProof(schnorrMessageHex, ownerPrivateKey);

    const response = await this.makeRequest<RevokeAccessResponse>(
      `/api/files/${fileId}/anonymous-grants/${grantId}`,
      {
        method: 'DELETE',
        body: JSON.stringify({
          ringSignature,
          timestamp,
          nonce,
          reason: reason || null,
          ownershipProof: {
            R: schnorrProof.R,
            s: schnorrProof.s,
            message: schnorrMessageHex,
            publicKey: compressedOwnerKey,
          },
        }),
      }
    );

    const normalizedGrant = this.normalizeGrantRecord(response.grant);
    const snapshot = (await this.readGrantJournal(fileId)) ?? [];
    const updated = [normalizedGrant, ...snapshot.filter((entry) => entry.id !== normalizedGrant.id)];
    await this.persistGrantJournal(fileId, updated);

    return {
      ...response,
      grant: normalizedGrant,
    };
  }

  async syncGrantJournal(fileId: string): Promise<AnonymousGrantRecord[]> {
    return this.listOwnerGrants(fileId, { useCache: false });
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
  const message = `audit:${eventType}:${fileId}:${timestamp}:${nonce}`;
      
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
