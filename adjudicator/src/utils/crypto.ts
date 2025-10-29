import { schnorr, secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { xchacha20poly1305 } from '@noble/ciphers/chacha';
import { TextDecoder } from 'util';

const textDecoder = new TextDecoder();

export function hashSha256Hex(value: string): string {
  const data = typeof value === 'string' ? Buffer.from(value, 'utf8') : value;
  return bytesToHex(sha256(data));
}

export function signMessageHex(privateKeyHex: string, message: string): string {
  const messageDigest = sha256(Buffer.from(message, 'utf8'));
  const privateKey = hexToBytes(privateKeyHex);
  const signature = schnorr.sign(messageDigest, privateKey);
  return bytesToHex(signature);
}

export function verifyMessageSignature(
  publicKeyHex: string,
  signatureHex: string,
  message: string
): boolean {
  try {
    const messageDigest = sha256(Buffer.from(message, 'utf8'));
    const publicKey = hexToBytes(publicKeyHex);
    const signature = hexToBytes(signatureHex);
    return schnorr.verify(signature, messageDigest, publicKey);
  } catch (error) {
    console.error('[Crypto] Signature verification failed', error);
    return false;
  }
}

export function getPublicKeyHex(privateKeyHex: string): string {
  const privateKey = hexToBytes(privateKeyHex);
  const publicKey = schnorr.getPublicKey(privateKey);
  return bytesToHex(publicKey);
}

function deriveSharedKey(privateKeyHex: string, peerPublicKeyHex: string): Uint8Array {
  const privateKey = hexToBytes(privateKeyHex);
  const publicKey = hexToBytes(peerPublicKeyHex);
  const sharedSecret = secp256k1.getSharedSecret(privateKey, publicKey, true);
  const secret = sharedSecret.slice(1);
  return sha256(secret);
}

export interface EscrowPackage {
  version: number;
  ephemeralPublicKey: string;
  nonce: string;
  ciphertext: string;
}

export function decryptEscrowPackage(
  adjudicatorPrivateKeyHex: string,
  packageBase64: string
): string {
  try {
    const decodedJson = Buffer.from(packageBase64, 'base64').toString('utf8');
    const envelope = JSON.parse(decodedJson) as EscrowPackage;
    if (!envelope || envelope.version !== 1) {
      throw new Error('Unsupported escrow package version');
    }

    const sharedKey = deriveSharedKey(adjudicatorPrivateKeyHex, envelope.ephemeralPublicKey);
    const nonce = hexToBytes(envelope.nonce);
    const ciphertext = hexToBytes(envelope.ciphertext);
    const cipher = xchacha20poly1305(sharedKey, nonce);
    const plaintext = cipher.decrypt(ciphertext);
    return textDecoder.decode(plaintext);
  } catch (error) {
    throw new Error(`Escrow decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
