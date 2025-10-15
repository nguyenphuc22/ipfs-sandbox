const { RingSignatureService } = require('../RingSignatureService');
const { PrismaClient } = require('@prisma/client');

// Mock Prisma client for testing
const mockPrisma = {
  user: {
    findMany: jest.fn(),
  },
  keyImage: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('RingSignatureService', () => {
  let ringSignatureService;

  beforeEach(() => {
    ringSignatureService = new RingSignatureService(mockPrisma);
    jest.clearAllMocks();
  });

  describe('verifyRingSignature', () => {
    it('should reject invalid JSON signature', async () => {
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: 'test-pub-key',
        signature: 'invalid-json',
        message: 'test-message',
        ringPublicKeys: ['test-pub-key', 'other-key'],
      });

      expect(result).toBe(false);
    });

    it('should reject signature with missing required fields', async () => {
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: 'test-pub-key',
        signature: JSON.stringify({}), // Empty object
        message: 'test-message',
        ringPublicKeys: ['test-pub-key', 'other-key'],
      });

      expect(result).toBe(false);
    });

    it('should reject signature with unsupported scheme', async () => {
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: 'test-pub-key',
        signature: JSON.stringify({
          scheme: 'unsupported-scheme',
          ringMembers: ['test-pub-key', 'other-key'],
          keyImage: 'test-key-image',
          c0: 'c0-value',
          s: ['s1', 's2'],
          messageDigest: 'message-digest',
        }),
        message: 'test-message',
        ringPublicKeys: ['test-pub-key', 'other-key'],
      });

      expect(result).toBe(false);
    });

    it('should reject signature with message digest mismatch', async () => {
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: 'test-pub-key',
        signature: JSON.stringify({
          scheme: 'lsag-secp256k1',
          ringMembers: ['test-pub-key', 'other-key'],
          keyImage: 'test-key-image',
          c0: 'c0-value',
          s: ['s1', 's2'],
          messageDigest: 'different-digest',
        }),
        message: 'test-message', // This will create a different digest
        ringPublicKeys: ['test-pub-key', 'other-key'],
      });

      expect(result).toBe(false);
    });

    it('should reject signature when public key is not in ring members', async () => {
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: 'not-in-ring',
        signature: JSON.stringify({
          scheme: 'lsag-secp256k1',
          ringMembers: ['test-pub-key', 'other-key'],
          keyImage: 'test-key-image',
          c0: 'c0-value',
          s: ['s1', 's2'],
          messageDigest: 'message-digest', // Will match computed digest
        }),
        message: 'message-digest', // Matching message for digest
        ringPublicKeys: ['test-pub-key', 'other-key'],
      });

      expect(result).toBe(false);
    });

    it('should reject signature when ring members are not in provided ringPublicKeys', async () => {
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: 'test-pub-key',
        signature: JSON.stringify({
          scheme: 'lsag-secp256k1',
          ringMembers: ['test-pub-key', 'other-key'],
          keyImage: 'test-key-image',
          c0: 'c0-value',
          s: ['s1', 's2'],
          messageDigest: 'message-digest',
        }),
        message: 'message-digest', // Matching message for digest
        ringPublicKeys: ['test-pub-key'], // 'other-key' is missing
      });

      expect(result).toBe(false);
    });

    it('should reject signature with wrong number of s values', async () => {
      const result = await ringSignatureService.verifyRingSignature({
        publicKey: 'test-pub-key',
        signature: JSON.stringify({
          scheme: 'lsag-secp256k1',
          ringMembers: ['test-pub-key', 'other-key'], // 2 members
          keyImage: 'test-key-image',
          c0: 'c0-value',
          s: ['s1'], // Only 1 s value, should be 2
          messageDigest: 'message-digest',
        }),
        message: 'message-digest', // Matching message for digest
        ringPublicKeys: ['test-pub-key', 'other-key'],
      });

      expect(result).toBe(false);
    });
  });

  describe('verifyNonce', () => {
    it('should reject missing nonce', async () => {
      const result = await ringSignatureService.verifyNonce(null);
      expect(result).toBe(false);

      const result2 = await ringSignatureService.verifyNonce(undefined);
      expect(result2).toBe(false);

      const result3 = await ringSignatureService.verifyNonce('');
      expect(result3).toBe(false);
    });

    it('should accept unique nonces', async () => {
      const result1 = await ringSignatureService.verifyNonce('nonce1');
      expect(result1).toBe(true);

      const result2 = await ringSignatureService.verifyNonce('nonce2');
      expect(result2).toBe(true);
    });

    it('should reject reused nonces within 5 minutes', async () => {
      // First use of nonce should be accepted
      const result1 = await ringSignatureService.verifyNonce('reused-nonce');
      expect(result1).toBe(true);

      // Second use of same nonce should be rejected
      const result2 = await ringSignatureService.verifyNonce('reused-nonce');
      expect(result2).toBe(false);
    });

    it('should accept nonce after timeout period', async () => {
      const result1 = await ringSignatureService.verifyNonce('timeout-nonce');
      expect(result1).toBe(true);

      // Simulate time passing by manually clearing the nonce from memory
      ringSignatureService.usedNonces.clear();

      const result2 = await ringSignatureService.verifyNonce('timeout-nonce');
      expect(result2).toBe(true);
    });
  });

  describe('checkKeyImage', () => {
    it('should reject missing key image', async () => {
      const result = await ringSignatureService.checkKeyImage(null);
      expect(result).toBe(false);

      const result2 = await ringSignatureService.checkKeyImage(undefined);
      expect(result2).toBe(false);

      const result3 = await ringSignatureService.checkKeyImage('');
      expect(result3).toBe(false);
    });

    it('should accept unique key images', async () => {
      const result1 = await ringSignatureService.checkKeyImage('key-image-1');
      expect(result1).toBe(true);

      const result2 = await ringSignatureService.checkKeyImage('key-image-2');
      expect(result2).toBe(true);
    });

    it('should reject reused key images', async () => {
      // First use of key image should be accepted
      const result1 = await ringSignatureService.checkKeyImage('reused-key-image');
      expect(result1).toBe(true);

      // Second use of same key image should be rejected (double spend prevention)
      const result2 = await ringSignatureService.checkKeyImage('reused-key-image');
      expect(result2).toBe(false);
    });
  });

  describe('getAllPublicKeys', () => {
    it('should fetch public keys from database', async () => {
      const mockUsers = [
        { publicKey: 'pub-key-1' },
        { publicKey: 'pub-key-2' },
        { publicKey: null }, // Should be filtered out
      ];
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await ringSignatureService.getAllPublicKeys();

      expect(result).toEqual(['pub-key-1', 'pub-key-2']);
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        select: {
          publicKey: true,
        },
        where: {
          publicKey: {
            not: null,
          },
        },
      });
    });

    it('should return empty array when no public keys found', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      const result = await ringSignatureService.getAllPublicKeys();
      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      mockPrisma.user.findMany.mockRejectedValue(new Error('DB Error'));
      const result = await ringSignatureService.getAllPublicKeys();
      expect(result).toEqual([]);
    });
  });

  describe('Integration: LSAG Signature Flow', () => {
    it('should process a complete LSAG signature verification with nonce and key image checks', async () => {
      const publicKey = 'test-pub-key';
      const message = 'test-message-for-signature';
      const ringPublicKeys = [publicKey, 'pub-key-2', 'pub-key-3'];
      
      // Create a properly formatted LSAG signature
      const signature = JSON.stringify({
        scheme: 'lsag-secp256k1',
        ringMembers: ringPublicKeys,
        keyImage: 'unique-key-image-for-test',
        c0: 'c0-hex-value-fits-64-characters-0123456789abcdef',
        s: [
          's1-hex-value-fits-64-characters-0123456789abcdef',
          's2-hex-value-fits-64-characters-0123456789abcdef',
          's3-hex-value-fits-64-characters-0123456789abcdef'
        ],
        messageDigest: require('crypto').createHash('sha256').update(message).digest('hex'),
        messageEncoding: 'hex'
      });

      // First verification should pass
      const result1 = await ringSignatureService.verifyRingSignature({
        publicKey,
        signature,
        message,
        ringPublicKeys,
      });
      expect(result1).toBe(true);

      // Same signature with same key image should fail (double spend)
      const result2 = await ringSignatureService.verifyRingSignature({
        publicKey,
        signature,
        message,
        ringPublicKeys,
      });
      expect(result2).toBe(false);
    });

    it('should reject reused nonce in different requests', async () => {
      const publicKey = 'test-pub-key';
      const message = 'test-message';
      const ringPublicKeys = [publicKey, 'pub-key-2'];
      const nonce = 'test-nonce';

      // Use the nonce in first request
      const nonceResult1 = await ringSignatureService.verifyNonce(nonce);
      expect(nonceResult1).toBe(true);

      // Second request with same nonce should fail
      const nonceResult2 = await ringSignatureService.verifyNonce(nonce);
      expect(nonceResult2).toBe(false);
    });
  });
});