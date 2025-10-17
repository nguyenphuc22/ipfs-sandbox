/**
 * ChunkEncryptionService
 *
 * Handles client-side file chunking, encryption, and IPFS upload
 * Implements the chunking logic moved from backend as per Task A
 *
 * References:
 * - backend/src/utils/chunkingUtils.js (original implementation)
 * - implement_next.md (migration plan)
 * - issue_plan.md Task A (requirements)
 */

import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { generateMasterKey as generateAOTMasterKey } from '../utils/aotCrypto';
import { PickedFile } from '../types';
import { ensureCryptoRandomSupport, ensureWebCryptoSupport } from './crypto/webCryptoSupport';
import { sha256Hex } from './crypto/hash';

// ============================================================================
// Configuration
// ============================================================================

export const CHUNK_CONFIG = {
  MIN_SIZE: 1 * 1024 * 1024,      // 1 MB
  DEFAULT_SIZE: 2 * 1024 * 1024,  // 2 MB
  MAX_SIZE: 4 * 1024 * 1024,      // 4 MB
};

// ============================================================================
// Types
// ============================================================================

export interface ChunkData {
  index: number;
  data: Uint8Array;
  size: number;
}

export interface EncryptedChunkData {
  index: number;
  size: number;
  hash: string; // Hash of PLAIN data (for integrity verification)
  encryptedBuffer: Uint8Array; // IV + AuthTag + EncryptedData
  iv: Uint8Array;
  authTag: Uint8Array;
}

export interface ChunkManifest {
  index: number;
  cid: string;
  hash: string;
  size: number;
}

export interface EncryptedKeyPackage {
  encryptedData: string; // base64
  iv: string; // base64
  authTag: string; // base64
}

export interface ProcessedFileResult {
  chunks: EncryptedChunkData[];
  masterKey: string; // hex
  chunkKeys: Record<number, string>; // index -> hex key
  encryptedChunkKeys: EncryptedKeyPackage;
  totalChunks: number;
  totalSize: number;
}

export interface UploadedChunk {
  index: number;
  cid: string;
  hash: string;
  size: number;
}

export interface ChunkUploadResult {
  uploadedChunks: UploadedChunk[];
  manifest: ChunkManifest[];
  masterKey: string;
  chunkKeys: Record<number, string>;
  encryptedChunkKeys: EncryptedKeyPackage;
  keyPackageFingerprint: string;
}

export interface ProgressCallback {
  (progress: {
    stage: 'reading' | 'chunking' | 'encrypting' | 'uploading';
    chunkIndex?: number;
    totalChunks?: number;
    percentage?: number;
  }): void;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const cleaned = hex.trim().toLowerCase().replace(/^0x/, '');
  if (cleaned.length % 2 !== 0) {
    throw new Error('Hex string must have even length');
  }
  const array = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < array.length; i++) {
    array[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return array;
}

/**
 * Convert Uint8Array to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert Uint8Array to base64 string
 */
function bytesToBase64(bytes: Uint8Array): string {
  // React Native compatible base64 encoding
  const binary = Array.from(bytes)
    .map(b => String.fromCharCode(b))
    .join('');
  return btoa(binary);
}

async function appendChunkToFormData(
  formData: FormData,
  encryptedChunk: Uint8Array,
  fileName: string,
  chunkIndex: number
): Promise<() => Promise<void>> {
  const chunkFileName = `${fileName}.chunk${chunkIndex}`;
  const mimeType = 'application/octet-stream';

  const BlobCtor = typeof Blob !== 'undefined'
    ? (Blob as unknown as { new (parts?: unknown[], options?: { type?: string }): Blob })
    : undefined;

  if (BlobCtor) {
    try {
      const blob = new BlobCtor([encryptedChunk], { type: mimeType });
      formData.append('file', blob, chunkFileName);
      return async () => {};
    } catch (blobError) {
      console.warn('[ChunkEncryption] Blob creation failed, falling back to file upload:', blobError);
    }
  }

  const base64Data = bytesToBase64(encryptedChunk);
  const baseTempDir =
    Platform.OS === 'ios'
      ? RNFS.TemporaryDirectoryPath
      : RNFS.CachesDirectoryPath || RNFS.TemporaryDirectoryPath;

  if (!baseTempDir) {
    throw new Error('No temporary directory available for chunk upload');
  }

  const sanitizedBaseName = fileName?.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'chunk';
  const normalizedTempDir = baseTempDir.replace(/\/$/, '');
  const tempFilePath = `${normalizedTempDir}/${sanitizedBaseName}-chunk-${chunkIndex}-${Date.now()}.bin`;

  await RNFS.writeFile(tempFilePath, base64Data, 'base64');

  const uri = Platform.OS === 'ios' ? tempFilePath : `file://${tempFilePath}`;

  formData.append('file', {
    uri,
    type: mimeType,
    name: chunkFileName,
  } as any);

  return async () => {
    try {
      await RNFS.unlink(tempFilePath);
    } catch (cleanupError) {
      console.warn('[ChunkEncryption] Failed to remove temp chunk file:', cleanupError);
    }
  };
}

/**
 * Convert base64 string to Uint8Array
 */
function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function shouldUseFileSystem(uri: string): boolean {
  if (!uri) {
    return false;
  }
  return uri.startsWith('file://')
    || uri.startsWith('/')
    || (Platform.OS === 'android' && uri.startsWith('content://'));
}

function normalizeFsPath(uri: string): string {
  if (!uri) {
    return uri;
  }

  if (uri.startsWith('file://')) {
    return decodeURI(uri.replace('file://', ''));
  }

  if (Platform.OS === 'android' && uri.startsWith('content://')) {
    return uri;
  }

  return decodeURI(uri);
}

function resolveReadableUri(file: PickedFile): string {
  if (file.fileCopyUri) {
    return file.fileCopyUri;
  }

  if (file.uri) {
    return file.uri;
  }

  throw new Error('File không có URI hợp lệ để đọc dữ liệu');
}

/**
 * Generate random bytes using crypto.getRandomValues
 */
function getRandomBytes(length: number): Uint8Array {
  ensureCryptoRandomSupport();
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Fallback for environments without crypto.getRandomValues
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

/**
 * Compute SHA-256 hash of data
 */
function computeHash(data: Uint8Array): string {
  return sha256Hex(data);
}

// ============================================================================
// Core Chunking Logic
// ============================================================================

/**
 * Read file from URI and return as Uint8Array
 *
 * In React Native, files are accessed via URIs.
 * We use fetch() to read the file content.
 */
async function readFileFromURI(uri: string): Promise<Uint8Array> {
  try {
    console.log('[ChunkEncryption] Reading file từ URI:', uri);

    if (shouldUseFileSystem(uri)) {
      const path = normalizeFsPath(uri);
      const base64Data = await RNFS.readFile(path, 'base64');
      return base64ToBytes(base64Data);
    }

    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to read file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('[ChunkEncryption] Error reading file:', error);
    throw new Error(`Failed to read file from URI: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Split file buffer into chunks
 */
function splitIntoChunks(
  fileBuffer: Uint8Array,
  chunkSize: number = CHUNK_CONFIG.DEFAULT_SIZE
): ChunkData[] {
  const chunks: ChunkData[] = [];
  let offset = 0;
  let index = 0;

  console.log(`[ChunkEncryption] Splitting file (${fileBuffer.length} bytes) into chunks of ${chunkSize} bytes`);

  while (offset < fileBuffer.length) {
    const remainingSize = fileBuffer.length - offset;
    const currentChunkSize = Math.min(chunkSize, remainingSize);
    const chunkData = fileBuffer.slice(offset, offset + currentChunkSize);

    chunks.push({
      index,
      data: chunkData,
      size: chunkData.length,
    });

    offset += currentChunkSize;
    index++;
  }

  console.log(`[ChunkEncryption] Created ${chunks.length} chunks`);
  return chunks;
}

// ============================================================================
// Crypto Operations
// ============================================================================

/**
 * Generate random 32-byte (256-bit) key for AES-256
 */
export function generateChunkKey(): Uint8Array {
  return getRandomBytes(32);
}

/**
 * Generate master key (32 bytes)
 */
export function generateMasterKey(): string {
  // Reuse the existing AOT master key generation
  return generateAOTMasterKey();
}

/**
 * Encrypt chunk data using AES-256-GCM
 *
 * Uses Web Crypto API (SubtleCrypto) which is available in React Native
 */
async function encryptChunkWithAESGCM(
  chunkData: Uint8Array,
  chunkKey: Uint8Array
): Promise<{
  encryptedData: Uint8Array;
  iv: Uint8Array;
  authTag: Uint8Array;
}> {
  // Generate random 12-byte IV for GCM
  const iv = getRandomBytes(12);

  try {
    const subtle = ensureWebCryptoSupport();
    // Import key
    const cryptoKey = await subtle.importKey(
      'raw',
      chunkKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // Encrypt
    const encrypted = await subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128, // 16 bytes auth tag
      },
      cryptoKey,
      chunkData
    );

    // The encrypted result contains both ciphertext and auth tag
    // Last 16 bytes are the auth tag
    const encryptedArray = new Uint8Array(encrypted);
    const ciphertextLength = encryptedArray.length - 16;
    const encryptedData = encryptedArray.slice(0, ciphertextLength);
    const authTag = encryptedArray.slice(ciphertextLength);

    return {
      encryptedData,
      iv,
      authTag,
    };
  } catch (error) {
    console.error('[ChunkEncryption] AES-GCM encryption error:', error);
    throw new Error(`Chunk encryption failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Decrypt chunk data using AES-256-GCM
 */
export async function decryptChunkWithAESGCM(
  encryptedData: Uint8Array,
  chunkKey: Uint8Array,
  iv: Uint8Array,
  authTag: Uint8Array
): Promise<Uint8Array> {
  try {
    const subtle = ensureWebCryptoSupport();
    // Combine encrypted data and auth tag
    const combined = new Uint8Array(encryptedData.length + authTag.length);
    combined.set(encryptedData, 0);
    combined.set(authTag, encryptedData.length);

    // Import key
    const cryptoKey = await subtle.importKey(
      'raw',
      chunkKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // Decrypt
    const decrypted = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128,
      },
      cryptoKey,
      combined
    );

    return new Uint8Array(decrypted);
  } catch (error) {
    console.error('[ChunkEncryption] AES-GCM decryption error:', error);
    throw new Error(`Chunk decryption failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Create encrypted chunk package ready for IPFS upload
 * Format: [12 bytes IV][16 bytes AuthTag][N bytes EncryptedData]
 */
async function createEncryptedChunkPackage(
  chunkData: Uint8Array,
  chunkKey: Uint8Array
): Promise<{
  encryptedBuffer: Uint8Array;
  iv: Uint8Array;
  authTag: Uint8Array;
  hash: string;
}> {
  // Compute hash of PLAIN data BEFORE encryption (for integrity check)
  const hash = computeHash(chunkData);

  // Encrypt
  const { encryptedData, iv, authTag } = await encryptChunkWithAESGCM(chunkData, chunkKey);

  // Combine IV + AuthTag + EncryptedData into single buffer for IPFS
  const encryptedBuffer = new Uint8Array(iv.length + authTag.length + encryptedData.length);
  encryptedBuffer.set(iv, 0);
  encryptedBuffer.set(authTag, iv.length);
  encryptedBuffer.set(encryptedData, iv.length + authTag.length);

  return {
    encryptedBuffer,
    iv,
    authTag,
    hash, // Hash of PLAIN data for integrity verification
  };
}

/**
 * Parse encrypted chunk package from IPFS download
 * Format: [12 bytes IV][16 bytes AuthTag][N bytes EncryptedData]
 */
export function parseEncryptedChunkPackage(encryptedBuffer: Uint8Array): {
  iv: Uint8Array;
  authTag: Uint8Array;
  encryptedData: Uint8Array;
} {
  const iv = encryptedBuffer.slice(0, 12);
  const authTag = encryptedBuffer.slice(12, 28);
  const encryptedData = encryptedBuffer.slice(28);

  return { iv, authTag, encryptedData };
}

/**
 * Encrypt chunk keys object with master key
 */
async function encryptChunkKeys(
  chunkKeysObject: Record<number, string>,
  masterKey: string
): Promise<EncryptedKeyPackage> {
  const plainText = JSON.stringify(chunkKeysObject);
  const plainBytes = new TextEncoder().encode(plainText);
  const masterKeyBytes = hexToBytes(masterKey);

  const { encryptedData, iv, authTag } = await encryptChunkWithAESGCM(plainBytes, masterKeyBytes);

  return {
    encryptedData: bytesToBase64(encryptedData),
    iv: bytesToBase64(iv),
    authTag: bytesToBase64(authTag),
  };
}

/**
 * Decrypt chunk keys object with master key
 */
export async function decryptChunkKeys(
  encryptedPackage: EncryptedKeyPackage,
  masterKey: string
): Promise<Record<number, string>> {
  const encryptedData = base64ToBytes(encryptedPackage.encryptedData);
  const iv = base64ToBytes(encryptedPackage.iv);
  const authTag = base64ToBytes(encryptedPackage.authTag);
  const masterKeyBytes = hexToBytes(masterKey);

  const decrypted = await decryptChunkWithAESGCM(encryptedData, masterKeyBytes, iv, authTag);
  const plainText = new TextDecoder().decode(decrypted);

  return JSON.parse(plainText);
}

// ============================================================================
// File Processing
// ============================================================================

/**
 * Process complete file for chunked upload
 * This is the main function that:
 * 1. Reads file from URI
 * 2. Splits into chunks
 * 3. Generates keys
 * 4. Encrypts each chunk
 */
export async function processFileForChunking(
  file: PickedFile,
  chunkSize?: number,
  onProgress?: ProgressCallback
): Promise<ProcessedFileResult> {
  try {
    // 1. Read file
    onProgress?.({ stage: 'reading', percentage: 0 });
    const sourceUri = resolveReadableUri(file);
    const fileBuffer = await readFileFromURI(sourceUri);

    // 2. Split into chunks
    onProgress?.({ stage: 'chunking', percentage: 10 });
    const chunks = splitIntoChunks(fileBuffer, chunkSize);

    // 3. Generate master key
    const masterKey = generateMasterKey();

    // 4. Process each chunk
    const chunkKeysObject: Record<number, string> = {};
    const processedChunks: EncryptedChunkData[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      onProgress?.({
        stage: 'encrypting',
        chunkIndex: i,
        totalChunks: chunks.length,
        percentage: 10 + (i / chunks.length) * 40,
      });

      // Generate unique key for this chunk
      const chunkKey = generateChunkKey();
      chunkKeysObject[chunk.index] = bytesToHex(chunkKey);

      // Create encrypted package
      const { encryptedBuffer, iv, authTag, hash } = await createEncryptedChunkPackage(
        chunk.data,
        chunkKey
      );

      processedChunks.push({
        index: chunk.index,
        size: chunk.size,
        hash,
        encryptedBuffer,
        iv,
        authTag,
      });

      console.log(`[ChunkEncryption] Processed chunk ${i}/${chunks.length - 1}:`, {
        index: chunk.index,
        originalSize: chunk.size,
        encryptedSize: encryptedBuffer.length,
        hash: hash.substring(0, 16) + '...',
      });
    }

    // 5. Encrypt chunk keys with master key
    onProgress?.({ stage: 'encrypting', percentage: 50 });
    const encryptedChunkKeys = await encryptChunkKeys(chunkKeysObject, masterKey);

    console.log('[ChunkEncryption] File processing complete:', {
      totalChunks: processedChunks.length,
      totalSize: fileBuffer.length,
      masterKeyLength: masterKey.length,
      chunkKeysCount: Object.keys(chunkKeysObject).length,
    });

    return {
      chunks: processedChunks,
      masterKey,
      chunkKeys: chunkKeysObject,
      encryptedChunkKeys,
      totalChunks: processedChunks.length,
      totalSize: fileBuffer.length,
    };
  } catch (error) {
    console.error('[ChunkEncryption] File processing error:', error);
    throw error;
  }
}

// ============================================================================
// IPFS Upload
// ============================================================================

/**
 * Upload encrypted chunk directly to IPFS gateway
 */
async function uploadChunkToIPFS(
  encryptedChunk: Uint8Array,
  chunkIndex: number,
  fileName: string,
  ipfsGatewayUrl: string
): Promise<string> {
  try {
    console.log(`[ChunkEncryption] Uploading chunk ${chunkIndex} to IPFS...`);

    // Create form data
    const formData = new FormData();
    const cleanup = await appendChunkToFormData(formData, encryptedChunk, fileName, chunkIndex);

    // Upload to IPFS via HTTP API
    try {
      const response = await fetch(`${ipfsGatewayUrl}/api/v0/add`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`IPFS upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      const cid = result.Hash;

      console.log(`[ChunkEncryption] Chunk ${chunkIndex} uploaded: ${cid}`);

      return cid;
    } finally {
      await cleanup();
    }
  } catch (error) {
    console.error(`[ChunkEncryption] Failed to upload chunk ${chunkIndex}:`, error);
    throw new Error(`Chunk ${chunkIndex} upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Upload all chunks to IPFS and create manifest
 */
export async function uploadChunksToIPFS(
  processedFile: ProcessedFileResult,
  fileName: string,
  ipfsGatewayUrl: string,
  onProgress?: ProgressCallback
): Promise<ChunkUploadResult> {
  try {
    const uploadedChunks: UploadedChunk[] = [];

    // Upload each chunk
    for (let i = 0; i < processedFile.chunks.length; i++) {
      const chunk = processedFile.chunks[i];

      onProgress?.({
        stage: 'uploading',
        chunkIndex: i,
        totalChunks: processedFile.totalChunks,
        percentage: 50 + (i / processedFile.totalChunks) * 50,
      });

      const cid = await uploadChunkToIPFS(
        chunk.encryptedBuffer,
        chunk.index,
        fileName,
        ipfsGatewayUrl
      );

      uploadedChunks.push({
        index: chunk.index,
        cid,
        hash: chunk.hash,
        size: chunk.size,
      });
    }

    // Create manifest
    const manifest: ChunkManifest[] = uploadedChunks.map(chunk => ({
      index: chunk.index,
      cid: chunk.cid,
      hash: chunk.hash,
      size: chunk.size,
    }));

    // Compute key package fingerprint
    const fingerprintData = `${fileName}:${processedFile.masterKey}:${processedFile.totalChunks}`;
    const fingerprintBytes = new TextEncoder().encode(fingerprintData);
    const keyPackageFingerprint = computeHash(fingerprintBytes);

    console.log('[ChunkEncryption] Upload complete:', {
      uploadedChunks: uploadedChunks.length,
      manifestSize: manifest.length,
      keyPackageFingerprint: keyPackageFingerprint.substring(0, 16) + '...',
    });

    onProgress?.({ stage: 'uploading', percentage: 100 });

    return {
      uploadedChunks,
      manifest,
      masterKey: processedFile.masterKey,
      chunkKeys: processedFile.chunkKeys,
      encryptedChunkKeys: processedFile.encryptedChunkKeys,
      keyPackageFingerprint,
    };
  } catch (error) {
    console.error('[ChunkEncryption] Upload error:', error);
    throw error;
  }
}

// ============================================================================
// Main API
// ============================================================================

/**
 * Complete file upload pipeline:
 * 1. Process file (chunk + encrypt)
 * 2. Upload chunks to IPFS
 * 3. Return manifest and keys
 */
export async function processAndUploadFile(
  file: PickedFile,
  ipfsGatewayUrl: string,
  chunkSize?: number,
  onProgress?: ProgressCallback
): Promise<ChunkUploadResult> {
  console.log('[ChunkEncryption] Starting complete upload pipeline:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  // Process file
  const processedFile = await processFileForChunking(file, chunkSize, onProgress);

  // Upload to IPFS
  const result = await uploadChunksToIPFS(
    processedFile,
    file.name || 'unknown',
    ipfsGatewayUrl,
    onProgress
  );

  console.log('[ChunkEncryption] Complete pipeline finished successfully');

  return result;
}
