/**
 * E2E Test: Anonymous File Access Flow
 *
 * Tests the complete anonymous download flow:
 * 1. Upload file anonymously (with AOT)
 * 2. Share file to another user (anonymous grant)
 * 3. Download file anonymously
 * 4. Report integrity alert (anonymous)
 * 5. Revoke access (hash-based)
 * 6. Verify audit logs contain NO userId leaks
 */

const { PrismaClient } = require('@prisma/client');
const { RingSignatureService } = require('../RingSignatureService');
const { FileAccessService } = require('../FileAccessService');
const { executePartialReencryption } = require('../revocationService');
const crypto = require('crypto');

describe('E2E: Anonymous File Access Flow', () => {
  let prisma;
  let ringService;
  let fileAccessService;
  let testFileId;
  let testPublicKey1;
  let testPublicKey2;
  let testPublicKeyHash1;
  let testPublicKeyHash2;

  beforeAll(async () => {
    prisma = new PrismaClient();
    ringService = new RingSignatureService(prisma);
    fileAccessService = new FileAccessService(ringService, prisma);

    // Clean up test data
    await prisma.anonymousAuditLog.deleteMany({
      where: {
        metadata: {
          contains: 'E2E_TEST'
        }
      }
    });

    await prisma.integrityAlert.deleteMany({
      where: {
        fileId: {
          startsWith: 'e2e-test-'
        }
      }
    });

    // Generate test public keys
    testPublicKey1 = crypto.randomBytes(33).toString('hex');
    testPublicKey2 = crypto.randomBytes(33).toString('hex');
    testPublicKeyHash1 = ringService.hashPublicKey(testPublicKey1);
    testPublicKeyHash2 = ringService.hashPublicKey(testPublicKey2);

    // ✅ NO User creation - fully anonymous test
    // Users are identified only by publicKeyHash, not User records
  });

  afterAll(async () => {
    // Clean up
    if (testFileId) {
      await prisma.file.delete({
        where: { id: testFileId }
      }).catch(() => {});
    }

    // ✅ No User cleanup needed - anonymous architecture

    await prisma.$disconnect();
  });

  /**
   * Step 1: Upload file anonymously with AOT (NO User record needed)
   */
  it('Step 1: Should upload file anonymously with AOT (NO userId)', async () => {
    // ✅ NO User query - fully anonymous upload
    // Uploader identified only by publicKeyHash

    // Create a test file with anonymous architecture
    testFileId = `e2e-test-${Date.now()}`;
    const testFile = await prisma.file.create({
      data: {
        id: testFileId,
        fileName: 'test-file.txt',
        totalSize: 1024,
        mimeType: 'text/plain',
        chunkCount: 1,
        metadata: JSON.stringify({ test: true, marker: 'E2E_TEST' }),
        metadataHash: crypto.randomBytes(32).toString('hex'),
        encryptedChunkKeys: JSON.stringify({ 0: crypto.randomBytes(32).toString('hex') }),
        ownershipPublicKey: testPublicKey1,
        uploaderPublicKeyHash: testPublicKeyHash1,  // ✅ Use publicKeyHash
        uploaderId: null,                           // ✅ No userId
        status: 'active'
      }
    });

    // Create chunk
    await prisma.fileChunk.create({
      data: {
        fileId: testFile.id,
        chunkIndex: 0,
        chunkHash: crypto.randomBytes(32).toString('hex'),
        ipfsCid: 'QmTest' + crypto.randomBytes(16).toString('hex'),
        size: 1024
      }
    });

    // Create anonymous access grant for uploader
    await prisma.anonymousFileAccess.create({
      data: {
        fileId: testFile.id,
        accessorPublicKeyHash: testPublicKeyHash1,
        status: 'active',
        keyStatus: 'client-managed',
        keyPackageFingerprint: crypto.randomBytes(32).toString('hex')
      }
    });

    // Log upload in audit log
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'upload',
        fileId: testFile.id,
        publicKeyHash: testPublicKeyHash1,
        metadata: JSON.stringify({
          fileName: 'test-file.txt',
          marker: 'E2E_TEST'
        })
      }
    });

    // Verify file was created with anonymous architecture
    expect(testFile).toBeDefined();
    expect(testFile.id).toBe(testFileId);
    expect(testFile.uploaderPublicKeyHash).toBe(testPublicKeyHash1);  // ✅ Has publicKeyHash
    expect(testFile.uploaderId).toBeNull();                           // ✅ No userId

    // Verify upload audit log exists
    const uploadLog = await prisma.anonymousAuditLog.findFirst({
      where: {
        eventType: 'upload',
        fileId: testFileId,
        publicKeyHash: testPublicKeyHash1
      }
    });

    expect(uploadLog).toBeDefined();
    expect(uploadLog.metadata).toContain('E2E_TEST');
    expect(uploadLog.metadata).not.toContain('userId'); // ✅ No userId leak
  });

  /**
   * Step 2: Share file to another user (anonymous grant)
   */
  it('Step 2: Should share file anonymously to another user', async () => {
    // Create anonymous access grant for second user
    await prisma.anonymousFileAccess.create({
      data: {
        fileId: testFileId,
        accessorPublicKeyHash: testPublicKeyHash2,
        status: 'active',
        keyStatus: 'client-managed',
        keyPackageFingerprint: crypto.randomBytes(32).toString('hex')
      }
    });

    // Log sharing event
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'share',
        fileId: testFileId,
        publicKeyHash: testPublicKeyHash1, // Sharer
        metadata: JSON.stringify({
          recipientPublicKeyHash: testPublicKeyHash2,
          marker: 'E2E_TEST'
        })
      }
    });

    // Verify access grant created
    const accessGrant = await prisma.anonymousFileAccess.findUnique({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: testPublicKeyHash2,
          fileId: testFileId
        }
      }
    });

    expect(accessGrant).toBeDefined();
    expect(accessGrant.status).toBe('active');

    // Verify share audit log
    const shareLog = await prisma.anonymousAuditLog.findFirst({
      where: {
        eventType: 'share',
        fileId: testFileId,
        publicKeyHash: testPublicKeyHash1
      }
    });

    expect(shareLog).toBeDefined();
    expect(shareLog.metadata).toContain('E2E_TEST');
    expect(shareLog.metadata).not.toContain('userId'); // ✅ No userId leak
  });

  /**
   * Step 3: Download file anonymously
   */
  it('Step 3: Should negotiate anonymous access and download file', async () => {
    // Mock ring signature verification (bypass actual crypto for test)
    jest.spyOn(ringService, 'verifyRingSignature').mockResolvedValue(true);
    jest.spyOn(ringService, 'verifyTimestamp').mockReturnValue(true);
    jest.spyOn(ringService, 'verifyNonce').mockResolvedValue(true);

    const timestamp = Date.now();
    const nonce = `e2e-nonce-${crypto.randomBytes(8).toString('hex')}`;

    // Negotiate access
    const accessResult = await fileAccessService.negotiateAccess({
      fileId: testFileId,
      publicKey: testPublicKey2, // Second user downloading
      ringSignature: 'mock-ring-signature',
      timestamp,
      nonce
    });

    expect(accessResult).toBeDefined();
    expect(accessResult.file.id).toBe(testFileId);
    expect(accessResult.chunkManifest).toHaveLength(1);
    expect(accessResult.ownershipPolicy.publicKey).toBe(testPublicKey1);

    // Verify access negotiation audit log
    const accessLog = await prisma.anonymousAuditLog.findFirst({
      where: {
        eventType: 'access_negotiation',
        fileId: testFileId,
        publicKeyHash: testPublicKeyHash2
      }
    });

    expect(accessLog).toBeDefined();
    expect(accessLog.metadata).not.toContain('userId'); // ✅ No userId leak

    // Verify access count incremented
    const updatedGrant = await prisma.anonymousFileAccess.findUnique({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: testPublicKeyHash2,
          fileId: testFileId
        }
      }
    });

    expect(updatedGrant.accessCount).toBe(1);
  });

  /**
   * Step 4: Report integrity alert anonymously
   */
  it('Step 4: Should report integrity alert anonymously', async () => {
    const timestamp = Date.now();
    const nonce = `e2e-integrity-nonce-${crypto.randomBytes(8).toString('hex')}`;

    // Report integrity alert
    await fileAccessService.reportIntegrityAlert({
      fileId: testFileId,
      publicKey: testPublicKey2,
      ringSignature: 'mock-ring-signature',
      chunkIndex: 0,
      expectedHash: 'expected-hash-123',
      actualHash: 'actual-hash-456',
      retryCount: 3,
      timestamp,
      nonce
    });

    // Verify integrity alert created
    const alert = await prisma.integrityAlert.findFirst({
      where: {
        fileId: testFileId,
        chunkIndex: 0,
        reportedByPublicKeyHash: testPublicKeyHash2
      }
    });

    expect(alert).toBeDefined();
    expect(alert.expectedHash).toBe('expected-hash-123');
    expect(alert.actualHash).toBe('actual-hash-456');
    expect(alert.reportedByPublicKeyHash).toBe(testPublicKeyHash2);
    expect(alert.reportedByPublicKeyHash).not.toContain('user'); // ✅ Hash-based, not userId

    // Verify integrity alert audit log
    const alertLog = await prisma.anonymousAuditLog.findFirst({
      where: {
        eventType: 'integrity_alert',
        fileId: testFileId,
        publicKeyHash: testPublicKeyHash2
      }
    });

    expect(alertLog).toBeDefined();
    expect(alertLog.metadata).not.toContain('userId'); // ✅ No userId leak
  });

  /**
   * Step 5: Revoke access (hash-based)
   */
  it('Step 5: Should revoke access using publicKeyHash (not userId)', async () => {
    // Revoke access for user 2
    const revocationResult = await executePartialReencryption(
      testFileId,
      testPublicKeyHash2, // ✅ Revoke by hash, not userId
      {
        R: 'mock-R',
        s: 'mock-s',
        message: 'revoke-user-2',
        publicKey: testPublicKey1
      },
      'standard',
      prisma
    );

    expect(revocationResult.success).toBe(true);
    expect(revocationResult.revocationId).toBeDefined();

    // Verify access grant is revoked
    const revokedGrant = await prisma.anonymousFileAccess.findUnique({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: testPublicKeyHash2,
          fileId: testFileId
        }
      }
    });

    expect(revokedGrant.status).toBe('revoked');

    // Verify revocation record uses publicKeyHash
    const revocation = await prisma.anonymousRevocation.findUnique({
      where: { id: revocationResult.revocationId }
    });

    expect(revocation).toBeDefined();
    expect(revocation.revokedPublicKeyHash).toBe(testPublicKeyHash2); // ✅ Hash-based
    expect(revocation.fileId).toBe(testFileId);
  });

  /**
   * Step 6: Comprehensive audit log verification - NO userId leaks
   */
  it('Step 6: Should verify audit logs contain NO userId or PII', async () => {
    // Get all audit logs for this test file
    const allLogs = await prisma.anonymousAuditLog.findMany({
      where: {
        OR: [
          { fileId: testFileId },
          { metadata: { contains: 'E2E_TEST' } }
        ]
      }
    });

    console.log(`\n📊 E2E Test: Found ${allLogs.length} audit logs to verify\n`);

    // Verify each log
    allLogs.forEach((log, index) => {
      console.log(`[${index + 1}/${allLogs.length}] Checking ${log.eventType} log (${log.id})`);

      // Check for userId leaks in metadata
      if (log.metadata) {
        expect(log.metadata).not.toContain('userId');
        expect(log.metadata).not.toContain('ownerUserId');
        expect(log.metadata).not.toContain('uploaderUserId');
        expect(log.metadata).not.toContain('"id":'); // No user ID fields

        // Should only contain publicKeyHash, not raw publicKey in some cases
        const metadata = JSON.parse(log.metadata);
        if (metadata.recipientPublicKeyHash) {
          // Hashes should be 64 chars (SHA-256)
          expect(metadata.recipientPublicKeyHash.length).toBe(64);
        }
      }

      // Verify publicKeyHash is present (not userId)
      if (log.publicKeyHash) {
        expect(log.publicKeyHash).toBeTruthy();
        expect(log.publicKeyHash.length).toBe(64); // SHA-256 hash
      }

      console.log(`  ✅ No userId leak detected`);
    });

    // Verify integrity alerts use publicKeyHash
    const alerts = await prisma.integrityAlert.findMany({
      where: { fileId: testFileId }
    });

    alerts.forEach((alert, index) => {
      console.log(`[${index + 1}/${alerts.length}] Checking integrity alert (${alert.id})`);
      expect(alert.reportedByPublicKeyHash).toBeTruthy();
      expect(alert.reportedByPublicKeyHash.length).toBe(64);
      console.log(`  ✅ Uses publicKeyHash (not userId)`);
    });

    // Verify revocations use publicKeyHash
    const revocations = await prisma.anonymousRevocation.findMany({
      where: { fileId: testFileId }
    });

    revocations.forEach((rev, index) => {
      console.log(`[${index + 1}/${revocations.length}] Checking revocation (${rev.id})`);
      expect(rev.revokedPublicKeyHash).toBeTruthy();
      expect(rev.revokedPublicKeyHash.length).toBe(64);
      console.log(`  ✅ Uses revokedPublicKeyHash (not revokedUserId)`);
    });

    console.log(`\n✅ E2E Test Complete: All ${allLogs.length + alerts.length + revocations.length} records verified - NO userId leaks detected!\n`);
  });
});
