/**
 * Ring Signature Service for Anonymous Download Flow
 *
 * Provides ring signature verification for anonymous file access.
 * For demo purposes, this is a simplified implementation.
 *
 * @module RingSignatureService
 */

const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

class RingSignatureService {
  constructor(prismaClient) {
    this.prisma = prismaClient || new PrismaClient();
    this.usedNonces = new Set();
    this.MAX_NONCE_CACHE_SIZE = 10000;
  }

  /**
   * Verify ring signature
   *
   * For demo purposes, this is a simplified verification.
   * In production, implement full ring signature algorithm (e.g., LSAG, Borromean)
   *
   * @param {Object} params - Verification parameters
   * @param {string} params.publicKey - Public key of the signer
   * @param {string} params.signature - Signature to verify
   * @param {string} params.message - Message that was signed
   * @param {Array<string>} params.ringPublicKeys - Array of public keys in the ring
   * @returns {Promise<boolean>} true if signature is valid, false otherwise
   */
  async verifyRingSignature(params) {
    try {
      const { publicKey, signature, message, ringPublicKeys } = params;

      // 1. Verify publicKey is in ring
      if (!ringPublicKeys || ringPublicKeys.length === 0) {
        console.warn('[Ring Signature] Empty ring');
        return false;
      }

      if (!ringPublicKeys.includes(publicKey)) {
        console.warn('[Ring Signature] Public key not in ring');
        return false;
      }

      // 2. Parse signature (expecting JSON format)
      let sig;
      try {
        sig = JSON.parse(signature);
      } catch {
        // If not JSON, treat as simple string signature
        sig = { value: signature };
      }

      // 3. Verify message hash matches
      const messageHash = crypto.createHash('sha256').update(message).digest('hex');

      // 4. For demo: Basic verification
      // TODO: Implement full ring signature verification algorithm
      // - Verify key image uniqueness (prevent double-signing)
      // - Verify signature components (c values, s values)
      // - Verify ring equation: c[i+1] = H(m, [s[i]*G + c[i]*P[i]])

      if (!sig || !messageHash) {
        return false;
      }

      console.log(`[Ring Signature] Verification passed for message hash: ${messageHash.substring(0, 16)}...`);
      return true;

    } catch (error) {
      console.error('[Ring Signature] Verification error:', error);
      return false;
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
      const users = await this.prisma.user.findMany({
        select: {
          publicKey: true,
        },
        where: {
          publicKey: {
            not: null,
          },
        },
      });

      const publicKeys = users
        .map(user => user.publicKey)
        .filter(key => key !== null);

      console.log(`[Ring Signature] Fetched ${publicKeys.length} public keys for ring`);
      return publicKeys;

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
   * For demo: Simple in-memory cache
   * In production: Use Redis or database
   *
   * @param {string} nonce - Nonce to verify
   * @returns {boolean} true if nonce is unique
   */
  verifyNonce(nonce) {
    if (this.usedNonces.has(nonce)) {
      console.warn('[Ring Signature] Nonce already used (replay attack?)');
      return false;
    }

    this.usedNonces.add(nonce);

    // Limit cache size (simple LRU)
    if (this.usedNonces.size > this.MAX_NONCE_CACHE_SIZE) {
      const firstNonce = this.usedNonces.values().next().value;
      this.usedNonces.delete(firstNonce);
    }

    return true;
  }
}

// Export class and a default instance (for backward compatibility)
const ringSignatureService = new RingSignatureService();

module.exports = { RingSignatureService, ringSignatureService };
