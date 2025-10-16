import type { FileAccessManifest } from './AnonymousFileAccessService';
import type {
  ChunkProgress,
  ChunkStatus,
  DownloadPhase,
  SecureKeyPackage,
} from '../types/download';
import { getKeyPackage } from './KeyPackageStorage';
import {
  decryptChunkWithAESGCM,
  parseEncryptedChunkPackage,
} from './ChunkEncryptionService';
import { sha256 } from '@noble/hashes/sha2';
import { API_CONFIG } from '../config/api';

export type ChunkDownloadSession = {
  fileId: string;
  manifest: FileAccessManifest | null;
  phase: DownloadPhase;
  chunkProgress: ChunkProgress[];
  error: string | null;
  integrityVerified: boolean;
  secureKeyPackage: SecureKeyPackage | null;
  startedAt: number | null;
  completedAt: number | null;
};

type ChunkUpdate = {
  status?: ChunkStatus;
  hash?: string;
  size?: number;
  error?: string | null;
  retries?: number;
};

type SessionUpdater = (previous: ChunkDownloadSession) => ChunkDownloadSession;

type Listener = () => void;

const sessions = new Map<string, ChunkDownloadSession>();
const listeners = new Set<Listener>();
const activeDownloads = new Map<string, Promise<void>>();

// Store decrypted chunks in memory (for file reassembly)
const decryptedChunks = new Map<string, Map<number, Uint8Array>>();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper: Convert hex string to Uint8Array
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
 * Helper: Convert Uint8Array to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Download encrypted chunk from IPFS by CID
 */
async function downloadChunkFromIPFS(cid: string): Promise<Uint8Array> {
  const ipfsUrl = `${API_CONFIG.ipfsGatewayUrl}/api/v0/cat?arg=${cid}`;

  console.log('[ChunkDownload] Fetching chunk from IPFS:', { cid, ipfsUrl });

  const response = await fetch(ipfsUrl, {
    method: 'POST', // IPFS HTTP API uses POST
    timeout: 30000,
  } as any);

  if (!response.ok) {
    throw new Error(`Failed to download chunk from IPFS: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Verify chunk integrity by comparing hash
 */
function verifyChunkIntegrity(data: Uint8Array, expectedHash: string): boolean {
  const actualHash = bytesToHex(sha256(data));
  return actualHash === expectedHash.toLowerCase();
}

const createDefaultSession = (fileId: string): ChunkDownloadSession => ({
  fileId,
  manifest: null,
  phase: 'idle',
  chunkProgress: [],
  error: null,
  integrityVerified: false,
  secureKeyPackage: null,
  startedAt: null,
  completedAt: null,
});

const emit = () => {
  listeners.forEach(listener => listener());
};

const withSession = (fileId: string, updater: SessionUpdater) => {
  const previous = sessions.get(fileId) ?? createDefaultSession(fileId);
  const next = updater(previous);
  sessions.set(fileId, next);
  emit();
  return next;
};

const ensureChunkProgress = (
  manifest: FileAccessManifest | null,
  existing?: ChunkProgress[],
): ChunkProgress[] => {
  if (!manifest) {
    return [];
  }

  return manifest.chunkManifest.map(chunk => {
    const prior = existing?.find(item => item.index === chunk.index);
    return {
      index: chunk.index,
      status: prior?.status ?? 'pending',
      hash: chunk.hash,
      size: chunk.size,
      error: prior?.error ?? null,
      retries: prior?.retries ?? 0,
    } as ChunkProgress;
  });
};

const updateChunkProgress = (
  session: ChunkDownloadSession,
  chunkIndex: number,
  update: ChunkUpdate,
): ChunkDownloadSession => {
  if (session.chunkProgress.length === 0) {
    return session;
  }

  const chunkIdx = session.chunkProgress.findIndex(chunk => chunk.index === chunkIndex);
  if (chunkIdx === -1) {
    return session;
  }

  const current = session.chunkProgress[chunkIdx];
  const retries = update.retries ?? (update.status === 'error' ? current.retries + 1 : current.retries);
  const nextChunk: ChunkProgress = {
    ...current,
    ...(update.status ? { status: update.status } : {}),
    ...(update.hash !== undefined ? { hash: update.hash } : {}),
    ...(update.size !== undefined ? { size: update.size } : {}),
    ...(update.error !== undefined ? { error: update.error } : {}),
    retries,
  };

  const chunkProgress = [...session.chunkProgress];
  chunkProgress[chunkIdx] = nextChunk;

  return {
    ...session,
    chunkProgress,
  };
};

const recomputeIntegrity = (session: ChunkDownloadSession): boolean =>
  session.chunkProgress.length > 0 &&
  session.chunkProgress.every(chunk => chunk.status === 'completed');

/**
 * Process chunk: download from IPFS, decrypt, verify integrity
 * REAL IMPLEMENTATION (Task C)
 */
const processChunk = async (
  fileId: string,
  chunkIndex: number,
  manifest: FileAccessManifest,
  keyPackage: SecureKeyPackage,
) => {
  const manifestChunk = manifest.chunkManifest.find(chunk => chunk.index === chunkIndex);
  if (!manifestChunk) {
    throw new Error(`Chunk ${chunkIndex} missing from manifest`);
  }

  const chunkKey = keyPackage.chunkKeys[chunkIndex];
  if (!chunkKey) {
    throw new Error(`Chunk key missing for index ${chunkIndex}`);
  }

  try {
    // 1. DOWNLOAD from IPFS
    withSession(fileId, session => ({
      ...updateChunkProgress(session, chunkIndex, { status: 'downloading', error: null }),
      error: null,
    }));

    console.log(`[ChunkDownload] Downloading chunk ${chunkIndex} from IPFS...`);
    const encryptedBuffer = await downloadChunkFromIPFS(manifestChunk.cid);

    // 2. PARSE encrypted package
    const { iv, authTag, encryptedData } = parseEncryptedChunkPackage(encryptedBuffer);

    // 3. DECRYPT
    withSession(fileId, session => updateChunkProgress(session, chunkIndex, {
      status: 'verifying',
    }));

    console.log(`[ChunkDownload] Decrypting chunk ${chunkIndex}...`);
    const chunkKeyBytes = hexToBytes(chunkKey);
    const decryptedData = await decryptChunkWithAESGCM(
      encryptedData,
      chunkKeyBytes,
      iv,
      authTag
    );

    // 4. VERIFY INTEGRITY
    console.log(`[ChunkDownload] Verifying integrity of chunk ${chunkIndex}...`);
    const isValid = verifyChunkIntegrity(decryptedData, manifestChunk.hash);

    if (!isValid) {
      throw new Error(`Integrity check failed for chunk ${chunkIndex}`);
    }

    // 5. STORE decrypted chunk
    let fileChunks = decryptedChunks.get(fileId);
    if (!fileChunks) {
      fileChunks = new Map();
      decryptedChunks.set(fileId, fileChunks);
    }
    fileChunks.set(chunkIndex, decryptedData);

    console.log(`[ChunkDownload] Chunk ${chunkIndex} completed successfully`);

    // 6. UPDATE session
    withSession(fileId, session => {
      const next = updateChunkProgress(session, chunkIndex, {
        status: 'completed',
        error: null,
        hash: manifestChunk.hash,
        size: manifestChunk.size,
      });
      const integrityVerified = recomputeIntegrity(next);
      return {
        ...next,
        integrityVerified,
        completedAt: integrityVerified ? Date.now() : next.completedAt,
      };
    });

  } catch (error) {
    console.error(`[ChunkDownload] Error processing chunk ${chunkIndex}:`, error);
    withSession(fileId, session => updateChunkProgress(session, chunkIndex, {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    }));
    throw error;
  }
};

/**
 * Reassemble file from decrypted chunks
 * Combines all chunks in sequential order
 */
async function reassembleFile(fileId: string): Promise<Uint8Array> {
  const chunks = decryptedChunks.get(fileId);
  if (!chunks || chunks.size === 0) {
    throw new Error('No decrypted chunks found for file');
  }

  console.log(`[ChunkDownload] Reassembling ${chunks.size} chunks for file ${fileId}...`);

  // Calculate total size
  let totalSize = 0;
  chunks.forEach(chunk => {
    totalSize += chunk.length;
  });

  console.log(`[ChunkDownload] Total file size: ${totalSize} bytes`);

  // Combine chunks in order
  const fileData = new Uint8Array(totalSize);
  let offset = 0;

  for (let i = 0; i < chunks.size; i++) {
    const chunk = chunks.get(i);
    if (!chunk) {
      throw new Error(`Missing chunk ${i} during reassembly`);
    }
    fileData.set(chunk, offset);
    offset += chunk.length;
  }

  console.log(`[ChunkDownload] File reassembly completed successfully`);
  return fileData;
}

/**
 * Real download implementation (Task C)
 * Downloads chunks from IPFS, decrypts, verifies, and reassembles file
 */
const runRealDownload = async (fileId: string) => {
  const session = sessions.get(fileId);
  if (!session || !session.manifest) {
    throw new Error('Chunk manifest not initialized for download');
  }

  const { manifest } = session;

  // Load key package from storage
  console.log(`[ChunkDownload] Loading key package for file ${fileId}...`);
  const keyPackage = await getKeyPackage(fileId);
  if (!keyPackage) {
    throw new Error('Key package not found. Cannot decrypt file.');
  }

  // Verify fingerprint matches
  if (session.secureKeyPackage?.keyPackageFingerprint &&
      keyPackage.fingerprint !== session.secureKeyPackage.keyPackageFingerprint) {
    throw new Error('Key package fingerprint mismatch - possible tampering detected');
  }

  withSession(fileId, previous => ({
    ...previous,
    phase: 'chunks',
    error: null,
    startedAt: previous.startedAt ?? Date.now(),
  }));

  // Download and decrypt all chunks
  console.log(`[ChunkDownload] Starting download of ${manifest.chunkManifest.length} chunks...`);
  for (const chunk of manifest.chunkManifest) {
    await processChunk(fileId, chunk.index, manifest, keyPackage);
  }

  // Reassemble file
  console.log(`[ChunkDownload] All chunks downloaded, reassembling file...`);
  withSession(fileId, previous => ({
    ...previous,
    phase: 'assembling',
  }));

  await reassembleFile(fileId);

  withSession(fileId, previous => ({
    ...previous,
    phase: 'ready',
    error: null,
    completedAt: Date.now(),
  }));

  console.log(`[ChunkDownload] Download complete for file ${fileId}`);
};

export const chunkDownloadManager = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getState(fileId: string): ChunkDownloadSession {
    return sessions.get(fileId) ?? createDefaultSession(fileId);
  },
  ensureSession(fileId: string, manifest: FileAccessManifest | null) {
    withSession(fileId, previous => {
      const manifestChanged = Boolean(manifest && manifest !== previous.manifest);
      const shouldRebuildChunks = manifestChanged || (manifest && previous.chunkProgress.length === 0);
      const chunkProgress = shouldRebuildChunks
        ? ensureChunkProgress(manifest, previous.chunkProgress)
        : previous.chunkProgress;

      return {
        ...previous,
        manifest,
        chunkProgress,
      };
    });
  },
  setPhase(fileId: string, phase: DownloadPhase) {
    withSession(fileId, previous => ({
      ...previous,
      phase,
    }));
  },
  setError(fileId: string, error: string | null) {
    withSession(fileId, previous => ({
      ...previous,
      error,
    }));
  },
  setSecureKeyPackage(fileId: string, secureKeyPackage: SecureKeyPackage | null) {
    withSession(fileId, previous => ({
      ...previous,
      secureKeyPackage,
    }));
  },
  resetSession(fileId: string) {
    sessions.delete(fileId);
    activeDownloads.delete(fileId);
    decryptedChunks.delete(fileId);
    emit();
  },
  /**
   * Download file from IPFS (REAL implementation - Task C)
   * Downloads encrypted chunks, decrypts them, verifies integrity, and reassembles file
   */
  async downloadFile(fileId: string): Promise<void> {
    if (activeDownloads.has(fileId)) {
      return activeDownloads.get(fileId);
    }

    const promise = runRealDownload(fileId).catch(error => {
      withSession(fileId, previous => ({
        ...previous,
        phase: 'chunks',
        error: error instanceof Error ? error.message : String(error),
      }));
      throw error;
    }).finally(() => {
      activeDownloads.delete(fileId);
    });

    activeDownloads.set(fileId, promise);
    return promise;
  },
  /**
   * Get assembled file data after download completes
   * Returns the decrypted, reassembled file as Uint8Array
   */
  async getAssembledFile(fileId: string): Promise<Uint8Array | null> {
    const chunks = decryptedChunks.get(fileId);
    if (!chunks || chunks.size === 0) {
      return null;
    }
    return reassembleFile(fileId);
  },
  /**
   * Clear downloaded chunks from memory cache
   * Call this after saving file to device to free memory
   */
  clearDownloadCache(fileId: string) {
    decryptedChunks.delete(fileId);
    console.log(`[ChunkDownload] Cleared chunk cache for file ${fileId}`);
  },
  async retryChunk(fileId: string, chunkIndex: number) {
    const session = sessions.get(fileId);
    if (!session || !session.manifest) {
      throw new Error('Chunk manifest not initialized for retry');
    }

    // Load key package
    const keyPackage = await getKeyPackage(fileId);
    if (!keyPackage) {
      throw new Error('Key package not found. Cannot retry chunk.');
    }

    withSession(fileId, previous => ({
      ...previous,
      phase: 'chunks',
    }));

    withSession(fileId, previous => {
      const currentRetries = previous.chunkProgress.find(chunk => chunk.index === chunkIndex)?.retries ?? 0;
      return updateChunkProgress(previous, chunkIndex, {
        status: 'downloading',
        error: null,
        retries: currentRetries + 1,
      });
    });

    await processChunk(fileId, chunkIndex, session.manifest, keyPackage);

    withSession(fileId, previous => (
      previous.integrityVerified
        ? {
            ...previous,
            phase: 'ready',
            error: null,
          }
        : previous
    ));
  },
};
