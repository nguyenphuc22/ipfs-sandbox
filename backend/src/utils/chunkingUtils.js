/**
 * Chunking utilities for file processing
 * Implements chunk-based storage as per thesis architecture
 */

const crypto = require('crypto');

// Configuration based on thesis specs (New_Thesis.md line 183-214)
const CHUNK_CONFIG = {
  MIN_SIZE: 1 * 1024 * 1024,      // 1 MB
  DEFAULT_SIZE: 2 * 1024 * 1024,  // 2 MB
  MAX_SIZE: 4 * 1024 * 1024,      // 4 MB
};

/**
 * Split file buffer into chunks
 * @param {Buffer} fileBuffer - Complete file buffer
 * @param {number} chunkSize - Size of each chunk (default 2MB)
 * @returns {Array<{index: number, data: Buffer, size: number}>}
 */
function splitIntoChunks(fileBuffer, chunkSize = CHUNK_CONFIG.DEFAULT_SIZE) {
  const chunks = [];
  let offset = 0;
  let index = 0;

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

  return chunks;
}

/**
 * Generate random AES-256 key for chunk encryption
 * @returns {Buffer} 32-byte key
 */
function generateChunkKey() {
  return crypto.randomBytes(32); // 256 bits
}

/**
 * Generate master key for encrypting chunk keys
 * @returns {Buffer} 32-byte master key
 */
function generateMasterKey() {
  return crypto.randomBytes(32);
}

/**
 * Encrypt chunk with AES-256-GCM
 * @param {Buffer} chunkData - Plain chunk data
 * @param {Buffer} chunkKey - 32-byte encryption key
 * @returns {{encryptedData: Buffer, iv: Buffer, authTag: Buffer}}
 */
function encryptChunk(chunkData, chunkKey) {
  // Generate random IV (12 bytes for GCM)
  const iv = crypto.randomBytes(12);

  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', chunkKey, iv);

  // Encrypt
  const encryptedData = Buffer.concat([
    cipher.update(chunkData),
    cipher.final(),
  ]);

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  return {
    encryptedData,
    iv,
    authTag,
  };
}

/**
 * Decrypt chunk with AES-256-GCM
 * @param {Buffer} encryptedData - Encrypted chunk data
 * @param {Buffer} chunkKey - 32-byte decryption key
 * @param {Buffer} iv - Initialization vector
 * @param {Buffer} authTag - Authentication tag
 * @returns {Buffer} Decrypted data
 */
function decryptChunk(encryptedData, chunkKey, iv, authTag) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', chunkKey, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
}

/**
 * Compute SHA-256 hash of chunk data (for integrity verification)
 * @param {Buffer} chunkData - Chunk data
 * @returns {string} Hex string of hash
 */
function computeChunkHash(chunkData) {
  return crypto.createHash('sha256').update(chunkData).digest('hex');
}

/**
 * Encrypt chunk keys object with master key
 * @param {Object} chunkKeysObject - {"0": "key0hex", "1": "key1hex", ...}
 * @param {Buffer} masterKey - Master key
 * @returns {{encryptedData: string, iv: string, authTag: string}}
 */
function encryptChunkKeys(chunkKeysObject, masterKey) {
  const plainText = JSON.stringify(chunkKeysObject);
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
  const encryptedData = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encryptedData.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

/**
 * Decrypt chunk keys object with master key
 * @param {string} encryptedData - Base64 encrypted data
 * @param {string} iv - Base64 IV
 * @param {string} authTag - Base64 auth tag
 * @param {Buffer} masterKey - Master key
 * @returns {Object} Chunk keys object
 */
function decryptChunkKeys(encryptedData, iv, authTag, masterKey) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    masterKey,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('utf8'));
}

/**
 * Create encrypted chunk package ready for IPFS upload
 * @param {Buffer} chunkData - Plain chunk data
 * @param {Buffer} chunkKey - Encryption key
 * @returns {{encryptedBuffer: Buffer, iv: Buffer, authTag: Buffer, hash: string}}
 */
function createEncryptedChunkPackage(chunkData, chunkKey) {
  // Compute hash of plain data BEFORE encryption (for integrity check)
  const hash = computeChunkHash(chunkData);

  // Encrypt
  const { encryptedData, iv, authTag } = encryptChunk(chunkData, chunkKey);

  // Combine IV + AuthTag + EncryptedData into single buffer for IPFS
  // Format: [12 bytes IV][16 bytes AuthTag][N bytes EncryptedData]
  const encryptedBuffer = Buffer.concat([iv, authTag, encryptedData]);

  return {
    encryptedBuffer,
    iv,
    authTag,
    hash,  // Hash of PLAIN data for integrity verification
  };
}

/**
 * Parse encrypted chunk package from IPFS download
 * @param {Buffer} encryptedBuffer - Combined buffer from IPFS
 * @returns {{iv: Buffer, authTag: Buffer, encryptedData: Buffer}}
 */
function parseEncryptedChunkPackage(encryptedBuffer) {
  // Format: [12 bytes IV][16 bytes AuthTag][N bytes EncryptedData]
  const iv = encryptedBuffer.slice(0, 12);
  const authTag = encryptedBuffer.slice(12, 28);
  const encryptedData = encryptedBuffer.slice(28);

  return { iv, authTag, encryptedData };
}

/**
 * Process complete file for chunked upload
 * @param {Buffer} fileBuffer - Complete file buffer
 * @param {number} chunkSize - Chunk size (optional)
 * @returns {Object} Complete chunking result
 */
function processFileForChunking(fileBuffer, chunkSize) {
  // 1. Split into chunks
  const chunks = splitIntoChunks(fileBuffer, chunkSize);

  // 2. Generate master key
  const masterKey = generateMasterKey();

  // 3. Process each chunk
  const chunkKeysObject = {};
  const processedChunks = chunks.map(({ index, data, size }) => {
    // Generate unique key for this chunk
    const chunkKey = generateChunkKey();

    // Store key in object
    chunkKeysObject[index] = chunkKey.toString('hex');

    // Create encrypted package
    const { encryptedBuffer, hash } = createEncryptedChunkPackage(data, chunkKey);

    return {
      index,
      size,
      hash,
      encryptedBuffer,
    };
  });

  // 4. Encrypt chunk keys with master key
  const encryptedChunkKeysData = encryptChunkKeys(chunkKeysObject, masterKey);

  return {
    chunks: processedChunks,
    masterKey: masterKey.toString('hex'),
    chunkKeys: chunkKeysObject,
    encryptedChunkKeys: encryptedChunkKeysData,
    totalChunks: processedChunks.length,
    totalSize: fileBuffer.length,
  };
}

module.exports = {
  CHUNK_CONFIG,
  splitIntoChunks,
  generateChunkKey,
  generateMasterKey,
  encryptChunk,
  decryptChunk,
  computeChunkHash,
  encryptChunkKeys,
  decryptChunkKeys,
  createEncryptedChunkPackage,
  parseEncryptedChunkPackage,
  processFileForChunking,
};
