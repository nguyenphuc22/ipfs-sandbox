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

    // 5. Create user access record (uploader gets access)
    const keyPackageFingerprint = crypto
      .createHash('sha256')
      .update(`${fileRecord.id}:${masterKey}`)
      .digest('hex');

    await prisma.userFileAccess.create({
      data: {
        userId,
        fileId: fileRecord.id,
        grantedBy: userId,
        status: 'active',
        keyStatus: 'owner-local',
        hasLocalKey: true,
        keyIssuedAt: new Date(),
        keyPackageFingerprint,
      },
    });

    // 6. Create audit log
    await prisma.auditLog.create({
      data: {
        eventType: 'upload',
        fileId: fileRecord.id,
        userId,
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
 * Get file access information for download
 * @param {string} fileId - File ID
 * @param {string} userId - Requesting user ID
 * @returns {Promise<Object>} Access information
 */
async function getFileAccessInfo(fileId, userId) {
  try {
    // 1. Get file record
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' },
        },
        userAccess: {
          where: {
            userId,
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

    // 2. Check access permission
    if (file.userAccess.length === 0) {
      throw new Error('Access denied - no grant found');
    }

    const access = file.userAccess[0];

    // 3. Create chunk manifest
    const chunkManifest = file.chunks.map(chunk => ({
      index: chunk.chunkIndex,
      cid: chunk.ipfsCid,
      hash: chunk.chunkHash,
      size: chunk.size,
    }));

    // 4. Parse encrypted chunk keys
  // 5. Create ownership policy
    const ownershipPolicy = {
      ownershipPublicKey: file.ownershipPublicKey,
      status: file.status,
      revoked: file.status === 'revoked',
      lastRevocationAt: file.lastRevocationAt,
    };

    // 6. Log access intent
    await prisma.auditLog.create({
      data: {
        eventType: 'access_request',
        fileId: file.id,
        userId,
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
        hasLocalKey: access.hasLocalKey,
        keyIssuedAt: access.keyIssuedAt,
        keyPackageFingerprint: access.keyPackageFingerprint,
      },
      chunkManifest,
      ownershipPolicy,
      grantedAt: access.grantedAt,
    };

  } catch (error) {
    console.error('[ChunkService] Get access info error:', error);
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
 * Report integrity alert
 * @param {string} fileId - File ID
 * @param {number} chunkIndex - Chunk index
 * @param {string} expectedHash - Expected hash
 * @param {string} actualHash - Actual computed hash
 * @param {string} userId - Reporter user ID
 */
async function reportIntegrityAlert(fileId, chunkIndex, expectedHash, actualHash, userId) {
  try {
    await prisma.integrityAlert.create({
      data: {
        fileId,
        chunkIndex,
        expectedHash,
        actualHash,
        reportedBy: userId,
      },
    });

    console.log(`[ChunkService] Integrity alert reported for file ${fileId}, chunk ${chunkIndex}`);
  } catch (error) {
    console.error('[ChunkService] Report integrity alert error:', error);
    throw error;
  }
}

/**
 * Log audit event
 * @param {string} eventType - Event type (download, view, share, etc.)
 * @param {string} fileId - File ID
 * @param {string} userId - User ID
 * @param {Object} metadata - Additional metadata
 */
async function logAuditEvent(eventType, fileId, userId, metadata = {}) {
  try {
    await prisma.auditLog.create({
      data: {
        eventType,
        fileId,
        userId,
        metadata: JSON.stringify(metadata),
      },
    });
  } catch (error) {
    console.error('[ChunkService] Log audit event error:', error);
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * List user's accessible files
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of files
 */
async function listUserFiles(userId) {
  try {
    const files = await prisma.file.findMany({
      where: {
        userAccess: {
          some: {
            userId,
            status: 'active',
          },
        },
      },
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
          },
        },
        userAccess: {
          where: { userId },
          select: {
            grantedAt: true,
            grantedBy: true,
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
      uploader: file.uploader,
      grantedAt: file.userAccess[0]?.grantedAt,
      keyStatus: file.userAccess[0]?.keyStatus,
      hasLocalKey: file.userAccess[0]?.hasLocalKey,
      createdAt: file.createdAt,
    }));
  } catch (error) {
    console.error('[ChunkService] List user files error:', error);
    throw error;
  }
}

module.exports = {
  uploadFileWithChunks,
  getFileAccessInfo,
  downloadAndDecryptChunk,
  reportIntegrityAlert,
  logAuditEvent,
  listUserFiles,
};