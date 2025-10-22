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
import { getKeyPackage, removeKeyPackage } from './KeyPackageStorage';
import {
  bytesToHex as chunkBytesToHex,
  hexToBytes as chunkHexToBytes,
  parseEncryptedChunkPackage,
  decryptChunkWithAESGCM,
  generateChunkKey,
  createEncryptedChunkPackage,
  uploadEncryptedChunkBuffer,
  generateMasterKey as generateChunkMasterKey,
} from './ChunkEncryptionService';

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
  status?: string;
  grantId?: string;
  grantStatus?: string;
  grantRevokedAt?: string | null;
  grantUpdatedAt?: string | null;
  keyPackageFingerprint?: string | null;
  lastOwnerProof?: string | null;
  fileUpdatedAt?: string | null;
  fileLastRevocationAt?: string | null;
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

type OwnershipProofPayload = {
  R: string;
  s: string;
  message: string;
  publicKey: string;
};

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

export interface ReencryptionRevocationResponse {
  success: boolean;
  revocationId: string;
  chunksReencrypted: number[];
  totalChunks: number;
  percentage: number;
  message: string;
  newKeyFingerprint: string;
  manifestStatus?: string;
  rotatedKeyPackage: {
    masterKey: string;
    chunkKeys: Record<string, string>;
  };
  reencryptedChunkDetails: Array<{
    index: number;
    oldCid: string;
    newCid: string;
    hash: string;
  }>;
}

interface RevocationManifestChunk {
  index: number;
  cid: string;
  size: number;
  originalHash?: string;
}

interface RevocationPrepareResponse {
  success: boolean;
  revocationId: string;
  fileId: string;
  revokedPublicKeyHash?: string | null;
  manifest: {
    securityLevel: string;
    chunkCount: number;
    preparedAt: string;
    selectedChunks: RevocationManifestChunk[];
  };
}

interface RevocationFinalizeResponse {
  success: boolean;
  revocationId: string;
  chunksReencrypted: number[];
  totalChunks: number;
  percentage: number;
  newKeyFingerprint: string;
  manifestStatus?: string;
  message?: string;
}

export interface GrantAccessParams {
  fileId: string;
  targetPublicKey: string;
  keyPackageFingerprint?: string | null;
  expiresAt?: string | Date | null;
  metadata?: Record<string, any>;
}

export interface AnonymousListMeta {
  etag: string | null;
  lastModified: string | null;
  fromCache: boolean;
  hadCache: boolean;
  fetchedAt: string;
  responseStatus: number;
}

export interface AnonymousListChanges {
  newFiles: AccessibleFile[];
  revokedFiles: AccessibleFile[];
  removedKeyPackages: string[];
}

export interface AnonymousListFetchResult {
  files: AccessibleFile[];
  raw: AccessibleFile[];
  metadata: AnonymousListMeta;
  changes: AnonymousListChanges;
}

interface AnonymousListCacheEntry {
  etag: string | null;
  lastModified: string | null;
  storedAt: string;
  files: AccessibleFile[];
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
  private static readonly ANONYMOUS_LIST_CACHE_PREFIX = 'aot_anonymous_list_cache_v1_';

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

  private getAnonymousListCacheStorageKey(publicKey: string): string {
    const normalized = normalizeHex(publicKey);
    const hash = sha256Hex(normalized);
    return `${AnonymousFileAccessService.ANONYMOUS_LIST_CACHE_PREFIX}${hash}`;
  }

  private buildOwnershipProofPayload(
    schnorrProof: { R?: string; s?: string },
    messageHex: string,
    publicKeyHex: string,
    context: string,
  ): OwnershipProofPayload {
    const scope = context ? ` for ${context}` : '';

    const trimmedR = `${schnorrProof?.R ?? ''}`.trim();
    const trimmedS = `${schnorrProof?.s ?? ''}`.trim();
    const trimmedMessage = `${messageHex ?? ''}`.trim();
    const trimmedPublicKey = `${publicKeyHex ?? ''}`.trim();

    const missingFields: string[] = [];
    if (!trimmedR) missingFields.push('R');
    if (!trimmedS) missingFields.push('s');
    if (!trimmedMessage) missingFields.push('message');
    if (!trimmedPublicKey) missingFields.push('publicKey');

    if (missingFields.length > 0) {
      throw new Error(`Ownership proof is missing ${missingFields.join(', ')}${scope}.`);
    }

    const invalidLengths: string[] = [];
    if (trimmedR.length !== 64) invalidLengths.push('R');
    if (trimmedS.length !== 64) invalidLengths.push('s');
    if (trimmedMessage.length !== 64) invalidLengths.push('message');

    const publicKeyLength = trimmedPublicKey.length;
    const allowedPublicKeyLengths = [64, 66, 130];
    if (!allowedPublicKeyLengths.includes(publicKeyLength)) {
      invalidLengths.push('publicKey');
    }

    if (invalidLengths.length > 0) {
      throw new Error(
        `Ownership proof${scope} must provide 32-byte hex values for ${invalidLengths.join(', ')}.`,
      );
    }

    return {
      R: trimmedR,
      s: trimmedS,
      message: trimmedMessage,
      publicKey: trimmedPublicKey,
    };
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

  private normalizeAccessibleFile(raw: any): AccessibleFile {
    const toIso = (value: any): string | null => {
      if (!value) {
        return null;
      }
      const date = value instanceof Date ? value : new Date(value);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    };

    const normalizedStatus = typeof raw?.status === 'string'
      ? raw.status
      : typeof raw?.grantStatus === 'string'
        ? raw.grantStatus
        : typeof raw?.ownershipStatus === 'string'
          ? raw.ownershipStatus
          : 'active';

    return {
      fileId: String(raw?.fileId ?? raw?.id ?? ''),
      fileName: String(raw?.fileName ?? raw?.name ?? ''),
      fileSize: Number.isFinite(Number(raw?.fileSize)) ? Number(raw.fileSize) : 0,
      chunkCount: Number.isFinite(Number(raw?.chunkCount)) ? Number(raw.chunkCount) : 0,
      mimeType: raw?.mimeType ?? undefined,
      ownerPublicKey: String(raw?.ownerPublicKey ?? raw?.ownershipPublicKey ?? ''),
      ownershipStatus: String(raw?.ownershipStatus ?? raw?.fileStatus ?? normalizedStatus ?? 'active'),
      grantedAt: toIso(raw?.grantedAt) ?? new Date().toISOString(),
      expiresAt: toIso(raw?.expiresAt),
      accessCount: Number.isFinite(Number(raw?.accessCount)) ? Number(raw.accessCount) : 0,
      uploadedAt: toIso(raw?.uploadedAt ?? raw?.fileCreatedAt) ?? new Date().toISOString(),
      cid: raw?.cid ?? raw?.chunkCid ?? null,
      chunkHash: raw?.chunkHash ?? null,
      status: normalizedStatus,
      grantId: raw?.grantId ? String(raw.grantId) : undefined,
      grantStatus: typeof raw?.grantStatus === 'string' ? raw.grantStatus : normalizedStatus,
      grantRevokedAt: toIso(raw?.grantRevokedAt ?? raw?.revokedAt),
      grantUpdatedAt: toIso(raw?.grantUpdatedAt ?? raw?.updatedAt),
      keyPackageFingerprint: raw?.keyPackageFingerprint ?? null,
      lastOwnerProof: raw?.lastOwnerProof ?? null,
      fileUpdatedAt: toIso(raw?.fileUpdatedAt ?? raw?.updatedAt),
      fileLastRevocationAt: toIso(raw?.fileLastRevocationAt ?? raw?.lastRevocationAt),
    };
  }

  private normalizeAccessibleFiles(rawFiles: any[]): AccessibleFile[] {
    if (!Array.isArray(rawFiles)) {
      return [];
    }
    return rawFiles.map((record) => this.normalizeAccessibleFile(record));
  }

  private async cleanupRevokedEntries(entries: AccessibleFile[]): Promise<string[]> {
    if (!entries || entries.length === 0) {
      return [];
    }

    const removed: string[] = [];
    for (const entry of entries) {
      const fileId = entry?.fileId;
      if (!fileId) {
        continue;
      }

      try {
        const existing = await getKeyPackage(fileId);
        await removeKeyPackage(fileId);
        if (existing) {
          removed.push(fileId);
          try {
            await this.logAnonymousAuditEvent('delete_cache', fileId, {
              reason: 'grant_revoked',
              revokedAt: entry?.grantRevokedAt ?? entry?.grantUpdatedAt ?? null,
            });
          } catch (auditError) {
            console.warn('[Anonymous Access] Failed to log audit event for revoked cache cleanup', auditError);
          }
        }
      } catch (error) {
        console.warn('[Anonymous Access] Failed to cleanup revoked entry cache', fileId, error);
      }
    }

    return removed;
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

  private async readAnonymousListCache(publicKey: string): Promise<AnonymousListCacheEntry | null> {
    const key = this.getAnonymousListCacheStorageKey(publicKey);
    try {
      const stored = await AsyncStorage.getItem(key);
      if (!stored) {
        return null;
      }
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      const entry: AnonymousListCacheEntry = {
        etag: typeof parsed.etag === 'string' ? parsed.etag : null,
        lastModified: typeof parsed.lastModified === 'string' ? parsed.lastModified : null,
        storedAt: typeof parsed.storedAt === 'string' ? parsed.storedAt : new Date(0).toISOString(),
        files: this.normalizeAccessibleFiles(parsed.files ?? []),
      };
      return entry;
    } catch (error) {
      console.warn('[Anonymous Access] Failed to read anonymous list cache:', error);
      try {
        await AsyncStorage.removeItem(key);
      } catch (removeError) {
        console.warn('[Anonymous Access] Failed to clear corrupted anonymous list cache:', removeError);
      }
      return null;
    }
  }

  private async persistAnonymousListCache(publicKey: string, entry: AnonymousListCacheEntry): Promise<void> {
    const key = this.getAnonymousListCacheStorageKey(publicKey);
    try {
      const payload = {
        etag: entry.etag,
        lastModified: entry.lastModified,
        storedAt: entry.storedAt,
        files: entry.files,
      };
      await AsyncStorage.setItem(key, JSON.stringify(payload));
    } catch (error) {
      console.warn('[Anonymous Access] Failed to persist anonymous list cache:', error);
    }
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

  private resolveIpfsGatewayUrl(): string {
    if (API_CONFIG.ipfsGatewayUrl) {
      return API_CONFIG.ipfsGatewayUrl.replace(/\/$/, '');
    }

    try {
      const parsed = new URL(this.baseUrl);
      parsed.port = '5001';
      parsed.pathname = '';
      return parsed.toString().replace(/\/$/, '');
    } catch (error) {
      return this.baseUrl.replace(/:(\d+)/, ':5001');
    }
  }

  private normalizeChunkKeyMap(input: Record<string | number, string>): Record<string, string> {
    const normalized: Record<string, string> = {};
    Object.entries(input || {}).forEach(([index, value]) => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Invalid chunk key for index ${index}`);
      }
      const keyHex = normalizeHex(value);
      if (keyHex.length !== 64) {
        throw new Error(`Chunk key for index ${index} must be 32-byte hex string`);
      }
      normalized[String(index)] = keyHex;
    });
    return normalized;
  }

  private async downloadEncryptedChunk(cid: string, gatewayUrl: string): Promise<Uint8Array> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${gatewayUrl}/api/v0/cat?arg=${cid}`, {
        method: 'POST',
        signal: controller.signal,
      } as RequestInit);

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`IPFS fetch failed (${response.status} ${response.statusText})`);
      }

      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('IPFS chunk download timed out');
      }
      throw error instanceof Error ? error : new Error('Failed to download chunk from IPFS');
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
  async listAccessibleFiles(options: { bypassCache?: boolean } = {}): Promise<AnonymousListFetchResult> {
    const { bypassCache = false } = options;

    try {
      console.log('[Anonymous Access] Listing accessible files (recipient)...');

      const publicKey = await this.getPublicKey();
      const timestamp = Date.now();
      const nonce = this.generateNonce();
      const message = `list-files:${timestamp}:${nonce}`;
      const ringSignature = await this.createRingSignature(message);

      const cache = await this.readAnonymousListCache(publicKey);
      const hadCache = !!cache;

      const url = `${this.baseUrl}/api/files/anonymous-list`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (!bypassCache) {
        if (cache?.etag) {
          headers['If-None-Match'] = cache.etag;
        }
        if (cache?.lastModified) {
          headers['If-Modified-Since'] = cache.lastModified;
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            publicKey,
            ringSignature,
            timestamp,
            nonce,
          }),
          headers,
          signal: controller.signal,
        });
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }

      const status = response.status;
      let rawFiles: AccessibleFile[] = [];
      let fromCache = false;

      let etag = response.headers.get('etag');
      let lastModifiedHeader = response.headers.get('last-modified');
      let lastModifiedIso: string | null = null;

      if (status === 304) {
        if (!cache) {
          throw new Error('Received 304 Not Modified but no cached list is available');
        }
        console.log('[Anonymous Access] Server returned 304 - using cached anonymous list');
        rawFiles = cache.files;
        fromCache = true;
        if (!etag && cache.etag) {
          etag = cache.etag;
        }
        if (!lastModifiedHeader && cache.lastModified) {
          lastModifiedHeader = cache.lastModified;
        }
      } else {
        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : {};

        if (!response.ok) {
          const message = data?.error || `HTTP ${status}: ${response.statusText}`;
          throw new Error(message);
        }

        rawFiles = this.normalizeAccessibleFiles(data?.files ?? []);

        if ((!etag || etag.length === 0) && typeof data?.meta?.etag === 'string') {
          etag = data.meta.etag;
        }

        if (!lastModifiedHeader && typeof data?.meta?.lastModified === 'string') {
          try {
            const parsedMeta = new Date(data.meta.lastModified);
            if (!Number.isNaN(parsedMeta.getTime())) {
              lastModifiedHeader = parsedMeta.toUTCString();
              lastModifiedIso = parsedMeta.toISOString();
            }
          } catch (parseError) {
            console.warn('[Anonymous Access] Failed to parse response meta.lastModified', parseError);
          }
        }

        if (!lastModifiedIso && lastModifiedHeader) {
          const parsedHeader = new Date(lastModifiedHeader);
          if (!Number.isNaN(parsedHeader.getTime())) {
            lastModifiedIso = parsedHeader.toISOString();
          }
        }

        if (!lastModifiedIso && typeof data?.meta?.lastModified === 'string') {
          const metaDate = new Date(data.meta.lastModified);
          if (!Number.isNaN(metaDate.getTime())) {
            lastModifiedIso = metaDate.toISOString();
          }
        }

        const storedAt = new Date().toISOString();
        await this.persistAnonymousListCache(publicKey, {
          etag: etag ?? null,
          lastModified: lastModifiedHeader ?? null,
          storedAt,
          files: rawFiles,
        });
      }

      if (!lastModifiedIso && lastModifiedHeader) {
        const parsedHeader = new Date(lastModifiedHeader);
        if (!Number.isNaN(parsedHeader.getTime())) {
          lastModifiedIso = parsedHeader.toISOString();
        }
      }

      if (!lastModifiedIso && !lastModifiedHeader && cache?.lastModified) {
        const cachedDate = new Date(cache.lastModified);
        if (!Number.isNaN(cachedDate.getTime())) {
          lastModifiedHeader = cache.lastModified;
          lastModifiedIso = cachedDate.toISOString();
        }
      }

      const previousRecords = cache?.files ?? [];
      const previousActiveMap = new Map(
        previousRecords
          .filter((record) => (record.status ?? record.grantStatus ?? 'active') !== 'revoked')
          .map((record) => [record.fileId, record] as const),
      );

      const activeFiles = rawFiles.filter(
        (file) => (file.status ?? file.grantStatus ?? 'active') !== 'revoked',
      );

      const newFiles = hadCache
        ? activeFiles.filter((file) => !previousActiveMap.has(file.fileId))
        : [];

      const revokedByStatus = rawFiles.filter(
        (file) => (file.status ?? file.grantStatus ?? 'active') === 'revoked',
      );

      const revokedByRemoval = hadCache
        ? previousRecords.filter(
            (previous) =>
              (previous.status ?? previous.grantStatus ?? 'active') !== 'revoked' &&
              !activeFiles.some((current) => current.fileId === previous.fileId),
          )
        : [];

      const revokedMap = new Map(
        [...revokedByStatus, ...revokedByRemoval].map((entry) => [entry.fileId, entry] as const),
      );
      const revokedFiles = Array.from(revokedMap.values());

      const removedKeyPackages = await this.cleanupRevokedEntries(revokedFiles);

      console.log(
        '[Anonymous Access] Anonymous list refresh summary',
        JSON.stringify(
          {
            total: rawFiles.length,
            active: activeFiles.length,
            revoked: revokedFiles.length,
            newEntries: newFiles.length,
            fromCache,
            hadCache,
          },
          null,
          2,
        ),
      );

      const metadata: AnonymousListMeta = {
        etag: etag ?? null,
        lastModified: lastModifiedIso,
        fromCache,
        hadCache,
        fetchedAt: new Date().toISOString(),
        responseStatus: status,
      };

      return {
        files: activeFiles,
        raw: rawFiles,
        metadata,
        changes: {
          newFiles,
          revokedFiles,
          removedKeyPackages,
        },
      };
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

    const ownershipProofPayload = this.buildOwnershipProofPayload(
      schnorrProof,
      schnorrMessageHex,
      compressedOwnerKey,
      'grant access',
    );

    const body: Record<string, any> = {
      targetPublicKey: compressedTargetKey,
      ringSignature,
      timestamp,
      nonce,
      ownershipProof: ownershipProofPayload,
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

    const ownershipProofPayload = this.buildOwnershipProofPayload(
      schnorrProof,
      schnorrMessageHex,
      compressedOwnerKey,
      'grant list',
    );

    const response = await this.makeRequest<OwnerGrantListResponse>(
      `/api/files/${fileId}/anonymous-grants/list`,
      {
        method: 'POST',
        body: JSON.stringify({
          ringSignature,
          timestamp,
          nonce,
          ownershipProof: ownershipProofPayload,
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

    const ownershipProofPayload = this.buildOwnershipProofPayload(
      schnorrProof,
      schnorrMessageHex,
      compressedOwnerKey,
      'grant revocation',
    );

    const response = await this.makeRequest<RevokeAccessResponse>(
      `/api/files/${fileId}/anonymous-grants/${grantId}`,
      {
        method: 'DELETE',
        body: JSON.stringify({
          ringSignature,
          timestamp,
          nonce,
          reason: reason || null,
          ownershipProof: ownershipProofPayload,
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

  async revokeAccessWithReencryption(params: {
    fileId: string;
    grant: AnonymousGrantRecord;
    keyPackage: {
      masterKey: string;
      chunkKeys: Record<string | number, string>;
    };
    securityLevel?: 'standard' | 'high' | 'maximum';
  }): Promise<ReencryptionRevocationResponse> {
    const { fileId, grant, keyPackage, securityLevel = 'standard' } = params;

    if (!fileId) {
      throw new Error('fileId is required');
    }
    if (!grant || !grant.accessorPublicKeyHash) {
      throw new Error('Grant with accessorPublicKeyHash is required');
    }
    if (!keyPackage?.masterKey || !keyPackage.chunkKeys) {
      throw new Error('Key package with masterKey and chunkKeys is required');
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

    const message = `revoke-reencrypt:${fileId}:${grant.accessorPublicKeyHash}:${timestamp}:${nonce}`;
    const ringSignaturePayload = await createLsagRingSignature({
      message,
      ringPublicKeys: ringMembers,
      signerIndex,
      signerPrivateKey: ownerPrivateKey,
    });
    const ringSignature = JSON.stringify(ringSignaturePayload);

    const schnorrMessageHex = sha256Hex(message);
    const schnorrProof = await createSchnorrProof(schnorrMessageHex, ownerPrivateKey);

    const ownershipProofPayload = this.buildOwnershipProofPayload(
      schnorrProof,
      schnorrMessageHex,
      compressedOwnerKey,
      'client-side revocation',
    );

    const chunkKeysPayload = this.normalizeChunkKeyMap(keyPackage.chunkKeys);

    const prepareResponse = await this.makeRequest<RevocationPrepareResponse>(
      `/api/files/revocation/prepare`,
      {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          message,
          ringSignature,
          ownershipProof: ownershipProofPayload,
          securityLevel,
          revokedPublicKeyHash: grant.accessorPublicKeyHash,
          keyPackage: {
            masterKey: keyPackage.masterKey,
            chunkKeys: chunkKeysPayload,
          },
        }),
      }
    );

    if (!prepareResponse?.success) {
      throw new Error('Failed to prepare revocation manifest');
    }

    const selectedChunks = prepareResponse.manifest?.selectedChunks ?? [];
    if (!Array.isArray(selectedChunks) || selectedChunks.length === 0) {
      throw new Error('Revocation manifest did not include any chunks to re-encrypt');
    }

    const ipfsGatewayUrl = this.resolveIpfsGatewayUrl();
    const updatedChunkKeys: Record<string, string> = { ...chunkKeysPayload };
    const reencryptedChunkDetails: Array<{ index: number; oldCid: string; newCid: string; hash: string }> = [];

    for (const chunk of selectedChunks) {
      const indexKey = String(chunk.index);
      const currentKeyHex = updatedChunkKeys[indexKey];
      if (!currentKeyHex) {
        throw new Error(`Key package missing chunk key for index ${indexKey}`);
      }

      const encryptedBuffer = await this.downloadEncryptedChunk(chunk.cid, ipfsGatewayUrl);
      const { iv, authTag, encryptedData } = parseEncryptedChunkPackage(encryptedBuffer);
      const plaintext = await decryptChunkWithAESGCM(
        encryptedData,
        chunkHexToBytes(currentKeyHex),
        iv,
        authTag,
      );

      const computedHash = normalizeHex(sha256Hex(plaintext));
      if (chunk.originalHash && normalizeHex(chunk.originalHash) !== computedHash) {
        throw new Error(`Chunk integrity check failed for index ${chunk.index}`);
      }

      const newChunkKeyBytes = generateChunkKey();
      const { encryptedBuffer: rotatedBuffer, hash } = await createEncryptedChunkPackage(
        plaintext,
        newChunkKeyBytes,
      );

      const newCid = await uploadEncryptedChunkBuffer(
        rotatedBuffer,
        chunk.index,
        `${fileId}.revocation`,
        ipfsGatewayUrl,
      );

      updatedChunkKeys[indexKey] = normalizeHex(chunkBytesToHex(newChunkKeyBytes));
      reencryptedChunkDetails.push({
        index: chunk.index,
        oldCid: chunk.cid,
        newCid,
        hash,
      });
    }

    const newMasterKey = normalizeHex(generateChunkMasterKey());

    const finalizeResponse = await this.makeRequest<RevocationFinalizeResponse>(
      `/api/files/revocation/finalize`,
      {
        method: 'POST',
        body: JSON.stringify({
          revocationId: prepareResponse.revocationId,
          fileId,
          message,
          ringSignature,
          ownershipProof: ownershipProofPayload,
          keyPackage: {
            masterKey: newMasterKey,
            chunkKeys: updatedChunkKeys,
          },
          reencryptedChunks: reencryptedChunkDetails,
        }),
      }
    );

    if (!finalizeResponse?.success) {
      throw new Error(finalizeResponse?.message || 'Re-encryption revocation failed');
    }

    return {
      ...finalizeResponse,
      message: finalizeResponse.message || 'Client-side re-encryption finalized',
      rotatedKeyPackage: {
        masterKey: newMasterKey,
        chunkKeys: updatedChunkKeys,
      },
      reencryptedChunkDetails,
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
  }): Promise<AnonymousListFetchResult> {
    try {
      console.log('[Anonymous Access] Listing accessible files with explicit parameters...');

      const url = `${this.baseUrl}/api/files/anonymous-list`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
          signal: controller.signal,
        });
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }

      const status = response.status;
      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        const message = data?.error || `HTTP ${status}: ${response.statusText}`;
        throw new Error(message);
      }

      const rawFiles = this.normalizeAccessibleFiles(data?.files ?? []);
      const activeFiles = rawFiles.filter(
        (file) => (file.status ?? file.grantStatus ?? 'active') !== 'revoked',
      );
      const revokedFiles = rawFiles.filter(
        (file) => (file.status ?? file.grantStatus ?? 'active') === 'revoked',
      );

      let etag = response.headers.get('etag');
      if ((!etag || etag.length === 0) && typeof data?.meta?.etag === 'string') {
        etag = data.meta.etag;
      }

      let lastModifiedHeader = response.headers.get('last-modified');
      let lastModifiedIso: string | null = null;

      if (!lastModifiedHeader && typeof data?.meta?.lastModified === 'string') {
        const metaDate = new Date(data.meta.lastModified);
        if (!Number.isNaN(metaDate.getTime())) {
          lastModifiedHeader = metaDate.toUTCString();
          lastModifiedIso = metaDate.toISOString();
        }
      }

      if (!lastModifiedIso && lastModifiedHeader) {
        const parsed = new Date(lastModifiedHeader);
        if (!Number.isNaN(parsed.getTime())) {
          lastModifiedIso = parsed.toISOString();
        }
      }

      if (!lastModifiedIso && typeof data?.meta?.lastModified === 'string') {
        const metaDate = new Date(data.meta.lastModified);
        if (!Number.isNaN(metaDate.getTime())) {
          lastModifiedIso = metaDate.toISOString();
        }
      }

      console.log(
        '[Anonymous Access] Explicit list fetch summary',
        JSON.stringify(
          {
            total: rawFiles.length,
            active: activeFiles.length,
            revoked: revokedFiles.length,
          },
          null,
          2,
        ),
      );

      const metadata: AnonymousListMeta = {
        etag: etag ?? null,
        lastModified: lastModifiedIso,
        fromCache: false,
        hadCache: false,
        fetchedAt: new Date().toISOString(),
        responseStatus: status,
      };

      return {
        files: activeFiles,
        raw: rawFiles,
        metadata,
        changes: {
          newFiles: activeFiles,
          revokedFiles,
          removedKeyPackages: [],
        },
      };
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
