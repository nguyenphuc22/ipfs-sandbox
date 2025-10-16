import type { FileAccessManifest } from './AnonymousFileAccessService';
import type {
  ChunkProgress,
  ChunkStatus,
  DownloadPhase,
  SecureKeyPackage,
} from '../types/download';

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

const processChunk = async (
  fileId: string,
  chunkIndex: number,
  manifest: FileAccessManifest,
) => {
  const manifestChunk = manifest.chunkManifest.find(chunk => chunk.index === chunkIndex);
  if (!manifestChunk) {
    throw new Error(`Chunk ${chunkIndex} missing from manifest`);
  }

  withSession(fileId, session => ({
    ...updateChunkProgress(session, chunkIndex, { status: 'downloading', error: null }),
    error: null,
  }));
  await delay(500);

  withSession(fileId, session => updateChunkProgress(session, chunkIndex, {
    status: 'verifying',
    hash: manifestChunk.hash,
    size: manifestChunk.size,
  }));
  await delay(200);

  withSession(fileId, session => {
    const next = updateChunkProgress(session, chunkIndex, { status: 'completed', error: null });
    const integrityVerified = recomputeIntegrity(next);
    return {
      ...next,
      integrityVerified,
      completedAt: integrityVerified ? Date.now() : next.completedAt,
    };
  });
};

const runDownloadSimulation = async (fileId: string) => {
  const session = sessions.get(fileId);
  if (!session || !session.manifest) {
    throw new Error('Chunk manifest not initialised for download');
  }

  const { manifest } = session;

  withSession(fileId, previous => ({
    ...previous,
    phase: 'chunks',
    error: null,
    startedAt: previous.startedAt ?? Date.now(),
  }));

  for (const chunk of manifest.chunkManifest) {
    await processChunk(fileId, chunk.index, manifest);
  }

  withSession(fileId, previous => ({
    ...previous,
    phase: 'ready',
    error: null,
  }));
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
    emit();
  },
  async simulateDownload(fileId: string) {
    if (activeDownloads.has(fileId)) {
      return activeDownloads.get(fileId);
    }

    const promise = runDownloadSimulation(fileId).catch(error => {
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
  async retryChunk(fileId: string, chunkIndex: number) {
    const session = sessions.get(fileId);
    if (!session || !session.manifest) {
      throw new Error('Chunk manifest not initialised for retry');
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

    await processChunk(fileId, chunkIndex, session.manifest);

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
