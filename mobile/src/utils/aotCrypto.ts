import { Point, CURVE, utils } from '@noble/secp256k1';
import { sha256Bytes, schnorrSignHex, schnorrPublicKeyHex } from './nativeCryptoAdapter';

const HEX_REGEX = /^[0-9a-f]+$/i;

const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : undefined;

type TypedArray = Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;

declare global {
  // eslint-disable-next-line no-var
  var crypto: { getRandomValues<T extends TypedArray>(array: T): T } | undefined;
}

export const initializeCrypto = () => {
  if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = {
      getRandomValues<T extends TypedArray>(array: T): T {
        for (let i = 0; i < array.length; i += 1) {
          array[i] = Math.floor(Math.random() * 256) as typeof array[number];
        }
        return array;
      },
    } as typeof globalThis.crypto;
  }

  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    globalThis.crypto = {
      ...(globalThis.crypto || {}),
      getRandomValues<T extends TypedArray>(array: T): T {
        for (let i = 0; i < array.length; i += 1) {
          array[i] = Math.floor(Math.random() * 256) as typeof array[number];
        }
        return array;
      },
    } as typeof globalThis.crypto;
  }
};

export const normalizeHex = (value: string): string => {
  const trimmed = value.trim().toLowerCase().replace(/^0x/, '');
  if (trimmed.length % 2 === 0) {
    return trimmed;
  }
  return `0${trimmed}`;
};

const hexToBytes = (hex: string): Uint8Array => {
  const normalized = normalizeHex(hex);
  const array = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < array.length; i += 1) {
    array[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return array;
};

const bytesToHex = (bytes: Uint8Array): string => {
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
};

const concatBytes = (...arrays: Uint8Array[]): Uint8Array => {
  const totalLength = arrays.reduce((acc, current) => acc + current.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  arrays.forEach((array) => {
    result.set(array, offset);
    offset += array.length;
  });
  return result;
};

const utf8ToBytes = (input: string): Uint8Array => {
  if (textEncoder) {
    return textEncoder.encode(input);
  }
  const arr = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    arr[i] = input.charCodeAt(i);
  }
  return arr;
};

const ensureBytes = (input: string | Uint8Array, encoding: 'auto' | 'hex' | 'utf8' = 'auto'): Uint8Array => {
  if (input instanceof Uint8Array) {
    return input;
  }
  if (encoding === 'hex' || (encoding === 'auto' && HEX_REGEX.test(input) && input.length % 2 === 0)) {
    return hexToBytes(input);
  }
  return utf8ToBytes(input);
};

const mod = (a: bigint, b: bigint): bigint => {
  const result = a % b;
  return result >= 0n ? result : result + b;
};

const randomScalar = async (): Promise<bigint> => {
  const bytes = utils.randomPrivateKey();
  return mod(BigInt(`0x${bytesToHex(bytes)}`), CURVE.n);
};

const hashToScalar = async (...parts: Array<string | Uint8Array>): Promise<bigint> => {
  const combined = concatBytes(...parts.map((part) => ensureBytes(part)));
  const digest = sha256Bytes(combined);
  return mod(BigInt(`0x${bytesToHex(digest)}`), CURVE.n);
};

const hashToPoint = async (publicKeyHex: string): Promise<Point> => {
  const normalized = ensureBytes(normalizeHex(publicKeyHex), 'hex');
  for (let counter = 0; counter < 256; counter += 1) {
    const counterBytes = new Uint8Array([0, 0, 0, 0]);
    counterBytes[0] = (counter >> 24) & 0xff;
    counterBytes[1] = (counter >> 16) & 0xff;
    counterBytes[2] = (counter >> 8) & 0xff;
    counterBytes[3] = counter & 0xff;

    const digest = sha256Bytes(concatBytes(normalized, counterBytes));
    const scalar = mod(BigInt(`0x${bytesToHex(digest)}`), CURVE.n);
    if (scalar === 0n) {
      continue;
    }
    try {
      return Point.BASE.multiply(scalar);
    } catch (error) {
      // Retry with the next counter value
    }
  }
  throw new Error('Failed to map public key to curve point');
};

export const generateKeyPair = async () => {
  initializeCrypto();
  const privateKeyBytes = utils.randomPrivateKey();
  const privateKey = bytesToHex(privateKeyBytes);
  const publicKey = schnorrPublicKeyHex(privateKey);
  return { privateKey, publicKey };
};

export const generateMasterKey = () => {
  initializeCrypto();
  return bytesToHex(utils.randomPrivateKey());
};

export const computeMetadataHash = async (payload: Record<string, any>): Promise<{ metadataHash: string; metadataPayload: string }> => {
  const metadataPayload = JSON.stringify(payload);
  const digest = sha256Bytes(utf8ToBytes(metadataPayload));
  return {
    metadataHash: bytesToHex(digest),
    metadataPayload,
  };
};

export const createSchnorrProof = async (messageHex: string, privateKeyHex: string) => {
  initializeCrypto();
  const messageBytes = hexToBytes(messageHex);
  const signatureHex = await schnorrSignHex(messageHex, privateKeyHex);
  const R = signatureHex.slice(0, 64);
  const s = signatureHex.slice(64);
  return {
    R,
    s,
    signature: signatureHex,
  };
};

export interface RingSignatureInput {
  message: string;
  ringPublicKeys: string[];
  signerIndex: number;
  signerPrivateKey: string;
}

export const createLsagRingSignature = async ({
  message,
  ringPublicKeys,
  signerIndex,
  signerPrivateKey,
}: RingSignatureInput) => {
  if (!Array.isArray(ringPublicKeys) || ringPublicKeys.length < 2) {
    throw new Error('Ring signature requires at least two public keys');
  }

  initializeCrypto();

  const normalizedRing = ringPublicKeys.map((key) => normalizeHex(String(key)));

  if (signerIndex < 0 || signerIndex >= normalizedRing.length) {
    throw new Error('signerIndex is out of range for the provided ring');
  }

  const signerScalar = mod(BigInt(`0x${normalizeHex(String(signerPrivateKey))}`), CURVE.n);
  if (signerScalar === 0n) {
    throw new Error('Invalid signer private key');
  }

  const ringPoints = normalizedRing.map((hex) => Point.fromHex(hex));
  const signerPoint = ringPoints[signerIndex];
  if (!signerPoint) {
    throw new Error('Failed to parse signer public key');
  }

  const hashedPoint = await hashToPoint(normalizedRing[signerIndex]);
  const keyImagePoint = hashedPoint.multiply(signerScalar);

  const ringSize = normalizedRing.length;
  const s = new Array<bigint>(ringSize).fill(0n);
  const c = new Array<bigint>(ringSize).fill(0n);

  const messageBytes = ensureBytes(message, 'auto');
  const messageDigest = bytesToHex(sha256Bytes(messageBytes));

  const u = await randomScalar();
  const LSigner = Point.BASE.multiply(u);
  const RSigner = hashedPoint.multiply(u);

  const nextIndex = (signerIndex + 1) % ringSize;
  c[nextIndex] = await hashToScalar(
    messageBytes,
    LSigner.toRawBytes(true),
    RSigner.toRawBytes(true),
  );

  let index = nextIndex;
  while (index !== signerIndex) {
    s[index] = await randomScalar();
    const hpPoint = await hashToPoint(normalizedRing[index]);
    const L = Point.BASE.multiply(s[index]).add(ringPoints[index].multiply(c[index]));
    const R = hpPoint.multiply(s[index]).add(keyImagePoint.multiply(c[index]));
    const followingIndex = (index + 1) % ringSize;
    c[followingIndex] = await hashToScalar(
      messageBytes,
      L.toRawBytes(true),
      R.toRawBytes(true),
    );
    index = followingIndex;
  }

  if (typeof c[signerIndex] === 'undefined') {
    throw new Error('Failed to derive challenge for signer');
  }

  s[signerIndex] = mod(u - c[signerIndex] * signerScalar, CURVE.n);

  if (typeof c[0] === 'undefined') {
    throw new Error('Failed to derive initial challenge');
  }

  return {
    scheme: 'lsag-secp256k1',
    ringMembers: normalizedRing,
    keyImage: bytesToHex(keyImagePoint.toRawBytes(true)),
    c0: c[0].toString(16).padStart(64, '0'),
    s: s.map((value) => value.toString(16).padStart(64, '0')),
    messageDigest,
    messageEncoding: HEX_REGEX.test(message) && message.length % 2 === 0 ? 'hex' : 'utf8',
  };
};
