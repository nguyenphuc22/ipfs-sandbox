const crypto = require('crypto');
const { RingSignatureService } = require('../RingSignatureService');

jest.mock('../../utils/aotStorage', () => ({
  getRingContext: jest.fn(),
}));

const { getRingContext } = require('../../utils/aotStorage');

// Mock Prisma client for testing
const mockPrisma = {
  file: {
    findMany: jest.fn(),
  },
  anonymousAuditLog: {
    findFirst: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(),
  },
  $executeRaw: jest.fn(),
};

describe('RingSignatureService', () => {
  let ringSignatureService;

  beforeEach(() => {
    ringSignatureService = new RingSignatureService(mockPrisma);
    jest.clearAllMocks();

    const auditLogEntries = [];
    const storedNonces = new Map();
    const storedKeyImages = new Map();

    const toDate = (value) => (value instanceof Date ? value : new Date(value));

    const matchesWhere = (entry, where = {}) => {
      if (!where || Object.keys(where).length === 0) {
        return true;
      }

      const { OR, AND, NOT, eventType, publicKeyHash, fileId, metadata, timestamp, ...rest } = where;

      if (Object.keys(rest).length > 0) {
        for (const key of Object.keys(rest)) {
          if (entry[key] !== rest[key]) {
            return false;
          }
        }
      }

      if (eventType && entry.eventType !== eventType) {
        return false;
      }

      if (publicKeyHash && entry.publicKeyHash !== publicKeyHash) {
        return false;
      }

      if (fileId && entry.fileId !== fileId) {
        return false;
      }

      if (metadata?.contains) {
        const target = typeof entry.metadata === 'string' ? entry.metadata : JSON.stringify(entry.metadata);
        if (!target || !target.includes(metadata.contains)) {
          return false;
        }
      }

      if (timestamp) {
        const value = toDate(entry.timestamp);
        if (timestamp.gte && value < timestamp.gte) {
          return false;
        }
        if (timestamp.gt && value <= timestamp.gt) {
          return false;
        }
        if (timestamp.lte && value > timestamp.lte) {
          return false;
        }
        if (timestamp.lt && value >= timestamp.lt) {
          return false;
        }
      }

      if (Array.isArray(AND) && !AND.every((clause) => matchesWhere(entry, clause))) {
        return false;
      }

      if (Array.isArray(OR) && !OR.some((clause) => matchesWhere(entry, clause))) {
        return false;
      }

      if (Array.isArray(NOT) && NOT.some((clause) => matchesWhere(entry, clause))) {
        return false;
      }

      return true;
    };

    const applyOrder = (entries, orderBy) => {
      if (!orderBy) {
        return entries;
      }

      const specs = Array.isArray(orderBy) ? orderBy : [orderBy];

      return [...entries].sort((a, b) => {
        for (const spec of specs) {
          const [field, direction] = Object.entries(spec)[0];
          if (field === 'timestamp') {
            const aTime = toDate(a.timestamp).getTime();
            const bTime = toDate(b.timestamp).getTime();
            if (aTime === bTime) {
              continue;
            }
            return direction === 'desc' ? bTime - aTime : aTime - bTime;
          }
          if (a[field] === b[field]) {
            continue;
          }
          if (a[field] === undefined) {
            return 1;
          }
          if (b[field] === undefined) {
            return -1;
          }
          return direction === 'desc' ? (b[field] > a[field] ? 1 : -1) : (a[field] > b[field] ? 1 : -1);
        }
        return 0;
      });
    };

    const cloneEntry = (entry) => ({
      ...entry,
      timestamp: toDate(entry.timestamp),
    });

    const updateReplayCaches = (entry) => {
      const parsed = typeof entry.metadata === 'string' ? safeParseJson(entry.metadata) : entry.metadata;
      if (entry.eventType === 'nonce_verification' && parsed?.nonce) {
        storedNonces.set(parsed.nonce, { timestamp: toDate(entry.timestamp), reused: parsed.reused === true });
      }
      if (entry.eventType === 'key_image_verification' && parsed?.keyImage) {
        storedKeyImages.set(parsed.keyImage, { timestamp: toDate(entry.timestamp), reused: parsed.reused === true });
      }
    };

    const rebuildReplayCaches = () => {
      storedNonces.clear();
      storedKeyImages.clear();
      auditLogEntries.forEach(updateReplayCaches);
    };

    getRingContext.mockReturnValue({ ringMemberPublicKeys: [] });
    mockPrisma.file.findMany.mockResolvedValue([]);
    mockPrisma.$executeRaw.mockResolvedValue(0);

    mockPrisma.anonymousAuditLog.findFirst.mockImplementation(async ({ where, orderBy } = {}) => {
      const matches = auditLogEntries.filter((entry) => matchesWhere(entry, where));
      if (matches.length === 0) {
        return null;
      }
      const [first] = applyOrder(matches, orderBy);
      return first ? cloneEntry(first) : null;
    });

    mockPrisma.anonymousAuditLog.create.mockImplementation(async ({ data }) => {
      const entry = {
        ...data,
        timestamp: toDate(data.timestamp || new Date()),
      };
      auditLogEntries.push(entry);
      updateReplayCaches(entry);
      return cloneEntry(entry);
    });

    mockPrisma.anonymousAuditLog.deleteMany.mockImplementation(async ({ where } = {}) => {
      const initialCount = auditLogEntries.length;
      if (!where || Object.keys(where).length === 0) {
        auditLogEntries.length = 0;
        rebuildReplayCaches();
        return { count: initialCount };
      }

      const remaining = auditLogEntries.filter((entry) => !matchesWhere(entry, where));
      const deletedCount = initialCount - remaining.length;
      auditLogEntries.length = 0;
      auditLogEntries.push(...remaining);
      rebuildReplayCaches();
      return { count: deletedCount };
    });

    mockPrisma.anonymousAuditLog.findMany.mockImplementation(async ({ where, orderBy } = {}) => {
      const matches = auditLogEntries.filter((entry) => matchesWhere(entry, where));
      const ordered = applyOrder(matches, orderBy);
      return ordered.map(cloneEntry);
    });
  });

  function safeParseJson(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

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
      await mockPrisma.anonymousAuditLog.deleteMany({
        where: {
          timestamp: {
            lt: new Date(Date.now() + ringSignatureService.NONCE_TTL_MS + 1000),
          },
        },
      });

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

    it('should reject reused key images but record reuse metadata', async () => {
      const keyImage = 'reused-key-image';

      // First use of key image should be accepted and stored
      const firstResult = await ringSignatureService.checkKeyImage(keyImage);
      expect(firstResult).toBe(true);

      // Second use should be rejected but mark the reuse in audit log
      const secondResult = await ringSignatureService.checkKeyImage(keyImage);
      expect(secondResult).toBe(false);

      const createCalls = mockPrisma.anonymousAuditLog.create.mock.calls;
      expect(createCalls.length).toBeGreaterThanOrEqual(2);

      const reuseEntry = createCalls[createCalls.length - 1][0];
      const metadata = JSON.parse(reuseEntry.data.metadata);
      expect(metadata).toMatchObject({ keyImage, reused: true });
    });
  });

  describe('getAllPublicKeys', () => {
    it('should fetch public keys from database', async () => {
      getRingContext.mockReturnValue({
        ringMemberPublicKeys: ['pub-key-1', 'pub-key-2'],
      });
      mockPrisma.file.findMany.mockResolvedValue([
        { ownershipPublicKey: 'pub-key-2' },
        { ownershipPublicKey: 'pub-key-3' },
        { ownershipPublicKey: null },
      ]);

      const result = await ringSignatureService.getAllPublicKeys();

      expect(result).toEqual(['pub-key-1', 'pub-key-2', 'pub-key-3']);
      expect(getRingContext).toHaveBeenCalled();
      expect(mockPrisma.file.findMany).toHaveBeenCalledWith({
        select: {
          ownershipPublicKey: true,
        },
      });
    });

    it('should return empty array when no public keys found', async () => {
      getRingContext.mockReturnValue({ ringMemberPublicKeys: [] });
      mockPrisma.file.findMany.mockResolvedValue([]);
      const result = await ringSignatureService.getAllPublicKeys();
      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      getRingContext.mockImplementation(() => { throw new Error('storage error'); });
      mockPrisma.file.findMany.mockResolvedValue([]);
      const result = await ringSignatureService.getAllPublicKeys();
      expect(result).toEqual([]);
    });
  });

  describe('Integration: LSAG Signature Flow', () => {
    it('should process a complete LSAG signature verification with nonce and key image checks', async () => {
      const publicKey = `02${'aa'.repeat(32)}`;
      const message = 'test-message-for-signature';
      const ringPublicKeys = [
        publicKey,
        `03${'bb'.repeat(32)}`,
        `02${'cc'.repeat(32)}`,
      ];

      const signaturePayload = {
        scheme: 'lsag-secp256k1',
        ringMembers: ringPublicKeys,
        keyImage: `02${'dd'.repeat(32)}`,
        c0: crypto.randomBytes(32).toString('hex'),
        s: ringPublicKeys.map(() => crypto.randomBytes(32).toString('hex')),
        messageDigest: crypto.createHash('sha256').update(message).digest('hex'),
        messageEncoding: 'hex',
      };
      const signature = JSON.stringify(signaturePayload);

      const verifySpy = jest
        .spyOn(ringSignatureService, 'verifyLsagSignature')
        .mockResolvedValue(true);

      try {
        const result1 = await ringSignatureService.verifyRingSignature({
          publicKey,
          signature,
          message,
          ringPublicKeys,
        });
        expect(result1).toBe(true);

        const result2 = await ringSignatureService.verifyRingSignature({
          publicKey,
          signature,
          message,
          ringPublicKeys,
        });
  expect(result2).toBe(false);

        const createCalls = mockPrisma.anonymousAuditLog.create.mock.calls;
        const reuseEntry = createCalls[createCalls.length - 1][0];
        const metadata = JSON.parse(reuseEntry.data.metadata);
        expect(metadata).toMatchObject({ keyImage: signaturePayload.keyImage, reused: true });
      } finally {
        verifySpy.mockRestore();
      }
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
