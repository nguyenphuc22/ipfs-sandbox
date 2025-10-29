const crypto = require('crypto');
const { getSchnorr } = require('../utils/schnorr');

async function verifyValidationToken({
    token,
    metadataHash,
    ownershipPublicKey,
    nonce,
    adjudicatorPublicKey,
}) {
    if (!token || typeof token !== 'object') {
        throw new Error('ValidationToken is required');
    }

    const requiredFields = [
        'tokenId',
        'fileMetadataHash',
        'userPublicKeyHash',
        'issuedAt',
        'expiresAt',
        'signature',
        'adjudicatorPublicKey',
        'requestNonce',
    ];

    for (const field of requiredFields) {
        if (!token[field]) {
            throw new Error(`ValidationToken missing field: ${field}`);
        }
    }

    if (adjudicatorPublicKey && token.adjudicatorPublicKey !== adjudicatorPublicKey) {
        throw new Error('Adjudicator public key mismatch');
    }

    const now = Date.now();
    if (now > Number(token.expiresAt)) {
        throw new Error('ValidationToken expired');
    }

    const ownerHash = crypto.createHash('sha256').update(ownershipPublicKey).digest('hex');
    if (token.userPublicKeyHash !== ownerHash) {
        throw new Error('ValidationToken user hash mismatch');
    }

    if (token.fileMetadataHash !== metadataHash) {
        throw new Error('ValidationToken metadata hash mismatch');
    }

    if (token.requestNonce !== nonce) {
        throw new Error('ValidationToken nonce mismatch');
    }

    const schnorr = await getSchnorr();
    const message = [
        token.tokenId,
        token.fileMetadataHash,
        token.userPublicKeyHash,
        token.issuedAt,
        token.expiresAt,
    ].join(':');

    const messageDigest = crypto.createHash('sha256').update(message).digest();
    const signatureBytes = Buffer.from(token.signature, 'hex');
    const publicKeyBytes = Buffer.from(token.adjudicatorPublicKey, 'hex');

    const verified = schnorr.verify(signatureBytes, messageDigest, publicKeyBytes);
    if (!verified) {
        throw new Error('Invalid ValidationToken signature');
    }
}

async function ensureNonceUnique({ prisma, nonce }) {
    if (!nonce) {
        throw new Error('Nonce is required');
    }
    if (!prisma || !prisma.validationNonce) {
        throw new Error('Prisma client not provided');
    }

    const existing = await prisma.validationNonce.findUnique({ where: { nonce } });
    if (existing) {
        throw new Error('Nonce already used');
    }

    await prisma.validationNonce.create({
        data: {
            nonce,
        },
    });
}

module.exports = {
    verifyValidationToken,
    ensureNonceUnique,
};
