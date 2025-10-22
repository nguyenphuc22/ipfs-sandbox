const crypto = require('crypto');

const DEFAULT_MAX_SKEW_MS = Number(process.env.REVOCATION_MAX_CLOCK_SKEW_MS || 5 * 60 * 1000);
const DEFAULT_MAX_FUTURE_DRIFT_MS = Number(process.env.REVOCATION_MAX_FUTURE_DRIFT_MS || 60 * 1000);

let curveModulePromise;

async function loadCurveModules() {
  if (!curveModulePromise) {
    curveModulePromise = import('@noble/curves/secp256k1.js')
      .then((module) => {
        if (!module || !module.schnorr || !module.secp256k1) {
          throw new Error('Failed to load secp256k1 curves module');
        }
        return module;
      })
      .catch((error) => {
        try {
          const legacy = require('@noble/secp256k1');
          let legacySchnorr = legacy?.schnorr;
          if (!legacySchnorr) {
            try {
              legacySchnorr = require('@noble/secp256k1/schnorr');
            } catch (schnorrError) {
              // Ignore, we'll rethrow the original import error below
            }
          }
          if (legacy && legacySchnorr) {
            return { schnorr: legacySchnorr, secp256k1: legacy };
          }
        } catch (legacyError) {
          // Ignore and rethrow original error below
        }
        throw error;
      });
  }
  return curveModulePromise;
}

function normalizeHex(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim().toLowerCase();
  return trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
}

function ensureEvenLength(hex) {
  if (!hex) {
    return hex;
  }
  return hex.length % 2 === 0 ? hex : `0${hex}`;
}

function computeSha256Hex(message) {
  const buffer = typeof message === 'string' ? Buffer.from(message, 'utf-8') : Buffer.from(message || '');
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function parseEnvelope(message) {
  if (!message || typeof message !== 'string') {
    throw new Error('Schnorr proof message is required');
  }

  const segments = message.split(':');
  if (segments.length < 3) {
    throw new Error('Schnorr proof message format is invalid');
  }

  const nonce = segments[segments.length - 1];
  const timestampRaw = segments[segments.length - 2];
  const timestamp = Number(timestampRaw);
  if (!Number.isFinite(timestamp)) {
    throw new Error('Schnorr proof message timestamp is invalid');
  }
  if (!nonce || typeof nonce !== 'string' || nonce.trim().length === 0) {
    throw new Error('Schnorr proof message nonce is required');
  }

  return {
    segments,
    nonce: nonce.trim(),
    timestamp,
    action: segments[0],
  };
}

function normalizePublicKeyHex(publicKeyHex) {
  const normalized = ensureEvenLength(normalizeHex(publicKeyHex));
  if (!normalized) {
    throw new Error('Ownership public key is required');
  }
  return normalized;
}

function resolvePointClass({ secp256k1, schnorr, Point, ProjectivePoint } = {}) {
  const candidates = [
    secp256k1?.Point,
    secp256k1?.ProjectivePoint,
    schnorr?.Point,
    schnorr?.ProjectivePoint,
    Point,
    ProjectivePoint,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate.fromHex === 'function') {
      return candidate;
    }
  }

  return null;
}

function toXOnlyPublicKeyHex(publicKeyHex, pointClass) {
  const normalized = normalizePublicKeyHex(publicKeyHex);
  const byteLength = normalized.length / 2;

  if (byteLength === 32) {
    return normalized;
  }

  if (!pointClass || typeof pointClass.fromHex !== 'function') {
    throw new Error('Invalid Schnorr ownership proof: secp256k1 point implementation unavailable');
  }

  try {
    const point = pointClass.fromHex(normalized);
    const affinePoint = typeof point.toAffine === 'function' ? point.toAffine() : point;
    const hasEven = typeof point.hasEvenY === 'function'
      ? point.hasEvenY()
      : (typeof affinePoint?.y === 'bigint' ? (affinePoint.y & 1n) === 0n : null);

    if (hasEven === null) {
      throw new Error('unable to determine point parity');
    }

    const evenPoint = hasEven ? point : point.negate();
    const compressed = typeof evenPoint.toBytes === 'function'
      ? evenPoint.toBytes(true)
      : evenPoint.toRawBytes(true);
    return Buffer.from(compressed.slice(1)).toString('hex');
  } catch (error) {
    throw new Error('Invalid Schnorr ownership proof: failed to parse ownership public key');
  }
}

function ensureFreshTimestamp(timestamp, { now = Date.now(), maxSkewMs = DEFAULT_MAX_SKEW_MS, maxFutureDriftMs = DEFAULT_MAX_FUTURE_DRIFT_MS } = {}) {
  if (now - timestamp > maxSkewMs) {
    throw new Error('Schnorr proof timestamp is stale');
  }
  if (timestamp - now > maxFutureDriftMs) {
    throw new Error('Schnorr proof timestamp is in the future');
  }
}

async function verifySchnorrOwnership({ proof, expectedPublicKey, expectedMessage }, options = {}) {
  if (!proof || typeof proof !== 'object') {
    throw new Error('Schnorr ownership proof payload is required');
  }
  if (!expectedPublicKey) {
    throw new Error('Expected ownership public key is required');
  }
  if (!expectedMessage) {
    throw new Error('Expected message for Schnorr verification is required');
  }

  const curveModules = await loadCurveModules();
  const { schnorr, secp256k1 } = curveModules;
  const pointClass = resolvePointClass({
    secp256k1,
    schnorr,
    Point: curveModules.Point,
    ProjectivePoint: curveModules.ProjectivePoint,
  });

  const normalizedR = ensureEvenLength(normalizeHex(proof.R));
  const normalizedS = ensureEvenLength(normalizeHex(proof.s));
  const normalizedMessage = ensureEvenLength(normalizeHex(proof.message));
  const normalizedProofPk = toXOnlyPublicKeyHex(proof.publicKey, pointClass);
  const normalizedStoredPk = toXOnlyPublicKeyHex(expectedPublicKey, pointClass);

  if (!normalizedR || !normalizedS || !normalizedMessage) {
    throw new Error('Incomplete Schnorr ownership proof');
  }
  if (normalizedProofPk !== normalizedStoredPk) {
    throw new Error('Ownership public key mismatch');
  }
  if (normalizedR.length !== 64 || normalizedS.length !== 64) {
    throw new Error('Schnorr proof components must be 32-byte hex strings');
  }

  const envelope = parseEnvelope(expectedMessage);
  ensureFreshTimestamp(envelope.timestamp, options);

  const expectedMessageHash = computeSha256Hex(expectedMessage);
  if (normalizedMessage !== expectedMessageHash) {
    throw new Error('Schnorr proof message digest mismatch');
  }

  const signatureBytes = Buffer.from(`${normalizedR}${normalizedS}`, 'hex');
  const messageBytes = Buffer.from(normalizedMessage, 'hex');
  const publicKeyBytes = Buffer.from(normalizedStoredPk, 'hex');

  let isValid = false;
  try {
    isValid = schnorr.verify(signatureBytes, messageBytes, publicKeyBytes);
  } catch (error) {
    throw new Error(`Invalid Schnorr ownership proof: ${error?.message || 'verification failed'}`);
  }

  if (!isValid) {
    throw new Error('Invalid Schnorr ownership proof');
  }

  return {
    messageHash: normalizedMessage,
    timestamp: envelope.timestamp,
    nonce: envelope.nonce,
    action: envelope.action,
    segments: envelope.segments,
    normalizedPublicKey: normalizedStoredPk,
  };
}

module.exports = {
  verifySchnorrOwnership,
  computeSha256Hex,
  normalizeHex,
};
