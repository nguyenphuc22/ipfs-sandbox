/**
 * Revocation Service with Partial Re-encryption
 * Implements thesis architecture for efficient revocation
 */

const { PrismaClient } = require('../config/prismaClient');
const crypto = require('crypto');
const { RingSignatureService, ringSignatureService } = require('./RingSignatureService');
const {
  encryptChunkKeys,
  decryptChunkKeys,
} = require('../utils/chunkingUtils');
const { maskHashForLogging, secureLog } = require('../utils/monitoring');
const { getRingContext } = require('../utils/aotStorage');
const { verifySchnorrOwnership, computeSha256Hex } = require('../utils/ownershipProof');

function normalizeHex(value) {
  if (typeof value !== 'string') {
    throw new Error('Invalid hex value');
  }
  const trimmed = value.trim().toLowerCase();
  return trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
}

function normalizeChunkKeyRecord(record = {}) {
  const normalized = {};
  for (const [index, value] of Object.entries(record)) {
    if (typeof value !== 'string') {
      throw new Error(`Chunk key for index ${index} must be a hex string`);
    }
    const normalizedHex = normalizeHex(value);
    if (normalizedHex.length !== 64) {
      throw new Error(`Chunk key for index ${index} must be 32-byte hex string`);
    }
    normalized[String(index)] = normalizedHex;
  }
  return normalized;
}

function hashChunkKeyHex(keyHex) {
  const buffer = Buffer.from(normalizeHex(keyHex), 'hex');
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function buildChunkKeyHashMap(chunkKeys = {}) {
  const hashMap = {};
  for (const [index, keyHex] of Object.entries(chunkKeys)) {
    hashMap[String(index)] = hashChunkKeyHex(keyHex);
  }
  return hashMap;
}

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
async function prepareClientReencryption(params = {}) {
  let prisma;
  let ownPrisma = false;
  const {
    fileId,
    revokedPublicKeyHash = null,
    message,
    ringSignature,
    ownershipProof = {},
    securityLevel = 'standard',
    keyPackage,
    prismaClient,
    ringService: providedRingService,
  } = params || {};

  try {
    if (!fileId || typeof fileId !== 'string') {
      throw new Error('fileId is required for revocation');
    }

    if (!message || typeof message !== 'string') {
      throw new Error('Revocation message is required');
    }

    if (!ownershipProof || typeof ownershipProof !== 'object') {
      throw new Error('Schnorr ownership proof is required');
    }

    if (!keyPackage || typeof keyPackage !== 'object') {
      throw new Error('Key package is required for client-side re-encryption');
    }

    secureLog('RevocationService', `Preparing client-side re-encryption manifest for file ${fileId}`, 'info', {
      fileId,
      revokedPublicKeyHash,
      securityLevel,
    });

    const { masterKey: masterKeyHex, chunkKeys } = keyPackage;

    if (!masterKeyHex || typeof masterKeyHex !== 'string') {
      throw new Error('Key package missing masterKey');
    }

    if (!chunkKeys || typeof chunkKeys !== 'object') {
      throw new Error('Key package missing chunkKeys');
    }

    const masterKeyBuffer = Buffer.from(normalizeHex(masterKeyHex), 'hex');
    if (masterKeyBuffer.length !== 32) {
      throw new Error('masterKey must be a 32-byte hex string');
    }

    const providedChunkKeys = normalizeChunkKeyRecord(chunkKeys);

    prisma = prismaClient || new PrismaClient();
    ownPrisma = !prismaClient;

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

    if (file.chunkCount <= 0) {
      throw new Error('File does not contain chunk metadata');
    }

    let encryptedChunkKeysData;
    try {
      encryptedChunkKeysData = JSON.parse(file.encryptedChunkKeys);
    } catch (error) {
      throw new Error('Stored chunk key package is corrupted');
    }

    let existingChunkKeys;
    try {
      existingChunkKeys = decryptChunkKeys(
        encryptedChunkKeysData.encryptedData,
        encryptedChunkKeysData.iv,
        encryptedChunkKeysData.authTag,
        masterKeyBuffer,
      );
    } catch (error) {
      throw new Error('Failed to decrypt stored chunk keys with provided master key');
    }

    const normalizedExistingChunkKeys = normalizeChunkKeyRecord(existingChunkKeys);

    const missingIndices = [];
    for (let i = 0; i < file.chunkCount; i += 1) {
      const indexKey = String(i);
      const providedKey = providedChunkKeys[indexKey];
      const storedKey = normalizedExistingChunkKeys[indexKey];
      if (!providedKey || !storedKey) {
        missingIndices.push(i);
        continue;
      }
      if (providedKey !== storedKey) {
        throw new Error(`Chunk key mismatch detected at index ${i}`);
      }
    }

    if (missingIndices.length > 0) {
      throw new Error(`Key package missing chunk keys for indices: ${missingIndices.join(', ')}`);
    }

    let authContext;
    try {
      authContext = await verifySchnorrOwnership({
        proof: ownershipProof,
        expectedPublicKey: file.ownershipPublicKey,
        expectedMessage: message,
      });
    } catch (error) {
      secureLog('RevocationService', `Schnorr verification failed during manifest preparation: ${error.message}`, 'warn', {
        fileId,
        revokedPublicKeyHash,
        error: error.message,
      });
      throw new Error(`Schnorr verification failed: ${error.message}`);
    }

    if (!Array.isArray(authContext.segments) || authContext.segments.length < 5) {
      throw new Error('Revocation message format is invalid');
    }

    const actionSegment = authContext.segments[0];
    if (actionSegment !== 'revoke-reencrypt') {
      throw new Error('Revocation message action mismatch');
    }

    const messageFileId = authContext.segments[1];
    if (messageFileId !== fileId) {
      throw new Error('Revocation message does not target the requested file');
    }

    const messageTargetHash = authContext.segments[2] || null;
    let resolvedRevokedHash = revokedPublicKeyHash || messageTargetHash || null;
    if (revokedPublicKeyHash && messageTargetHash && revokedPublicKeyHash !== messageTargetHash) {
      throw new Error('Revocation message target does not match revoked public key hash');
    }

    const existingProof = await prisma.anonymousRevocation.findFirst({
      where: {
        fileId,
        proofMessage: authContext.messageHash,
      },
    });

    if (existingProof) {
      throw new Error('Schnorr proof message has already been used (possible replay)');
    }

    const ringContext = getRingContext();
    const ringMembers = Array.isArray(ringContext.ringMemberPublicKeys)
      ? ringContext.ringMemberPublicKeys
      : [];
    let messageDigest = null;

    if (ringMembers.length >= 2) {
      if (!ringSignature) {
        throw new Error('Ring signature is required for revocation');
      }

      const ringService = providedRingService || ringSignatureService || new RingSignatureService(prisma);
      messageDigest = computeSha256Hex(message);
      const ringValid = await ringService.verifyRingSignature({
        publicKey: file.ownershipPublicKey,
        signature: ringSignature,
        message,
        ringPublicKeys: ringMembers,
        keyImageContext: {
          usageContext: 'owner-revocation',
          scopeId: fileId,
          activityType: 'revocation',
          actorPublicKey: file.ownershipPublicKey,
          messageDigest,
        },
      });

      if (!ringValid) {
        secureLog('RevocationService', 'Ring signature verification failed for client manifest preparation', 'warn', {
          fileId,
          revokedPublicKeyHash,
          messageDigest,
        });
        throw new Error('Invalid ring signature for revocation');
      }
    }

    const chunksToReencrypt = selectChunksForReencryption(
      file.chunkCount,
      securityLevel,
    );

    if (chunksToReencrypt.length === 0) {
      throw new Error('Failed to select chunks for re-encryption');
    }

    const manifestChunks = chunksToReencrypt.map((index) => {
      const chunk = file.chunks.find((entry) => entry.chunkIndex === index);
      if (!chunk) {
        throw new Error(`Chunk metadata missing for index ${index}`);
      }
      return {
        index,
        cid: chunk.ipfsCid,
        size: chunk.size,
        originalHash: chunk.chunkHash,
      };
    });

    const chunkKeyHashes = buildChunkKeyHashMap(normalizedExistingChunkKeys);
    const preparedAt = new Date().toISOString();

    const revocationStrategy = {
      type: 'client-reencryption',
      status: 'pending',
      securityLevel,
      totalChunks: file.chunkCount,
      selectedChunkIndices: chunksToReencrypt,
      chunkKeyHashes,
      preparedAt,
      messageDigest,
    };

    const revocationRecord = await prisma.anonymousRevocation.create({
      data: {
        fileId,
        revokedPublicKeyHash: resolvedRevokedHash,
        proofR: ownershipProof.R,
        proofS: ownershipProof.s,
        proofMessage: authContext.messageHash,
        proofTimestamp: new Date(authContext.timestamp || Date.now()),
        ringSignature: ringSignature || null,
        ringPublicKeys: ringMembers.length > 0 ? JSON.stringify(ringMembers) : null,
        chunksReencrypted: JSON.stringify([]),
        revocationStrategy: JSON.stringify(revocationStrategy),
      },
    });

    secureLog('RevocationService', `Prepared client manifest ${revocationRecord.id} for file ${fileId}`, 'info', {
      fileId,
      revocationId: revocationRecord.id,
      revokedPublicKeyHash: resolvedRevokedHash,
      selectedChunks: chunksToReencrypt.length,
      totalChunks: file.chunkCount,
    });

    return {
      success: true,
      revocationId: revocationRecord.id,
      fileId,
      revokedPublicKeyHash: resolvedRevokedHash,
      messageHash: authContext.messageHash,
      timestamp: authContext.timestamp,
      nonce: authContext.nonce,
      ringMembers,
      manifest: {
        fileId,
        securityLevel,
        chunkCount: file.chunkCount,
        preparedAt,
        selectedChunks: manifestChunks,
      },
    };
  } catch (error) {
    secureLog('RevocationService', `Client manifest preparation error: ${error.message}`, 'error', {
      fileId,
      revokedPublicKeyHash,
      error: error.message,
    });
    throw error;
  } finally {
    if (ownPrisma && prisma) {
      await prisma.$disconnect().catch(() => {});
    }
  }
}

async function finalizeClientReencryption(params = {}) {
  let prisma;
  let ownPrisma = false;
  const {
    revocationId,
    fileId,
    message,
    ringSignature,
    ownershipProof = {},
    keyPackage,
    reencryptedChunks = [],
    prismaClient,
    ringService: providedRingService,
  } = params || {};

  try {
    if (!revocationId || typeof revocationId !== 'string') {
      throw new Error('revocationId is required');
    }

    if (!fileId || typeof fileId !== 'string') {
      throw new Error('fileId is required');
    }

    if (!message || typeof message !== 'string') {
      throw new Error('Revocation message is required');
    }

    if (!ownershipProof || typeof ownershipProof !== 'object') {
      throw new Error('Schnorr ownership proof is required');
    }

    if (!keyPackage || typeof keyPackage !== 'object') {
      throw new Error('Key package is required to finalize re-encryption');
    }

    const { masterKey: newMasterKeyHex, chunkKeys } = keyPackage;

    if (!newMasterKeyHex || typeof newMasterKeyHex !== 'string') {
      throw new Error('Key package missing masterKey');
    }

    if (!chunkKeys || typeof chunkKeys !== 'object') {
      throw new Error('Key package missing chunkKeys');
    }

    const normalizedNewMasterKeyHex = normalizeHex(newMasterKeyHex);
    const newMasterKeyBuffer = Buffer.from(normalizedNewMasterKeyHex, 'hex');
    if (newMasterKeyBuffer.length !== 32) {
      throw new Error('masterKey must be a 32-byte hex string');
    }

    const providedChunkKeys = normalizeChunkKeyRecord(chunkKeys);

    prisma = prismaClient || new PrismaClient();
    ownPrisma = !prismaClient;

    const revocation = await prisma.anonymousRevocation.findUnique({
      where: { id: revocationId },
      include: {
        file: {
          include: {
            chunks: {
              orderBy: { chunkIndex: 'asc' },
            },
            anonymousAccess: true,
          },
        },
      },
    });

    if (!revocation || !revocation.file) {
      throw new Error('Revocation manifest not found');
    }

    if (revocation.fileId !== fileId) {
      throw new Error('Revocation manifest does not belong to the specified file');
    }

    let strategy;
    try {
      strategy = JSON.parse(revocation.revocationStrategy || '{}');
    } catch (error) {
      strategy = {};
    }

    if (strategy?.type !== 'client-reencryption') {
      throw new Error('Revocation record was not prepared for client-side re-encryption');
    }

    if (strategy?.status && strategy.status !== 'pending') {
      throw new Error('Revocation manifest has already been finalized');
    }

    const file = revocation.file;

    let authContext;
    try {
      authContext = await verifySchnorrOwnership({
        proof: ownershipProof,
        expectedPublicKey: file.ownershipPublicKey,
        expectedMessage: message,
      });
    } catch (error) {
      secureLog('RevocationService', `Schnorr verification failed during manifest finalization: ${error.message}`, 'warn', {
        fileId,
        revocationId,
        error: error.message,
      });
      throw new Error(`Schnorr verification failed: ${error.message}`);
    }

    if (authContext.messageHash !== revocation.proofMessage) {
      throw new Error('Schnorr proof message does not match prepared manifest');
    }

    if (!Array.isArray(authContext.segments) || authContext.segments.length < 5) {
      throw new Error('Revocation message format is invalid');
    }

    const actionSegment = authContext.segments[0];
    if (actionSegment !== 'revoke-reencrypt') {
      throw new Error('Revocation message action mismatch');
    }

    const messageFileId = authContext.segments[1];
    if (messageFileId !== fileId) {
      throw new Error('Revocation message does not target the requested file');
    }

    const messageTargetHash = authContext.segments[2] || null;
    if (revocation.revokedPublicKeyHash && messageTargetHash && revocation.revokedPublicKeyHash !== messageTargetHash) {
      throw new Error('Revocation message target does not match prepared manifest');
    }

    const ringContext = getRingContext();
    const ringMembers = Array.isArray(ringContext.ringMemberPublicKeys)
      ? ringContext.ringMemberPublicKeys
      : [];
    let messageDigest = null;

    if (ringMembers.length >= 2) {
      if (!ringSignature) {
        throw new Error('Ring signature is required to finalize revocation');
      }

      const ringService = providedRingService || ringSignatureService || new RingSignatureService(prisma);
      messageDigest = computeSha256Hex(message);
      const ringValid = await ringService.verifyRingSignature({
        publicKey: file.ownershipPublicKey,
        signature: ringSignature,
        message,
        ringPublicKeys: ringMembers,
        keyImageContext: {
          usageContext: 'owner-revocation',
          scopeId: fileId,
          activityType: 'revocation-finalize',
          actorPublicKey: file.ownershipPublicKey,
          messageDigest,
        },
      });

      if (!ringValid) {
        throw new Error('Invalid ring signature for revocation finalization');
      }
    }

    const selectedChunkIndices = Array.isArray(strategy.selectedChunkIndices)
      ? strategy.selectedChunkIndices.map((value) => Number(value))
      : [];

    if (selectedChunkIndices.length === 0) {
      throw new Error('Revocation manifest does not contain selected chunks');
    }

    if (!Array.isArray(reencryptedChunks) || reencryptedChunks.length !== selectedChunkIndices.length) {
      throw new Error('Re-encrypted chunk list does not match manifest selection');
    }

    const providedIndexSet = new Set();
    const normalizedReencryptedChunks = reencryptedChunks.map((chunk) => {
      const index = Number(chunk.index);
      if (!Number.isInteger(index)) {
        throw new Error('Re-encrypted chunk index must be an integer');
      }
      if (providedIndexSet.has(index)) {
        throw new Error(`Duplicate re-encrypted chunk index: ${index}`);
      }
      providedIndexSet.add(index);

      const manifestChunk = file.chunks.find((entry) => entry.chunkIndex === index);
      if (!manifestChunk) {
        throw new Error(`Chunk metadata missing for index ${index}`);
      }

      if (!chunk.oldCid || typeof chunk.oldCid !== 'string') {
        throw new Error(`Missing oldCid for chunk ${index}`);
      }
      if (chunk.oldCid !== manifestChunk.ipfsCid) {
        throw new Error(`oldCid mismatch for chunk ${index}`);
      }

      if (!chunk.newCid || typeof chunk.newCid !== 'string') {
        throw new Error(`Missing newCid for chunk ${index}`);
      }

      if (!chunk.hash || typeof chunk.hash !== 'string') {
        throw new Error(`Missing new hash for chunk ${index}`);
      }

      return {
        index,
        oldCid: chunk.oldCid,
        newCid: chunk.newCid,
        hash: chunk.hash,
        size: Number.isInteger(chunk.size) ? chunk.size : manifestChunk.size,
      };
    });

    for (const expectedIndex of selectedChunkIndices) {
      if (!providedIndexSet.has(Number(expectedIndex))) {
        throw new Error(`Missing re-encrypted data for chunk ${expectedIndex}`);
      }
    }

    const chunkKeyHashes = strategy?.chunkKeyHashes || {};
    const newChunkKeyHashes = buildChunkKeyHashMap(providedChunkKeys);

    for (let i = 0; i < file.chunkCount; i += 1) {
      const indexKey = String(i);
      const providedKey = providedChunkKeys[indexKey];
      if (!providedKey) {
        throw new Error(`Key package missing chunk key for index ${i}`);
      }

      const originalHash = chunkKeyHashes[indexKey];
      const newHash = newChunkKeyHashes[indexKey];

      if (originalHash) {
        if (selectedChunkIndices.includes(i)) {
          if (originalHash === newHash) {
            throw new Error(`Chunk key for index ${i} was not rotated`);
          }
        } else if (originalHash !== newHash) {
          throw new Error(`Chunk key for index ${i} must remain unchanged`);
        }
      }
    }

    const newEncryptedChunkKeys = encryptChunkKeys(providedChunkKeys, newMasterKeyBuffer);
    const newKeyFingerprint = crypto
      .createHash('sha256')
      .update(`${fileId}:${normalizedNewMasterKeyHex}`)
      .digest('hex');

    const reencryptedIndices = normalizedReencryptedChunks.map((chunk) => chunk.index);
    const remainingAccess = file.anonymousAccess.filter((access) => access.status === 'active');
    const remainingAccessIds = remainingAccess
      .filter((access) => access.accessorPublicKeyHash !== revocation.revokedPublicKeyHash)
      .map((access) => access.id);

    const maskedPublicKeyHash = revocation.revokedPublicKeyHash
      ? maskHashForLogging(revocation.revokedPublicKeyHash, 'publicKeyHash')
      : 'ALL_USERS';

    const finalizedAt = new Date();
    const updatedStrategy = {
      ...strategy,
      status: 'completed',
      finalizedAt: finalizedAt.toISOString(),
      reencryptedCount: reencryptedIndices.length,
      percentage: Math.round((reencryptedIndices.length / file.chunkCount) * 100),
      newKeyFingerprint,
    };

    await prisma.$transaction(async (tx) => {
      for (const chunk of normalizedReencryptedChunks) {
        await tx.fileChunk.update({
          where: {
            fileId_chunkIndex: {
              fileId,
              chunkIndex: chunk.index,
            },
          },
          data: {
            ipfsCid: chunk.newCid,
            chunkHash: chunk.hash,
            size: chunk.size,
          },
        });
      }

      await tx.file.update({
        where: { id: fileId },
        data: {
          encryptedChunkKeys: JSON.stringify(newEncryptedChunkKeys),
          lastRevocationId: revocationId,
          lastRevocationAt: finalizedAt,
        },
      });

      if (revocation.revokedPublicKeyHash) {
        await tx.anonymousFileAccess.updateMany({
          where: {
            fileId,
            accessorPublicKeyHash: revocation.revokedPublicKeyHash,
            status: 'active',
          },
          data: {
            status: 'revoked',
            revokedAt: finalizedAt,
          },
        });
      }

      if (remainingAccessIds.length > 0) {
        await tx.anonymousFileAccess.updateMany({
          where: {
            id: { in: remainingAccessIds },
          },
          data: {
            keyStatus: 'awaiting-offline-redistribution',
            keyPackageFingerprint: newKeyFingerprint,
          },
        });
      }

      await tx.anonymousRevocation.update({
        where: { id: revocationId },
        data: {
          proofR: ownershipProof.R,
          proofS: ownershipProof.s,
          proofTimestamp: new Date(authContext.timestamp || Date.now()),
          ringSignature: ringSignature || revocation.ringSignature || null,
          chunksReencrypted: JSON.stringify(reencryptedIndices),
          revocationStrategy: JSON.stringify(updatedStrategy),
        },
      });

      await tx.anonymousAuditLog.create({
        data: {
          eventType: 'revocation',
          fileId,
          publicKeyHash: revocation.revokedPublicKeyHash || null,
          metadata: JSON.stringify({
            revocationId,
            revokedPublicKeyHash: revocation.revokedPublicKeyHash || 'full_revocation',
            chunksReencrypted: reencryptedIndices.length,
            totalChunks: file.chunkCount,
            percentage: Math.round((reencryptedIndices.length / file.chunkCount) * 100),
            ownerProofNonce: authContext.nonce,
            ownerProofTimestamp: authContext.timestamp,
            messageDigest,
            newKeyFingerprint,
            strategy: 'client-reencryption',
          }),
        },
      });
    });

    secureLog('RevocationService', `Client manifest ${revocationId} finalized for ${maskedPublicKeyHash}`, 'info', {
      fileId,
      revocationId,
      chunksReencrypted: reencryptedIndices.length,
      newKeyFingerprint,
    });

    return {
      success: true,
      revocationId,
      chunksReencrypted: reencryptedIndices,
      totalChunks: file.chunkCount,
      percentage: Math.round((reencryptedIndices.length / file.chunkCount) * 100),
      newKeyFingerprint,
      manifestStatus: 'completed',
      message: `Client-side re-encryption finalized. Updated ${reencryptedIndices.length} of ${file.chunkCount} chunks`,
    };
  } catch (error) {
    secureLog('RevocationService', `Client manifest finalization error: ${error.message}`, 'error', {
      fileId,
      revocationId,
      error: error.message,
    });
    throw error;
  } finally {
    if (ownPrisma && prisma) {
      await prisma.$disconnect().catch(() => {});
    }
  }
}

async function executePartialReencryption() {
  throw new Error('Server-side re-encryption flow has been removed. Use prepareClientReencryption and finalizeClientReencryption instead.');
}

/**
 * Revoke access by publicKeyHash without re-encryption
 * Simple revocation for quick access denial
 */
async function revokeAccessByPublicKeyHash(fileId, publicKeyHash, reason = 'revoked', prismaClient, options = {}) {
  let prisma;
  let ownPrisma = false;
  try {
    prisma = prismaClient || new PrismaClient();
    ownPrisma = !prismaClient;

    const allowQuickRevoke = options?.adminOverride === true || process.env.ENABLE_QUICK_REVOKE === 'true';
    if (!allowQuickRevoke) {
      throw new Error('Quick revoke is disabled. Use partial re-encryption revoke flow.');
    }

    secureLog('RevocationService', `Quick revoke invoked for file ${fileId}`, 'warn', {
      fileId,
      publicKeyHash,
      reason,
      adminOverride: options?.adminOverride === true,
    });

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
          adminOverride: options?.adminOverride === true,
          requestedBy: options?.requestedBy || null,
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
          adminOverride: options?.adminOverride === true,
          requestedBy: options?.requestedBy || null,
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
  } finally {
    if (ownPrisma && prisma) {
      await prisma.$disconnect().catch(() => {});
    }
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
  prepareClientReencryption,
  finalizeClientReencryption,
  executePartialReencryption,
  revokeAccessByPublicKeyHash,
  getRevocationHistory,
};

module.exports = {
  selectChunksForReencryption,
  prepareClientReencryption,
  finalizeClientReencryption,
  executePartialReencryption,
  revokeAccessByPublicKeyHash,
  getRevocationHistory,
  revocationService,
};
