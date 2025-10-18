/**
 * Anonymous File Access Service
 *
 * Handles anonymous file access using publicKeyHash instead of userId
 * Implements the new anonymous download flow
 *
 * @module FileAccessService
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { ringSignatureService } = require('./RingSignatureService');
const { secureLog, maskHashForLogging } = require('../utils/monitoring');
const { getSchnorr } = require('../utils/schnorr');

function normalizeHex(hex) {
  if (typeof hex !== 'string') {
    return '';
  }
  const trimmed = hex.trim().toLowerCase();
  return trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
}

function toMessageHex(message) {
  if (typeof message !== 'string') {
    return null;
  }

  const normalized = normalizeHex(message);
  const isHex = /^[0-9a-f]+$/i.test(normalized);
  if (isHex && normalized.length === 64) {
    return normalized;
  }

  const buffer = Buffer.from(message, 'utf-8');
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  return hash;
}

async function verifySchnorrProof({ R, s, message, publicKey }, expectedPublicKey) {
  const schnorr = await getSchnorr();

  const normalizedR = normalizeHex(R);
  const normalizedS = normalizeHex(s);
  const normalizedMessage = toMessageHex(message);
  const proofPublicKey = normalizeHex(publicKey);
  const storedPublicKey = normalizeHex(expectedPublicKey);

  if (!normalizedR || !normalizedS || !normalizedMessage) {
    throw new Error('Incomplete Schnorr proof payload');
  }

  if (!proofPublicKey || proofPublicKey !== storedPublicKey) {
    throw new Error('Ownership public key mismatch');
  }

  if (normalizedR.length !== 64 || normalizedS.length !== 64) {
    throw new Error('Schnorr proof components must be 32-byte hex values');
  }

  const signatureHex = `${normalizedR}${normalizedS}`;
  const signatureBytes = Buffer.from(signatureHex, 'hex');
  const messageBytes = Buffer.from(normalizedMessage, 'hex');

  let publicKeyBytes = Buffer.from(storedPublicKey, 'hex');
  if (publicKeyBytes.length === 33) {
    publicKeyBytes = publicKeyBytes.slice(1);
  } else if (publicKeyBytes.length !== 32) {
    throw new Error(`Invalid public key length: expected 32 or 33 bytes, got ${publicKeyBytes.length}`);
  }

  const isValid = schnorr.verify(signatureBytes, messageBytes, publicKeyBytes);
  if (!isValid) {
    throw new Error('Invalid Schnorr ownership proof');
  }

  return true;
}

function parseOptionalDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid expiresAt value');
  }
  return date;
}

class FileAccessService {
  constructor(ringService, prismaClient) {
    this.ringService = ringService || ringSignatureService;
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * List files accessible by public key (anonymous)
   *
   * @param {Object} params - Request parameters
   * @param {string} params.publicKey - User's public key
   * @param {string} params.ringSignature - Ring signature
   * @param {string} params.timestamp - Request timestamp
   * @param {string} params.nonce - Request nonce
   * @returns {Promise<Array>} Array of accessible files
   */
  async listAccessibleFiles(params) {
    const { publicKey, ringSignature, timestamp, nonce } = params;

    // 1. Verify timestamp freshness
    if (!this.ringService.verifyTimestamp(timestamp)) {
      throw new Error('Request timestamp is invalid or too old');
    }

    // 2. Verify nonce uniqueness
    if (!await this.ringService.verifyNonce(nonce)) {
      throw new Error('Nonce has already been used');
    }

    // 3. Verify ring signature
    const message = `list-files:${timestamp}:${nonce}`;
    const isValid = await this.ringService.verifyRingSignature({
      publicKey,
      signature: ringSignature,
      message,
      ringPublicKeys: await this.ringService.getAllPublicKeys(),
    });

    if (!isValid) {
      throw new Error('Invalid ring signature');
    }

    // 4. Hash public key
    const publicKeyHash = this.ringService.hashPublicKey(publicKey);

    // 5. Query access grants by publicKeyHash (NOT userId)
    const accessGrants = await this.prisma.anonymousFileAccess.findMany({
      where: {
        accessorPublicKeyHash: publicKeyHash,
        status: 'active',
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      },
      include: {
        file: {
          select: {
            id: true,
            fileName: true,
            totalSize: true,
            chunkCount: true,
            mimeType: true,
            ownershipPublicKey: true,
            status: true,
            createdAt: true,
            chunks: {
              orderBy: { chunkIndex: 'asc' },
              select: {
                chunkIndex: true,
                ipfsCid: true,
                chunkHash: true,
              },
              take: 1,
            },
          }
        }
      },
      orderBy: {
        grantedAt: 'desc'
      }
    });

    // 6. Transform response (no userId exposed)
    const files = accessGrants.map(grant => {
      const primaryChunk = grant.file.chunks?.[0];

      return {
        fileId: grant.file.id,
        fileName: grant.file.fileName,
        fileSize: grant.file.totalSize,
        chunkCount: grant.file.chunkCount,
        mimeType: grant.file.mimeType,
        ownerPublicKey: grant.file.ownershipPublicKey,
        ownershipStatus: grant.file.status,
        grantedAt: grant.grantedAt,
        expiresAt: grant.expiresAt,
        accessCount: grant.accessCount,
        uploadedAt: grant.file.createdAt,
        cid: primaryChunk?.ipfsCid || null,
        chunkHash: primaryChunk?.chunkHash || null,
      };
    });

    // 7. Log audit (no userId)
    await this.prisma.anonymousAuditLog.create({
      data: {
        eventType: 'file_list_query',
        publicKeyHash: publicKeyHash,
        ringSignature: ringSignature,
        timestamp: new Date(),
        metadata: JSON.stringify({
          fileCount: files.length,
          queryTimestamp: timestamp,
          nonce: nonce,
        })
      }
    });

    const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
    secureLog('FileAccessService', `Listed ${files.length} files for publicKeyHash: ${maskedPublicKeyHash}`, 'info', { publicKeyHash, fileCount: files.length });

    return files;
  }

  /**
   * Grant anonymous access to a file for a target public key
   *
   * @param {Object} params - Grant parameters
   * @param {string} params.fileId - ID of the file to grant access to
   * @param {string} params.targetPublicKey - Recipient public key
   * @param {string} params.ringSignature - Ring signature proving owner intent
   * @param {number|string} params.timestamp - Request timestamp
   * @param {string} params.nonce - Unique nonce for replay protection
   * @param {Object} params.ownershipProof - Schnorr proof of ownership
   * @param {string} [params.keyPackageFingerprint] - Optional key package fingerprint shared with recipient
   * @param {string|Date} [params.expiresAt] - Optional expiration
   * @param {Object} [params.metadata] - Optional metadata to store in audit log
   * @returns {Promise<Object>} Grant result with operation type and grant data
   */
  async grantAnonymousAccess(params) {
    const {
      fileId,
      targetPublicKey,
      ringSignature,
      timestamp,
      nonce,
      ownershipProof,
      keyPackageFingerprint,
      expiresAt,
      metadata,
    } = params || {};

    if (!fileId || typeof fileId !== 'string') {
      throw new Error('fileId is required');
    }

    const normalizedTargetPublicKey = typeof targetPublicKey === 'string' ? targetPublicKey.trim() : '';
    if (!normalizedTargetPublicKey) {
      throw new Error('targetPublicKey is required');
    }

    if (!ringSignature || typeof ringSignature !== 'string') {
      throw new Error('ringSignature is required');
    }

    const requestNonce = typeof nonce === 'string' ? nonce.trim() : '';
    if (!requestNonce) {
      throw new Error('nonce is required');
    }

    if (!ownershipProof || typeof ownershipProof !== 'object') {
      throw new Error('ownershipProof is required');
    }

    const numericTimestamp = Number(timestamp);
    if (!Number.isFinite(numericTimestamp)) {
      throw new Error('Invalid timestamp');
    }

    if (!this.ringService.verifyTimestamp(numericTimestamp)) {
      throw new Error('Request timestamp is invalid or too old');
    }

    if (!await this.ringService.verifyNonce(requestNonce)) {
      throw new Error('Nonce has already been used');
    }

    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      select: {
        id: true,
        ownershipPublicKey: true,
        uploaderPublicKeyHash: true,
        status: true,
      },
    });

    if (!file) {
      throw new Error('File not found');
    }

    if (file.status !== 'active') {
      throw new Error('File is not active');
    }

    await verifySchnorrProof(ownershipProof, file.ownershipPublicKey);

    const ownerPublicKeyHash = file.uploaderPublicKeyHash || this.ringService.hashPublicKey(file.ownershipPublicKey);
    const recipientPublicKeyHash = this.ringService.hashPublicKey(normalizedTargetPublicKey);

    const ringMessage = `grant:${fileId}:${recipientPublicKeyHash}:${numericTimestamp}:${requestNonce}`;
    const ringValid = await this.ringService.verifyRingSignature({
      publicKey: file.ownershipPublicKey,
      signature: ringSignature,
      message: ringMessage,
      ringPublicKeys: await this.ringService.getAllPublicKeys(),
    });

    if (!ringValid) {
      throw new Error('Invalid ring signature');
    }

    const expiresAtDate = expiresAt !== undefined ? parseOptionalDate(expiresAt) : undefined;
    const normalizedFingerprint = typeof keyPackageFingerprint === 'string'
      ? keyPackageFingerprint.trim().toLowerCase()
      : undefined;

    const existingGrant = await this.prisma.anonymousFileAccess.findUnique({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: recipientPublicKeyHash,
          fileId,
        },
      },
    });

    const now = new Date();
    let grantRecord;
    let operation;

    if (existingGrant) {
      const updateData = {
        status: 'active',
        keyStatus: 'client-managed',
        grantedAt: now,
      };

      if (expiresAtDate !== undefined) {
        updateData.expiresAt = expiresAtDate;
      }

      if (normalizedFingerprint) {
        updateData.keyPackageFingerprint = normalizedFingerprint;
      }

      grantRecord = await this.prisma.anonymousFileAccess.update({
        where: { id: existingGrant.id },
        data: updateData,
      });
      operation = 'updated';
    } else {
      grantRecord = await this.prisma.anonymousFileAccess.create({
        data: {
          accessorPublicKeyHash: recipientPublicKeyHash,
          fileId,
          status: 'active',
          keyStatus: 'client-managed',
          grantedAt: now,
          expiresAt: expiresAtDate ?? null,
          keyPackageFingerprint: normalizedFingerprint || null,
        },
      });
      operation = 'created';
    }

    const auditMetadata = {
      recipientPublicKeyHash,
      operation,
      keyStatus: grantRecord.keyStatus,
      keyPackageFingerprint: grantRecord.keyPackageFingerprint,
      expiresAt: grantRecord.expiresAt ? grantRecord.expiresAt.toISOString() : null,
      nonce: requestNonce,
    };

    if (metadata && typeof metadata === 'object') {
      Object.assign(auditMetadata, metadata);
    }

    await this.prisma.anonymousAuditLog.create({
      data: {
        eventType: 'grant',
        fileId,
        publicKeyHash: ownerPublicKeyHash,
        ringSignature,
        timestamp: now,
        metadata: JSON.stringify(auditMetadata),
      },
    });

    const maskedOwnerHash = maskHashForLogging(ownerPublicKeyHash, 'publicKeyHash');
    const maskedRecipientHash = maskHashForLogging(recipientPublicKeyHash, 'publicKeyHash');
    secureLog(
      'FileAccessService',
      `Anonymous grant ${operation} for file ${fileId}: owner ${maskedOwnerHash} -> recipient ${maskedRecipientHash}`,
      'info',
      {
        fileId,
        ownerPublicKeyHash,
        recipientPublicKeyHash,
        operation,
      },
    );

    return {
      operation,
      grant: {
        id: grantRecord.id,
        accessorPublicKeyHash: grantRecord.accessorPublicKeyHash,
        fileId: grantRecord.fileId,
        grantedAt: grantRecord.grantedAt,
        expiresAt: grantRecord.expiresAt,
        status: grantRecord.status,
        keyStatus: grantRecord.keyStatus,
        keyPackageFingerprint: grantRecord.keyPackageFingerprint,
      },
    };
  }

  /**
   * Negotiate access to specific file (anonymous)
   *
   * @param {Object} params - Request parameters
   * @param {string} params.fileId - ID of the file to access
   * @param {string} params.publicKey - User's public key
   * @param {string} params.ringSignature - Ring signature
   * @param {string} params.timestamp - Request timestamp
   * @param {string} params.nonce - Request nonce
   * @returns {Promise<Object>} File access manifest with chunk information
   */
  async negotiateAccess(params) {
    const { fileId, publicKey, ringSignature, timestamp, nonce } = params;

    // 1. Verify timestamp freshness
    if (!this.ringService.verifyTimestamp(timestamp)) {
      throw new Error('Request timestamp is invalid or too old');
    }

    // 2. Verify nonce uniqueness
    if (!await this.ringService.verifyNonce(nonce)) {
      throw new Error('Nonce has already been used');
    }

    // 3. Verify ring signature
    const message = `access:${fileId}:${timestamp}:${nonce}`;
    const isValid = await this.ringService.verifyRingSignature({
      publicKey,
      signature: ringSignature,
      message,
      ringPublicKeys: await this.ringService.getAllPublicKeys(),
    });

    if (!isValid) {
      throw new Error('Invalid ring signature');
    }

    // 4. Hash public key
    const publicKeyHash = this.ringService.hashPublicKey(publicKey);

    // 5. Verify access grant by publicKeyHash (NOT userId)
    const accessGrant = await this.prisma.anonymousFileAccess.findUnique({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: publicKeyHash,
          fileId: fileId,
        }
      },
      include: {
        file: {
          include: {
            chunks: {
              orderBy: { chunkIndex: 'asc' }
            }
          }
        }
      }
    });

    if (!accessGrant || accessGrant.status !== 'active') {
      throw new Error('Access denied or revoked');
    }

    // 6. Check expiration
    if (accessGrant.expiresAt && accessGrant.expiresAt < new Date()) {
      throw new Error('Access expired');
    }

    // 7. Build chunk manifest (no userId)
    const chunkManifest = accessGrant.file.chunks.map(chunk => ({
      index: chunk.chunkIndex,
      cid: chunk.ipfsCid,
      size: chunk.size,
      hash: chunk.chunkHash,
    }));

    // 8. Update access stats
    await this.prisma.anonymousFileAccess.update({
      where: { id: accessGrant.id },
      data: {
        lastAccessAt: new Date(),
        lastAccessProof: ringSignature,
        accessCount: { increment: 1 },
      }
    });

    // 9. Log audit (no userId)
    await this.prisma.anonymousAuditLog.create({
      data: {
        eventType: 'access_negotiation',
        fileId: fileId,
        publicKeyHash: publicKeyHash,
        ringSignature: ringSignature,
        timestamp: new Date(),
        metadata: JSON.stringify({
          chunkCount: chunkManifest.length,
          fileSize: accessGrant.file.totalSize,
          accessCount: accessGrant.accessCount + 1,
        })
      }
    });

    const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
    secureLog('FileAccessService', `Granted access to file ${fileId} for publicKeyHash: ${maskedPublicKeyHash}`, 'info', { fileId, publicKeyHash });

    // 10. Return manifest (no master key - user manages their own keys)
    return {
      file: {
        id: accessGrant.file.id,
        name: accessGrant.file.fileName,
        size: accessGrant.file.totalSize,
        chunkCount: accessGrant.file.chunkCount,
        mimeType: accessGrant.file.mimeType,
      },
      chunkManifest: chunkManifest,
      ownershipPolicy: {
        publicKey: accessGrant.file.ownershipPublicKey,
        status: accessGrant.file.status,
        revoked: accessGrant.file.status === 'revoked',
      },
      grantContext: {
        grantedAt: accessGrant.grantedAt,
        expiresAt: accessGrant.expiresAt,
        accessCount: accessGrant.accessCount + 1,
      }
    };
  }

  /**
   * Report integrity alert (anonymous)
   *
   * @param {Object} params - Alert parameters
   * @param {string} params.fileId - ID of the file
   * @param {string} params.publicKey - Reporter's public key
   * @param {string} params.ringSignature - Ring signature
   * @param {number} params.chunkIndex - Index of the chunk
   * @param {string} params.expectedHash - Expected hash value
   * @param {string} params.actualHash - Actual hash value
   * @param {number} params.retryCount - Number of retries
   * @param {string} params.timestamp - Request timestamp
   * @param {string} params.nonce - Request nonce
   * @returns {Promise<void>}
   */
  async reportIntegrityAlert(params) {
    const {
      fileId, publicKey, ringSignature,
      chunkIndex, expectedHash, actualHash,
      retryCount, timestamp, nonce
    } = params;

    // 1. Verify timestamp freshness
    if (!this.ringService.verifyTimestamp(timestamp)) {
      throw new Error('Request timestamp is invalid or too old');
    }

    // 2. Verify nonce uniqueness
    if (!await this.ringService.verifyNonce(nonce)) {
      throw new Error('Nonce has already been used');
    }

    // 3. Verify ring signature
    const message = `integrity-alert:${fileId}:${chunkIndex}:${timestamp}:${nonce}`;
    const isValid = await this.ringService.verifyRingSignature({
      publicKey,
      signature: ringSignature,
      message,
      ringPublicKeys: await this.ringService.getAllPublicKeys(),
    });

    if (!isValid) {
      throw new Error('Invalid ring signature');
    }

    // 4. Hash public key
    const publicKeyHash = this.ringService.hashPublicKey(publicKey);

    // 5. Create integrity alert (no userId)
    await this.prisma.integrityAlert.create({
      data: {
        fileId: fileId,
        chunkIndex: chunkIndex,
        expectedHash: expectedHash,
        actualHash: actualHash,
        reportedByPublicKeyHash: publicKeyHash, // ✅ Use publicKeyHash, not userId
        reportedAt: new Date(),
        resolved: false,
      }
    });

    // 6. Log audit (no userId)
    await this.prisma.anonymousAuditLog.create({
      data: {
        eventType: 'integrity_alert',
        fileId: fileId,
        publicKeyHash: publicKeyHash,
        ringSignature: ringSignature,
        timestamp: new Date(),
        metadata: JSON.stringify({
          chunkIndex,
          expectedHash: expectedHash.substring(0, 16) + '...',
          actualHash: actualHash ? actualHash.substring(0, 16) + '...' : null,
          retryCount,
        })
      }
    });

    const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
    secureLog('FileAccessService', `Chunk ${chunkIndex} mismatch for file ${fileId} reported by publicKeyHash: ${maskedPublicKeyHash}`, 'info', { fileId, chunkIndex, publicKeyHash, expectedHash, actualHash });
  }

  /**
   * Log anonymous audit event
   *
   * @param {Object} params - Audit parameters
   * @param {string} params.eventType - Type of audit event
   * @param {string} params.fileId - ID of the file
   * @param {string} params.publicKey - User's public key
   * @param {string} params.ringSignature - Ring signature
   * @param {string} params.timestamp - Request timestamp
   * @param {string} params.nonce - Request nonce
   * @param {Object} params.metadata - Additional metadata
   * @returns {Promise<void>}
   */
  async logAnonymousAuditEvent(params) {
    const {
      eventType, fileId, publicKey, ringSignature,
      timestamp, nonce, metadata
    } = params;

    // 1. Verify timestamp freshness
    if (!this.ringService.verifyTimestamp(timestamp)) {
      throw new Error('Request timestamp is invalid or too old');
    }

    // 2. Verify nonce uniqueness
    if (!await this.ringService.verifyNonce(nonce)) {
      throw new Error('Nonce has already been used');
    }

    // 3. Verify ring signature
    const message = `audit:${eventType}:${fileId}:${timestamp}:${nonce}`;
    const isValid = await this.ringService.verifyRingSignature({
      publicKey,
      signature: ringSignature,
      message,
      ringPublicKeys: await this.ringService.getAllPublicKeys(),
    });

    if (!isValid) {
      throw new Error('Invalid ring signature');
    }

    // 4. Hash public key
    const publicKeyHash = this.ringService.hashPublicKey(publicKey);

    // 5. Create audit log (no userId)
    await this.prisma.anonymousAuditLog.create({
      data: {
        eventType: eventType,
        fileId: fileId,
        publicKeyHash: publicKeyHash,
        ringSignature: ringSignature,
        timestamp: new Date(),
        metadata: JSON.stringify(metadata || {}),
      }
    });

    const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
    secureLog('FileAccessService', `${eventType} event logged for file ${fileId} by publicKeyHash: ${maskedPublicKeyHash}`, 'info', { eventType, fileId, publicKeyHash });
  }
}

// Export the class and a default instance (for backward compatibility)
const fileAccessService = new FileAccessService();

module.exports = { FileAccessService, fileAccessService };
