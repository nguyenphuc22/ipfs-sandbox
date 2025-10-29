const getGlobalFlag = (key: string): unknown => {
  try {
    if (typeof globalThis !== 'undefined') {
      const flags = (globalThis as any).__IPFSSandboxFlags__;
      if (flags && Object.prototype.hasOwnProperty.call(flags, key)) {
        return flags[key];
      }

      const directFlag = (globalThis as any)[key];
      if (typeof directFlag !== 'undefined') {
        return directFlag;
      }
    }
  } catch (error) {
    console.warn('[featureFlags] Unable to read global flag', key, error);
  }
  return undefined;
};

const getEnvFlag = (key: string): unknown => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      const value = process.env[key];
      if (typeof value !== 'undefined') {
        return value;
      }
    }
  } catch (error) {
    console.warn('[featureFlags] Unable to read env flag', key, error);
  }
  return undefined;
};

export const isDownloadExportEnabled = (): boolean => {
  const flagKey = 'ENABLE_DOWNLOAD_EXPORT';
  const globalValue = getGlobalFlag(flagKey);
  if (typeof globalValue === 'boolean') {
    return globalValue;
  }

  const envValue = getEnvFlag(flagKey);
  if (typeof envValue === 'string') {
    return envValue.toLowerCase() === 'true';
  }

  return false;
};