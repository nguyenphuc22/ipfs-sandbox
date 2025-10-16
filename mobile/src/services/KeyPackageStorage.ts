import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredKeyPackage {
  masterKey: string;
  chunkKeys: Record<number, string>;
  fingerprint?: string;
  storedAt: string;
}

const STORAGE_KEY = 'ipfs_key_packages_v1';

async function readAllPackages(): Promise<Record<string, StoredKeyPackage>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return {};
    }

    return parsed;
  } catch (error) {
    console.warn('[KeyPackageStorage] Failed to parse stored key packages, resetting', error);
    await AsyncStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

async function persistPackages(packages: Record<string, StoredKeyPackage>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
}

export async function saveKeyPackage(
  fileId: string,
  keyPackage: Omit<StoredKeyPackage, 'storedAt'> & { storedAt?: string },
): Promise<void> {
  if (!fileId) {
    throw new Error('fileId is required to store key package');
  }

  if (!keyPackage.masterKey || !keyPackage.chunkKeys) {
    throw new Error('Invalid key package: missing masterKey or chunkKeys');
  }

  const allPackages = await readAllPackages();
  const stored: StoredKeyPackage = {
    masterKey: keyPackage.masterKey,
    chunkKeys: keyPackage.chunkKeys,
    fingerprint: keyPackage.fingerprint,
    storedAt: keyPackage.storedAt ?? new Date().toISOString(),
  };
  allPackages[fileId] = stored;
  await persistPackages(allPackages);
}

export async function getKeyPackage(fileId: string): Promise<StoredKeyPackage | null> {
  if (!fileId) {
    return null;
  }

  const packages = await readAllPackages();
  return packages[fileId] ?? null;
}

export async function removeKeyPackage(fileId: string): Promise<void> {
  const packages = await readAllPackages();
  if (packages[fileId]) {
    delete packages[fileId];
    await persistPackages(packages);
  }
}

export async function clearAllKeyPackages(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
