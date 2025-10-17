import { createHash } from 'crypto';

export function sha256(message: Uint8Array | string): Uint8Array {
  const buffer = typeof message === 'string' ? Buffer.from(message, 'utf8') : Buffer.from(message);
  const digest = createHash('sha256').update(buffer).digest();
  return new Uint8Array(digest);
}
