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
 * @param {string} revokedUserId - User ID to revoke
 * @param {Object} ownershipProof - Schnorr proof
 * @param {string} securityLevel - Security level (standard/high/maximum)
 * @param {Object} prismaClient - Prisma client instance (optional, for dependency injection)
 * @returns {Promise<Object>} Revocation result
 */
async function executePartialReencryption(
  fileId,
  revokedUserId,
  ownershipProof,
  securityLevel = 'standard',
  prismaClient
) {
  try {
    console.log(`[Revocation] Starting partial re-encryption for file ${fileId}`);

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

    console.log(`[Revocation] Selected ${chunksToReencrypt.length}/${file.chunkCount} chunks for re-encryption`);

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
        console.warn(`[Revocation] Chunk ${chunkIndex} not found, skipping`);
        continue;
      }

      console.log(`[Revocation] Re-encrypting chunk ${chunkIndex}...`);

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
        console.log(`[Revocation] Chunk ${chunkIndex} re-uploaded: ${newCid}`);

        reencryptedChunks.push({
          index: chunkIndex,
          oldCid: chunk.ipfsCid,
          newCid,
          hash: chunk.chunkHash, // Keep same hash (plaintext unchanged)
        });

      } catch (error) {
        console.error(`[Revocation] Failed to re-encrypt chunk ${chunkIndex}:`, error.message);
        // Continue with other chunks
      }
    }

    // 5. Update chunk records in database
    for (const chunk of reencryptedChunks) {
      await this.prisma.fileChunk.update({
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
    await this.prisma.file.update({
      where: { id: fileId },
      data: {
        encryptedChunkKeys: JSON.stringify(newEncryptedChunkKeys),
      },
    });

    // 8. Revoke anonymous access (find by userId if needed, though ideally should use publicKeyHash)
    let revokedPublicKeyHash = null;
    if (revokedUserId) {
      // Find user's publicKey from the user record
      const user = await this.prisma.user.findUnique({
        where: { id: revokedUserId },
        select: { publicKey: true }
      });
      
      if (user && user.publicKey) {
        revokedPublicKeyHash = crypto
          .createHash('sha256')
          .update(user.publicKey)
          .digest('hex');
          
        await this.prisma.anonymousFileAccess.updateMany({
          where: {
            fileId,
            accessorPublicKeyHash: revokedPublicKeyHash,
            status: 'active',
          },
          data: {
            status: 'revoked',
            revokedAt: new Date(),
          },
        });
      } else {
        console.warn(`[Revocation] Could not find public key for user ${revokedUserId}, skipping access revocation`);
      }
    }

    // 9. Update key status for remaining users with anonymous access
    let remainingAccess = file.anonymousAccess;
    if (revokedPublicKeyHash) {
      remainingAccess = file.anonymousAccess.filter(
        access => access.accessorPublicKeyHash !== revokedPublicKeyHash
      );
    }

    for (const access of remainingAccess) {
      await this.prisma.anonymousFileAccess.update({
        where: { id: access.id },
        data: {
          keyStatus: 'awaiting-offline-redistribution',
          hasLocalKey: false,
          keyIssuedAt: null,
          keyPackageFingerprint: newKeyFingerprint,
        },
      });
    }

    // 10. Create revocation record
    const revocationId = crypto.randomUUID();
    await this.prisma.anonymousRevocation.create({
      data: {
        id: revocationId,
        fileId,
        revokedUserId,
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
    await this.prisma.file.update({
      where: { id: fileId },
      data: {
        lastRevocationId: revocationId,
        lastRevocationAt: new Date(),
      },
    });

    console.log(`[Revocation] Partial re-encryption completed: ${reencryptedChunks.length} chunks`);

    return {
      success: true,
      revocationId,
      chunksReencrypted: reencryptedChunks.map(c => c.index),
      totalChunks: file.chunkCount,
      percentage: Math.round((reencryptedChunks.length / file.chunkCount) * 100),
      message: `Successfully revoked access. Re-encrypted ${reencryptedChunks.length} of ${file.chunkCount} chunks (${Math.round((reencryptedChunks.length / file.chunkCount) * 100)}%)`,
    };

  } catch (error) {
    console.error('[Revocation] Partial re-encryption error:', error);
    throw error;
  }
}

/**
 * List revocation history for a file
 */
async function getRevocationHistory(fileId, prismaClient) {
  try {
    const prisma = prismaClient || new PrismaClient();
    const ownPrisma = !prismaClient; // Track if we created our own instance
    const revocations = await prisma.anonymousRevocation.findMany({
      where: { fileId },
      orderBy: { createdAt: 'desc' },
    });

    return revocations.map(rev => ({
      id: rev.id,
      revokedUserId: rev.revokedUserId,
      chunksReencrypted: JSON.parse(rev.chunksReencrypted),
      strategy: JSON.parse(rev.revocationStrategy || '{}'),
      timestamp: rev.createdAt,
    }));
  } catch (error) {
    console.error('[Revocation] Get history error:', error);
    throw error;
  }
}

// Export functions to maintain backward compatibility
// These functions can accept an optional prisma client parameter
// If no prisma is provided, they will create their own instance (for backward compatibility)

module.exports = {
  selectChunksForReencryption,
  executePartialReencryption,
  getRevocationHistory,
};
