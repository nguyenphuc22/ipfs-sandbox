import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FileAccessManifest } from '../services/AnonymousFileAccessService';
import type {
  ChunkProgress,
  ChunkProgressState,
  ChunkStatus,
} from '../types/download';

type UseChunkProgressOptions = {
  manifest?: FileAccessManifest | null;
};

type UpdateOptions = {
  status?: ChunkStatus;
  error?: string | null;
};

type UseChunkProgressReturn = ChunkProgressState & {
  setStatus: (chunkIndex: number, update: UpdateOptions) => void;
  markCompleted: (chunkIndex: number) => void;
  markError: (chunkIndex: number, error: string) => void;
  reset: () => void;
};

export const useChunkProgress = (
  options: UseChunkProgressOptions = {},
): UseChunkProgressReturn => {
  const { manifest } = options;
  const initialisedRef = useRef(false);
  const [chunkProgress, setChunkProgress] = useState<ChunkProgress[]>([]);

  useEffect(() => {
    if (!manifest || manifest.chunkManifest.length === 0) {
      initialisedRef.current = false;
      setChunkProgress([]);
      return;
    }

    setChunkProgress(
      manifest.chunkManifest.map((chunk) => ({
        index: chunk.index,
        status: 'pending',
        hash: chunk.hash,
        size: chunk.size,
        error: null,
        retries: 0,
      })),
    );
    initialisedRef.current = true;
  }, [manifest]);

  const setStatus = useCallback((chunkIndex: number, update: UpdateOptions) => {
    setChunkProgress((prev) =>
      prev.map((chunk) =>
        chunk.index === chunkIndex
          ? {
              ...chunk,
              ...(update.status ? { status: update.status } : {}),
              ...(update.error !== undefined ? { error: update.error } : {}),
              retries: update.status === 'error' ? chunk.retries + 1 : chunk.retries,
            }
          : chunk,
      ),
    );
  }, []);

  const markCompleted = useCallback((chunkIndex: number) => {
    setStatus(chunkIndex, { status: 'completed', error: null });
  }, [setStatus]);

  const markError = useCallback((chunkIndex: number, error: string) => {
    setStatus(chunkIndex, { status: 'error', error });
  }, [setStatus]);

  const reset = useCallback(() => {
    if (!manifest || manifest.chunkManifest.length === 0) {
      setChunkProgress([]);
      initialisedRef.current = false;
      return;
    }

    setChunkProgress(
      manifest.chunkManifest.map((chunk) => ({
        index: chunk.index,
        status: 'pending',
        hash: chunk.hash,
        size: chunk.size,
        error: null,
        retries: 0,
      })),
    );
  }, [manifest]);

  const progressPercent = useMemo(() => {
    if (chunkProgress.length === 0) {
      return 0;
    }

    const completed = chunkProgress.filter((chunk) => chunk.status === 'completed').length;
    return (completed / chunkProgress.length) * 100;
  }, [chunkProgress]);

  return {
    chunkProgress,
    progressPercent,
    setStatus,
    markCompleted,
    markError,
    reset,
  };
};
