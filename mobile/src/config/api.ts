/**
 * API Configuration for IPFS Sandbox Mobile
 *
 * Automatically resolves the correct gateway endpoint for local development
 * and keeps the production configuration in one place.
 */

import { NativeModules, Platform } from 'react-native';

// =============================================================================
// 🔧 STATIC CONFIGURATION
// =============================================================================
const API_PORT = 3000;
const IPFS_PORT = 5001;
const PRODUCTION_BASE_URL = 'https://your-production-domain.com';
const PRODUCTION_IPFS_URL = 'https://your-ipfs-gateway.com';
const PRODUCTION_ADJUDICATOR_URL = 'https://your-adjudicator-service.com';
const ADJUDICATOR_PORT = 4000;

// Allow developers to override at runtime (useful for debugging sessions)
const globalOverride = (globalThis as any)?.__IPFS_API_BASE_URL__;

const isDevelopment = __DEV__;

const DEFAULT_HOSTS: Record<'android' | 'ios' | 'default', string> = {
  android: '10.0.2.2',
  ios: 'localhost',
  default: 'localhost',
};

const packagerHostRegex = /^https?:\/\/([^/:]+)(?::\d+)?\//i;

function getPackagerHost(): string | null {
  try {
    const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
    if (typeof scriptURL === 'string') {
      const match = scriptURL.match(packagerHostRegex);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (error) {
    console.warn('Unable to resolve packager host:', error);
  }
  return null;
}

function normaliseHost(host: string): string {
  if (!host) {
    return DEFAULT_HOSTS.default;
  }

  if (host === 'localhost' || host === '127.0.0.1') {
    return Platform.OS === 'android' ? DEFAULT_HOSTS.android : DEFAULT_HOSTS.ios;
  }

  return host;
}

function resolveDevelopmentBaseUrl(): string {
  if (typeof globalOverride === 'string' && globalOverride.length > 0) {
    return globalOverride;
  }

  const packagerHost = getPackagerHost();
  const resolvedHost = packagerHost
    ? normaliseHost(packagerHost)
    : (DEFAULT_HOSTS[Platform.OS as 'android' | 'ios'] || DEFAULT_HOSTS.default);

  return `http://${resolvedHost}:${API_PORT}`;
}

function resolveDevelopmentIPFSUrl(): string {
  const packagerHost = getPackagerHost();
  const resolvedHost = packagerHost
    ? normaliseHost(packagerHost)
    : (DEFAULT_HOSTS[Platform.OS as 'android' | 'ios'] || DEFAULT_HOSTS.default);

  return `http://${resolvedHost}:${IPFS_PORT}`;
}

function resolveDevelopmentAdjudicatorUrl(): string {
  const packagerHost = getPackagerHost();
  const resolvedHost = packagerHost
    ? normaliseHost(packagerHost)
    : (DEFAULT_HOSTS[Platform.OS as 'android' | 'ios'] || DEFAULT_HOSTS.default);

  return `http://${resolvedHost}:${ADJUDICATOR_PORT}`;
}

function getApiConfig() {
  if (!isDevelopment) {
    return {
      baseUrl: PRODUCTION_BASE_URL,
      ipfsGatewayUrl: PRODUCTION_IPFS_URL,
      adjudicatorUrl: PRODUCTION_ADJUDICATOR_URL,
      timeout: 30000,
    };
  }

  return {
    baseUrl: resolveDevelopmentBaseUrl(),
    ipfsGatewayUrl: resolveDevelopmentIPFSUrl(),
    adjudicatorUrl: resolveDevelopmentAdjudicatorUrl(),
    timeout: 30000,
  };
}

export const API_CONFIG = getApiConfig();

export const ALL_CONFIGS = {
  DEVELOPMENT: API_CONFIG.baseUrl,
  PRODUCTION: PRODUCTION_BASE_URL,
};

export function setApiConfig(baseUrl: string) {
  API_CONFIG.baseUrl = baseUrl;
}

if (isDevelopment) {
  console.log('API Configuration:', {
    platform: Platform.OS,
    environment: 'Development',
    selectedConfig: API_CONFIG,
  });
}
