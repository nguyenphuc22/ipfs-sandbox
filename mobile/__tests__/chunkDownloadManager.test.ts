import { chunkDownloadManager } from '../src/services/chunkDownloadManager';
import type { FileAccessManifest } from '../src/services/AnonymousFileAccessService';

// Mock dependencies for real download
jest.mock('../src/services/KeyPackageStorage', () => ({
  getKeyPackage: jest.fn().mockResolvedValue({
    masterKey: 'mock_master_key',
    chunkKeys: {
      0: '0'.repeat(64),
      1: '1'.repeat(64),
      2: '2'.repeat(64),
    },
    fingerprint: 'fingerprint',
  }),
}));

jest.mock('../src/services/ChunkEncryptionService', () => ({
  decryptChunkWithAESGCM: jest.fn().mockResolvedValue(new Uint8Array(512)),
  parseEncryptedChunkPackage: jest.fn().mockReturnValue({
    iv: new Uint8Array(12),
    authTag: new Uint8Array(16),
    encryptedData: new Uint8Array(512),
  }),
}));

// Mock @noble/hashes for integrity verification
jest.mock('@noble/hashes/sha2', () => ({
  sha256: jest.fn(() => new Uint8Array(32).fill(0)),
}));

// Mock fetch for IPFS download
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(544)), // IV + AuthTag + Data
}) as any;

describe('chunkDownloadManager', () => {
  const fileId = 'test-file';

  const createManifest = (chunkCount = 2): FileAccessManifest => ({
    success: true,
    file: {
      id: fileId,
      name: 'Test File',
      size: 1024 * chunkCount,
      chunkCount,
      mimeType: 'text/plain',
    },
    chunkManifest: Array.from({ length: chunkCount }, (_, index) => ({
      index,
      cid: `cid-${index}`,
      size: 512,
      hash: `hash-${index}`,
    })),
    ownershipPolicy: {
      publicKey: 'owner-public-key',
      status: 'active',
      revoked: false,
    },
    grantContext: {
      grantedAt: new Date().toISOString(),
      expiresAt: null,
      accessCount: 0,
      hasLocalKey: true,
      keyPackageFingerprint: 'fingerprint',
      keyStatus: 'client-managed',
    },
  });

  afterEach(() => {
    chunkDownloadManager.resetSession(fileId);
  });

  it('initialises chunk progress when ensuring session', () => {
    const manifest = createManifest(3);

    chunkDownloadManager.ensureSession(fileId, manifest);
    const state = chunkDownloadManager.getState(fileId);

    expect(state.manifest).toEqual(manifest);
    expect(state.chunkProgress).toHaveLength(3);
    expect(state.chunkProgress.every(chunk => chunk.status === 'pending')).toBe(true);
  });

  it('downloads file and marks chunks as completed', async () => {
    const manifest = createManifest(2);

    chunkDownloadManager.ensureSession(fileId, manifest);
    await chunkDownloadManager.downloadFile(fileId);

    const state = chunkDownloadManager.getState(fileId);

    expect(state.phase).toBe('ready');
    expect(state.integrityVerified).toBe(true);
    expect(state.chunkProgress.every(chunk => chunk.status === 'completed')).toBe(true);
  });

  it('retries chunk download and increments retry count', async () => {
    const manifest = createManifest(1);

    chunkDownloadManager.ensureSession(fileId, manifest);
    await chunkDownloadManager.retryChunk(fileId, 0);

    const state = chunkDownloadManager.getState(fileId);
    expect(state.chunkProgress[0].status).toBe('completed');
    expect(state.chunkProgress[0].retries).toBeGreaterThan(0);
    expect(state.phase).toBe('ready');
  });
});
