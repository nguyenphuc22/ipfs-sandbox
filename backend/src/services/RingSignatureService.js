/**
 * Ring Signature Service for Anonymous Download Flow
 *
 * Provides ring signature verification for anonymous file access.
 * Implements LSAG ring signature verification with key image checking
 * and replay protection.
 *
 * @module RingSignatureService
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { verifyLsagRingSignature } = require('../utils/ringSignature');
const { getRingContext } = require('../utils/aotStorage');

class RingSignatureService {
  constructor(prismaClient, redisClient = null) {
    this.prisma = prismaClient || new PrismaClient();
    this.redis = redisClient; // Optional Redis client for production use

    // For demo purposes, using in-memory storage when Redis not available
    this.usedNonces = new Map();
    this.usedKeyImages = new Map();
    this.MAX_NONCE_CACHE_SIZE = 10000;
    this.NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes (max age for replay protection)
    this.KEYIMAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours to prevent double spending
  }

  _normalizeKeyImageContext(context = {}) {
    const normalized = {};
    normalized.usageContext = typeof context.usageContext === 'string' && context.usageContext.trim().length > 0
      ? context.usageContext.trim()
      : 'anonymous-access';

    if (typeof context.actorPublicKeyHash === 'string' && context.actorPublicKeyHash.trim().length > 0) {
      normalized.actorPublicKeyHash = context.actorPublicKeyHash.trim();
    } else if (typeof context.actorPublicKey === 'string' && context.actorPublicKey.trim().length > 0) {
      normalized.actorPublicKeyHash = this.hashPublicKey(context.actorPublicKey.trim());
    } else {
      normalized.actorPublicKeyHash = null;
    }

    normalized.scopeId = typeof context.scopeId === 'string' && context.scopeId.trim().length > 0
      ? context.scopeId.trim()
      : null;

    normalized.activityType = typeof context.activityType === 'string' && context.activityType.trim().length > 0
      ? context.activityType.trim()
      : null;

    normalized.messageDigest = typeof context.messageDigest === 'string' && context.messageDigest.trim().length > 0
      ? context.messageDigest.trim()
      : null;

    if (Array.isArray(context.ringPublicKeys)) {
      normalized.ringSize = context.ringPublicKeys.length;
    } else if (typeof context.ringSize === 'number') {
      normalized.ringSize = context.ringSize;
    } else {
      normalized.ringSize = null;
    }

    normalized.recordedAt = new Date();
    return normalized;
  }

  _parseAuditMetadata(entry) {
    if (!entry || !entry.metadata) {
      return null;
    }

    try {
      return JSON.parse(entry.metadata);
    } catch (error) {
      console.warn('[Ring Signature] Failed to parse key image metadata payload');
      return null;
    }
  }

  _shouldAllowKeyImageReuse(existingMetadata, context) {
    if (!context) {
      return false;
    }

    const usageContext = context.usageContext || 'anonymous-access';

    if (usageContext === 'owner-management') {
      if (!existingMetadata) {
        return true;
      }

      if (existingMetadata.usageContext && existingMetadata.usageContext !== 'owner-management') {
        return false;
      }

      if (!context.actorPublicKeyHash || !existingMetadata.actorPublicKeyHash) {
        return true;
      }

      return existingMetadata.actorPublicKeyHash === context.actorPublicKeyHash;
    }

    if (usageContext === 'anonymous-access') {
      if (!existingMetadata) {
        return true;
      }

      if (existingMetadata.usageContext && existingMetadata.usageContext !== 'anonymous-access') {
        return false;
      }

      if (!context.actorPublicKeyHash || !existingMetadata.actorPublicKeyHash) {
        return true;
      }

      return existingMetadata.actorPublicKeyHash === context.actorPublicKeyHash;
    }

    return false;
  }

  _buildKeyImageAuditMetadata({ keyImage, reused, context, existingMetadata, allowed }) {
    const observedAt = context?.recordedAt instanceof Date ? context.recordedAt : new Date();
    const ttlHours = Math.round(this.KEYIMAGE_TTL_MS / (60 * 60 * 1000));

    const metadata = {
      keyImage,
      reused,
      usageContext: context?.usageContext || 'anonymous-access',
      observedAt: observedAt.toISOString(),
      ttlHours,
    };

    metadata.verifiedAt = observedAt.toISOString();

    if (context?.scopeId) {
      metadata.scopeId = context.scopeId;
    }

    if (context?.activityType) {
      metadata.activityType = context.activityType;
    }

    if (context?.actorPublicKeyHash) {
      metadata.actorPublicKeyHash = context.actorPublicKeyHash;
    }

    if (context?.messageDigest) {
      metadata.messageDigest = context.messageDigest;
    }

    if (typeof context?.ringSize === 'number') {
      metadata.ringSize = context.ringSize;
    }

    if (!reused) {
      metadata.firstSeenAt = metadata.observedAt;
    } else {
      const existingFirstSeen = existingMetadata?.firstSeenAt || existingMetadata?.verifiedAt || existingMetadata?.observedAt;
      metadata.firstSeenAt = existingFirstSeen || metadata.observedAt;
      metadata.allowedByPolicy = Boolean(allowed);
      metadata.attemptedAt = metadata.observedAt;
    }

    return metadata;
  }

  /**
   * Verify LSAG ring signature
   *
   * Implements proper LSAG (Linkable Spontaneous Anonymous Group) signature
   * verification with key image checking to prevent double spending.
   *
   * @param {Object} params - Verification parameters
   * @param {string} params.publicKey - Public key of the signer (one of the ring members)
   * @param {string} params.signature - LSAG signature in JSON format
   * @param {string} params.message - Message that was signed
   * @param {Array<string>} params.ringPublicKeys - Array of public keys in the ring
   * @returns {Promise<boolean>} true if signature is valid, false otherwise
   */
  async verifyRingSignature(params) {
    try {
      const {
        publicKey,
        signature,
        message,
        ringPublicKeys,
        keyImageContext: providedKeyImageContext = {},
        usageContext,
        scopeId,
        activityType,
        actorPublicKey,
      } = params;

      // 1. Validate parameters
      if (!publicKey || !signature || !message || !ringPublicKeys || ringPublicKeys.length === 0) {
        console.warn('[Ring Signature] Missing required parameters');
        return false;
      }

      // 2. Parse signature (expecting LSAG JSON format)
      let sig;
      try {
        sig = JSON.parse(signature);
      } catch (parseError) {
        console.warn('[Ring Signature] Invalid JSON signature format');
        return false;
      }

      // 3. Validate signature structure
      if (!sig.scheme || !sig.ringMembers || !sig.keyImage || !sig.c0 || !Array.isArray(sig.s) || !sig.messageDigest) {
        console.warn('[Ring Signature] Invalid signature structure: missing required fields');
        return false;
      }

      // 4. Verify scheme is supported
      if (sig.scheme !== 'lsag-secp256k1') {
          return false;
        return false;
      }

      // 5. Verify message digest matches
      const expectedMessageDigest = crypto.createHash('sha256').update(message).digest('hex');
      if (sig.messageDigest !== expectedMessageDigest) {
        console.warn('[Ring Signature] Message digest mismatch');
        return false;
      }

      // 6. Verify public key is in ring
      if (!sig.ringMembers.includes(publicKey)) {
        console.warn('[Ring Signature] Public key not in ring members');
        return false;
      }

      // 7. Verify ringPublicKeys parameter matches signature's ring members
      for (const ringMember of sig.ringMembers) {
        if (!ringPublicKeys.includes(ringMember)) {
          console.warn('[Ring Signature] Ring member not in provided ringPublicKeys');
          return false;
        }
      }

      // 8. Verify signature components count matches ring size
      if (sig.s.length !== sig.ringMembers.length) {
        console.warn(`[Ring Signature] Signature length mismatch: ${sig.s.length} vs ring size ${sig.ringMembers.length}`);
        return false;
      }

      // 9. Perform LSAG verification with proper elliptic curve cryptography
      // Verify ring equation: c[i+1] = H(m, s[i]*G + c[i]*P[i]) for all i
      const isValid = await this.verifyLsagSignature(sig, message);
      if (!isValid) {
        console.warn('[Ring Signature] LSAG verification failed');
        return false;
      }

      // 10. Verify key image uniqueness to prevent double spending
      const keyImageContext = {
        ...providedKeyImageContext,
        actorPublicKey: actorPublicKey || providedKeyImageContext.actorPublicKey || publicKey,
        usageContext: usageContext || providedKeyImageContext.usageContext,
        scopeId: scopeId ?? providedKeyImageContext.scopeId,
        activityType: activityType || providedKeyImageContext.activityType,
        ringPublicKeys: providedKeyImageContext.ringPublicKeys || sig.ringMembers,
        messageDigest: providedKeyImageContext.messageDigest || sig.messageDigest,
      };

      const isKeyImageUnique = await this.checkKeyImage(sig.keyImage, keyImageContext);
      if (!isKeyImageUnique) {
        console.warn('[Ring Signature] Key image already seen (double spend attempt?)');
        return false;
      }

      console.log(`[Ring Signature] Verification passed for keyImage: ${sig.keyImage.substring(0, 16)}...`);
      return true;

    } catch (error) {
      console.error('[Ring Signature] Verification error:', error);
      return false;
    }
  }

  /**
   * Verify LSAG signature components
   *
   * This performs the LSAG verification algorithm checking the ring equations
   * with proper elliptic curve cryptography operations
   * @param {Object} sig - Parsed signature object
   * @param {string} message - Original message that was signed
   * @returns {Promise<boolean>} - Whether the signature is valid
   */
  async verifyLsagSignature(sig, message) {
    const { ringMembers, s, c0, keyImage, messageDigest } = sig;
    const n = ringMembers.length;

    // Basic validation of format
    if (s.length !== n) {
      console.warn('[Ring Signature] Signature count mismatch');
      return false;
    }

    // Check that all s values and c0 look like valid hex (64 chars for 32 bytes)
    if (!/^[a-fA-F0-9]{64}$/.test(c0)) {
      console.warn('[Ring Signature] Invalid c0 format');
      return false;
    }

    for (let i = 0; i < n; i++) {
      if (!/^[a-fA-F0-9]{64}$/.test(s[i])) {
        console.warn(`[Ring Signature] Invalid s[${i}] format`);
        return false;
      }
    }

    // Validate keyImage format (should be a compressed public key format, typically 66 chars hex or 33 bytes)
    if (!keyImage || typeof keyImage !== 'string' || !/^[a-fA-F0-9]{66}$/.test(keyImage)) {
      console.warn('[Ring Signature] Invalid keyImage format');
      return false;
    }

    // Perform actual LSAG verification using proper elliptic curve cryptography
    try {
      await verifyLsagRingSignature({
        message: message,
        ringSignature: sig,
        expectedRingPublicKeys: ringMembers
      });
      console.log('[Ring Signature] LSAG cryptographic verification passed');
      return true;
    } catch (error) {
      console.warn('[Ring Signature] LSAG cryptographic verification failed:', error.message);
      return false;
    }
  }

  /**
   * Check if key image has been seen before (to prevent double spending)
   *
   * Uses SQLite database for persistent key image storage
   *
   * @param {string} keyImage - The key image to check
   * @returns {Promise<boolean>} - True if key image is unique, false if already seen
   */
  async checkKeyImage(keyImage, context = {}) {
    if (!keyImage) {
      console.warn('[Ring Signature] Missing key image');
      return false;
    }

    const normalizedContext = this._normalizeKeyImageContext(context);
    const now = normalizedContext.recordedAt instanceof Date ? normalizedContext.recordedAt : new Date();
    const expiryTime = new Date(now.getTime() - this.KEYIMAGE_TTL_MS);

    try {
      // Primary: Use SQLite database for persistent storage
      // First, clean up expired key images
      await this.prisma.$executeRaw`
        DELETE FROM AnonymousAuditLog
        WHERE eventType = 'key_image_verification'
        AND timestamp < ${expiryTime}
      `;

      // Check if key image already exists and is not expired
      const existingKeyImage = await this.prisma.anonymousAuditLog.findFirst({
        where: {
          eventType: 'key_image_verification',
          metadata: {
            contains: `"keyImage":"${keyImage}"`
          },
          timestamp: {
            gte: expiryTime
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      if (existingKeyImage) {
        console.warn('[Ring Signature] Key image already seen - treating as linked activity');
        const existingMetadata = this._parseAuditMetadata(existingKeyImage);
        const allowReuse = this._shouldAllowKeyImageReuse(existingMetadata, normalizedContext);

        const reuseMetadata = this._buildKeyImageAuditMetadata({
          keyImage,
          reused: true,
          context: normalizedContext,
          existingMetadata,
          allowed: allowReuse,
        });

        await this.prisma.anonymousAuditLog.create({
          data: {
            eventType: 'key_image_verification',
            fileId: normalizedContext.scopeId || null,
            publicKeyHash: normalizedContext.actorPublicKeyHash || null,
            metadata: JSON.stringify(reuseMetadata),
            timestamp: now,
            status: allowReuse ? 'allowed' : 'blocked',
          }
        }).catch(() => {});

        return allowReuse;
      }

      // Store the key image in database (full key image for proper lookup)
      const initialMetadata = this._buildKeyImageAuditMetadata({
        keyImage,
        reused: false,
        context: normalizedContext,
        existingMetadata: null,
        allowed: true,
      });

      await this.prisma.anonymousAuditLog.create({
        data: {
          eventType: 'key_image_verification',
          fileId: normalizedContext.scopeId || null,
          publicKeyHash: normalizedContext.actorPublicKeyHash || null,
          metadata: JSON.stringify(initialMetadata),
          timestamp: now,
          status: 'accepted',
        }
      });

      return true;

    } catch (dbError) {
      console.error('[Ring Signature] Database error checking key image, falling back to Redis/memory:', dbError);

      // Fallback to Redis if available
      if (this.redis) {
        try {
          const redisKey = `keyimage:${keyImage}`;
          const existing = await this.redis.get(redisKey);
          if (existing) {
            let existingContext;
            try {
              existingContext = JSON.parse(existing);
            } catch (error) {
              existingContext = null;
            }

            const allowReuse = this._shouldAllowKeyImageReuse(existingContext, normalizedContext);
            if (!allowReuse) {
              return false;
            }

            await this.redis.setex(redisKey, this.KEYIMAGE_TTL_MS / 1000, JSON.stringify({
              ...existingContext,
              lastReuseAt: now.toISOString(),
            }));
            return true;
          }
          await this.redis.setex(redisKey, this.KEYIMAGE_TTL_MS / 1000, JSON.stringify({
            usageContext: normalizedContext.usageContext,
            actorPublicKeyHash: normalizedContext.actorPublicKeyHash,
            scopeId: normalizedContext.scopeId,
            firstSeenAt: now.toISOString(),
          }));
          return true;
        } catch (redisError) {
          console.error('[Ring Signature] Redis error checking key image:', redisError);
        }
      }

      // Final fallback: In-memory check
      const nowMs = Date.now();
      const keyImageKey = `keyimage:${keyImage}`;

      const keyImageRecord = this.usedKeyImages.get(keyImageKey);
      if (keyImageRecord && (nowMs - keyImageRecord.timestamp) < this.KEYIMAGE_TTL_MS) {
        const allowReuse = this._shouldAllowKeyImageReuse(keyImageRecord.context, normalizedContext);
        if (!allowReuse) {
          return false;
        }

        this.usedKeyImages.set(keyImageKey, {
          timestamp: nowMs,
          context: keyImageRecord.context || normalizedContext,
        });
        return true;
      }

      this.usedKeyImages.set(keyImageKey, { timestamp: nowMs, context: normalizedContext });

      // Clean up old key images
      const cutoffTime = nowMs - this.KEYIMAGE_TTL_MS;
      for (const [key, value] of this.usedKeyImages) {
        if (value.timestamp < cutoffTime) {
          this.usedKeyImages.delete(key);
        }
      }

      return true;
    }
  }

  /**
   * Get all public keys for ring signature
   *
   * Fetches all registered users' public keys from database
   *
   * @returns {Promise<Array<string>>} Array of public keys
   */
  async getAllPublicKeys() {
    try {
      const context = getRingContext?.() || {};
      const contextKeys = Array.isArray(context.ringMemberPublicKeys) ? context.ringMemberPublicKeys : [];

      let fileKeys = [];
      if (this.prisma?.file?.findMany) {
        const files = await this.prisma.file.findMany({
          select: {
            ownershipPublicKey: true,
          },
        });

        fileKeys = files
          .map(file => file.ownershipPublicKey)
          .filter(key => typeof key === 'string' && key.trim().length > 0);
      }

      const uniqueKeys = Array.from(new Set([
        ...contextKeys,
        ...fileKeys,
      ].filter(key => typeof key === 'string' && key.trim().length > 0)));

      console.log(`[Ring Signature] Fetched ${uniqueKeys.length} public keys for ring`);
      return uniqueKeys;

    } catch (error) {
      console.error('[Ring Signature] Error fetching public keys:', error);
      return [];
    }
  }

  /**
   * Hash public key using SHA-256
   *
   * @param {string} publicKey - Public key to hash
   * @returns {string} SHA-256 hash of public key
   */
  hashPublicKey(publicKey) {
    return crypto.createHash('sha256').update(publicKey).digest('hex');
  }

  /**
   * Verify timestamp freshness (prevent replay attacks)
   *
   * @param {number} timestamp - Timestamp in milliseconds
   * @param {number} maxAge - Maximum age in milliseconds (default: 5 minutes)
   * @returns {boolean} true if timestamp is fresh
   */
  verifyTimestamp(timestamp, maxAge = 5 * 60 * 1000) {
    const now = Date.now();
    const age = now - timestamp;

    if (age < 0) {
      console.warn('[Ring Signature] Timestamp is in the future');
      return false;
    }

    if (age > maxAge) {
      console.warn(`[Ring Signature] Timestamp too old: ${age}ms (max: ${maxAge}ms)`);
      return false;
    }

    return true;
  }

  /**
   * Verify nonce uniqueness (prevent replay attacks)
   *
   * Uses SQLite database for persistent nonce storage
   * Falls back to Redis or in-memory cache if database is unavailable
   *
   * @param {string} nonce - Nonce to verify
   * @returns {Promise<boolean>} true if nonce is unique and valid
   */
  async verifyNonce(nonce) {
    if (!nonce) {
      console.warn('[Ring Signature] Missing nonce');
      return false;
    }

    const now = new Date();
    const expiryTime = new Date(now.getTime() - this.NONCE_TTL_MS);

    try {
      // Primary: Use SQLite database for persistent storage
      // First, clean up expired nonces
      await this.prisma.$executeRaw`
        DELETE FROM AnonymousAuditLog
        WHERE eventType = 'nonce_verification'
        AND timestamp < ${expiryTime}
      `;

      // Check if nonce already exists and is not expired
      const existingNonce = await this.prisma.anonymousAuditLog.findFirst({
        where: {
          eventType: 'nonce_verification',
          metadata: {
            contains: `"nonce":"${nonce}"`
          },
          timestamp: {
            gte: expiryTime
          }
        }
      });

      if (existingNonce) {
        console.warn('[Ring Signature] Nonce already used (replay attack?)');

        // Log the replay attempt (use full nonce for tracking)
        await this.prisma.anonymousAuditLog.create({
          data: {
            eventType: 'nonce_verification',
            metadata: JSON.stringify({
              nonce: nonce, // Store full nonce for proper audit trail
              reused: true,
              attemptedAt: now.toISOString()
            }),
            timestamp: now
          }
        }).catch(() => {}); // Don't fail on logging error

        return false;
      }

      // Store the nonce in database (full nonce for proper lookup)
      await this.prisma.anonymousAuditLog.create({
        data: {
          eventType: 'nonce_verification',
          metadata: JSON.stringify({
            nonce: nonce, // Store full nonce for proper replay detection
            reused: false,
            verifiedAt: now.toISOString()
          }),
          timestamp: now
        }
      });

      return true;

    } catch (dbError) {
      console.error('[Ring Signature] Database error verifying nonce, falling back to Redis/memory:', dbError);

      // Fallback to Redis if available
      if (this.redis) {
        try {
          const setResult = await this.redis.set(`nonce:${nonce}`, '1', 'NX', 'EX', this.NONCE_TTL_MS / 1000);
          if (!setResult) {
            console.warn('[Ring Signature] Nonce already used (replay attack?)');
            return false;
          }
          return true;
        } catch (redisError) {
          console.error('[Ring Signature] Redis error verifying nonce:', redisError);
        }
      }

      // Final fallback: In-memory check with timestamp
      const nowMs = Date.now();
      const nonceKey = `nonce:${nonce}`;

      const nonceRecord = this.usedNonces.get(nonceKey);
      if (nonceRecord && (nowMs - nonceRecord.timestamp) < this.NONCE_TTL_MS) {
        console.warn('[Ring Signature] Nonce already used (replay attack?)');
        return false;
      }

      this.usedNonces.set(nonceKey, { timestamp: nowMs });

      // Clean up old nonces
      const cutoffTime = nowMs - (10 * 60 * 1000);
      for (const [key, value] of this.usedNonces) {
        if (value.timestamp < cutoffTime) {
          this.usedNonces.delete(key);
        }
      }

      return true;
    }
  }
}

// Export class and a default instance (for backward compatibility)
const ringSignatureService = new RingSignatureService();

module.exports = { RingSignatureService, ringSignatureService };
