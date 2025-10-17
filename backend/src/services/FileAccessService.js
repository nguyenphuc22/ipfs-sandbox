/**
 * Anonymous File Access Service
 *
 * Handles anonymous file access using publicKeyHash instead of userId
 * Implements the new anonymous download flow
 *
 * @module FileAccessService
 */

const { PrismaClient } = require('@prisma/client');
const { ringSignatureService } = require('./RingSignatureService');
const { secureLog, maskHashForLogging } = require('../utils/monitoring');

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
