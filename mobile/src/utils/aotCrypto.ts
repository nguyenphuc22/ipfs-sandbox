import { Point, CURVE, utils } from '@noble/secp256k1';
import { sha256Bytes, schnorrSignHex, schnorrPublicKeyHex } from './nativeCryptoAdapter';

const HEX_REGEX = /^[0-9a-f]+$/i;
const VALID_PUBLIC_KEY_LENGTHS = new Set([64, 66, 130]);

const expandSchnorrPublicKey = (hex: string): string => {
  const normalized = normalizeHex(hex);

  if (!HEX_REGEX.test(normalized)) {
    throw new Error('Invalid hex for public key');
  }

  const normalizeToCompressed = (input: string): string => {
    const point = Point.fromHex(input);
    return bytesToHex(point.toRawBytes(true));
  };

  if (normalized.length === 64) {
    // Taproot/X-only format. Try both even (02) and odd (03) parity.
    for (const prefix of ['02', '03']) {
      try {
        return normalizeToCompressed(`${prefix}${normalized}`);
      } catch (error) {
        // Try next prefix
      }
    }
    throw new Error('Invalid x-only public key');
  }

  if (normalized.length === 66 || normalized.length === 130) {
    return normalizeToCompressed(normalized);
  }

  throw new Error('Unsupported public key length');
};

const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : undefined;

type TypedArray = Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;

declare global {

  var crypto: { getRandomValues<T extends TypedArray>(array: T): T } | undefined;
}

const createCryptoShim = (): NonNullable<typeof globalThis.crypto> => ({
  getRandomValues<T extends TypedArray>(array: T): T {
    const result = array;
    for (let i = 0; i < result.length; i += 1) {
      result[i] = Math.floor(Math.random() * 256) as typeof result[number];
    }
    return result;
  },
});

export const initializeCrypto = () => {
  if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = createCryptoShim();
    return;
  }

  const existingCrypto = globalThis.crypto;
  if (existingCrypto && typeof existingCrypto.getRandomValues !== 'function') {
    globalThis.crypto = {
      ...existingCrypto,
      getRandomValues: createCryptoShim().getRandomValues,
    };
  }
};

export const normalizeHex = (value: string): string => {
  const trimmed = value.trim().toLowerCase().replace(/^0x/, '');
  if (trimmed.length % 2 === 0) {
    return trimmed;
  }
  return `0${trimmed}`;
};

export const isValidPublicKeyHex = (value: string | null | undefined): boolean => {
  if (!value) {
    return false;
  }

  const normalized = normalizeHex(String(value));
  if (!HEX_REGEX.test(normalized)) {
    return false;
  }
  if (!VALID_PUBLIC_KEY_LENGTHS.has(normalized.length)) {
    return false;
  }

  try {
    Point.fromHex(expandSchnorrPublicKey(normalized));
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Normalize public key to compressed format (66 hex chars with 02/03 prefix)
 * Converts x-only (64 chars) and uncompressed (130 chars) to compressed format
 */
export const toCompressedPublicKey = (publicKey: string): string => {
  const normalized = normalizeHex(publicKey);

  if (!isValidPublicKeyHex(normalized)) {
    throw new Error(`Invalid public key: ${publicKey}`);
  }

  // Use expandSchnorrPublicKey which already handles all formats
  return expandSchnorrPublicKey(normalized);
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
  console.log('[hashToPoint] Input publicKeyHex:', publicKeyHex.substring(0, 20));
  for (let counter = 0; counter < 256; counter += 1) {
    const counterBytes = new Uint8Array([0, 0, 0, 0]);
    counterBytes[0] = Math.floor(counter / (256 ** 3)) % 256;
    counterBytes[1] = Math.floor(counter / (256 ** 2)) % 256;
    counterBytes[2] = Math.floor(counter / 256) % 256;
    counterBytes[3] = counter % 256;

    const digest = sha256Bytes(concatBytes(normalized, counterBytes));
    const scalar = mod(BigInt(`0x${bytesToHex(digest)}`), CURVE.n);
    if (counter < 3) {
      console.log(`[hashToPoint] counter=${counter}, bytes=[${Array.from(counterBytes)}], digest=${bytesToHex(digest).substring(0, 16)}...`);
    }
    if (scalar === 0n) {
      continue;
    }
    try {
      const result = Point.BASE.multiply(scalar);
      console.log(`[hashToPoint] Success at counter=${counter}`);
      return result;
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

  // Keys are already compressed (66 chars), so we can use them directly
  // Don't call expandSchnorrPublicKey as it might re-compress and produce different results
  const ringPoints = normalizedRing.map((hex) => {
    // Verify it's already compressed format
    if (hex.length !== 66 || (!hex.startsWith('02') && !hex.startsWith('03'))) {
      throw new Error(`Ring member must be in compressed format (66 chars with 02/03 prefix), got: ${hex.substring(0, 20)}`);
    }
    return Point.fromHex(hex);
  });
  const signerPoint = ringPoints[signerIndex];
  if (!signerPoint) {
    throw new Error('Failed to parse signer public key');
  }

  // CRITICAL CHECK: Verify that signerPoint = signerScalar * G
  const derivedPublicKeyPoint = Point.BASE.multiply(signerScalar);
  const derivedPublicKeyBytes = derivedPublicKeyPoint.toRawBytes(true);
  const signerPointBytes = signerPoint.toRawBytes(true);
  console.log('[LSAG Create] Public key verification:', {
    providedPublicKey: bytesToHex(signerPointBytes).substring(0, 20) + '...',
    derivedPublicKey: bytesToHex(derivedPublicKeyBytes).substring(0, 20) + '...',
    doTheyMatch: bytesToHex(signerPointBytes) === bytesToHex(derivedPublicKeyBytes),
  });
  if (bytesToHex(signerPointBytes) !== bytesToHex(derivedPublicKeyBytes)) {
    throw new Error('Private key does not match public key in ring!');
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

  const LSignerBytes = LSigner.toRawBytes(true);
  const RSignerBytes = RSigner.toRawBytes(true);
  console.log(`[LSAG Create] Signer (index ${signerIndex}) L/R points:`, {
    LLength: LSignerBytes.length,
    LPrefix: bytesToHex(LSignerBytes).substring(0, 20),
    RLength: RSignerBytes.length,
    RPrefix: bytesToHex(RSignerBytes).substring(0, 20),
    u: u.toString(16).padStart(64, '0').substring(0, 20) + '...',
  });

  const nextIndex = (signerIndex + 1) % ringSize;
  c[nextIndex] = await hashToScalar(
    messageBytes,
    LSignerBytes,
    RSignerBytes,
  );
  console.log(`[LSAG Create] Signer computed c[${nextIndex}]:`, c[nextIndex].toString(16).padStart(64, '0').substring(0, 20) + '...');

  let index = nextIndex;
  while (index !== signerIndex) {
    s[index] = await randomScalar();
    const hpPoint = await hashToPoint(normalizedRing[index]);
    const L = Point.BASE.multiply(s[index]).add(ringPoints[index].multiply(c[index]));
    const R = hpPoint.multiply(s[index]).add(keyImagePoint.multiply(c[index]));

    const LBytes = L.toRawBytes(true);
    const RBytes = R.toRawBytes(true);
    console.log(`[LSAG Create] Member ${index} L/R points:`, {
      LLength: LBytes.length,
      LPrefix: bytesToHex(LBytes).substring(0, 20),
      RLength: RBytes.length,
      RPrefix: bytesToHex(RBytes).substring(0, 20),
      currentC: c[index].toString(16).padStart(64, '0').substring(0, 20) + '...',
      s: s[index].toString(16).padStart(64, '0').substring(0, 20) + '...',
    });

    const followingIndex = (index + 1) % ringSize;
    c[followingIndex] = await hashToScalar(
      messageBytes,
      LBytes,
      RBytes,
    );
    console.log(`[LSAG Create] Member ${index} computed c[${followingIndex}]:`, c[followingIndex].toString(16).padStart(64, '0').substring(0, 20) + '...');
    index = followingIndex;
  }

  if (typeof c[signerIndex] === 'undefined') {
    throw new Error('Failed to derive challenge for signer');
  }

  console.log(`[LSAG Create] Computing s[${signerIndex}]:`, {
    u: u.toString(16).padStart(64, '0').substring(0, 20) + '...',
    cSigner: c[signerIndex].toString(16).padStart(64, '0').substring(0, 20) + '...',
    signerScalar: signerScalar.toString(16).padStart(64, '0').substring(0, 20) + '...',
  });

  s[signerIndex] = mod(u - c[signerIndex] * signerScalar, CURVE.n);

  console.log(`[LSAG Create] Computed s[${signerIndex}]:`, s[signerIndex].toString(16).padStart(64, '0').substring(0, 20) + '...');
  console.log(`[LSAG Create] Verification check: s*G + c*P should equal u*G`);
  const verifyL = Point.BASE.multiply(s[signerIndex]).add(signerPoint.multiply(c[signerIndex]));
  const verifyLBytes = verifyL.toRawBytes(true);
  console.log(`[LSAG Create] Verify L:`, bytesToHex(verifyLBytes).substring(0, 20) + '...');
  console.log(`[LSAG Create] Original LSigner:`, bytesToHex(LSignerBytes).substring(0, 20) + '...');
  console.log(`[LSAG Create] Do they match?`, bytesToHex(verifyLBytes) === bytesToHex(LSignerBytes));

  if (typeof c[0] === 'undefined') {
    throw new Error('Failed to derive initial challenge');
  }

  console.log('[LSAG] Signature creation complete:', {
    c0: c[0].toString(16).padStart(64, '0'),
    signerIndex,
    allChallenges: c.map((val, idx) => ({
      index: idx,
      c: val.toString(16).padStart(64, '0').substring(0, 16) + '...',
    })),
    allResponses: s.map((val, idx) => ({
      index: idx,
      s: val.toString(16).padStart(64, '0').substring(0, 16) + '...',
    })),
  });

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
