/**
 * Access Management Service
 *
 * Encapsulates anonymous access lifecycle operations for file owners:
 * - list existing grants for a file
 * - grant access to new recipients
 * - revoke existing grants
 *
 * Each operation requires:
 * - Schnorr ownership proof (R, s, message, publicKey)
 * - LSAG ring signature with nonce-based replay protection
 */

const { EventEmitter } = require('events');
const crypto = require('crypto');
const { PrismaClient } = require('../config/prismaClient');
const { getSchnorr } = require('../utils/schnorr');
const { RingSignatureService } = require('./RingSignatureService');
const { secureLog, maskHashForLogging } = require('../utils/monitoring');

const AccessManagementEvents = new EventEmitter();

function normalizeHex(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim().toLowerCase();
  return trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
}

function normalizeMessage(message) {
  if (typeof message !== 'string') {
    return null;
  }
  const normalized = normalizeHex(message);
  const isHex = /^[0-9a-f]+$/i.test(normalized);
  if (isHex && normalized.length === 64) {
    return normalized;
  }
  const buffer = Buffer.from(message, 'utf-8');
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function verifySchnorrOwnership(ownershipProof, expectedPublicKey) {
  const schnorr = await getSchnorr();
  const { R, s, message, publicKey } = ownershipProof || {};

  const normalizedR = normalizeHex(R);
  const normalizedS = normalizeHex(s);
  const normalizedMessage = normalizeMessage(message);
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

function parseDateInput(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid expiresAt value');
  }
  return date;
}

class AccessManagementService {
  constructor({ prismaClient, ringService } = {}) {
    this.prisma = prismaClient || new PrismaClient();
    this.ringService = ringService || new RingSignatureService(this.prisma);
  }

  get events() {
    return AccessManagementEvents;
  }

  /**
   * Validate shared LSAG proof envelope
   */
  async _validateEnvelope({
    fileId,
    grantId,
    timestamp,
    nonce,
    ringSignature,
    messageBuilder,
    ownerPublicKey,
    activityType,
  }) {
    if (!timestamp || !Number.isFinite(Number(timestamp))) {
      throw new Error('Missing or invalid timestamp');
    }
    if (!nonce || typeof nonce !== 'string' || nonce.trim().length === 0) {
      throw new Error('Missing nonce');
    }
    if (!ringSignature || typeof ringSignature !== 'string') {
      throw new Error('Missing ring signature');
    }

    const numericTs = Number(timestamp);
    if (!this.ringService.verifyTimestamp(numericTs)) {
      throw new Error('Request timestamp is invalid or too old');
    }

    const nonceValidated = await this.ringService.verifyNonce(nonce.trim());
    if (!nonceValidated) {
      throw new Error('Nonce has already been used');
    }

    const message = messageBuilder({ fileId, grantId, timestamp: numericTs, nonce: nonce.trim() });
    const keyImageContext = {
      usageContext: 'owner-management',
      scopeId: fileId,
      activityType: activityType || null,
    };
    const ringValid = await this.ringService.verifyRingSignature({
      publicKey: ownerPublicKey,
      signature: ringSignature,
      message,
      ringPublicKeys: await this.ringService.getAllPublicKeys(),
      keyImageContext,
    });

    if (!ringValid) {
      throw new Error('Invalid ring signature');
    }

    return { numericTs, nonce: nonce.trim(), message };
  }

  async _loadFileOrThrow(fileId) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      select: {
        id: true,
        status: true,
        ownershipPublicKey: true,
        uploaderPublicKeyHash: true,
      },
    });
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  }

  async listGrants({ fileId, timestamp, nonce, ringSignature, ownershipProof }) {
    if (!fileId || typeof fileId !== 'string') {
      throw new Error('fileId is required');
    }

  const file = await this._loadFileOrThrow(fileId);
    await verifySchnorrOwnership(ownershipProof, file.ownershipPublicKey);

  await this._validateEnvelope({
      fileId,
      timestamp,
      nonce,
      ringSignature,
      ownerPublicKey: file.ownershipPublicKey,
      activityType: 'list-grants',
      messageBuilder: ({ fileId: fid, timestamp: ts, nonce: n }) => `list-grants:${fid}:${ts}:${n}`,
    });

    const grants = await this.prisma.anonymousFileAccess.findMany({
      where: { fileId },
      orderBy: { grantedAt: 'desc' },
    });

    const ownerHash = file.uploaderPublicKeyHash || this.ringService.hashPublicKey(file.ownershipPublicKey);
    const maskedOwner = maskHashForLogging(ownerHash, 'publicKeyHash');

    await this.prisma.anonymousAuditLog.create({
      data: {
        eventType: 'grant_listed',
        fileId,
        publicKeyHash: ownerHash,
        ringSignature,
        metadata: JSON.stringify({
          grantCount: grants.length,
          nonce,
          timestamp,
        }),
        status: 'success',
      },
    });

    secureLog('AccessManagementService', `Listed ${grants.length} grants for file ${fileId} by owner ${maskedOwner}`, 'info', {
      fileId,
      ownerPublicKeyHash: ownerHash,
      grantCount: grants.length,
    });

    return grants;
  }

  async grantAccess({
    fileId,
    targetPublicKey,
    expiresAt,
    metadata,
    keyPackageFingerprint,
    ownershipProof,
    ringSignature,
    timestamp,
    nonce,
  }) {
    if (!fileId || typeof fileId !== 'string') {
      throw new Error('fileId is required');
    }
    if (!targetPublicKey || typeof targetPublicKey !== 'string') {
      throw new Error('targetPublicKey is required');
    }

  const file = await this._loadFileOrThrow(fileId);
    if (file.status !== 'active') {
      throw new Error('File is not active');
    }

    await verifySchnorrOwnership(ownershipProof, file.ownershipPublicKey);

  const { numericTs, nonce: validatedNonce } = await this._validateEnvelope({
      fileId,
      timestamp,
      nonce,
      ringSignature,
      ownerPublicKey: file.ownershipPublicKey,
      activityType: 'grant',
      messageBuilder: ({ fileId: fid, timestamp: ts, nonce: n }) => {
        const recipientHash = this.ringService.hashPublicKey(targetPublicKey);
        return `grant:${fid}:${recipientHash}:${ts}:${n}`;
      },
    });

    const expiresAtDate = parseDateInput(expiresAt);
    const normalizedFingerprint = typeof keyPackageFingerprint === 'string'
      ? keyPackageFingerprint.trim().toLowerCase()
      : null;

    const ownerHash = file.uploaderPublicKeyHash || this.ringService.hashPublicKey(file.ownershipPublicKey);
    const recipientHash = this.ringService.hashPublicKey(targetPublicKey.trim());

    const existingGrant = await this.prisma.anonymousFileAccess.findUnique({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: recipientHash,
          fileId,
        },
      },
    });

    const now = new Date();
    let operation = 'created';
    let grantRecord;

    if (existingGrant) {
      grantRecord = await this.prisma.anonymousFileAccess.update({
        where: { id: existingGrant.id },
        data: {
          status: 'active',
          grantedAt: now,
          revokedAt: null,
          expiresAt: expiresAtDate,
          keyStatus: 'client-managed',
          keyPackageFingerprint: normalizedFingerprint,
          lastOwnerProof: JSON.stringify(ownershipProof),
        },
      });
      operation = 'updated';
    } else {
      grantRecord = await this.prisma.anonymousFileAccess.create({
        data: {
          accessorPublicKeyHash: recipientHash,
          fileId,
          grantedAt: now,
          expiresAt: expiresAtDate,
          status: 'active',
          keyStatus: 'client-managed',
          keyPackageFingerprint: normalizedFingerprint,
          lastOwnerProof: JSON.stringify(ownershipProof),
        },
      });
    }

    const auditPayload = {
      targetPublicKeyHash: recipientHash,
      operation,
      expiresAt: expiresAtDate ? expiresAtDate.toISOString() : null,
      keyPackageFingerprint: normalizedFingerprint,
      nonce: validatedNonce,
      timestamp: numericTs,
      status: grantRecord.status,
      revokedAt: grantRecord.revokedAt,
    };

    if (metadata && typeof metadata === 'object') {
      auditPayload.metadata = metadata;
    }

    await this.prisma.anonymousAuditLog.create({
      data: {
        eventType: operation === 'created' ? 'grant_issued' : 'grant_updated',
        fileId,
        publicKeyHash: ownerHash,
        ringSignature,
        metadata: JSON.stringify(auditPayload),
        status: grantRecord.status,
        revokedAt: grantRecord.revokedAt,
        lastOwnerProof: JSON.stringify(ownershipProof),
      },
    });

    const maskedOwner = maskHashForLogging(ownerHash, 'publicKeyHash');
    const maskedRecipient = maskHashForLogging(recipientHash, 'publicKeyHash');
    secureLog('AccessManagementService', `Grant ${operation} for file ${fileId}: owner ${maskedOwner} -> ${maskedRecipient}`, 'info', {
      fileId,
      operation,
      ownerPublicKeyHash: ownerHash,
      recipientPublicKeyHash: recipientHash,
    });

    AccessManagementEvents.emit('AccessGrantChanged', {
      type: operation,
      fileId,
      grant: grantRecord,
    });

    return { operation, grant: grantRecord };
  }

  async revokeAccess({
    fileId,
    grantId,
    ownershipProof,
    ringSignature,
    timestamp,
    nonce,
    reason,
  }) {
    if (!fileId || typeof fileId !== 'string') {
      throw new Error('fileId is required');
    }
    if (!grantId || typeof grantId !== 'string') {
      throw new Error('grantId is required');
    }

  const file = await this._loadFileOrThrow(fileId);
    await verifySchnorrOwnership(ownershipProof, file.ownershipPublicKey);

  const { numericTs, nonce: validatedNonce } = await this._validateEnvelope({
      fileId,
      grantId,
      timestamp,
      nonce,
      ringSignature,
      ownerPublicKey: file.ownershipPublicKey,
      activityType: 'revoke',
      messageBuilder: ({ fileId: fid, grantId: gid, timestamp: ts, nonce: n }) => `revoke:${fid}:${gid}:${ts}:${n}`,
    });

    const grant = await this.prisma.anonymousFileAccess.findUnique({
      where: { id: grantId },
    });

    if (!grant || grant.fileId !== fileId) {
      throw new Error('Grant not found for file');
    }

    if (grant.status === 'revoked') {
      return { operation: 'noop', grant };
    }

    const updatedGrant = await this.prisma.anonymousFileAccess.update({
      where: { id: grantId },
      data: {
        status: 'revoked',
        revokedAt: new Date(),
        lastOwnerProof: JSON.stringify(ownershipProof),
      },
    });

    const ownerHash = file.uploaderPublicKeyHash || this.ringService.hashPublicKey(file.ownershipPublicKey);
    const auditMetadata = {
      grantId,
      targetPublicKeyHash: grant.accessorPublicKeyHash,
      reason: reason || null,
      nonce: validatedNonce,
      timestamp: numericTs,
      status: updatedGrant.status,
      revokedAt: updatedGrant.revokedAt ? updatedGrant.revokedAt.toISOString() : null,
    };

    await this.prisma.anonymousAuditLog.create({
      data: {
        eventType: 'grant_revoked',
        fileId,
        publicKeyHash: ownerHash,
        ringSignature,
        metadata: JSON.stringify(auditMetadata),
        status: updatedGrant.status,
        revokedAt: updatedGrant.revokedAt,
        lastOwnerProof: JSON.stringify(ownershipProof),
      },
    });

    const maskedOwner = maskHashForLogging(ownerHash, 'publicKeyHash');
    const maskedRecipient = maskHashForLogging(grant.accessorPublicKeyHash, 'publicKeyHash');
    secureLog('AccessManagementService', `Grant revoked for file ${fileId}: owner ${maskedOwner} revoked ${maskedRecipient}`, 'info', {
      fileId,
      grantId,
      ownerPublicKeyHash: ownerHash,
      recipientPublicKeyHash: grant.accessorPublicKeyHash,
    });

    AccessManagementEvents.emit('AccessGrantChanged', {
      type: 'revoked',
      fileId,
      grant: updatedGrant,
    });

    return { operation: 'revoked', grant: updatedGrant };
  }
}

module.exports = {
  AccessManagementService,
  AccessManagementEvents,
};
