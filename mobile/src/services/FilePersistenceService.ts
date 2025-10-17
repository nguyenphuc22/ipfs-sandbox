import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { isDownloadExportEnabled } from '../config/featureFlags';

export type PersistedFileTargets = {
  sandboxPath: string;
  exportPath: string | null;
};

type PersistDownloadedFileParams = {
  fileId: string;
  fileName?: string;
  mimeType?: string | null;
  data: Uint8Array;
};

const DOWNLOADS_FOLDER_NAME = 'anonymous-downloads';
const SHARED_EXPORTS_FOLDER_NAME = 'shared-downloads';

const sanitizeFileName = (name: string | undefined | null, fallback: string): string => {
  if (!name || name.trim().length === 0) {
    return fallback;
  }

  const trimmed = name.trim();
  const sanitized = trimmed.replace(/[^a-zA-Z0-9_.-]/g, '_');
  return sanitized.length > 0 ? sanitized : fallback;
};

const toBase64 = (bytes: Uint8Array): string => {
  if (typeof btoa === 'function') {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    return btoa(binary);
  }

  const globalBuffer = (typeof globalThis !== 'undefined' && (globalThis as any)?.Buffer)
    ? (globalThis as any).Buffer
    : null;

  if (globalBuffer?.from) {
    return globalBuffer.from(bytes).toString('base64');
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Buffer } = require('buffer');
    return Buffer.from(bytes).toString('base64');
  } catch (error) {
    console.warn('[FilePersistence] Unable to encode base64 via Buffer', error);
  }

  // Final fallback: manual conversion (less efficient but ensures output)
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa === 'function') {
    return btoa(binary);
  }
  throw new Error('No base64 encoder available in this environment');
};

const ensureDirectory = async (path: string): Promise<void> => {
  try {
    const exists = await RNFS.exists(path);
    if (!exists) {
      await RNFS.mkdir(path);
    }
  } catch (error) {
    console.warn('[FilePersistence] Failed to ensure directory', path, error);
    throw error;
  }
};

const writeBase64File = async (path: string, base64: string): Promise<void> => {
  try {
    await RNFS.writeFile(path, base64, 'base64');
  } catch (error) {
    console.warn('[FilePersistence] Failed to write file', path, error);
    throw error;
  }
};

export const persistDownloadedFile = async ({
  fileId,
  fileName,
  mimeType,
  data,
}: PersistDownloadedFileParams): Promise<PersistedFileTargets> => {
  const documentDir = RNFS.DocumentDirectoryPath;

  if (!documentDir) {
    throw new Error('Document directory path is not available on this platform');
  }

  const normalizedDocumentDir = documentDir.replace(/\/$/, '');
  const sandboxDir = `${normalizedDocumentDir}/${DOWNLOADS_FOLDER_NAME}`;
  await ensureDirectory(sandboxDir);

  const fallbackName = `${fileId}.bin`;
  const normalizedName = sanitizeFileName(fileName, fallbackName);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sandboxFileName = `${fileId}-${timestamp}-${normalizedName}`;
  const sandboxPath = `${sandboxDir}/${sandboxFileName}`;

  const base64Content = toBase64(data);
  await writeBase64File(sandboxPath, base64Content);

  console.log('[FilePersistence] Saved reassembled file to sandbox:', sandboxPath, {
    mimeType: mimeType ?? 'unknown',
    sizeBytes: data.length,
  });

  let exportPath: string | null = null;

  if (isDownloadExportEnabled()) {
    try {
      if (Platform.OS === 'android' && RNFS.DownloadDirectoryPath) {
        const exportDir = RNFS.DownloadDirectoryPath.replace(/\/$/, '');
        exportPath = `${exportDir}/${sandboxFileName}`;
        await RNFS.copyFile(sandboxPath, exportPath);
        console.log('[FilePersistence] Exported file to shared Downloads directory:', exportPath);
      } else if (Platform.OS === 'ios') {
        const sharedDir = `${sandboxDir}/${SHARED_EXPORTS_FOLDER_NAME}`;
        await ensureDirectory(sharedDir);
        exportPath = `${sharedDir}/${sandboxFileName}`;
        await RNFS.copyFile(sandboxPath, exportPath);
        console.log('[FilePersistence] Exported file copy for Finder access:', exportPath);
      }
    } catch (exportError) {
      console.warn('[FilePersistence] Failed to export file to shared location:', exportError);
      exportPath = null;
    }
  }

  return {
    sandboxPath,
    exportPath,
  };
};