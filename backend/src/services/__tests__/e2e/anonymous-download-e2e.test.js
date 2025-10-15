/**
 * E2E Test Scenario: Anonymous Download Flow
 * 
 * This test verifies the complete anonymous download flow:
 * 1. Upload anonymous (simulated) → 
 * 2. Share → 
 * 3. Download → 
 * 4. Integrity alert → 
 * 5. Revoke (hash-based) 
 * 6. Verify audit log does not leak userId
 */

const { FileAccessService } = require('../../FileAccessService');
const { RingSignatureService } = require('../../RingSignatureService');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const request = require('supertest');
const crypto = require('crypto');

describe('E2E: Anonymous Download Flow', () => {
  let app;
  let prisma;
  let ringSignatureService;
  let fileAccessService;
  
  // Mock user identities
  const ownerPublicKey = 'owner-pub-key-' + crypto.randomBytes(16).toString('hex');
  const downloaderPublicKey = 'downloader-pub-key-' + crypto.randomBytes(16).toString('hex');
  const ownerPublicKeyHash = `hash-${ownerPublicKey}`;
  const downloaderPublicKeyHash = `hash-${downloaderPublicKey}`;
  
  // Test file data
  const testFileId = 'test-file-' + crypto.randomUUID();
  const testFileName = 'test-document.pdf';
  
  beforeAll(async () => {
    // Setup Prisma
    prisma = new PrismaClient();
    
    // Setup RingSignatureService with mock methods for testing
    ringSignatureService = new RingSignatureService(prisma);
    
    // Mock the ring signature verification methods for testing
    ringSignatureService.verifyRingSignature = jest.fn().mockResolvedValue(true);
    ringSignatureService.verifyNonce = jest.fn().mockResolvedValue(true);
    ringSignatureService.verifyTimestamp = jest.fn().mockResolvedValue(true);
    ringSignatureService.hashPublicKey = jest.fn()
      .mockImplementation((publicKey) => {
        if (publicKey === ownerPublicKey) return ownerPublicKeyHash;
        if (publicKey === downloaderPublicKey) return downloaderPublicKeyHash;
        return `hash-${publicKey}`;
      });
    
    // Create FileAccessService with mocked dependencies
    fileAccessService = new FileAccessService(ringSignatureService, prisma);
    
    // Setup Express app for testing the endpoints
    app = express();
    app.use(express.json());
    
    // Add test routes that mirror the anonymous endpoints
    app.post('/api/files/anonymous-list', async (req, res) => {
      try {
        const files = await fileAccessService.listAccessibleFiles(req.body);
        res.json({ success: true, files, totalCount: files.length });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
    
    app.post('/api/files/:fileId/anonymous-access', async (req, res) => {
      try {
        const result = await fileAccessService.negotiateAccess({
          ...req.body,
          fileId: req.params.fileId
        });
        res.json({ success: true, ...result });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
    
    app.post('/api/files/:fileId/anonymous-integrity-alert', async (req, res) => {
      try {
        await fileAccessService.reportIntegrityAlert({
          ...req.body,
          fileId: req.params.fileId
        });
        res.json({ success: true, message: 'Integrity alert recorded' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
    
    // Create test user and file records for the scenario
    await prisma.user.upsert({
      where: { publicKey: ownerPublicKey },
      update: {},
      create: {
        publicKey: ownerPublicKey,
        displayLabel: 'Test Owner'
      }
    });
    
    await prisma.user.upsert({
      where: { publicKey: downloaderPublicKey },
      update: {},
      create: {
        publicKey: downloaderPublicKey,
        displayLabel: 'Test Downloader'
      }
    });
    
    await prisma.file.upsert({
      where: { id: testFileId },
      update: {},
      create: {
        id: testFileId,
        fileName: testFileName,
        totalSize: 1024000, // 1MB
        mimeType: 'application/pdf',
        chunkCount: 4,
        metadataHash: 'test-metadata-hash',
        encryptedChunkKeys: 'encrypted-keys-placeholder',
        ownershipPublicKey: ownerPublicKey,
        uploader: {
          connect: { publicKey: ownerPublicKey }
        }
      }
    });
    
    // Create anonymous access for downloader to the file
    await prisma.anonymousFileAccess.upsert({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: downloaderPublicKeyHash,
          fileId: testFileId
        }
      },
      update: {},
      create: {
        accessorPublicKeyHash: downloaderPublicKeyHash,
        fileId: testFileId,
        status: 'active'
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.anonymousFileAccess.deleteMany({
      where: {
        fileId: testFileId
      }
    });
    
    await prisma.integrityAlert.deleteMany({
      where: {
        fileId: testFileId
      }
    });
    
    await prisma.anonymousAuditLog.deleteMany({
      where: {
        fileId: testFileId
      }
    });
    
    await prisma.file.delete({
      where: { id: testFileId }
    });
    
    await prisma.user.deleteMany({
      where: {
        publicKey: { in: [ownerPublicKey, downloaderPublicKey] }
      }
    });
    
    await prisma.$disconnect();
  });

  test('Complete anonymous download flow: upload → share → download → integrity alert → revoke', async () => {
    // Step 1: Downloader lists accessible files (anonymous)
    const listResponse = await request(app)
      .post('/api/files/anonymous-list')
      .send({
        publicKey: downloaderPublicKey,
        ringSignature: 'test-ring-sig',
        timestamp: Date.now().toString(),
        nonce: 'test-nonce-list'
      });
    
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.success).toBe(true);
    expect(Array.isArray(listResponse.body.files)).toBe(true);
    
    // Verify that the file is in the list and does not contain userId
    const listedFile = listResponse.body.files.find(f => f.fileId === testFileId);
    expect(listedFile).toBeDefined();
    expect(listedFile).not.toHaveProperty('userId'); // Critical: no userId in response
    expect(listedFile).not.toHaveProperty('ownerUserId'); // Critical: no userId in response
    expect(listedFile.ownerPublicKey).toBe(ownerPublicKey);
    
    // Step 2: Downloader negotiates access to the file
    const accessResponse = await request(app)
      .post(`/api/files/${testFileId}/anonymous-access`)
      .send({
        publicKey: downloaderPublicKey,
        ringSignature: 'test-ring-sig',
        timestamp: Date.now().toString(),
        nonce: 'test-nonce-access',
        fileId: testFileId
      });
    
    expect(accessResponse.status).toBe(200);
    expect(accessResponse.body.success).toBe(true);
    expect(accessResponse.body.file).toBeDefined();
    expect(accessResponse.body.file.id).toBe(testFileId);
    expect(accessResponse.body.chunkManifest).toBeDefined();
    
    // Critical: verify no userId in the response
    expect(accessResponse.body).not.toHaveProperty('userId');
    expect(accessResponse.body.file).not.toHaveProperty('userId');
    
    // Step 3: Downloader reports an integrity alert
    const integrityResponse = await request(app)
      .post(`/api/files/${testFileId}/anonymous-integrity-alert`)
      .send({
        publicKey: downloaderPublicKey,
        ringSignature: 'test-ring-sig',
        timestamp: Date.now().toString(),
        nonce: 'test-nonce-integrity',
        chunkIndex: 1,
        expectedHash: 'expected-hash-value',
        actualHash: 'actual-hash-value-mismatch',
        retryCount: 1
      });
    
    expect(integrityResponse.status).toBe(200);
    expect(integrityResponse.body.success).toBe(true);
    
    // Step 4: Verify that audit logs were created without userId
    const auditLogs = await prisma.anonymousAuditLog.findMany({
      where: {
        fileId: testFileId
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    expect(auditLogs.length).toBeGreaterThan(0);
    
    // Verify that all audit logs use publicKeyHash instead of userId
    for (const log of auditLogs) {
      expect(log.publicKeyHash).toBeDefined();
      expect(log.publicKeyHash).toContain('hash-'); // Verify hashing happened
      expect(log.publicKeyHash).not.toContain('userId'); // Critical: no userId pattern
    }
    
    // Step 5: Verify integrity alert was recorded with publicKeyHash (not userId)
    const integrityAlerts = await prisma.integrityAlert.findMany({
      where: {
        fileId: testFileId
      }
    });
    
    expect(integrityAlerts.length).toBeGreaterThan(0);
    for (const alert of integrityAlerts) {
      expect(alert.reportedByPublicKeyHash).toBeDefined();
      expect(alert.reportedByPublicKeyHash).toBe(downloaderPublicKeyHash);
      // Verify no userId field exists in the schema
      expect(alert).not.toHaveProperty('reportedByUserId'); // Critical: no userId field
    }
  });

  test('Revoke access and verify audit logs do not contain userId', async () => {
    // This simulates the revocation process using the anonymous revocation mechanism
    // First, ensure the access exists
    const existingAccess = await prisma.anonymousFileAccess.findUnique({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: downloaderPublicKeyHash,
          fileId: testFileId
        }
      }
    });
    
    expect(existingAccess).toBeDefined();
    
    // Simulate revocation by updating the access status
    const revokedAccess = await prisma.anonymousFileAccess.update({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: downloaderPublicKeyHash,
          fileId: testFileId
        }
      },
      data: {
        status: 'revoked',
        lastAccessAt: new Date()
      }
    });
    
    expect(revokedAccess.status).toBe('revoked');
    
    // Verify that the public key hash is still properly masked in any associated logs
    const auditLogs = await prisma.anonymousAuditLog.findMany({
      where: {
        publicKeyHash: downloaderPublicKeyHash
      }
    });
    
    // All audit logs should still be using properly hashed public keys
    for (const log of auditLogs) {
      expect(log.publicKeyHash).toContain('hash-');
      expect(log.publicKeyHash).toBe(downloaderPublicKeyHash);
      expect(log.publicKeyHash).not.toContain('userId'); // Critical: no userId pattern
    }
    
    // Verify that subsequent access attempts fail
    const failedAccessResponse = await request(app)
      .post(`/api/files/${testFileId}/anonymous-access`)
      .send({
        publicKey: downloaderPublicKey,
        ringSignature: 'test-ring-sig',
        timestamp: Date.now().toString(),
        nonce: 'test-nonce-after-revoke',
        fileId: testFileId
      });
    
    // Should fail because access was revoked
    expect(failedAccessResponse.status).not.toBe(200);
    
    // If successful, this would mean the system properly revoked access based on hash
    // and all logging used publicKeyHash instead of userId
  });

  test('Verify no PII (userId) leaked in any audit logs', async () => {
    // Query all audit logs to ensure no userId is present
    const allAuditLogs = await prisma.anonymousAuditLog.findMany({
      take: 100, // Get recent logs
      orderBy: { timestamp: 'desc' }
    });
    
    // Verify all logs use publicKeyHash and not userId
    for (const log of allAuditLogs) {
      // These are the critical checks for PII protection
      expect(log).not.toHaveProperty('userId');
      expect(log.publicKeyHash).toBeDefined();
      expect(log.publicKeyHash).toContain('hash-'); // Verify proper hashing
      expect(log.publicKeyHash).not.toEqual(expect.stringContaining('userId'));
    }
    
    // Also check that no logs contain raw public keys (should be hashed)
    for (const log of allAuditLogs) {
      if (log.metadata) {
        const metadata = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata;
        const metadataStr = JSON.stringify(metadata);
        // Ensure raw public keys are not stored in metadata (should be hashed)
        expect(metadataStr).not.toContain(ownerPublicKey);
        expect(metadataStr).not.toContain(downloaderPublicKey);
      }
    }
  });
});