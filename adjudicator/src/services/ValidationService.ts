import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { hashSha256Hex, signMessageHex } from '../utils/crypto';

const DEFAULT_TTL_MS = Number(process.env.TOKEN_TTL_MS ?? 10 * 60 * 1000);
const DEFAULT_RATE_LIMIT = Number(process.env.TOKEN_RATE_LIMIT_PER_HOUR ?? 100);

export interface ValidationRequest {
  userPublicKey: string;
  fileMetadataHash: string;
  timestamp: number;
  nonce: string;
}

export interface ValidationToken {
  tokenId: string;
  fileMetadataHash: string;
  userPublicKeyHash: string;
  issuedAt: number;
  expiresAt: number;
  signature: string;
  adjudicatorPublicKey: string;
  requestNonce: string;
}

export class ValidationService {
  private readonly adjudicatorPrivateKey: string;

  private readonly adjudicatorPublicKey: string;

  private readonly tokenTtlMs: number;

  private readonly rateLimit: number;

  constructor() {
    this.adjudicatorPrivateKey = process.env.ADJUDICATOR_PRIVATE_KEY ?? '';
    this.adjudicatorPublicKey = process.env.ADJUDICATOR_PUBLIC_KEY ?? '';
    if (!this.adjudicatorPrivateKey || !this.adjudicatorPublicKey) {
      throw new Error('Adjudicator Schnorr keypair not configured. Check ADJUDICATOR_PRIVATE_KEY and ADJUDICATOR_PUBLIC_KEY.');
    }

    this.tokenTtlMs = Number.isFinite(DEFAULT_TTL_MS) ? DEFAULT_TTL_MS : 10 * 60 * 1000;
    this.rateLimit = Number.isFinite(DEFAULT_RATE_LIMIT) ? DEFAULT_RATE_LIMIT : 100;
  }

  private async assertUserExists(publicKey: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { publicKey } });
    if (!user) {
      throw new Error('User not found');
    }
  }

  private async assertNotBanned(publicKey: string): Promise<void> {
    const banned = await prisma.bannedUser.findUnique({ where: { publicKey } });
    if (banned) {
      throw new Error('User is banned');
    }
  }

  private async assertRateLimit(publicKey: string): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const count = await prisma.validationTokenAudit.count({
      where: {
        userPublicKey: publicKey,
        issuedAt: { gte: oneHourAgo },
      },
    });

    if (count >= this.rateLimit) {
      throw new Error('Rate limit exceeded');
    }
  }

  private assertFreshTimestamp(timestamp: number): void {
    const now = Date.now();
    const drift = Math.abs(now - timestamp);
    if (drift > 5 * 60 * 1000) {
      throw new Error('Request timestamp too old');
    }
  }

  private async assertNonceUnused(nonce: string): Promise<void> {
    const existing = await prisma.validationTokenAudit.findFirst({ where: { requestNonce: nonce } });
    if (existing) {
      throw new Error('Nonce already used');
    }
  }

  async issueValidationToken(request: ValidationRequest): Promise<ValidationToken> {
    const { userPublicKey, fileMetadataHash, timestamp, nonce } = request;

    if (!userPublicKey || !fileMetadataHash || !timestamp || !nonce) {
      throw new Error('Missing required fields');
    }

    await this.assertUserExists(userPublicKey);
    await this.assertNotBanned(userPublicKey);
    await this.assertRateLimit(userPublicKey);
    this.assertFreshTimestamp(timestamp);
    await this.assertNonceUnused(nonce);

    const userPublicKeyHash = hashSha256Hex(userPublicKey);
    const issuedAt = Date.now();
    const expiresAt = issuedAt + this.tokenTtlMs;
    const tokenId = crypto.randomUUID();

    const payload = [tokenId, fileMetadataHash, userPublicKeyHash, issuedAt, expiresAt].join(':');
    const signature = signMessageHex(this.adjudicatorPrivateKey, payload);

    await prisma.validationTokenAudit.create({
      data: {
        tokenId,
        userPublicKey,
        userPublicKeyHash,
        fileMetadataHash,
        requestNonce: nonce,
        issuedAt: new Date(issuedAt),
        expiresAt: new Date(expiresAt),
        signature,
      },
    });

    return {
      tokenId,
      fileMetadataHash,
      userPublicKeyHash,
      issuedAt,
      expiresAt,
      signature,
      adjudicatorPublicKey: this.adjudicatorPublicKey,
      requestNonce: nonce,
    };
  }
}

export const validationService = new ValidationService();
