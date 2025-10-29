const crypto = require('crypto');
const { verifyValidationToken, ensureNonceUnique } = require('../ValidationTokenVerifier');
const { getSchnorr } = require('../../utils/schnorr');

const TEST_PRIVATE_KEY = Buffer.from('1'.repeat(64), 'hex');
let schnorr;
let TEST_PUBLIC_KEY;

function createToken({
    metadataHash = 'deadbeef',
    ownershipPublicKey = '024c3cb8bf5e1bf3a808aa7cf7c56ab10715d62adb0fa74b20dbb6c18909b8badd',
    issuedAt = Date.now(),
    expiresAt = Date.now() + 600_000,
    tokenId = crypto.randomUUID(),
    requestNonce = 'nonce-123',
} = {}) {
    const userHash = crypto.createHash('sha256').update(ownershipPublicKey).digest('hex');
    const message = [tokenId, metadataHash, userHash, issuedAt, expiresAt].join(':');
    const msgDigest = crypto.createHash('sha256').update(message).digest();
    const signature = Buffer.from(schnorr.sign(msgDigest, TEST_PRIVATE_KEY)).toString('hex');

    return {
        tokenId,
        fileMetadataHash: metadataHash,
        userPublicKeyHash: userHash,
        issuedAt,
        expiresAt,
        signature,
        adjudicatorPublicKey: TEST_PUBLIC_KEY,
        requestNonce,
    };
}

describe('ValidationTokenVerifier', () => {
    beforeAll(async () => {
        schnorr = await getSchnorr();
        TEST_PUBLIC_KEY = Buffer.from(schnorr.getPublicKey(TEST_PRIVATE_KEY)).toString('hex');
    });

    const ownershipPublicKey = '024c3cb8bf5e1bf3a808aa7cf7c56ab10715d62adb0fa74b20dbb6c18909b8badd';
    const metadataHash = 'deadbeef';

    it('accepts a valid token', async () => {
        const token = createToken({ metadataHash, ownershipPublicKey, requestNonce: 'nonce-ok' });

        await expect(verifyValidationToken({
            token,
            metadataHash,
            ownershipPublicKey,
            nonce: 'nonce-ok',
            adjudicatorPublicKey: TEST_PUBLIC_KEY,
        })).resolves.toBeUndefined();
    });

    it('rejects expired tokens', async () => {
        const token = createToken({
            metadataHash,
            ownershipPublicKey,
            expiresAt: Date.now() - 1000,
        });

        await expect(verifyValidationToken({
            token,
            metadataHash,
            ownershipPublicKey,
            nonce: token.requestNonce,
            adjudicatorPublicKey: TEST_PUBLIC_KEY,
        })).rejects.toThrow('ValidationToken expired');
    });

    it('rejects nonce mismatch', async () => {
        const token = createToken({ metadataHash, ownershipPublicKey, requestNonce: 'nonce-a' });

        await expect(verifyValidationToken({
            token,
            metadataHash,
            ownershipPublicKey,
            nonce: 'nonce-b',
            adjudicatorPublicKey: TEST_PUBLIC_KEY,
        })).rejects.toThrow('ValidationToken nonce mismatch');
    });

    it('rejects signature tampering', async () => {
        const token = {
            ...createToken({ metadataHash, ownershipPublicKey }),
            signature: '00'.repeat(64),
        };

        await expect(verifyValidationToken({
            token,
            metadataHash,
            ownershipPublicKey,
            nonce: token.requestNonce,
            adjudicatorPublicKey: TEST_PUBLIC_KEY,
        })).rejects.toThrow('Invalid ValidationToken signature');
    });

    it('enforces nonce uniqueness via ensureNonceUnique', async () => {
        const prismaMock = {
            validationNonce: {
                findUnique: jest.fn().mockResolvedValue(null),
                create: jest.fn().mockResolvedValue({ id: '1' }),
            },
        };

        await expect(ensureNonceUnique({ prisma: prismaMock, nonce: 'nonce-1' })).resolves.toBeUndefined();
        await expect(ensureNonceUnique({
            prisma: {
                validationNonce: {
                    findUnique: jest.fn().mockResolvedValue({ nonce: 'nonce-1' }),
                    create: jest.fn(),
                },
            },
            nonce: 'nonce-1',
        })).rejects.toThrow('Nonce already used');
    });
});
