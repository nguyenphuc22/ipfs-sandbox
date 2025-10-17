import type { CryptoLike } from './webcrypto';

declare module '@noble/hashes/sha2' {
  export function sha256(data: Uint8Array | ArrayBuffer | string): Uint8Array;
}

declare global {
  // eslint-disable-next-line no-var
  var crypto: CryptoLike | undefined;

  interface FormData {
    // Align with DOM FormData signature to allow optional filename argument
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    append(name: string, value: any, fileName?: string): void;
  }

  interface BlobConstructor {
    // Allow broader blob parts to match runtime capabilities in React Native
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (blobParts?: any[], options?: { type?: string }): Blob;
  }

  // eslint-disable-next-line no-var
  var Blob: BlobConstructor;
}

export {};
