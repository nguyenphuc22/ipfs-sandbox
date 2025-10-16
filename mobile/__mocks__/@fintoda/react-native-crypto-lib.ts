import { createHash } from 'crypto';

const toBuffer = (value: Uint8Array | ArrayLike<number>): Buffer => {
  if (Buffer.isBuffer(value)) {
    return value;
  }
  return Buffer.from(Array.from(value));
};

const signAsync = jest.fn(async (privateKey: Uint8Array, message: Uint8Array) => {
  const hash = createHash('sha256');
  hash.update(toBuffer(privateKey));
  hash.update(toBuffer(message));
  const digest = hash.digest();
  const signature = new Uint8Array(64);
  signature.set(digest.subarray(0, 32), 0);
  signature.set(digest.subarray(0, 32), 32);
  return signature;
});

const verifyAsync = jest.fn(async () => true);

const getPublicKey = jest.fn((privateKey: Uint8Array) => {
  const hash = createHash('sha256');
  hash.update(toBuffer(privateKey));
  return new Uint8Array(hash.digest().subarray(0, 32));
});

export const schnorr = {
  signAsync,
  verifyAsync,
  getPublicKey,
};

export default {
  schnorr,
};
