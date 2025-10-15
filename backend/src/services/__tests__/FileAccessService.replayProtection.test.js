/**
 * File Access Service - Replay Protection Integration Tests
 *
 * Verifies that FileAccessService properly awaits and handles
 * nonce verification to prevent replay attacks
 */

const { FileAccessService } = require('../FileAccessService');
const { RingSignatureService } = require('../RingSignatureService');
const { PrismaClient } = require('@prisma/client');

describe('File Access Service - Replay Protection', () => {
  let fileAccessService;
  let ringService;
  let prisma;

  beforeAll(() => {
    prisma = new PrismaClient();
    ringService = new RingSignatureService(prisma);
    fileAccessService = new FileAccessService(ringService, prisma);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.anonymousAuditLog.deleteMany({
      where: {
        eventType: 'nonce_verification'
      }
    });
    await prisma.$disconnect();
  });

  describe('Nonce Replay Protection in listAccessibleFiles', () => {
    test('Should reject request with reused nonce', async () => {
      const timestamp = Date.now();
      const nonce = 'test-nonce-list-files-' + timestamp;

      // Mock ring signature verification to always pass
      const originalVerifyRingSignature = ringService.verifyRingSignature;
      ringService.verifyRingSignature = jest.fn().mockResolvedValue(true);
      ringService.getAllPublicKeys = jest.fn().mockResolvedValue(['test-pub-key']);

      const params = {
        publicKey: 'test-pub-key',
        ringSignature: 'test-signature',
        timestamp: timestamp,
        nonce: nonce
      };

      // First request should succeed
      try {
        await fileAccessService.listAccessibleFiles(params);
      } catch (error) {
        // May fail due to no access grants, but nonce should be recorded
      }

      // Second request with same nonce should fail
      await expect(
        fileAccessService.listAccessibleFiles(params)
      ).rejects.toThrow('Nonce has already been used');

      // Restore original method
      ringService.verifyRingSignature = originalVerifyRingSignature;
    });
  });

  describe('Nonce Replay Protection in negotiateAccess', () => {
    test('Should reject request with reused nonce', async () => {
      const timestamp = Date.now();
      const nonce = 'test-nonce-negotiate-' + timestamp;

      // Mock ring signature verification to always pass
      const originalVerifyRingSignature = ringService.verifyRingSignature;
      ringService.verifyRingSignature = jest.fn().mockResolvedValue(true);
      ringService.getAllPublicKeys = jest.fn().mockResolvedValue(['test-pub-key']);

      const params = {
        fileId: 'test-file-id',
        publicKey: 'test-pub-key',
        ringSignature: 'test-signature',
        timestamp: timestamp,
        nonce: nonce
      };

      // First request should consume the nonce
      try {
        await fileAccessService.negotiateAccess(params);
      } catch (error) {
        // May fail due to no access grant, but nonce should be recorded
      }

      // Second request with same nonce should fail
      await expect(
        fileAccessService.negotiateAccess(params)
      ).rejects.toThrow('Nonce has already been used');

      // Restore original method
      ringService.verifyRingSignature = originalVerifyRingSignature;
    });
  });

  describe('Nonce Replay Protection in reportIntegrityAlert', () => {
    test('Should reject request with reused nonce', async () => {
      const timestamp = Date.now();
      const nonce = 'test-nonce-integrity-' + timestamp;

      // Mock ring signature verification to always pass
      const originalVerifyRingSignature = ringService.verifyRingSignature;
      ringService.verifyRingSignature = jest.fn().mockResolvedValue(true);
      ringService.getAllPublicKeys = jest.fn().mockResolvedValue(['test-pub-key']);

      const params = {
        fileId: 'test-file-id',
        publicKey: 'test-pub-key',
        ringSignature: 'test-signature',
        timestamp: timestamp,
        nonce: nonce,
        chunkIndex: 0,
        expectedHash: 'expected-hash',
        actualHash: 'actual-hash',
        retryCount: 1
      };

      // First request should consume the nonce
      try {
        await fileAccessService.reportIntegrityAlert(params);
      } catch (error) {
        // May succeed or fail, but nonce should be recorded
      }

      // Second request with same nonce should fail
      await expect(
        fileAccessService.reportIntegrityAlert(params)
      ).rejects.toThrow('Nonce has already been used');

      // Restore original method
      ringService.verifyRingSignature = originalVerifyRingSignature;
    });
  });

  describe('Nonce Replay Protection in logAnonymousAuditEvent', () => {
    test('Should reject request with reused nonce', async () => {
      const timestamp = Date.now();
      const nonce = 'test-nonce-audit-' + timestamp;

      // Mock ring signature verification to always pass
      const originalVerifyRingSignature = ringService.verifyRingSignature;
      ringService.verifyRingSignature = jest.fn().mockResolvedValue(true);
      ringService.getAllPublicKeys = jest.fn().mockResolvedValue(['test-pub-key']);

      const params = {
        eventType: 'test-event',
        fileId: 'test-file-id',
        publicKey: 'test-pub-key',
        ringSignature: 'test-signature',
        timestamp: timestamp,
        nonce: nonce,
        metadata: { test: 'data' }
      };

      // First request should consume the nonce
      await fileAccessService.logAnonymousAuditEvent(params);

      // Second request with same nonce should fail
      await expect(
        fileAccessService.logAnonymousAuditEvent(params)
      ).rejects.toThrow('Nonce has already been used');

      // Restore original method
      ringService.verifyRingSignature = originalVerifyRingSignature;
    });
  });

  describe('Timestamp Validation', () => {
    test('Should reject requests with old timestamps', async () => {
      const oldTimestamp = Date.now() - (10 * 60 * 1000); // 10 minutes ago
      const nonce = 'test-nonce-old-timestamp-' + Date.now();

      const params = {
        publicKey: 'test-pub-key',
        ringSignature: 'test-signature',
        timestamp: oldTimestamp,
        nonce: nonce
      };

      await expect(
        fileAccessService.listAccessibleFiles(params)
      ).rejects.toThrow('Request timestamp is invalid or too old');
    });

    test('Should reject requests with future timestamps', async () => {
      const futureTimestamp = Date.now() + (10 * 60 * 1000); // 10 minutes in future
      const nonce = 'test-nonce-future-timestamp-' + Date.now();

      const params = {
        publicKey: 'test-pub-key',
        ringSignature: 'test-signature',
        timestamp: futureTimestamp,
        nonce: nonce
      };

      await expect(
        fileAccessService.listAccessibleFiles(params)
      ).rejects.toThrow('Request timestamp is invalid or too old');
    });
  });
});
