/**
 * Real Cryptography Tests for RingSignatureService
 *
 * These tests use actual LSAG signatures with proper elliptic curve cryptography
 * to verify the ring signature implementation works correctly.
 */

const { RingSignatureService } = require('../RingSignatureService');
const { createLsagRingSignature, derivePublicKeyFromPrivateKey } = require('../../utils/ringSignature');
const { PrismaClient } = require('@prisma/client');

describe('RingSignatureService - Real Cryptography Tests', () => {
  let ringSignatureService;
  let prisma;

  // Test private keys (32 bytes hex)
  const privateKeys = [
    'a'.repeat(64),  // Private key 1
    'b'.repeat(64),  // Private key 2
    'c'.repeat(64),  // Private key 3
    'd'.repeat(64),  // Private key 4
  ];

  let publicKeys = [];

  beforeAll(async () => {
    // Generate public keys from private keys
    for (const privateKey of privateKeys) {
      const publicKey = await derivePublicKeyFromPrivateKey(privateKey);
      publicKeys.push(publicKey);
    }

    prisma = new PrismaClient();
    ringSignatureService = new RingSignatureService(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up audit logs before each test
    await prisma.anonymousAuditLog.deleteMany({});
    ringSignatureService.usedNonces.clear();
    ringSignatureService.usedKeyImages.clear();
  });

  describe('Real LSAG Signature Verification', () => {
    test('should verify a valid LSAG signature', async () => {
      const message = 'Test message for ring signature';
      const signerIndex = 1; // Use the second key as signer

      // Create a real LSAG signature
      const signature = await createLsagRingSignature({
        message,
        ringPublicKeys: publicKeys,
        signerIndex,
        signerPrivateKey: privateKeys[signerIndex],
      });

      // Verify the signature
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: publicKeys[signerIndex],
        signature: JSON.stringify(signature),
        message,
        ringPublicKeys: publicKeys,
      });

      expect(result).toBe(true);
    });

    test('should reject signature with wrong message', async () => {
      const originalMessage = 'Original message';
      const wrongMessage = 'Wrong message';
      const signerIndex = 0;

      // Create signature with original message
      const signature = await createLsagRingSignature({
        message: originalMessage,
        ringPublicKeys: publicKeys,
        signerIndex,
        signerPrivateKey: privateKeys[signerIndex],
      });

      // Try to verify with wrong message
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: publicKeys[signerIndex],
        signature: JSON.stringify(signature),
        message: wrongMessage,
        ringPublicKeys: publicKeys,
      });

      expect(result).toBe(false);
    });

    test('should reject signature with tampered ring members', async () => {
      const message = 'Test message';
      const signerIndex = 2;

      // Create signature
      const signature = await createLsagRingSignature({
        message,
        ringPublicKeys: publicKeys,
        signerIndex,
        signerPrivateKey: privateKeys[signerIndex],
      });

      // Tamper with ring members
      const tamperedSignature = JSON.parse(JSON.stringify(signature));
      tamperedSignature.ringMembers[0] = 'e'.repeat(64); // Replace first member

      // Verification should fail
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: publicKeys[signerIndex],
        signature: JSON.stringify(tamperedSignature),
        message,
        ringPublicKeys: [tamperedSignature.ringMembers[0], ...publicKeys.slice(1)],
      });

      expect(result).toBe(false);
    });
  });

  describe('Key Image Double-Spend Prevention', () => {
    test('should prevent reusing the same key image', async () => {
      const message1 = 'First message';
      const message2 = 'Second message';
      const signerIndex = 1;

      // Create first signature
      const signature1 = await createLsagRingSignature({
        message: message1,
        ringPublicKeys: publicKeys,
        signerIndex,
        signerPrivateKey: privateKeys[signerIndex],
      });

      // First verification should succeed
      const result1 = await ringSignatureService.verifyRingSignature({
        publicKey: publicKeys[signerIndex],
        signature: JSON.stringify(signature1),
        message: message1,
        ringPublicKeys: publicKeys,
      });

      expect(result1).toBe(true);

      // Create second signature with same private key (same key image)
      const signature2 = await createLsagRingSignature({
        message: message2,
        ringPublicKeys: publicKeys,
        signerIndex,
        signerPrivateKey: privateKeys[signerIndex],
      });

      // Key images should be the same
      expect(signature1.keyImage).toBe(signature2.keyImage);

      // Second verification should fail due to key image reuse
      const result2 = await ringSignatureService.verifyRingSignature({
        publicKey: publicKeys[signerIndex],
        signature: JSON.stringify(signature2),
        message: message2,
        ringPublicKeys: publicKeys,
      });

      expect(result2).toBe(false);

      // Check that key image reuse was logged
      const auditLogs = await prisma.anonymousAuditLog.findMany({
        where: {
          eventType: 'key_image_verification',
        },
      });

      // Should have at least 2 logs: one for successful verification, one for reuse attempt
      expect(auditLogs.length).toBeGreaterThanOrEqual(2);

      const reuseLog = auditLogs.find(log => {
        const metadata = JSON.parse(log.metadata);
        return metadata.reused === true;
      });

      expect(reuseLog).toBeDefined();
    });

    test('should allow different users to sign with their own keys', async () => {
      const message = 'Shared message';

      // User 1 signs
      const signature1 = await createLsagRingSignature({
        message,
        ringPublicKeys: publicKeys,
        signerIndex: 0,
        signerPrivateKey: privateKeys[0],
      });

      // User 2 signs the same message
      const signature2 = await createLsagRingSignature({
        message,
        ringPublicKeys: publicKeys,
        signerIndex: 1,
        signerPrivateKey: privateKeys[1],
      });

      // Key images should be different
      expect(signature1.keyImage).not.toBe(signature2.keyImage);

      // Both verifications should succeed
      const result1 = await ringSignatureService.verifyRingSignature({
        publicKey: publicKeys[0],
        signature: JSON.stringify(signature1),
        message,
        ringPublicKeys: publicKeys,
      });

      expect(result1).toBe(true);

      const result2 = await ringSignatureService.verifyRingSignature({
        publicKey: publicKeys[1],
        signature: JSON.stringify(signature2),
        message,
        ringPublicKeys: publicKeys,
      });

      expect(result2).toBe(true);
    });
  });

  describe('Nonce Replay Protection', () => {
    test('should prevent nonce reuse within 5 minutes', async () => {
      const nonce1 = 'unique-nonce-12345';
      const nonce2 = 'another-nonce-67890';

      // First nonce should be accepted
      const result1 = await ringSignatureService.verifyNonce(nonce1);
      expect(result1).toBe(true);

      // Different nonce should be accepted
      const result2 = await ringSignatureService.verifyNonce(nonce2);
      expect(result2).toBe(true);

      // Reusing first nonce should be rejected
      const result3 = await ringSignatureService.verifyNonce(nonce1);
      expect(result3).toBe(false);

      // Reusing second nonce should be rejected
      const result4 = await ringSignatureService.verifyNonce(nonce2);
      expect(result4).toBe(false);

      // Check audit logs
      const auditLogs = await prisma.anonymousAuditLog.findMany({
        where: {
          eventType: 'nonce_verification',
        },
      });

      // Should have 6 logs: 2 accepted + 2 reused attempts with their respective logs
      expect(auditLogs.length).toBeGreaterThanOrEqual(4);

      const reuseLogs = auditLogs.filter(log => {
        const metadata = JSON.parse(log.metadata);
        return metadata.reused === true;
      });

      expect(reuseLogs.length).toBe(2);
    });

    test('should clean up expired nonces from database', async () => {
      const nonce = 'test-nonce-for-cleanup';

      // Use the nonce
      await ringSignatureService.verifyNonce(nonce);

      // Manually expire the nonce by updating its timestamp
      const fiveMinutesAgo = new Date(Date.now() - (6 * 60 * 1000)); // 6 minutes ago

      await prisma.anonymousAuditLog.updateMany({
        where: {
          eventType: 'nonce_verification',
          metadata: {
            contains: `"nonce":"${nonce.substring(0, 16)}"`
          }
        },
        data: {
          timestamp: fiveMinutesAgo
        }
      });

      // Using a new nonce should trigger cleanup
      await ringSignatureService.verifyNonce('trigger-cleanup-nonce');

      // Now the expired nonce should be gone
      const expiredNonces = await prisma.anonymousAuditLog.findMany({
        where: {
          eventType: 'nonce_verification',
          timestamp: {
            lt: new Date(Date.now() - (5 * 60 * 1000))
          }
        }
      });

      // Should have cleaned up expired nonces
      expect(expiredNonces.length).toBe(0);
    });
  });

  describe('Timestamp Verification', () => {
    test('should accept current timestamp', () => {
      const now = Date.now();
      const result = ringSignatureService.verifyTimestamp(now);
      expect(result).toBe(true);
    });

    test('should accept timestamp within 5 minutes', () => {
      const fourMinutesAgo = Date.now() - (4 * 60 * 1000);
      const result = ringSignatureService.verifyTimestamp(fourMinutesAgo);
      expect(result).toBe(true);
    });

    test('should reject timestamp older than 5 minutes', () => {
      const sixMinutesAgo = Date.now() - (6 * 60 * 1000);
      const result = ringSignatureService.verifyTimestamp(sixMinutesAgo);
      expect(result).toBe(false);
    });

    test('should reject future timestamp', () => {
      const oneMinuteInFuture = Date.now() + (1 * 60 * 1000);
      const result = ringSignatureService.verifyTimestamp(oneMinuteInFuture);
      expect(result).toBe(false);
    });

    test('should allow custom maxAge parameter', () => {
      const tenMinutesAgo = Date.now() - (10 * 60 * 1000);

      // Should fail with default 5 minute window
      const result1 = ringSignatureService.verifyTimestamp(tenMinutesAgo);
      expect(result1).toBe(false);

      // Should pass with 15 minute window
      const result2 = ringSignatureService.verifyTimestamp(tenMinutesAgo, 15 * 60 * 1000);
      expect(result2).toBe(true);
    });
  });

  describe('Complete Anonymous File Access Flow', () => {
    test('should verify full anonymous access flow with ring signature, nonce, and key image', async () => {
      const message = JSON.stringify({
        action: 'access_file',
        fileId: 'test-file-123',
        timestamp: Date.now(),
        nonce: 'unique-access-nonce-' + Date.now(),
      });

      const messageData = JSON.parse(message);
      const signerIndex = 2;

      // Step 1: Verify timestamp
      const timestampValid = ringSignatureService.verifyTimestamp(messageData.timestamp);
      expect(timestampValid).toBe(true);

      // Step 2: Verify nonce uniqueness
      const nonceValid = await ringSignatureService.verifyNonce(messageData.nonce);
      expect(nonceValid).toBe(true);

      // Step 3: Create and verify ring signature
      const signature = await createLsagRingSignature({
        message,
        ringPublicKeys: publicKeys,
        signerIndex,
        signerPrivateKey: privateKeys[signerIndex],
      });

      const signatureValid = await ringSignatureService.verifyRingSignature({
        publicKey: publicKeys[signerIndex],
        signature: JSON.stringify(signature),
        message,
        ringPublicKeys: publicKeys,
      });

      expect(signatureValid).toBe(true);

      // Step 4: Verify replay attack is prevented
      const replayTimestamp = ringSignatureService.verifyTimestamp(messageData.timestamp);
      const replayNonce = await ringSignatureService.verifyNonce(messageData.nonce);

      // Timestamp still valid (within 5 minutes)
      expect(replayTimestamp).toBe(true);
      // Nonce should be rejected (already used)
      expect(replayNonce).toBe(false);

      // Step 5: Verify second access attempt with same key (double spend) is prevented
      const message2 = JSON.stringify({
        action: 'access_file',
        fileId: 'test-file-456',  // Different file
        timestamp: Date.now(),
        nonce: 'different-nonce-' + Date.now(),
      });

      const signature2 = await createLsagRingSignature({
        message: message2,
        ringPublicKeys: publicKeys,
        signerIndex,
        signerPrivateKey: privateKeys[signerIndex],  // Same private key
      });

      // Key image should be the same
      expect(signature2.keyImage).toBe(signature.keyImage);

      // Verification should fail due to key image reuse
      const signatureValid2 = await ringSignatureService.verifyRingSignature({
        publicKey: publicKeys[signerIndex],
        signature: JSON.stringify(signature2),
        message: message2,
        ringPublicKeys: publicKeys,
      });

      expect(signatureValid2).toBe(false);
    });
  });
});
