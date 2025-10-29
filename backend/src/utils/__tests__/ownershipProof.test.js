const crypto = require('crypto');
const { verifySchnorrOwnership, computeSha256Hex } = require('../ownershipProof');

let schnorr;

beforeAll(async () => {
  ({ schnorr } = await import('@noble/curves/secp256k1.js'));
});

describe('verifySchnorrOwnership', () => {
  const generateKeyPair = () => {
    const privateKey = crypto.randomBytes(32);
    const publicKeyHex = Buffer.from(schnorr.getPublicKey(privateKey)).toString('hex');
    return { privateKey, publicKeyHex };
  };

  const signMessage = (privateKey, message) => {
    const messageHash = computeSha256Hex(message);
    const signature = schnorr.sign(Buffer.from(messageHash, 'hex'), privateKey);
    const signatureHex = Buffer.from(signature).toString('hex');
    return {
      messageHash,
      R: signatureHex.slice(0, 64),
      s: signatureHex.slice(64),
    };
  };

  test('accepts a fresh and valid Schnorr ownership proof', async () => {
    const { privateKey, publicKeyHex } = generateKeyPair();
    const timestamp = Date.now();
    const nonce = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const targetHash = crypto.createHash('sha256').update('recipient').digest('hex');
    const message = `revoke-reencrypt:${fileId}:${targetHash}:${timestamp}:${nonce}`;

    const { messageHash, R, s } = signMessage(privateKey, message);

    const result = await verifySchnorrOwnership({
      proof: {
        R,
        s,
        message: messageHash,
        publicKey: publicKeyHex,
      },
      expectedPublicKey: publicKeyHex,
      expectedMessage: message,
    });

    expect(result.messageHash).toBe(messageHash);
    expect(result.timestamp).toBe(timestamp);
    expect(result.nonce).toBe(nonce);
    expect(result.segments[0]).toBe('revoke-reencrypt');
  });

  test('rejects proof when timestamp is outside allowed window', async () => {
    const { privateKey, publicKeyHex } = generateKeyPair();
    const timestamp = Date.now() - (10 * 60 * 1000); // 10 minutes ago
    const nonce = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const message = `revoke-reencrypt:${fileId}:target:${timestamp}:${nonce}`;

    const { messageHash, R, s } = signMessage(privateKey, message);

    await expect(verifySchnorrOwnership({
      proof: {
        R,
        s,
        message: messageHash,
        publicKey: publicKeyHex,
      },
      expectedPublicKey: publicKeyHex,
      expectedMessage: message,
    })).rejects.toThrow('Schnorr proof timestamp is stale');
  });

  test('accepts compressed public keys by normalizing to x-only format', async () => {
    const { privateKey, publicKeyHex } = generateKeyPair();
    const compressedPublicKey = Buffer.from((await import('@noble/secp256k1')).getPublicKey(privateKey, true)).toString('hex');
    const timestamp = Date.now();
    const nonce = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const targetHash = crypto.createHash('sha256').update('recipient').digest('hex');
    const message = `revoke-reencrypt:${fileId}:${targetHash}:${timestamp}:${nonce}`;

    const { messageHash, R, s } = signMessage(privateKey, message);

    const result = await verifySchnorrOwnership({
      proof: {
        R,
        s,
        message: messageHash,
        publicKey: compressedPublicKey,
      },
      expectedPublicKey: compressedPublicKey,
      expectedMessage: message,
    });

    expect(result.messageHash).toBe(messageHash);
    expect(result.normalizedPublicKey).toHaveLength(64);
  });

  test('returns sanitized error when ownership public key cannot be parsed', async () => {
    const { privateKey, publicKeyHex } = generateKeyPair();
    const timestamp = Date.now();
    const nonce = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const message = `revoke-reencrypt:${fileId}:target:${timestamp}:${nonce}`;

    const { messageHash, R, s } = signMessage(privateKey, message);

    await expect(verifySchnorrOwnership({
      proof: {
        R,
        s,
        message: messageHash,
        publicKey: 'zz-not-a-key',
      },
      expectedPublicKey: publicKeyHex,
      expectedMessage: message,
    })).rejects.toThrow('Invalid Schnorr ownership proof');
  });
});
