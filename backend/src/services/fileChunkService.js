/**
 * File Chunk Service
 * Handles chunked file upload/download with AOT integration
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');
const {
  processFileForChunking,
  parseEncryptedChunkPackage,
  decryptChunk,
  computeChunkHash,
} = require('../utils/chunkingUtils');
const { maskHashForLogging, secureLog } = require('../utils/monitoring');

const IPFS_API_URL = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';

/**
 * Upload file with chunking and AOT
 * @param {Object} params
 * @param {Buffer} params.fileBuffer - Complete file buffer
 * @param {string} params.fileName - Original filename
 * @param {string} params.mimeType - MIME type
 * @param {string} params.userId - Uploader user ID
 * @param {string} params.metadataHash - Metadata hash from client
 * @param {string} params.ownershipPublicKey - Schnorr public key
 * @param {Object} params.schnorrProof - {R, s, message, publicKey}
 * @param {string} params.ringSignature - Optional ring signature
 * @param {Array<string>} params.ringPublicKeys - Ring member public keys
 * @param {string} params.escrowedIdentity - Escrowed identity
 * @returns {Promise<Object>} Upload result with file record
 */
async function uploadFileWithChunks({
  fileBuffer,
  fileName,
  mimeType,
  userId,
  metadataHash,
  ownershipPublicKey,
  schnorrProof,
  ringSignature = null,
  ringPublicKeys = [],
  escrowedIdentity = null,
}) {
  try {
    // 1. Process file into encrypted chunks
    console.log(`[ChunkService] Processing file: ${fileName} (${fileBuffer.length} bytes)`);
    const {
      chunks,
      masterKey,
      chunkKeys,
      encryptedChunkKeys,
      totalChunks,
      totalSize,
    } = processFileForChunking(fileBuffer);

    console.log(`[ChunkService] Split into ${totalChunks} chunks`);

    // 2. Upload each chunk to IPFS
    const uploadedChunks = [];
    for (const chunk of chunks) {
      console.log(`[ChunkService] Uploading chunk ${chunk.index}/${totalChunks - 1}...`);

      const formData = new FormData();
      formData.append('file', chunk.encryptedBuffer, {
        filename: `${fileName}.chunk${chunk.index}`,
        contentType: 'application/octet-stream',
      });

      const response = await axios.post(`${IPFS_API_URL}/api/v0/add`, formData, {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const ipfsCid = response.data.Hash;
      console.log(`[ChunkService] Chunk ${chunk.index} uploaded: ${ipfsCid}`);

      uploadedChunks.push({
        index: chunk.index,
        hash: chunk.hash,
        ipfsCid,
        size: chunk.size,
      });
    }

    // 3. Create file record in database with Prisma
    const fileRecord = await prisma.file.create({
      data: {
        fileName,
        totalSize,
        mimeType,
        chunkCount: totalChunks,
        metadata: JSON.stringify({ originalName: fileName }),
        metadataHash,
        encryptedChunkKeys: JSON.stringify(encryptedChunkKeys),
        ringSignature,
        ringPublicKeys: ringPublicKeys.length > 0 ? JSON.stringify(ringPublicKeys) : null,
        escrowedIdentity,
        ownershipPublicKey,
        uploaderId: userId,
        status: 'active',
      },
    });

    console.log(`[ChunkService] File record created: ${fileRecord.id}`);

    // 4. Create chunk records
    const chunkRecords = await prisma.fileChunk.createMany({
      data: uploadedChunks.map(chunk => ({
        fileId: fileRecord.id,
        chunkIndex: chunk.index,
        chunkHash: chunk.hash,
        ipfsCid: chunk.ipfsCid,
        size: chunk.size,
      })),
    });

    console.log(`[ChunkService] ${chunkRecords.count} chunk records created`);

    // 5. Create anonymous access record for the uploader using public key hash
    // First, get the uploader's public key to compute the hash
    const uploader = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!uploader || !uploader.publicKey) {
      throw new Error('Uploader does not have a public key');
    }

    const accessorPublicKeyHash = crypto
      .createHash('sha256')
      .update(uploader.publicKey)
      .digest('hex');

    const keyPackageFingerprint = crypto
      .createHash('sha256')
      .update(`${fileRecord.id}:${masterKey}`)
      .digest('hex');

    await prisma.anonymousFileAccess.create({
      data: {
        accessorPublicKeyHash,
        fileId: fileRecord.id,
        status: 'active',
        keyStatus: 'client-managed',
        accessCount: 0,
        keyPackageFingerprint,
      },
    });

    // 6. Create anonymous audit log
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'upload',
        fileId: fileRecord.id,
        publicKeyHash: accessorPublicKeyHash,
        metadata: JSON.stringify({
          fileName,
          fileSize: totalSize,
          chunkCount: totalChunks,
          schnorrProof,
        }),
      },
    });

    return {
      success: true,
      fileId: fileRecord.id,
      fileName: fileRecord.fileName,
      totalSize: fileRecord.totalSize,
      chunkCount: totalChunks,
      chunks: uploadedChunks.map(c => ({
        index: c.index,
        cid: c.ipfsCid,
        hash: c.hash,
      })),
      metadataHash,
      ownershipPublicKey,
      secureKeyPackage: {
        masterKey,
        chunkKeys,
        keyPackageFingerprint,
      },
    };

  } catch (error) {
    console.error('[ChunkService] Upload error:', error);
    throw error;
  }
}



/**
 * Download and decrypt specific chunk
 * @param {string} ipfsCid - IPFS CID of encrypted chunk
 * @param {Buffer} chunkKey - Decryption key
 * @returns {Promise<Buffer>} Decrypted chunk data
 */
async function downloadAndDecryptChunk(ipfsCid, chunkKey) {
  try {
    // Download from IPFS
    const response = await axios.get(`${IPFS_API_URL}/api/v0/cat?arg=${ipfsCid}`, {
      responseType: 'arraybuffer',
    });

    const encryptedBuffer = Buffer.from(response.data);

    // Parse encrypted package
    const { iv, authTag, encryptedData } = parseEncryptedChunkPackage(encryptedBuffer);

    // Decrypt
    const decryptedData = decryptChunk(encryptedData, chunkKey, iv, authTag);

    return decryptedData;

  } catch (error) {
    console.error('[ChunkService] Download chunk error:', error);
    throw error;
  }
}

/**
 * Report integrity alert using public key hash (anonymous)
 * @param {string} fileId - File ID
 * @param {number} chunkIndex - Chunk index
 * @param {string} expectedHash - Expected hash
 * @param {string} actualHash - Actual computed hash
 * @param {string} publicKeyHash - Reporter's public key hash
 */
async function reportIntegrityAlert(fileId, chunkIndex, expectedHash, actualHash, publicKeyHash) {
  try {
    // Create integrity alert with public key hash
    await prisma.integrityAlert.create({
      data: {
        fileId,
        chunkIndex,
        expectedHash,
        actualHash,
        reportedByPublicKeyHash: publicKeyHash,  // Use public key hash instead of userId
      },
    });

    // Log to AnonymousAuditLog as required
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'integrity_alert',
        fileId,
        publicKeyHash,
        metadata: JSON.stringify({
          chunkIndex,
          expectedHash,
          actualHash,
        }),
      },
    });

    const maskedHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
    secureLog('ChunkService', `Integrity alert reported for file ${fileId}, chunk ${chunkIndex} by publicKeyHash: ${maskedHash}`, 'info', { fileId, chunkIndex, publicKeyHash });
  } catch (error) {
    console.error('[ChunkService] Report integrity alert error:', error);
    throw error;
  }
}



/***
 * Log anonymous audit event (NEW - for anonymous access)
 * @param {string} eventType - Event type (download, view, share, etc.)
 * @param {string} fileId - File ID
 * @param {string} publicKeyHash - Public key hash (for anonymous access)
 * @param {Object} metadata - Additional metadata
 */
async function logAnonymousAuditEvent(eventType, fileId, publicKeyHash, metadata = {}) {
  try {
    await prisma.anonymousAuditLog.create({
      data: {
        eventType,
        fileId,
        publicKeyHash,
        metadata: JSON.stringify(metadata),
      },
    });
  } catch (error) {
    console.error('[ChunkService] Log anonymous audit event error:', error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Get anonymous file access info for a public key hash (NEW - anonymous system)
 * @param {string} fileId - File ID
 * @param {string} publicKeyHash - Requesting user's public key hash
 * @returns {Promise<Object>} Access information using anonymous system
 */
async function getAnonymousFileAccessInfo(fileId, publicKeyHash) {
  try {
    // 1. Get file record with chunks
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' },
        },
        anonymousAccess: {
          where: {
            accessorPublicKeyHash: publicKeyHash,
            status: 'active',
          },
        },
      },
    });

    if (!file) {
      throw new Error('File not found');
    }

    if (file.status !== 'active') {
      throw new Error('File is not accessible (revoked or deleted)');
    }

    // 2. Check anonymous access permission
    if (file.anonymousAccess.length === 0) {
      throw new Error('Access denied - no anonymous grant found');
    }

    const access = file.anonymousAccess[0];

    // 3. Create chunk manifest
    const chunkManifest = file.chunks.map(chunk => ({
      index: chunk.chunkIndex,
      cid: chunk.ipfsCid,
      hash: chunk.chunkHash,
      size: chunk.size,
    }));

    // 4. Create ownership policy
    const ownershipPolicy = {
      ownershipPublicKey: file.ownershipPublicKey,
      status: file.status,
      revoked: file.status === 'revoked',
      lastRevocationAt: file.lastRevocationAt,
    };

    // 5. Log access intent to anonymous audit log
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'access_request',
        fileId: file.id,
        publicKeyHash,
        metadata: JSON.stringify({
          fileName: file.fileName,
          chunkCount: file.chunkCount,
        }),
      },
    });

    return {
      success: true,
      fileId: file.id,
      fileName: file.fileName,
      totalSize: file.totalSize,
      chunkCount: file.chunkCount,
      grantContext: {
        keyStatus: access.keyStatus,
        keyPackageFingerprint: access.keyPackageFingerprint,
      },
      chunkManifest,
      ownershipPolicy,
      grantedAt: access.grantedAt,
    };

  } catch (error) {
    console.error('[ChunkService] Get anonymous access info error:', error);
    throw error;
  }
}

/**
 * List files accessible by public key hash (NEW - replaces listUserFiles)
 * @param {string} publicKeyHash - Public key hash
 * @returns {Promise<Array>} List of accessible files
 */
async function listAnonymousAccessibleFiles(publicKeyHash) {
  try {
    const files = await prisma.file.findMany({
      where: {
        anonymousAccess: {
          some: {
            accessorPublicKeyHash: publicKeyHash,
            status: 'active',
          },
        },
      },
      include: {
        anonymousAccess: {
          where: { accessorPublicKeyHash: publicKeyHash },
          select: {
            grantedAt: true,
            keyStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return files.map(file => ({
      id: file.id,
      fileName: file.fileName,
      totalSize: file.totalSize,
      chunkCount: file.chunkCount,
      mimeType: file.mimeType,
      status: file.status,
      ownershipPublicKey: file.ownershipPublicKey,
      grantedAt: file.anonymousAccess[0]?.grantedAt,
      keyStatus: file.anonymousAccess[0]?.keyStatus,
      createdAt: file.createdAt,
      // ✅ No userId or PII returned in response
    }));
  } catch (error) {
    console.error('[ChunkService] List anonymous accessible files error:', error);
    throw error;
  }
}

module.exports = {
  uploadFileWithChunks,
  downloadAndDecryptChunk,
  reportIntegrityAlert, // Updated to use publicKeyHash instead of userId
  getAnonymousFileAccessInfo, // NEW: Anonymous replacement for getFileAccessInfo
  logAnonymousAuditEvent, // NEW: for anonymous audit logging
  listAnonymousAccessibleFiles, // NEW: Anonymous replacement for listUserFiles
};