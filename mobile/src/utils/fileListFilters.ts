import { FileData } from '../types';
import { normalizeHex } from './aotCrypto';

interface FilterOptions {
  normalizedOwnerKey?: string | null;
  skipOwnershipFilter?: boolean;
}

/**
 * Filters files that should be visible in the file list based on ownership.
 * When skipOwnershipFilter is true (recipient view), the list is returned as-is.
 */
export const filterFilesByOwnership = (
  files: FileData[],
  { normalizedOwnerKey, skipOwnershipFilter }: FilterOptions = {},
): FileData[] => {
  if (!normalizedOwnerKey || skipOwnershipFilter) {
    return files;
  }

  return files.filter((file) => {
    if (!file.ownershipPublicKey) {
      return true;
    }

    try {
      return normalizeHex(file.ownershipPublicKey) === normalizedOwnerKey;
    } catch (error) {
      console.warn('[filterFilesByOwnership] Failed to normalize ownership key', error);
      return false;
    }
  });
};
