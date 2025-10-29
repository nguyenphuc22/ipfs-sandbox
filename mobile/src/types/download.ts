import type { FileAccessManifest } from '../services/AnonymousFileAccessService';

export type DownloadPhase = 'idle' | 'access' | 'waitingKey' | 'keys' | 'chunks' | 'assembling' | 'ready';

export type ChunkStatus = 'pending' | 'downloading' | 'verifying' | 'completed' | 'error';

export type ChunkProgress = {
  index: number;
  status: ChunkStatus;
  hash?: string;
  size?: number;
  error?: string | null;
  retries: number;
};

export type ChunkProgressState = {
  chunkProgress: ChunkProgress[];
  progressPercent: number;
};

export type SecureKeyPackage = {
  masterKey: string;
  chunkKeys: Record<number, string>;
  fingerprint?: string;
};

export type ChunkManifest = FileAccessManifest['chunkManifest'];
