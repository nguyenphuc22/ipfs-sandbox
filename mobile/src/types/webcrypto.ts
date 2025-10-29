export type SubtleCryptoLike = {
  encrypt: (...args: any[]) => Promise<ArrayBuffer>;
  decrypt: (...args: any[]) => Promise<ArrayBuffer>;
  importKey: (...args: any[]) => Promise<any>;
  exportKey?: (...args: any[]) => Promise<any>;
};

export type CryptoLike = {
  getRandomValues?: <T extends ArrayBufferView>(array: T) => T;
  randomUUID?: () => string;
  subtle?: SubtleCryptoLike;
  webcrypto?: {
    subtle?: SubtleCryptoLike;
  } & Record<string, unknown>;
} & Record<string, unknown>;
