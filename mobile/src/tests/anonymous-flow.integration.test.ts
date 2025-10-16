/**
 * Integration Smoke Test: Anonymous File Access Flow
 *
 * Tests the complete anonymous file access workflow:
 * 1. Init identity → 2. Fetch anonymous list → 3. Negotiate access →
 * 4. Download chunk → 5. Send integrity alert
 *
 * This test verifies that the mobile app properly uses AnonymousFileAccessService
 * instead of legacy userId-based access.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AnonymousFileAccessService,
  createAnonymousFileAccessService
} from '../services/AnonymousFileAccessService';

// Mock AsyncStorage for testing
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Anonymous File Access Flow - Integration Test', () => {
  let anonymousService: AnonymousFileAccessService;
  const mockPublicKey = '04a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
  const mockSecretKey = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create service instance
    anonymousService = createAnonymousFileAccessService();

    // Mock identity in storage
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'aot_public_key') {return Promise.resolve(mockPublicKey);}
      if (key === 'aot_secret_key') {return Promise.resolve(mockSecretKey);}
      return Promise.resolve(null);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * PHASE 1: Identity Initialization
   * Verify that identity can be checked and retrieved
   */
  describe('Phase 1: Identity Initialization', () => {
    it('should check if user has identity', async () => {
      const hasIdentity = await anonymousService.hasIdentity();

      expect(hasIdentity).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('aot_public_key');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('aot_secret_key');
    });

    it('should retrieve current public key', async () => {
      const publicKey = await anonymousService.getCurrentPublicKey();

      expect(publicKey).toBe(mockPublicKey);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('aot_public_key');
    });

    it('should return false when identity not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const hasIdentity = await anonymousService.hasIdentity();

      expect(hasIdentity).toBe(false);
    });
  });

  /**
   * PHASE 2: Fetch Anonymous File List
   * Verify that file list can be retrieved using anonymous auth
   */
  describe('Phase 2: Fetch Anonymous File List', () => {
    it('should list accessible files anonymously', async () => {
      const mockFiles = [
        {
          fileId: 'file-1',
          fileName: 'test.txt',
          fileSize: 1024,
          chunkCount: 1,
          ownerPublicKey: mockPublicKey,
          ownershipStatus: 'active',
          grantedAt: new Date().toISOString(),
          expiresAt: null,
          accessCount: 1,
          uploadedAt: new Date().toISOString(),
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          files: mockFiles,
          totalCount: 1,
        }),
      });

      const files = await anonymousService.listAccessibleFiles();

      expect(files).toHaveLength(1);
      expect(files[0].fileId).toBe('file-1');
      expect(files[0].fileName).toBe('test.txt');

      // Verify request was made with anonymous parameters
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/files/anonymous-list'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('publicKey'),
        })
      );
    });

    it('should list files with explicit parameters', async () => {
      const mockParams = {
        publicKey: mockPublicKey,
        ringSignature: 'mock-signature',
        timestamp: Date.now(),
        nonce: 'mock-nonce',
      };

      const mockFiles = [
        {
          fileId: 'file-2',
          fileName: 'data.json',
          fileSize: 2048,
          chunkCount: 1,
          ownerPublicKey: mockPublicKey,
          ownershipStatus: 'active',
          grantedAt: new Date().toISOString(),
          expiresAt: null,
          accessCount: 0,
          uploadedAt: new Date().toISOString(),
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          files: mockFiles,
          totalCount: 1,
        }),
      });

      const files = await anonymousService.listAccessibleFilesWithParams(mockParams);

      expect(files).toHaveLength(1);
      expect(files[0].fileId).toBe('file-2');

      // Verify no userId in request
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).toHaveProperty('publicKey');
      expect(requestBody).toHaveProperty('ringSignature');
      expect(requestBody).toHaveProperty('timestamp');
      expect(requestBody).toHaveProperty('nonce');
      expect(requestBody).not.toHaveProperty('userId');
    });
  });

  /**
   * PHASE 3: Negotiate Access
   * Verify access negotiation returns chunk manifest
   */
  describe('Phase 3: Negotiate Access', () => {
    it('should negotiate access to a file', async () => {
      const mockManifest = {
        success: true,
        file: {
          id: 'file-1',
          name: 'test.txt',
          size: 1024,
          chunkCount: 2,
        },
        chunkManifest: [
          { index: 0, cid: 'Qm123', size: 512, hash: 'hash1' },
          { index: 1, cid: 'Qm456', size: 512, hash: 'hash2' },
        ],
        ownershipPolicy: {
          publicKey: mockPublicKey,
          status: 'active',
          revoked: false,
        },
        grantContext: {
          grantedAt: new Date().toISOString(),
          expiresAt: null,
          accessCount: 1,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      const manifest = await anonymousService.negotiateAccess('file-1');

      expect(manifest.success).toBe(true);
      expect(manifest.chunkManifest).toHaveLength(2);
      expect(manifest.ownershipPolicy.publicKey).toBe(mockPublicKey);

      // Verify anonymous endpoint was called
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/file-1/anonymous-access'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should handle access denied errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Access denied' }),
      });

      await expect(anonymousService.negotiateAccess('file-denied')).rejects.toThrow(
        'You do not have permission to access this file'
      );
    });

    it('should handle expired access', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Access expired' }),
      });

      await expect(anonymousService.negotiateAccess('file-expired')).rejects.toThrow(
        'Your access to this file has expired'
      );
    });
  });

  /**
   * PHASE 4: Download Chunk (simulated - actual download tested separately)
   * This phase would involve downloading chunks via IPFS
   */
  describe('Phase 4: Chunk Download (Simulated)', () => {
    it('should verify chunk manifest structure for download', async () => {
      const mockManifest = {
        success: true,
        file: { id: 'file-1', name: 'test.txt', size: 1024, chunkCount: 1 },
        chunkManifest: [
          {
            index: 0,
            cid: 'QmTest123',
            size: 1024,
            hash: 'expected-hash-value'
          },
        ],
        ownershipPolicy: { publicKey: mockPublicKey, status: 'active', revoked: false },
        grantContext: { grantedAt: new Date().toISOString(), expiresAt: null, accessCount: 0 },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      const manifest = await anonymousService.negotiateAccess('file-1');

      // Verify chunk manifest has required fields for download
      const chunk = manifest.chunkManifest[0];
      expect(chunk).toHaveProperty('cid');
      expect(chunk).toHaveProperty('hash');
      expect(chunk).toHaveProperty('size');
      expect(chunk).toHaveProperty('index');

      // In real download flow, this CID would be used to fetch from IPFS
      expect(chunk.cid).toBe('QmTest123');
      expect(chunk.hash).toBe('expected-hash-value');
    });
  });

  /**
   * PHASE 5: Send Integrity Alert
   * Verify integrity alerts can be reported anonymously
   */
  describe('Phase 5: Send Integrity Alert', () => {
    it('should report integrity alert anonymously', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Alert received' }),
      });

      const params = {
        fileId: 'file-1',
        chunkIndex: 0,
        expectedHash: 'expected-hash',
        actualHash: 'actual-hash',
        retryCount: 2,
      };

      // Should not throw
      await anonymousService.reportIntegrityAlert(params);

      // Verify anonymous endpoint was called
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/file-1/anonymous-integrity-alert'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('publicKey'),
        })
      );

      // Verify no userId in payload
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).not.toHaveProperty('userId');
      expect(requestBody).toHaveProperty('publicKey');
      expect(requestBody).toHaveProperty('ringSignature');
      expect(requestBody).toHaveProperty('chunkIndex', 0);
      expect(requestBody).toHaveProperty('expectedHash', 'expected-hash');
      expect(requestBody).toHaveProperty('actualHash', 'actual-hash');
    });

    it('should not throw on integrity alert failure (best-effort)', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const params = {
        fileId: 'file-1',
        chunkIndex: 0,
        expectedHash: 'expected-hash',
        actualHash: null,
        retryCount: 0,
      };

      // Should not throw even on network failure
      await expect(anonymousService.reportIntegrityAlert(params)).resolves.toBeUndefined();
    });
  });

  /**
   * PHASE 6: Audit Logging
   * Verify audit events are logged anonymously
   */
  describe('Phase 6: Anonymous Audit Logging', () => {
    it('should log audit event anonymously', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Event logged' }),
      });

      await anonymousService.logAnonymousAuditEvent('view', 'file-1', {
        viewDuration: 5000,
        scrollDepth: 0.75,
      });

      // Verify anonymous audit endpoint was called
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/files/audit/anonymous-log'),
        expect.objectContaining({ method: 'POST' })
      );

      // Verify payload structure
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).toHaveProperty('eventType', 'view');
      expect(requestBody).toHaveProperty('fileId', 'file-1');
      expect(requestBody).toHaveProperty('publicKey');
      expect(requestBody).toHaveProperty('ringSignature');
      expect(requestBody).toHaveProperty('timestamp');
      expect(requestBody).toHaveProperty('nonce');
      expect(requestBody).toHaveProperty('metadata');
      expect(requestBody).not.toHaveProperty('userId');
    });

    it('should support multiple event types', async () => {
      const eventTypes = ['download', 'view', 'share', 'delete_cache', 'access_request'] as const;

      for (const eventType of eventTypes) {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        await anonymousService.logAnonymousAuditEvent(eventType, 'file-test');

        const fetchCall = (global.fetch as jest.Mock).mock.calls.slice(-1)[0];
        const requestBody = JSON.parse(fetchCall[1].body);
        expect(requestBody.eventType).toBe(eventType);
      }
    });

    it('should not throw on audit logging failure (best-effort)', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Should not throw even on network failure
      await expect(
        anonymousService.logAnonymousAuditEvent('download', 'file-1')
      ).resolves.toBeUndefined();
    });
  });

  /**
   * COMPLETE FLOW TEST
   * End-to-end test of the entire anonymous flow
   */
  describe('Complete Anonymous Flow', () => {
    it('should complete full anonymous file access workflow', async () => {
      // Step 1: Check identity
      const hasIdentity = await anonymousService.hasIdentity();
      expect(hasIdentity).toBe(true);

      // Step 2: List accessible files
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          files: [
            {
              fileId: 'file-workflow',
              fileName: 'workflow-test.txt',
              fileSize: 2048,
              chunkCount: 2,
              ownerPublicKey: mockPublicKey,
              ownershipStatus: 'active',
              grantedAt: new Date().toISOString(),
              expiresAt: null,
              accessCount: 0,
              uploadedAt: new Date().toISOString(),
            },
          ],
          totalCount: 1,
        }),
      });

      const files = await anonymousService.listAccessibleFiles();
      expect(files).toHaveLength(1);
      const targetFile = files[0];

      // Step 3: Negotiate access
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          file: {
            id: targetFile.fileId,
            name: targetFile.fileName,
            size: targetFile.fileSize,
            chunkCount: 2,
          },
          chunkManifest: [
            { index: 0, cid: 'Qm111', size: 1024, hash: 'hash-chunk-0' },
            { index: 1, cid: 'Qm222', size: 1024, hash: 'hash-chunk-1' },
          ],
          ownershipPolicy: {
            publicKey: mockPublicKey,
            status: 'active',
            revoked: false,
          },
          grantContext: {
            grantedAt: targetFile.grantedAt,
            expiresAt: null,
            accessCount: 1,
          },
        }),
      });

      const manifest = await anonymousService.negotiateAccess(targetFile.fileId);
      expect(manifest.chunkManifest).toHaveLength(2);

      // Step 4: Simulate chunk download and integrity check
      const chunk = manifest.chunkManifest[0];
      const downloadedHash = 'wrong-hash'; // Simulated hash mismatch

      // Step 5: Report integrity alert (hash mismatch detected)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Alert received' }),
      });

      await anonymousService.reportIntegrityAlert({
        fileId: targetFile.fileId,
        chunkIndex: 0,
        expectedHash: chunk.hash,
        actualHash: downloadedHash,
        retryCount: 1,
      });

      // Step 6: Log download completion
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await anonymousService.logAnonymousAuditEvent('download', targetFile.fileId, {
        chunkCount: manifest.chunkManifest.length,
        totalSize: manifest.file.size,
      });

      // Verify complete workflow
      expect(global.fetch).toHaveBeenCalledTimes(4); // list + access + alert + audit

      // Verify all calls used anonymous endpoints
      const allCalls = (global.fetch as jest.Mock).mock.calls;
      allCalls.forEach(call => {
        const url = call[0];
        expect(url).toMatch(/anonymous/);
      });
    });
  });
});
