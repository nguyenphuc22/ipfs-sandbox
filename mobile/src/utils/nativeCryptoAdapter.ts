import { digest, schnorr } from '@fintoda/react-native-crypto-lib';
import { sha256 as nobleSha256 } from '@noble/hashes/sha2';
import { Point } from '@noble/secp256k1';

const normalizeHex = (value: string): string => value.trim().toLowerCase().replace(/^0x/, '');

const hexToBytes = (hex: string): Uint8Array => {
  const cleaned = normalizeHex(hex);
  if (cleaned.length % 2 !== 0) {
    throw new Error('Hex string must have even length');
  }
  const array = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < array.length; i += 1) {
    array[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
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

// IMPORTANT: Use @noble/hashes/sha2 instead of native crypto
// This ensures identical SHA256 results between mobile and backend
export const sha256Bytes = (bytes: Uint8Array): Uint8Array => {
  return nobleSha256(bytes);
};

export const schnorrPublicKeyHex = (privateKeyHex: string): string => {
  // Use @noble/secp256k1 for consistent public key derivation
  // This ensures we get the correct compressed format with proper parity
  const privateKeyBigInt = BigInt('0x' + normalizeHex(privateKeyHex));
  const point = Point.fromPrivateKey(privateKeyBigInt);
  const compressed = point.toRawBytes(true); // true = compressed format (33 bytes)
  const result = bytesToHex(compressed);

  console.log('[schnorrPublicKeyHex] Using @noble/secp256k1:', {
    privateKeyPrefix: privateKeyHex.substring(0, 16) + '...',
    compressedLength: compressed.length,
    resultLength: result.length,
    resultPrefix: result.substring(0, 10),
    parityByte: compressed[0]?.toString(16).padStart(2, '0'),
  });

  return result;
};

export const schnorrSignHex = async (messageHex: string, privateKeyHex: string): Promise<string> => {
  const priv = hexToBytes(privateKeyHex);
  const msg = hexToBytes(messageHex);
  const signature = await schnorr.signAsync(priv, msg);
  return bytesToHex(signature);
};

export const isNativeCryptoAvailable = true;
