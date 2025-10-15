const { RingSignatureService } = require('../RingSignatureService');
const { PrismaClient } = require('@prisma/client');

describe('Ring Signature Service Integration Tests', () => {
  let ringSignatureService;

  beforeAll(() => {
    const prisma = new PrismaClient();
    ringSignatureService = new RingSignatureService(prisma);
  });

  afterAll(async () => {
    await ringSignatureService.prisma.$disconnect();
  });

  describe('Replay Protection Tests', () => {
    test('Should prevent replay attacks with nonce reuse', async () => {
      // Test that the same nonce cannot be used twice within the time window
      const nonce = 'test-nonce-replay-protection';
      
      // First use should succeed
      const firstNonceCheck = await ringSignatureService.verifyNonce(nonce);
      expect(firstNonceCheck).toBe(true);
      
      // Second use should fail (replay attack)
      const secondNonceCheck = await ringSignatureService.verifyNonce(nonce);
      expect(secondNonceCheck).toBe(false);
    });

    test('Should prevent double spending with key image reuse', async () => {
      // Test that the same key image cannot be used twice (double spending prevention)
      const keyImage = 'test-key-image-double-spend-protection';
      
      // First use should succeed
      const firstKeyImageCheck = await ringSignatureService.checkKeyImage(keyImage);
      expect(firstKeyImageCheck).toBe(true);
      
      // Second use should fail (double spending attempt)
      const secondKeyImageCheck = await ringSignatureService.checkKeyImage(keyImage);
      expect(secondKeyImageCheck).toBe(false);
    });

    test('Should allow multiple different nonces simultaneously', async () => {
      // Test that multiple different nonces can be used at the same time
      const nonces = ['nonce-1', 'nonce-2', 'nonce-3', 'nonce-4', 'nonce-5'];
      
      // All should be accepted
      const results = await Promise.all(
        nonces.map(nonce => ringSignatureService.verifyNonce(nonce))
      );
      
      expect(results.every(result => result === true)).toBe(true);
      
      // Using any of them again should fail
      const replayResults = await Promise.all(
        nonces.map(nonce => ringSignatureService.verifyNonce(nonce))
      );
      
      expect(replayResults.every(result => result === false)).toBe(true);
    });

    test('Should properly integrate nonce and key image checks in ring signature verification', async () => {
      const publicKey = 'test-pub-key-for-integration';
      const message = 'integration-test-message';
      const ringPublicKeys = [publicKey, 'pub-key-2', 'pub-key-3', 'pub-key-4'];
      
      // Create a properly structured LSAG signature
      const signature = JSON.stringify({
        scheme: 'lsag-secp256k1',
        ringMembers: ringPublicKeys,
        keyImage: 'integration-test-key-image',
        c0: 'c0-hex-value-fits-64-characters-0123456789abcdef',
        s: Array(4).fill().map((_, i) => 
          `s${i}-hex-value-fits-64-characters-0123456789abcdef`
        ),
        messageDigest: require('crypto').createHash('sha256').update(message).digest('hex'),
      });

      // First request with valid signature should succeed
      const firstVerification = await ringSignatureService.verifyRingSignature({
        publicKey,
        signature,
        message,
        ringPublicKeys,
      });
      
      expect(firstVerification).toBe(true);

      // Second request with same signature should fail due to key image reuse
      const secondVerification = await ringSignatureService.verifyRingSignature({
        publicKey,
        signature,
        message,
        ringPublicKeys,
      });
      
      expect(secondVerification).toBe(false);
    });

    test('Should handle timestamp-based replay protection', () => {
      // Test timestamp verification for messages
      const validTimestamp = Date.now(); // Current time
      const futureTimestamp = Date.now() + 60000; // 1 minute in the future
      const oldTimestamp = Date.now() - (6 * 60 * 1000); // 6 minutes ago (older than 5 min limit)

      // Valid timestamp should pass
      const validResult = ringSignatureService.verifyTimestamp(validTimestamp);
      expect(validResult).toBe(true);

      // Future timestamp should fail
      const futureResult = ringSignatureService.verifyTimestamp(futureTimestamp);
      expect(futureResult).toBe(false);

      // Old timestamp should fail (older than 5 minutes)
      const oldResult = ringSignatureService.verifyTimestamp(oldTimestamp);
      expect(oldResult).toBe(false);
    });
  });
});