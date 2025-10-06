import { digest, schnorr } from '@fintoda/react-native-crypto-lib';

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

export const sha256Bytes = (bytes: Uint8Array): Uint8Array => {
  return digest.createHash(digest.HASH.SHA256, bytes);
};

export const schnorrPublicKeyHex = (privateKeyHex: string): string => {
  const priv = hexToBytes(privateKeyHex);
  const pub = schnorr.getPublic(priv);
  console.log('schnorr.getPublic returned length:', pub.length);

  // If it returns 33 bytes (compressed), convert to x-only (32 bytes)
  if (pub.length === 33) {
    // Remove first byte (02 or 03 prefix) to get x-only public key
    const xOnly = pub.slice(1);
    console.log('Converted to x-only, length:', xOnly.length);
    return bytesToHex(xOnly);
  }

  return bytesToHex(pub);
};

export const schnorrSignHex = async (messageHex: string, privateKeyHex: string): Promise<string> => {
  const priv = hexToBytes(privateKeyHex);
  const msg = hexToBytes(messageHex);
  const signature = await schnorr.signAsync(priv, msg);
  return bytesToHex(signature);
};

export const isNativeCryptoAvailable = true;
