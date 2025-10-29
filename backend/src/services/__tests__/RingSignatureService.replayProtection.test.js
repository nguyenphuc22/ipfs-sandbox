/**
 * Ring Signature Service - Replay Protection Database Tests
 *
 * Verifies that nonce and key image replay protection works correctly
 * with proper database storage and lookup
 */

const { RingSignatureService } = require('../RingSignatureService');
const { PrismaClient } = require('../../config/prismaClient');

describe('Ring Signature Service - Replay Protection Database Tests', () => {
  let ringSignatureService;
  let prisma;

  beforeAll(() => {
    prisma = new PrismaClient();
    ringSignatureService = new RingSignatureService(prisma);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.anonymousAuditLog.deleteMany({
      where: {
        OR: [
          { eventType: 'nonce_verification' },
          { eventType: 'key_image_verification' }
        ]
      }
    });
    await prisma.$disconnect();
  });

  describe('Nonce Replay Protection with Database', () => {
    test('Should store full nonce in database for proper lookup', async () => {
      const testNonce = 'test-nonce-full-storage-' + Date.now();

      // First use should succeed
      const firstCheck = await ringSignatureService.verifyNonce(testNonce);
      expect(firstCheck).toBe(true);

      // Verify nonce was stored in database with full value
      const storedNonce = await prisma.anonymousAuditLog.findFirst({
        where: {
          eventType: 'nonce_verification',
          metadata: {
            contains: `"nonce":"${testNonce}"`
          }
        }
      });

      expect(storedNonce).not.toBeNull();
      const metadata = JSON.parse(storedNonce.metadata);
      expect(metadata.nonce).toBe(testNonce); // Full nonce, not truncated
      expect(metadata.reused).toBe(false);
      expect(metadata.verifiedAt).toBeDefined();
    });

    test('Should detect replay attack by finding full nonce in database', async () => {
      const testNonce = 'test-nonce-replay-detection-' + Date.now();

      // First use
      await ringSignatureService.verifyNonce(testNonce);

      // Second use should be detected as replay
      const replayCheck = await ringSignatureService.verifyNonce(testNonce);
      expect(replayCheck).toBe(false);

      // Verify replay attempt was logged
      const replayLog = await prisma.anonymousAuditLog.findFirst({
        where: {
          eventType: 'nonce_verification',
          metadata: {
            contains: `"nonce":"${testNonce}"`
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      const metadata = JSON.parse(replayLog.metadata);
      expect(metadata.nonce).toBe(testNonce); // Full nonce in replay log
      expect(metadata.reused).toBe(true);
      expect(metadata.attemptedAt).toBeDefined();
    });

    test('Should handle multiple concurrent nonce verifications', async () => {
      const baseNonce = 'test-nonce-concurrent-' + Date.now();
      const nonces = [
        `${baseNonce}-1`,
        `${baseNonce}-2`,
        `${baseNonce}-3`,
        `${baseNonce}-4`,
        `${baseNonce}-5`
      ];

      // All should succeed
      const results = await Promise.all(
        nonces.map(nonce => ringSignatureService.verifyNonce(nonce))
      );

      expect(results.every(result => result === true)).toBe(true);

      // Verify all were stored with full nonce values
      for (const nonce of nonces) {
        const stored = await prisma.anonymousAuditLog.findFirst({
          where: {
            eventType: 'nonce_verification',
            metadata: {
              contains: `"nonce":"${nonce}"`
            }
          }
        });

        expect(stored).not.toBeNull();
        const metadata = JSON.parse(stored.metadata);
        expect(metadata.nonce).toBe(nonce);
      }
    });
  });

  describe('Key Image Double Spend Protection with Database', () => {
    test('Should store full key image in database for proper lookup', async () => {
      const testKeyImage = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab';

      // First use should succeed
      const firstCheck = await ringSignatureService.checkKeyImage(testKeyImage);
      expect(firstCheck).toBe(true);

      // Verify key image was stored in database with full value
      const storedKeyImage = await prisma.anonymousAuditLog.findFirst({
        where: {
          eventType: 'key_image_verification',
          metadata: {
            contains: `"keyImage":"${testKeyImage}"`
          }
        }
      });

      expect(storedKeyImage).not.toBeNull();
      const metadata = JSON.parse(storedKeyImage.metadata);
      expect(metadata.keyImage).toBe(testKeyImage); // Full key image, not truncated
      expect(metadata.reused).toBe(false);
      expect(metadata.verifiedAt).toBeDefined();
    });

    test('Should detect double spend by finding full key image in database', async () => {
      const testKeyImage = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fe';

      // First use
      await ringSignatureService.checkKeyImage(testKeyImage);

      // Second use should be detected as double spend
      const doubleSpendCheck = await ringSignatureService.checkKeyImage(testKeyImage);
      expect(doubleSpendCheck).toBe(false);

      // Verify double spend attempt was logged
      const doubleSpendLog = await prisma.anonymousAuditLog.findFirst({
        where: {
          eventType: 'key_image_verification',
          metadata: {
            contains: `"keyImage":"${testKeyImage}"`
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      const metadata = JSON.parse(doubleSpendLog.metadata);
      expect(metadata.keyImage).toBe(testKeyImage); // Full key image in double spend log
      expect(metadata.reused).toBe(true);
      expect(metadata.attemptedAt).toBeDefined();
    });

    test('Should handle multiple different key images', async () => {
      const keyImages = [
        '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01',
        '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012',
        '23456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123',
      ];

      // All should succeed
      const results = await Promise.all(
        keyImages.map(ki => ringSignatureService.checkKeyImage(ki))
      );

      expect(results.every(result => result === true)).toBe(true);

      // Verify all were stored with full key image values
      for (const keyImage of keyImages) {
        const stored = await prisma.anonymousAuditLog.findFirst({
          where: {
            eventType: 'key_image_verification',
            metadata: {
              contains: `"keyImage":"${keyImage}"`
            }
          }
        });

        expect(stored).not.toBeNull();
        const metadata = JSON.parse(stored.metadata);
        expect(metadata.keyImage).toBe(keyImage);
      }
    });
  });

  describe('Expired Nonce and Key Image Cleanup', () => {
    test('Should clean up expired nonces', async () => {
      const oldNonce = 'test-old-nonce-' + Date.now();

      // Create an old nonce record (older than 5 minutes)
      const oldTimestamp = new Date(Date.now() - 6 * 60 * 1000);
      await prisma.anonymousAuditLog.create({
        data: {
          eventType: 'nonce_verification',
          metadata: JSON.stringify({
            nonce: oldNonce,
            reused: false,
            verifiedAt: oldTimestamp.toISOString()
          }),
          timestamp: oldTimestamp
        }
      });

      // Verify a new nonce (this should trigger cleanup)
      const newNonce = 'test-new-nonce-' + Date.now();
      await ringSignatureService.verifyNonce(newNonce);

      // The old nonce should have been cleaned up
      // Verify by checking if we can reuse the old nonce
      const canReuseOld = await ringSignatureService.verifyNonce(oldNonce);
      expect(canReuseOld).toBe(true); // Should succeed because old one was cleaned up
    });

    test('Should clean up expired key images', async () => {
      const oldKeyImage = 'old' + 'a'.repeat(64);

      // Create an old key image record (older than 24 hours)
      const oldTimestamp = new Date(Date.now() - 25 * 60 * 60 * 1000);
      await prisma.anonymousAuditLog.create({
        data: {
          eventType: 'key_image_verification',
          metadata: JSON.stringify({
            keyImage: oldKeyImage,
            reused: false,
            verifiedAt: oldTimestamp.toISOString()
          }),
          timestamp: oldTimestamp
        }
      });

      // Check a new key image (this should trigger cleanup)
      const newKeyImage = 'new' + 'b'.repeat(64);
      await ringSignatureService.checkKeyImage(newKeyImage);

      // The old key image should have been cleaned up
      const canReuseOld = await ringSignatureService.checkKeyImage(oldKeyImage);
      expect(canReuseOld).toBe(true); // Should succeed because old one was cleaned up
    });
  });
});
