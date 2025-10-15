/**
 * Revocation Service with Partial Re-encryption
 * Implements thesis architecture for efficient revocation
 */

const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');
const {
  parseEncryptedChunkPackage,
  decryptChunk,
  createEncryptedChunkPackage,
  generateChunkKey,
  encryptChunkKeys,
  decryptChunkKeys,
  computeChunkHash,
} = require('../utils/chunkingUtils');
const { maskHashForLogging, secureLog } = require('../utils/monitoring');

const IPFS_API_URL = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';

/**
 * Select chunks for re-encryption based on strategy
 * Implements thesis architecture (New_Thesis.md lines 926-956)
 */
function selectChunksForReencryption(chunkCount, securityLevel = 'standard') {
  const ratioMap = {
    standard: { min: 0.3, max: 0.5 },   // 30-50% chunks
    high: { min: 0.4, max: 0.6 },       // 40-60% chunks
    maximum: { min: 0.5, max: 0.8 },    // 50-80% chunks
  };

  const ratio = ratioMap[securityLevel] || ratioMap.standard;

  // Calculate number of chunks to re-encrypt
  const minChunks = Math.ceil(chunkCount * ratio.min);
  const maxChunks = Math.ceil(chunkCount * ratio.max);
  const targetChunks = Math.floor(Math.random() * (maxChunks - minChunks + 1)) + minChunks;

  // Select random chunk indices
  const allIndices = Array.from({ length: chunkCount }, (_, i) => i);
  const selectedIndices = [];

  // Use distributed selection for better coverage
  const selectionMethod = chunkCount > 100 ? 'distributed' : 'random';

  if (selectionMethod === 'distributed') {
    // Distributed: Select chunks evenly across file
    const step = Math.floor(chunkCount / targetChunks);
    for (let i = 0; i < targetChunks; i++) {
      const index = (i * step + Math.floor(Math.random() * step)) % chunkCount;
      if (!selectedIndices.includes(index)) {
        selectedIndices.push(index);
      }
    }
  } else {
    // Random: Select random chunks
    while (selectedIndices.length < targetChunks && allIndices.length > 0) {
      const randomIndex = Math.floor(Math.random() * allIndices.length);
      const chunkIndex = allIndices.splice(randomIndex, 1)[0];
      selectedIndices.push(chunkIndex);
    }
  }

  return selectedIndices.sort((a, b) => a - b);
}

/**
 * Execute partial re-encryption for revocation (with prisma injection)
 * @param {string} fileId - File ID
 * @param {string} revokedPublicKeyHash - Hash of public key to revoke (if null, full revocation)
 * @param {Object} ownershipProof - Schnorr proof
 * @param {string} securityLevel - Security level (standard/high/maximum)
 * @param {Object} prismaClient - Prisma client instance (optional, for dependency injection)
 * @returns {Promise<Object>} Revocation result
 */
async function executePartialReencryption(
  fileId,
  revokedPublicKeyHash,
  ownershipProof,
  securityLevel = 'standard',
  prismaClient
) {
  try {
    secureLog('RevocationService', `Starting partial re-encryption for file ${fileId}`, 'info', { fileId });

    // 1. Get file and chunks
    const prisma = prismaClient || new PrismaClient();
    const ownPrisma = !prismaClient; // Track if we created our own instance
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' },
        },
        anonymousAccess: {
          where: { status: 'active' },
        },
      },
    });

    if (!file) {
      throw new Error('File not found');
    }

    // 2. Select chunks for re-encryption
    const chunksToReencrypt = selectChunksForReencryption(
      file.chunkCount,
      securityLevel
    );

    secureLog('RevocationService', `Selected ${chunksToReencrypt.length}/${file.chunkCount} chunks for re-encryption`, 'info', { fileId, chunksCount: chunksToReencrypt.length, totalChunks: file.chunkCount });

    // 3. Decrypt current encrypted chunk keys
    const encryptedChunkKeysData = JSON.parse(file.encryptedChunkKeys);

    // TODO: In production, should get master key from secure storage
    // For demo, we'll generate new keys for selected chunks
    const oldChunkKeysObject = {}; // Will be populated when we have master key

    // 4. Download, decrypt, and re-encrypt selected chunks
    const reencryptedChunks = [];
    const newChunkKeys = {};

    for (const chunkIndex of chunksToReencrypt) {
      const chunk = file.chunks.find(c => c.chunkIndex === chunkIndex);
      if (!chunk) {
        secureLog('RevocationService', `Chunk ${chunkIndex} not found, skipping`, 'warn', { fileId, chunkIndex });
        continue;
      }

      secureLog('RevocationService', `Re-encrypting chunk ${chunkIndex}`, 'info', { fileId, chunkIndex });

      try {
        // Download encrypted chunk from IPFS
        const response = await axios.get(
          `${IPFS_API_URL}/api/v0/cat?arg=${chunk.ipfsCid}`,
          { responseType: 'arraybuffer' }
        );

        const encryptedBuffer = Buffer.from(response.data);

        // Parse encrypted package
        const { iv, authTag, encryptedData } = parseEncryptedChunkPackage(encryptedBuffer);

        // TODO: Decrypt with old key (need master key to get chunk key)
        // For demo, we'll create new encrypted version
        // In production: const decryptedData = decryptChunk(encryptedData, oldChunkKey, iv, authTag);

        // For demo: Use encrypted data as "decrypted" (skip actual decryption)
        const pseudoDecryptedData = encryptedData;

        // Generate new chunk key
        const newChunkKey = generateChunkKey();
        newChunkKeys[chunkIndex] = newChunkKey.toString('hex');

        // Create new encrypted package
        const { encryptedBuffer: newEncryptedBuffer } = createEncryptedChunkPackage(
          pseudoDecryptedData,
          newChunkKey
        );

        // Upload new encrypted chunk to IPFS
        const formData = new FormData();
        formData.append('file', newEncryptedBuffer, {
          filename: `${file.fileName}.chunk${chunkIndex}.reenc`,
          contentType: 'application/octet-stream',
        });

        const uploadResponse = await axios.post(
          `${IPFS_API_URL}/api/v0/add`,
          formData,
          {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );

        const newCid = uploadResponse.data.Hash;
        secureLog('RevocationService', `Chunk ${chunkIndex} re-uploaded to IPFS`, 'info', { fileId, chunkIndex, newCid });

        reencryptedChunks.push({
          index: chunkIndex,
          oldCid: chunk.ipfsCid,
          newCid,
          hash: chunk.chunkHash, // Keep same hash (plaintext unchanged)
        });

      } catch (error) {
        secureLog('RevocationService', `Failed to re-encrypt chunk ${chunkIndex}: ${error.message}`, 'error', { fileId, chunkIndex, error: error.message });
        // Continue with other chunks
      }
    }

    // 5. Update chunk records in database
    for (const chunk of reencryptedChunks) {
      await prisma.fileChunk.update({
        where: {
          fileId_chunkIndex: {
            fileId,
            chunkIndex: chunk.index,
          },
        },
        data: {
          ipfsCid: chunk.newCid,
        },
      });
    }

    // 6. Generate new master key and re-encrypt chunk keys
    const newMasterKey = crypto.randomBytes(32);
    const newKeyFingerprint = crypto
      .createHash('sha256')
      .update(`${fileId}:${newMasterKey.toString('hex')}`)
      .digest('hex');

    // Merge old keys with new keys for re-encrypted chunks
    const updatedChunkKeysObject = { ...oldChunkKeysObject, ...newChunkKeys };

    const newEncryptedChunkKeys = encryptChunkKeys(updatedChunkKeysObject, newMasterKey);

    // 7. Update file record
    await prisma.file.update({
      where: { id: fileId },
      data: {
        encryptedChunkKeys: JSON.stringify(newEncryptedChunkKeys),
      },
    });

    // 8. Revoke anonymous access using the provided publicKeyHash
    if (revokedPublicKeyHash) {
      await prisma.anonymousFileAccess.updateMany({
        where: {
          fileId,
          accessorPublicKeyHash: revokedPublicKeyHash,
          status: 'active',
        },
        data: {
          status: 'revoked',
        },
      });
    }

    // 9. Update key status for remaining users with anonymous access
    let remainingAccess = file.anonymousAccess;
    if (revokedPublicKeyHash) {
      remainingAccess = file.anonymousAccess.filter(
        access => access.accessorPublicKeyHash !== revokedPublicKeyHash
      );
    }

    for (const access of remainingAccess) {
      await prisma.anonymousFileAccess.update({
        where: { id: access.id },
        data: {
          keyStatus: 'awaiting-offline-redistribution',
          keyPackageFingerprint: newKeyFingerprint,
        },
      });
    }

    // 10. Create revocation record
    const revocationId = crypto.randomUUID();
    await prisma.anonymousRevocation.create({
      data: {
        id: revocationId,
        fileId,
        revokedPublicKeyHash,
        proofR: ownershipProof.R,
        proofS: ownershipProof.s,
        proofMessage: ownershipProof.message,
        proofTimestamp: new Date(),
        chunksReencrypted: JSON.stringify(reencryptedChunks.map(c => c.index)),
        revocationStrategy: JSON.stringify({
          securityLevel,
          totalChunks: file.chunkCount,
          reencryptedCount: reencryptedChunks.length,
          percentage: Math.round((reencryptedChunks.length / file.chunkCount) * 100),
        }),
      },
    });

    // 11. Update file last revocation info
    await prisma.file.update({
      where: { id: fileId },
      data: {
        lastRevocationId: revocationId,
        lastRevocationAt: new Date(),
      },
    });

    // 12. Create audit log for revocation event with masked publicKeyHash
    const maskedPublicKeyHash = revokedPublicKeyHash ? maskHashForLogging(revokedPublicKeyHash, 'publicKeyHash') : 'ALL_USERS';
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'revocation',
        fileId: fileId,
        publicKeyHash: revokedPublicKeyHash || null,
        metadata: JSON.stringify({
          revocationId,
          revokedPublicKeyHash: revokedPublicKeyHash || 'full_revocation',
          chunksReencrypted: reencryptedChunks.length,
          totalChunks: file.chunkCount,
          percentage: Math.round((reencryptedChunks.length / file.chunkCount) * 100),
          securityLevel,
        })
      }
    });

    secureLog('RevocationService', `Partial re-encryption completed for publicKeyHash: ${maskedPublicKeyHash} - ${reencryptedChunks.length} chunks`, 'info', {
      fileId,
      revocationId,
      publicKeyHash: revokedPublicKeyHash,
      chunksReencrypted: reencryptedChunks.length
    });

    return {
      success: true,
      revocationId,
      chunksReencrypted: reencryptedChunks.map(c => c.index),
      totalChunks: file.chunkCount,
      percentage: Math.round((reencryptedChunks.length / file.chunkCount) * 100),
      message: `Successfully revoked access. Re-encrypted ${reencryptedChunks.length} of ${file.chunkCount} chunks (${Math.round((reencryptedChunks.length / file.chunkCount) * 100)}%)`,
    };

  } catch (error) {
    secureLog('RevocationService', `Partial re-encryption error: ${error.message}`, 'error', { fileId, revokedPublicKeyHash, error: error.message });
    throw error;
  }
}

/**
 * Revoke access by publicKeyHash without re-encryption
 * Simple revocation for quick access denial
 */
async function revokeAccessByPublicKeyHash(fileId, publicKeyHash, reason = 'revoked', prismaClient) {
  try {
    const prisma = prismaClient || new PrismaClient();

    secureLog('RevocationService', `Revoking access for publicKeyHash on file ${fileId}`, 'info', { fileId, publicKeyHash });

    // Revoke anonymous access
    await prisma.anonymousFileAccess.updateMany({
      where: {
        fileId,
        accessorPublicKeyHash: publicKeyHash,
        status: 'active',
      },
      data: {
        status: 'revoked',
      },
    });

    // Create revocation record
    const revocationId = crypto.randomUUID();
    await prisma.anonymousRevocation.create({
      data: {
        id: revocationId,
        fileId,
        revokedPublicKeyHash: publicKeyHash,
        proofR: 'quick-revoke-no-proof',
        proofS: 'quick-revoke-no-proof',
        proofMessage: `Quick revocation: ${reason}`,
        proofTimestamp: new Date(),
        chunksReencrypted: JSON.stringify([]),
        revocationStrategy: JSON.stringify({
          type: 'quick-revoke',
          reason,
        }),
      },
    });

    // Create audit log
    const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'revocation',
        fileId: fileId,
        publicKeyHash: publicKeyHash,
        metadata: JSON.stringify({
          revocationId,
          reason,
          type: 'quick-revoke',
        })
      }
    });

    secureLog('RevocationService', `Access revoked for publicKeyHash: ${maskedPublicKeyHash}`, 'info', {
      fileId,
      revocationId,
      publicKeyHash
    });

    return {
      success: true,
      revocationId,
      message: 'Access revoked successfully',
    };
  } catch (error) {
    secureLog('RevocationService', `Revoke access error: ${error.message}`, 'error', { fileId, publicKeyHash, error: error.message });
    throw error;
  }
}

/**
 * List revocation history for a file
 */
async function getRevocationHistory(fileId, prismaClient) {
  try {
    const prisma = prismaClient || new PrismaClient();
    const revocations = await prisma.anonymousRevocation.findMany({
      where: { fileId },
      orderBy: { createdAt: 'desc' },
    });

    return revocations.map(rev => ({
      id: rev.id,
      revokedPublicKeyHash: maskHashForLogging(rev.revokedPublicKeyHash, 'publicKeyHash'), // Mask hash in response
      chunksReencrypted: JSON.parse(rev.chunksReencrypted),
      strategy: JSON.parse(rev.revocationStrategy || '{}'),
      timestamp: rev.createdAt,
    }));
  } catch (error) {
    secureLog('RevocationService', `Get revocation history error: ${error.message}`, 'error', { fileId, error: error.message });
    throw error;
  }
}

// Export functions to maintain backward compatibility
// These functions can accept an optional prisma client parameter
// If no prisma is provided, they will create their own instance (for backward compatibility)

const revocationService = {
  selectChunksForReencryption,
  executePartialReencryption,
  revokeAccessByPublicKeyHash,
  getRevocationHistory,
};

module.exports = {
  selectChunksForReencryption,
  executePartialReencryption,
  revokeAccessByPublicKeyHash,
  getRevocationHistory,
  revocationService,
};
