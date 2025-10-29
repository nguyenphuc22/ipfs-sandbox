import { useEffect, useMemo, useState } from 'react';
import type { FileAccessManifest } from '../services/AnonymousFileAccessService';
import {
  chunkDownloadManager,
  type ChunkDownloadSession,
} from '../services/chunkDownloadManager';
import type { DownloadPhase, SecureKeyPackage } from '../types/download';

export type ChunkDownloaderActions = {
  ensureSession: (manifest: FileAccessManifest | null) => void;
  setPhase: (phase: DownloadPhase) => void;
  setError: (error: string | null) => void;
  setSecureKeyPackage: (secureKeyPackage: SecureKeyPackage | null) => void;
  resetSession: () => void;
  downloadFile: () => Promise<void>;
  getAssembledFile: () => Promise<Uint8Array | null>;
  clearDownloadCache: () => void;
  retryChunk: (chunkIndex: number) => Promise<void>;
};

export const useChunkDownloadSession = (fileId: string): ChunkDownloadSession => {
  const [session, setSession] = useState<ChunkDownloadSession>(() =>
    chunkDownloadManager.getState(fileId),
  );

  useEffect(() => {
    setSession(chunkDownloadManager.getState(fileId));
    const unsubscribe = chunkDownloadManager.subscribe(() => {
      setSession(chunkDownloadManager.getState(fileId));
    });
    return () => {
      unsubscribe();
    };
  }, [fileId]);

  return session;
};

export const useChunkDownloader = (
  fileId: string,
): { session: ChunkDownloadSession; actions: ChunkDownloaderActions } => {
  const session = useChunkDownloadSession(fileId);

  const actions = useMemo<ChunkDownloaderActions>(
    () => ({
      ensureSession: (manifest: FileAccessManifest | null) =>
        chunkDownloadManager.ensureSession(fileId, manifest),
      setPhase: (phase: DownloadPhase) => chunkDownloadManager.setPhase(fileId, phase),
      setError: (error: string | null) => chunkDownloadManager.setError(fileId, error),
      setSecureKeyPackage: (secureKeyPackage: SecureKeyPackage | null) =>
        chunkDownloadManager.setSecureKeyPackage(fileId, secureKeyPackage),
      resetSession: () => chunkDownloadManager.resetSession(fileId),
      downloadFile: () => chunkDownloadManager.downloadFile(fileId),
      getAssembledFile: () => chunkDownloadManager.getAssembledFile(fileId),
      clearDownloadCache: () => chunkDownloadManager.clearDownloadCache(fileId),
      retryChunk: (chunkIndex: number) => chunkDownloadManager.retryChunk(fileId, chunkIndex),
    }),
    [fileId],
  );

  return {
    session,
    actions,
  };
};
