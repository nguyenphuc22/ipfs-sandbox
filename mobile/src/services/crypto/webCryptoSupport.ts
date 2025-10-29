import QuickCrypto, { install as installQuickCrypto } from 'react-native-quick-crypto';
import type { CryptoLike, SubtleCryptoLike } from '../../types/webcrypto';

const getGlobalCrypto = (): CryptoLike | undefined => globalThis.crypto as unknown as CryptoLike | undefined;

let initialized = false;
let initializationError: Error | null = null;

const hasSubtleCrypto = (): boolean => {
  const cryptoInstance = getGlobalCrypto();
  return Boolean(cryptoInstance?.subtle ?? cryptoInstance?.webcrypto?.subtle);
};

const ensureRandomHelpers = (cryptoInstance: CryptoLike) => {
  if (typeof cryptoInstance.getRandomValues !== 'function' && typeof QuickCrypto.getRandomValues === 'function') {
    cryptoInstance.getRandomValues = QuickCrypto.getRandomValues as unknown as typeof cryptoInstance.getRandomValues;
  }

  if (typeof cryptoInstance.randomUUID !== 'function' && typeof QuickCrypto.randomUUID === 'function') {
    cryptoInstance.randomUUID = QuickCrypto.randomUUID;
  }
};

const applyPolyfill = () => {
  try {
    installQuickCrypto();
  } catch (error) {
    initializationError = error instanceof Error ? error : new Error(String(error));
  }

  const cryptoObject = getGlobalCrypto() ?? ({} as CryptoLike);

  if (!cryptoObject.subtle && QuickCrypto?.subtle) {
    cryptoObject.subtle = QuickCrypto.subtle as unknown as SubtleCryptoLike;
  }

  if (!cryptoObject.webcrypto && QuickCrypto.webcrypto) {
    cryptoObject.webcrypto = QuickCrypto.webcrypto as unknown as CryptoLike['webcrypto'];
  }

  ensureRandomHelpers(cryptoObject);
  (globalThis as any).crypto = cryptoObject;

  if (!hasSubtleCrypto() && QuickCrypto.webcrypto?.subtle) {
  const webcryptoInstance = QuickCrypto.webcrypto as unknown as CryptoLike;
    ensureRandomHelpers(webcryptoInstance);
    webcryptoInstance.subtle = QuickCrypto.webcrypto.subtle as unknown as SubtleCryptoLike;
  (globalThis as any).crypto = webcryptoInstance;
  }
};

export const ensureWebCryptoSupport = (): SubtleCryptoLike => {
  if (!initialized) {
    if (!hasSubtleCrypto()) {
      applyPolyfill();
    } else {
      const cryptoInstance = getGlobalCrypto();
      if (cryptoInstance) {
        ensureRandomHelpers(cryptoInstance);
      }
    }
    initialized = true;
  }

  if (!hasSubtleCrypto()) {
    const reason = initializationError
      ? `Không thể khởi tạo WebCrypto: ${initializationError.message}`
      : 'WebCrypto API (crypto.subtle) không khả dụng trên môi trường hiện tại. Vui lòng cài đặt polyfill WebCrypto (ví dụ: react-native-quick-crypto).';
    throw new Error(reason);
  }

  const cryptoInstance = getGlobalCrypto();
  if (cryptoInstance?.subtle) {
    return cryptoInstance.subtle;
  }

  if (cryptoInstance?.webcrypto?.subtle) {
    return cryptoInstance.webcrypto.subtle;
  }

  throw new Error('WebCrypto API không khả dụng sau khi áp dụng polyfill.');
};

export const ensureCryptoRandomSupport = () => {
  const cryptoInstance = getGlobalCrypto();
  if (cryptoInstance) {
    ensureRandomHelpers(cryptoInstance);
    return;
  }

  applyPolyfill();
};
