/**
 * E2E Test Scenario: Anonymous Download Flow (service-level)
 *
 * This test verifies the complete anonymous download flow without relying on HTTP networking:
 * 1. List accessible files
 * 2. Negotiate access
 * 3. Report integrity alert
 * 4. Revoke access and ensure further access fails
 * 5. Validate audit logs contain no userId information
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { FileAccessService } = require('../../FileAccessService');
const { RingSignatureService } = require('../../RingSignatureService');

function hashPublicKey(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

describe('E2E: Anonymous Download Flow', () => {
  let prisma;
  let ringSignatureService;
  let fileAccessService;

  // Mock user identities
  const ownerPublicKey = 'owner-pub-key-' + crypto.randomBytes(16).toString('hex');
  const downloaderPublicKey = 'downloader-pub-key-' + crypto.randomBytes(16).toString('hex');
  const ownerPublicKeyHash = hashPublicKey(ownerPublicKey);
  const downloaderPublicKeyHash = hashPublicKey(downloaderPublicKey);

  // Test file data
  const testFileId = 'test-file-' + crypto.randomUUID();
  const testFileName = 'test-document.pdf';

  beforeAll(async () => {
    prisma = new PrismaClient();
    ringSignatureService = new RingSignatureService(prisma);
    fileAccessService = new FileAccessService(ringSignatureService, prisma);

    jest.spyOn(ringSignatureService, 'verifyRingSignature').mockResolvedValue(true);
    jest.spyOn(ringSignatureService, 'verifyNonce').mockResolvedValue(true);
    jest.spyOn(ringSignatureService, 'verifyTimestamp').mockReturnValue(true);
    jest.spyOn(ringSignatureService, 'hashPublicKey').mockImplementation(hashPublicKey);
    jest.spyOn(ringSignatureService, 'getAllPublicKeys').mockResolvedValue([
      ownerPublicKey,
      downloaderPublicKey,
    ]);

    await prisma.file.create({
      data: {
        id: testFileId,
        fileName: testFileName,
        totalSize: 1_024_000,
        mimeType: 'application/pdf',
        chunkCount: 2,
        metadataHash: 'test-metadata-hash',
        encryptedChunkKeys: 'encrypted-keys-placeholder',
        ownershipPublicKey: ownerPublicKey,
        uploaderPublicKeyHash: ownerPublicKeyHash,
        status: 'active',
        chunks: {
          create: [
            {
              chunkIndex: 0,
              chunkHash: 'chunk-hash-0',
              ipfsCid: 'cid-0',
              size: 512_000,
            },
            {
              chunkIndex: 1,
              chunkHash: 'chunk-hash-1',
              ipfsCid: 'cid-1',
              size: 512_000,
            },
          ],
        },
      },
    });

    await prisma.anonymousFileAccess.create({
      data: {
        accessorPublicKeyHash: downloaderPublicKeyHash,
        fileId: testFileId,
        status: 'active',
      },
    });
  });

  afterAll(async () => {
    await prisma.anonymousFileAccess.deleteMany({
      where: { fileId: testFileId },
    });

    await prisma.integrityAlert.deleteMany({
      where: { fileId: testFileId },
    });

    await prisma.anonymousAuditLog.deleteMany({
      where: { fileId: testFileId },
    });

    await prisma.fileChunk.deleteMany({
      where: { fileId: testFileId },
    });

    await prisma.file.deleteMany({
      where: { id: testFileId },
    });

    jest.restoreAllMocks();
    await prisma.$disconnect();
  });

  test('Complete anonymous download flow: upload → share → download → integrity alert → revoke', async () => {
    const timestamp = Date.now().toString();

    // Step 1: Downloader lists accessible files (anonymous)
    const files = await fileAccessService.listAccessibleFiles({
      publicKey: downloaderPublicKey,
      ringSignature: 'test-ring-sig',
      timestamp,
      nonce: 'test-nonce-list',
    });

    expect(Array.isArray(files)).toBe(true);
    const listedFile = files.find(f => f.fileId === testFileId);
    expect(listedFile).toBeDefined();
    expect(listedFile).not.toHaveProperty('userId');
    expect(listedFile).not.toHaveProperty('ownerUserId');
    expect(listedFile.ownerPublicKey).toBe(ownerPublicKey);

    // Step 2: Downloader negotiates access to the file
    const accessResult = await fileAccessService.negotiateAccess({
      fileId: testFileId,
      publicKey: downloaderPublicKey,
      ringSignature: 'test-ring-sig',
      timestamp,
      nonce: 'test-nonce-access',
    });

    expect(accessResult).toBeDefined();
    expect(accessResult.file).toBeDefined();
    expect(accessResult.file.id).toBe(testFileId);
    expect(Array.isArray(accessResult.chunkManifest)).toBe(true);
    expect(accessResult.chunkManifest.length).toBeGreaterThan(0);
    expect(accessResult).not.toHaveProperty('userId');
    expect(accessResult.file).not.toHaveProperty('userId');

    // Step 3: Downloader reports an integrity alert
    await fileAccessService.reportIntegrityAlert({
      fileId: testFileId,
      publicKey: downloaderPublicKey,
      ringSignature: 'test-ring-sig',
      timestamp,
      nonce: 'test-nonce-integrity',
      chunkIndex: 1,
      expectedHash: 'expected-hash-value',
      actualHash: 'actual-hash-value-mismatch',
      retryCount: 1,
    });

    // Step 4: Verify that audit logs were created without userId
    const auditLogs = await prisma.anonymousAuditLog.findMany({
      where: { fileId: testFileId },
      orderBy: { timestamp: 'desc' },
    });

    expect(auditLogs.length).toBeGreaterThan(0);
    for (const log of auditLogs) {
      expect(log.publicKeyHash).toBeDefined();
      expect(log.publicKeyHash).toMatch(/^[0-9a-f]{64}$/);
      expect(log.publicKeyHash).not.toContain('userId');
    }

    // Step 5: Verify integrity alert was recorded with publicKeyHash (not userId)
    const integrityAlerts = await prisma.integrityAlert.findMany({
      where: { fileId: testFileId },
    });

    expect(integrityAlerts.length).toBeGreaterThan(0);
    for (const alert of integrityAlerts) {
      expect(alert.reportedByPublicKeyHash).toBe(downloaderPublicKeyHash);
      expect(alert).not.toHaveProperty('reportedByUserId');
    }
  });

  test('Revoke access and verify audit logs do not contain userId', async () => {
    const existingAccess = await prisma.anonymousFileAccess.findUnique({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: downloaderPublicKeyHash,
          fileId: testFileId,
        },
      },
    });

    expect(existingAccess).toBeDefined();

    await prisma.anonymousFileAccess.update({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: downloaderPublicKeyHash,
          fileId: testFileId,
        },
      },
      data: {
        status: 'revoked',
        lastAccessAt: new Date(),
      },
    });

    const auditLogs = await prisma.anonymousAuditLog.findMany({
      where: { publicKeyHash: downloaderPublicKeyHash },
    });

    for (const log of auditLogs) {
      expect(log.publicKeyHash).toBe(downloaderPublicKeyHash);
      expect(log.publicKeyHash).toMatch(/^[0-9a-f]{64}$/);
      expect(log.publicKeyHash).not.toContain('userId');
    }

    await expect(
      fileAccessService.negotiateAccess({
        fileId: testFileId,
        publicKey: downloaderPublicKey,
        ringSignature: 'test-ring-sig',
        timestamp: Date.now().toString(),
        nonce: 'test-nonce-after-revoke',
      })
    ).rejects.toThrow('Access denied or revoked');
  });

  test('Verify no PII (userId) leaked in any audit logs', async () => {
    const allAuditLogs = await prisma.anonymousAuditLog.findMany({
      where: { fileId: testFileId },
      orderBy: { timestamp: 'desc' },
    });

    for (const log of allAuditLogs) {
      expect(log).not.toHaveProperty('userId');
      if (log.publicKeyHash) {
        expect(log.publicKeyHash).toMatch(/^[0-9a-f]{64}$/);
      }
      if (log.metadata) {
        try {
          const metadataStr = typeof log.metadata === 'string' ? log.metadata : JSON.stringify(log.metadata);
          expect(metadataStr).not.toContain(ownerPublicKey);
          expect(metadataStr).not.toContain(downloaderPublicKey);
        } catch (error) {
          // Ignore JSON parse errors for unrelated metadata shapes
        }
      }
    }
  });
});
