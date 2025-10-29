import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import { getPublicKey, getSharedSecret, utils, Point } from '@noble/secp256k1';
import { xchacha20poly1305 } from '@noble/ciphers/chacha';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, randomBytes, utf8ToBytes } from '@noble/hashes/utils.js';

interface EscrowEnvelope {
  version: number;
  ephemeralPublicKey: string;
  nonce: string;
  ciphertext: string;
}

export async function createEscrowedIdentity(
  realPublicKey: string,
  adjudicatorPublicKey: string
): Promise<string> {
  console.log('[Escrow] === START createEscrowedIdentity ===');
  console.log('[Escrow] realPublicKey:', realPublicKey);
  console.log('[Escrow] adjudicatorPublicKey:', adjudicatorPublicKey);
  console.log('[Escrow] adjudicatorPublicKey type:', typeof adjudicatorPublicKey);
  console.log('[Escrow] adjudicatorPublicKey length:', adjudicatorPublicKey?.length);

  if (!realPublicKey || !adjudicatorPublicKey) {
    throw new Error('Missing data for escrowed identity generation');
  }

  console.log('[Escrow] Generating ephemeral key pair...');
  const ephemeralPrivateKey = utils.randomPrivateKey();
  console.log('[Escrow] ephemeralPrivateKey length:', ephemeralPrivateKey.length);

  const ephemeralPublicKey = getPublicKey(ephemeralPrivateKey, true);
  console.log('[Escrow] ephemeralPublicKey:', bytesToHex(ephemeralPublicKey));
  console.log('[Escrow] ephemeralPublicKey length:', ephemeralPublicKey.length);

  console.log('[Escrow] Converting adjudicator key to bytes...');
  const adjudicatorKeyBytes = normalizeAdjudicatorPublicKey(adjudicatorPublicKey);
  console.log('[Escrow] adjudicatorKeyBytes length:', adjudicatorKeyBytes.length);
  console.log('[Escrow] adjudicatorKeyBytes (first 10):', Array.from(adjudicatorKeyBytes.slice(0, 10)));

  console.log('[Escrow] Computing shared secret...');
  let sharedSecret;
  try {
    sharedSecret = getSharedSecret(
      ephemeralPrivateKey,
      adjudicatorKeyBytes,
      true
    );
    console.log('[Escrow] ✅ Shared secret computed successfully, length:', sharedSecret.length);
  } catch (error) {
    console.error('[Escrow] ❌ ERROR computing shared secret:', error);
    console.error('[Escrow] Error message:', error instanceof Error ? error.message : String(error));
    throw error;
  }

  console.log('[Escrow] Deriving symmetric key...');
  const symmetricKey = sha256(sharedSecret.slice(1));
  console.log('[Escrow] symmetricKey length:', symmetricKey.length);

  console.log('[Escrow] Encrypting message...');
  const nonce = randomBytes(24);
  const messageBytes = utf8ToBytes(realPublicKey);
  const cipher = xchacha20poly1305(symmetricKey, nonce);
  const ciphertext = cipher.encrypt(messageBytes);
  console.log('[Escrow] Encryption complete, ciphertext length:', ciphertext.length);

  const envelope: EscrowEnvelope = {
    version: 1,
    ephemeralPublicKey: bytesToHex(ephemeralPublicKey),
    nonce: bytesToHex(nonce),
    ciphertext: bytesToHex(ciphertext),
  };

  console.log('[Escrow] ✅ Escrow envelope created successfully');
  return Buffer.from(JSON.stringify(envelope), 'utf8').toString('base64');
}

function normalizeAdjudicatorPublicKey(publicKey: string): Uint8Array {
  if (!publicKey) {
    throw new Error('Adjudicator public key is missing');
  }

  let hex = publicKey.trim();
  if (hex.startsWith('0x') || hex.startsWith('0X')) {
    hex = hex.slice(2);
  }

  const candidates: string[] = [];
  if (hex.length === 64) {
    const evenCandidate = `02${hex}`;
    const oddCandidate = `03${hex}`;
    console.log('[Escrow] Detected x-only Schnorr key, attempting compressed reconstruction');
    candidates.push(evenCandidate, oddCandidate);
  } else {
    candidates.push(hex);
  }

  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      const point = Point.fromHex(candidate);
      const bytes = point.toRawBytes(true);
      console.log('[Escrow] Normalized adjudicator key length:', bytes.length);
      return bytes;
    } catch (error) {
      lastError = error;
    }
  }

  console.error('[Escrow] Failed to normalize adjudicator public key', {
    originalLength: publicKey.length,
    strippedLength: hex.length,
    candidatesTried: candidates,
  });
  throw lastError instanceof Error
    ? lastError
    : new Error('Invalid adjudicator public key format for escrow');
}
