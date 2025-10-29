"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationService = exports.ValidationService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../config/prisma");
const crypto_2 = require("../utils/crypto");
const DEFAULT_TTL_MS = Number(process.env.TOKEN_TTL_MS ?? 10 * 60 * 1000);
const DEFAULT_RATE_LIMIT = Number(process.env.TOKEN_RATE_LIMIT_PER_HOUR ?? 100);
class ValidationService {
    constructor() {
        this.adjudicatorPrivateKey = process.env.ADJUDICATOR_PRIVATE_KEY ?? '';
        this.adjudicatorPublicKey = process.env.ADJUDICATOR_PUBLIC_KEY ?? '';
        if (!this.adjudicatorPrivateKey || !this.adjudicatorPublicKey) {
            throw new Error('Adjudicator Schnorr keypair not configured. Check ADJUDICATOR_PRIVATE_KEY and ADJUDICATOR_PUBLIC_KEY.');
        }
        this.tokenTtlMs = Number.isFinite(DEFAULT_TTL_MS) ? DEFAULT_TTL_MS : 10 * 60 * 1000;
        this.rateLimit = Number.isFinite(DEFAULT_RATE_LIMIT) ? DEFAULT_RATE_LIMIT : 100;
    }
    async assertUserExists(publicKey) {
        const user = await prisma_1.prisma.user.findUnique({ where: { publicKey } });
        if (!user) {
            throw new Error('User not found');
        }
    }
    async assertNotBanned(publicKey) {
        const banned = await prisma_1.prisma.bannedUser.findUnique({ where: { publicKey } });
        if (banned) {
            throw new Error('User is banned');
        }
    }
    async assertRateLimit(publicKey) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const count = await prisma_1.prisma.validationTokenAudit.count({
            where: {
                userPublicKey: publicKey,
                issuedAt: { gte: oneHourAgo },
            },
        });
        if (count >= this.rateLimit) {
            throw new Error('Rate limit exceeded');
        }
    }
    assertFreshTimestamp(timestamp) {
        const now = Date.now();
        const drift = Math.abs(now - timestamp);
        if (drift > 5 * 60 * 1000) {
            throw new Error('Request timestamp too old');
        }
    }
    async assertNonceUnused(nonce) {
        const existing = await prisma_1.prisma.validationTokenAudit.findFirst({ where: { requestNonce: nonce } });
        if (existing) {
            throw new Error('Nonce already used');
        }
    }
    async issueValidationToken(request) {
        const { userPublicKey, fileMetadataHash, timestamp, nonce } = request;
        if (!userPublicKey || !fileMetadataHash || !timestamp || !nonce) {
            throw new Error('Missing required fields');
        }
        await this.assertUserExists(userPublicKey);
        await this.assertNotBanned(userPublicKey);
        await this.assertRateLimit(userPublicKey);
        this.assertFreshTimestamp(timestamp);
        await this.assertNonceUnused(nonce);
        const userPublicKeyHash = (0, crypto_2.hashSha256Hex)(userPublicKey);
        const issuedAt = Date.now();
        const expiresAt = issuedAt + this.tokenTtlMs;
        const tokenId = crypto_1.default.randomUUID();
        const payload = [tokenId, fileMetadataHash, userPublicKeyHash, issuedAt, expiresAt].join(':');
        const signature = (0, crypto_2.signMessageHex)(this.adjudicatorPrivateKey, payload);
        await prisma_1.prisma.validationTokenAudit.create({
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
exports.ValidationService = ValidationService;
exports.validationService = new ValidationService();
