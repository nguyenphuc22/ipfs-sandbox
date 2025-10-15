/**
 * End-to-End Test for Anonymous File Flow
 *
 * Tests the complete anonymous download flow:
 * 1. Upload file anonymously
 * 2. Share file with another user (using publicKeyHash)
 * 3. Download file chunks
 * 4. Report integrity alert
 * 5. Revoke access (hash-based)
 * 6. Verify audit logs don't leak userId
 */

const { PrismaClient } = require('@prisma/client');
const { FileAccessService } = require('../FileAccessService');
const { RingSignatureService } = require('../RingSignatureService');
const { revocationService } = require('../revocationService');
const crypto = require('crypto');

describe('Anonymous File Flow E2E Tests', () => {
  let prisma;
  let fileAccessService;
  let ringSignatureService;
  let testFileId;
  let testPublicKey1;
  let testPublicKey2;
  let testPublicKeyHash1;
  let testPublicKeyHash2;
  let testUserId1;
  let testUserId2;

  beforeAll(async () => {
    prisma = new PrismaClient();
    ringSignatureService = new RingSignatureService(prisma);
    fileAccessService = new FileAccessService(ringSignatureService, prisma);

    // Generate test keys
    testPublicKey1 = crypto.randomBytes(32).toString('hex');
    testPublicKey2 = crypto.randomBytes(32).toString('hex');
    testPublicKeyHash1 = ringSignatureService.hashPublicKey(testPublicKey1);
    testPublicKeyHash2 = ringSignatureService.hashPublicKey(testPublicKey2);

    // Register test users in the ring
    const user1 = await prisma.user.upsert({
      where: { publicKey: testPublicKey1 },
      update: {},
      create: {
        publicKey: testPublicKey1,
        displayLabel: 'E2E Test User 1',
        role: 'user',
      },
    });

    const user2 = await prisma.user.upsert({
      where: { publicKey: testPublicKey2 },
      update: {},
      create: {
        publicKey: testPublicKey2,
        displayLabel: 'E2E Test User 2',
        role: 'user',
      },
    });

    // Store user IDs for creating files (internal use only, not exposed in API)
    testUserId1 = user1.id;
    testUserId2 = user2.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testFileId) {
      await prisma.integrityAlert.deleteMany({
        where: { fileId: testFileId },
      });

      await prisma.anonymousFileAccess.deleteMany({
        where: { fileId: testFileId },
      });

      await prisma.fileChunk.deleteMany({
        where: { fileId: testFileId },
      });

      await prisma.file.deleteMany({
        where: { id: testFileId },
      });
    }

    // Clean up test users and audit logs
    await prisma.anonymousAuditLog.deleteMany({
      where: {
        OR: [
          { publicKeyHash: testPublicKeyHash1 },
          { publicKeyHash: testPublicKeyHash2 },
        ],
      },
    });

    await prisma.user.deleteMany({
      where: {
        OR: [
          { publicKey: testPublicKey1 },
          { publicKey: testPublicKey2 },
        ],
      },
    });

    await prisma.$disconnect();
  });

  describe('Phase 1: Anonymous File Upload', () => {
    test('Should create file with ownership using publicKey (no userId)', async () => {
      // Create a test file
      const file = await prisma.file.create({
        data: {
          id: crypto.randomBytes(16).toString('hex'),
          fileName: 'e2e-test-file.txt',
          totalSize: 1024,
          chunkCount: 2,
          mimeType: 'text/plain',
          ownershipPublicKey: testPublicKey1,
          uploaderId: testUserId1, // Internal field, not exposed in API
          metadataHash: crypto.createHash('sha256').update('test-metadata').digest('hex'),
          encryptedChunkKeys: JSON.stringify({ encrypted: 'test-keys' }),
          status: 'active',
        },
      });

      testFileId = file.id;

      // Create chunks
      await prisma.fileChunk.createMany({
        data: [
          {
            fileId: testFileId,
            chunkIndex: 0,
            ipfsCid: 'Qm' + crypto.randomBytes(44).toString('hex'),
            size: 512,
            chunkHash: crypto.createHash('sha256').update('chunk0').digest('hex'),
          },
          {
            fileId: testFileId,
            chunkIndex: 1,
            ipfsCid: 'Qm' + crypto.randomBytes(44).toString('hex'),
            size: 512,
            chunkHash: crypto.createHash('sha256').update('chunk1').digest('hex'),
          },
        ],
      });

      // Verify file was created with publicKey, not userId
      expect(file.ownershipPublicKey).toBe(testPublicKey1);
      expect(file).not.toHaveProperty('userId');
      expect(file).not.toHaveProperty('ownerUserId');
    });
  });

  describe('Phase 2: Anonymous File Sharing (hash-based)', () => {
    test('Should grant access using publicKeyHash (not userId)', async () => {
      // Grant access to testPublicKey2
      const accessGrant = await prisma.anonymousFileAccess.create({
        data: {
          fileId: testFileId,
          accessorPublicKeyHash: testPublicKeyHash2,
          status: 'active',
          grantedAt: new Date(),
          accessCount: 0,
        },
      });

      // Verify access grant uses publicKeyHash, not userId
      expect(accessGrant.accessorPublicKeyHash).toBe(testPublicKeyHash2);
      expect(accessGrant).not.toHaveProperty('userId');
      expect(accessGrant).not.toHaveProperty('grantedByUserId');
    });
  });

  describe('Phase 3: Anonymous File Listing', () => {
    test('Should list accessible files without exposing userId', async () => {
      const timestamp = Date.now();
      const nonce = crypto.randomBytes(16).toString('hex');

      // Create mock ring signature
      const mockSignature = JSON.stringify({
        scheme: 'lsag-secp256k1',
        ringMembers: [testPublicKey2, testPublicKey1],
        keyImage: `key-image-list-${nonce}`,
        c0: crypto.randomBytes(32).toString('hex'),
        s: [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')],
        messageDigest: crypto.createHash('sha256').update(`list-files:${timestamp}:${nonce}`).digest('hex'),
      });

      const files = await fileAccessService.listAccessibleFiles({
        publicKey: testPublicKey2,
        ringSignature: mockSignature,
        timestamp,
        nonce,
      });

      // Verify returned files don't contain userId
      expect(files.length).toBeGreaterThan(0);
      files.forEach(file => {
        expect(file).not.toHaveProperty('userId');
        expect(file).not.toHaveProperty('ownerUserId');
        expect(file).toHaveProperty('ownerPublicKey');
        expect(file).toHaveProperty('fileId');
      });

      // Verify audit log was created without userId
      const auditLog = await prisma.anonymousAuditLog.findFirst({
        where: {
          eventType: 'file_list_query',
          publicKeyHash: testPublicKeyHash2,
        },
        orderBy: { timestamp: 'desc' },
      });

      expect(auditLog).not.toBeNull();
      expect(auditLog.publicKeyHash).toBe(testPublicKeyHash2);
      expect(auditLog).not.toHaveProperty('userId');

      // Verify metadata doesn't contain userId
      const metadata = JSON.parse(auditLog.metadata);
      expect(metadata).not.toHaveProperty('userId');
      expect(metadata).not.toHaveProperty('ownerUserId');
    });
  });

  describe('Phase 4: Anonymous File Download (Access Negotiation)', () => {
    test('Should negotiate access and get chunk manifest without userId', async () => {
      const timestamp = Date.now();
      const nonce = crypto.randomBytes(16).toString('hex');

      // Create mock ring signature
      const mockSignature = JSON.stringify({
        scheme: 'lsag-secp256k1',
        ringMembers: [testPublicKey2, testPublicKey1],
        keyImage: `key-image-access-${nonce}`,
        c0: crypto.randomBytes(32).toString('hex'),
        s: [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')],
        messageDigest: crypto.createHash('sha256').update(`access:${testFileId}:${timestamp}:${nonce}`).digest('hex'),
      });

      const accessManifest = await fileAccessService.negotiateAccess({
        fileId: testFileId,
        publicKey: testPublicKey2,
        ringSignature: mockSignature,
        timestamp,
        nonce,
      });

      // Verify manifest doesn't contain userId
      expect(accessManifest).toHaveProperty('file');
      expect(accessManifest).toHaveProperty('chunkManifest');
      expect(accessManifest).toHaveProperty('ownershipPolicy');
      expect(accessManifest).not.toHaveProperty('userId');
      expect(accessManifest.file).not.toHaveProperty('userId');
      expect(accessManifest.ownershipPolicy).toHaveProperty('publicKey');
      expect(accessManifest.ownershipPolicy).not.toHaveProperty('userId');

      // Verify audit log was created without userId
      const auditLog = await prisma.anonymousAuditLog.findFirst({
        where: {
          eventType: 'access_negotiation',
          fileId: testFileId,
          publicKeyHash: testPublicKeyHash2,
        },
        orderBy: { timestamp: 'desc' },
      });

      expect(auditLog).not.toBeNull();
      expect(auditLog.publicKeyHash).toBe(testPublicKeyHash2);
      expect(auditLog).not.toHaveProperty('userId');

      // Verify metadata doesn't contain userId
      const metadata = JSON.parse(auditLog.metadata);
      expect(metadata).not.toHaveProperty('userId');
    });
  });

  describe('Phase 5: Integrity Alert Reporting', () => {
    test('Should report integrity alert without exposing userId', async () => {
      const timestamp = Date.now();
      const nonce = crypto.randomBytes(16).toString('hex');
      const expectedHash = crypto.createHash('sha256').update('chunk0').digest('hex');
      const actualHash = crypto.createHash('sha256').update('corrupted').digest('hex');

      // Create mock ring signature
      const mockSignature = JSON.stringify({
        scheme: 'lsag-secp256k1',
        ringMembers: [testPublicKey2, testPublicKey1],
        keyImage: `key-image-alert-${nonce}`,
        c0: crypto.randomBytes(32).toString('hex'),
        s: [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')],
        messageDigest: crypto.createHash('sha256').update(`integrity-alert:${testFileId}:0:${timestamp}:${nonce}`).digest('hex'),
      });

      await fileAccessService.reportIntegrityAlert({
        fileId: testFileId,
        publicKey: testPublicKey2,
        ringSignature: mockSignature,
        chunkIndex: 0,
        expectedHash,
        actualHash,
        retryCount: 3,
        timestamp,
        nonce,
      });

      // Verify integrity alert was created with publicKeyHash, not userId
      const alert = await prisma.integrityAlert.findFirst({
        where: {
          fileId: testFileId,
          chunkIndex: 0,
        },
      });

      expect(alert).not.toBeNull();
      expect(alert.reportedByPublicKeyHash).toBe(testPublicKeyHash2);
      expect(alert).not.toHaveProperty('reportedByUserId');
      expect(alert).not.toHaveProperty('userId');

      // Verify audit log doesn't contain userId
      const auditLog = await prisma.anonymousAuditLog.findFirst({
        where: {
          eventType: 'integrity_alert',
          fileId: testFileId,
          publicKeyHash: testPublicKeyHash2,
        },
        orderBy: { timestamp: 'desc' },
      });

      expect(auditLog).not.toBeNull();
      expect(auditLog.publicKeyHash).toBe(testPublicKeyHash2);
      expect(auditLog).not.toHaveProperty('userId');

      // Verify metadata doesn't contain userId
      const metadata = JSON.parse(auditLog.metadata);
      expect(metadata).not.toHaveProperty('userId');
      expect(metadata).not.toHaveProperty('reportedByUserId');
    });
  });

  describe('Phase 6: Access Revocation (hash-based)', () => {
    test('Should revoke access using publicKeyHash (not userId)', async () => {
      // Revoke access for testPublicKey2
      await revocationService.revokeAccessByPublicKeyHash(
        testFileId,
        testPublicKeyHash2,
        'integrity_violation'
      );

      // Verify access was revoked
      const accessGrant = await prisma.anonymousFileAccess.findFirst({
        where: {
          fileId: testFileId,
          accessorPublicKeyHash: testPublicKeyHash2,
        },
      });

      expect(accessGrant).not.toBeNull();
      expect(accessGrant.status).toBe('revoked');
      expect(accessGrant).not.toHaveProperty('userId');

      // Verify revocation record uses publicKeyHash
      const revocation = await prisma.anonymousRevocation.findFirst({
        where: {
          fileId: testFileId,
          revokedPublicKeyHash: testPublicKeyHash2,
        },
      });

      expect(revocation).not.toBeNull();
      expect(revocation.revokedPublicKeyHash).toBe(testPublicKeyHash2);
      expect(revocation).not.toHaveProperty('revokedUserId');
      expect(revocation).not.toHaveProperty('userId');
    });

    test('Should prevent access after revocation', async () => {
      const timestamp = Date.now();
      const nonce = crypto.randomBytes(16).toString('hex');

      // Create mock ring signature
      const mockSignature = JSON.stringify({
        scheme: 'lsag-secp256k1',
        ringMembers: [testPublicKey2, testPublicKey1],
        keyImage: `key-image-revoked-${nonce}`,
        c0: crypto.randomBytes(32).toString('hex'),
        s: [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')],
        messageDigest: crypto.createHash('sha256').update(`access:${testFileId}:${timestamp}:${nonce}`).digest('hex'),
      });

      // Attempt to negotiate access after revocation
      await expect(
        fileAccessService.negotiateAccess({
          fileId: testFileId,
          publicKey: testPublicKey2,
          ringSignature: mockSignature,
          timestamp,
          nonce,
        })
      ).rejects.toThrow('Access denied or revoked');
    });
  });

  describe('Phase 7: Audit Log Verification (No userId Leakage)', () => {
    test('Should verify all audit logs contain no userId references', async () => {
      // Get all audit logs for this test
      const auditLogs = await prisma.anonymousAuditLog.findMany({
        where: {
          OR: [
            { fileId: testFileId },
            { publicKeyHash: testPublicKeyHash1 },
            { publicKeyHash: testPublicKeyHash2 },
          ],
        },
      });

      expect(auditLogs.length).toBeGreaterThan(0);

      // Verify no audit log contains userId
      auditLogs.forEach(log => {
        expect(log).not.toHaveProperty('userId');
        expect(log).toHaveProperty('publicKeyHash');

        // Verify metadata doesn't contain userId
        if (log.metadata) {
          const metadata = JSON.parse(log.metadata);
          expect(metadata).not.toHaveProperty('userId');
          expect(metadata).not.toHaveProperty('ownerUserId');
          expect(metadata).not.toHaveProperty('reportedByUserId');
        }
      });
    });

    test('Should verify integrity alerts contain no userId references', async () => {
      const alerts = await prisma.integrityAlert.findMany({
        where: { fileId: testFileId },
      });

      expect(alerts.length).toBeGreaterThan(0);

      alerts.forEach(alert => {
        expect(alert).not.toHaveProperty('reportedByUserId');
        expect(alert).not.toHaveProperty('userId');
        expect(alert).toHaveProperty('reportedByPublicKeyHash');
      });
    });

    test('Should verify file access grants contain no userId references', async () => {
      const accessGrants = await prisma.anonymousFileAccess.findMany({
        where: { fileId: testFileId },
      });

      expect(accessGrants.length).toBeGreaterThan(0);

      accessGrants.forEach(grant => {
        expect(grant).not.toHaveProperty('userId');
        expect(grant).not.toHaveProperty('grantedByUserId');
        expect(grant).toHaveProperty('accessorPublicKeyHash');
        expect(grant).toHaveProperty('grantedByPublicKeyHash');
      });
    });

    test('Should verify revocation records contain no userId references', async () => {
      const revocations = await prisma.anonymousRevocation.findMany({
        where: { fileId: testFileId },
      });

      expect(revocations.length).toBeGreaterThan(0);

      revocations.forEach(revocation => {
        expect(revocation).not.toHaveProperty('revokedUserId');
        expect(revocation).not.toHaveProperty('userId');
        expect(revocation).toHaveProperty('revokedPublicKeyHash');
      });
    });
  });

  describe('Complete E2E Flow Test', () => {
    test('Should execute complete anonymous flow without any userId leakage', async () => {
      // This test verifies the entire flow in sequence
      const flowTestFileId = crypto.randomBytes(16).toString('hex');
      const flowPublicKey = crypto.randomBytes(32).toString('hex');
      const flowPublicKeyHash = ringSignatureService.hashPublicKey(flowPublicKey);

      try {
        // Step 1: Create user
        await prisma.user.create({
          data: {
            publicKey: flowPublicKey,
            displayLabel: 'Flow Test User',
            role: 'user',
          },
        });

        // Step 2: Upload file
        const flowUser = await prisma.user.findUnique({ where: { publicKey: flowPublicKey } });
        await prisma.file.create({
          data: {
            id: flowTestFileId,
            fileName: 'flow-test.txt',
            totalSize: 512,
            chunkCount: 1,
            mimeType: 'text/plain',
            ownershipPublicKey: flowPublicKey,
            uploaderId: flowUser.id,
            metadataHash: crypto.createHash('sha256').update('flow-test').digest('hex'),
            encryptedChunkKeys: JSON.stringify({ encrypted: 'flow-test-keys' }),
            status: 'active',
          },
        });

        // Step 3: Grant self-access
        await prisma.anonymousFileAccess.create({
          data: {
            fileId: flowTestFileId,
            accessorPublicKeyHash: flowPublicKeyHash,
            grantedByPublicKeyHash: flowPublicKeyHash,
            status: 'active',
            grantedAt: new Date(),
            accessCount: 0,
          },
        });

        // Step 4: Perform operations and verify no userId in responses
        const timestamp = Date.now();
        const nonce = crypto.randomBytes(16).toString('hex');

        const mockSignature = JSON.stringify({
          scheme: 'lsag-secp256k1',
          ringMembers: [flowPublicKey],
          keyImage: `key-image-flow-${nonce}`,
          c0: crypto.randomBytes(32).toString('hex'),
          s: [crypto.randomBytes(32).toString('hex')],
          messageDigest: crypto.createHash('sha256').update(`list-files:${timestamp}:${nonce}`).digest('hex'),
        });

        const files = await fileAccessService.listAccessibleFiles({
          publicKey: flowPublicKey,
          ringSignature: mockSignature,
          timestamp,
          nonce,
        });

        // Verify response
        expect(files).toBeDefined();
        expect(JSON.stringify(files)).not.toContain('userId');
        expect(JSON.stringify(files)).not.toContain('ownerUserId');

        // Step 5: Verify database records
        const allRecords = await Promise.all([
          prisma.anonymousAuditLog.findMany({ where: { publicKeyHash: flowPublicKeyHash } }),
          prisma.anonymousFileAccess.findMany({ where: { fileId: flowTestFileId } }),
        ]);

        allRecords.flat().forEach(record => {
          expect(JSON.stringify(record)).not.toContain('userId');
        });

        // Cleanup
        await prisma.anonymousAuditLog.deleteMany({ where: { publicKeyHash: flowPublicKeyHash } });
        await prisma.anonymousFileAccess.deleteMany({ where: { fileId: flowTestFileId } });
        await prisma.file.delete({ where: { id: flowTestFileId } });
        await prisma.user.delete({ where: { publicKey: flowPublicKey } });
      } catch (error) {
        // Cleanup on error
        await prisma.anonymousAuditLog.deleteMany({ where: { publicKeyHash: flowPublicKeyHash } }).catch(() => {});
        await prisma.anonymousFileAccess.deleteMany({ where: { fileId: flowTestFileId } }).catch(() => {});
        await prisma.file.delete({ where: { id: flowTestFileId } }).catch(() => {});
        await prisma.user.delete({ where: { publicKey: flowPublicKey } }).catch(() => {});
        throw error;
      }
    });
  });
});
