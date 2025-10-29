import QuickCrypto from 'react-native-quick-crypto';

type HashInput = Uint8Array | ArrayBuffer | string;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function sha256Bytes(data: HashInput): Uint8Array {
  const hash = QuickCrypto.createHash('sha256');
  // QuickCrypto accepts the same inputs as Node's crypto
  hash.update(data as any);
  const digest = hash.digest();
  return digest instanceof Uint8Array ? digest : new Uint8Array(digest);
}

export function sha256Hex(data: HashInput): string {
  return bytesToHex(sha256Bytes(data));
}
