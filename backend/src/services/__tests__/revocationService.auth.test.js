jest.mock('../../utils/aotStorage', () => ({
  getRingContext: jest.fn(() => ({ ringMemberPublicKeys: [] })),
}));

const crypto = require('crypto');
const { PrismaClient } = require('../../config/prismaClient');
const { encryptChunkKeys } = require('../../utils/chunkingUtils');
const { computeSha256Hex } = require('../../utils/ownershipProof');
const revocationServiceModule = require('../revocationService');

const {
  prepareClientReencryption,
  finalizeClientReencryption,
  revokeAccessByPublicKeyHash,
} = revocationServiceModule;

let schnorr;

beforeAll(async () => {
  ({ schnorr } = await import('@noble/curves/secp256k1.js'));
});

function generateKeyPair() {
  const privateKey = crypto.randomBytes(32);
  const publicKeyHex = Buffer.from(schnorr.getPublicKey(privateKey)).toString('hex');
  return { privateKey, publicKeyHex };
}

function signMessage(privateKey, message) {
  const messageHash = computeSha256Hex(message);
  const signature = schnorr.sign(Buffer.from(messageHash, 'hex'), privateKey);
  const signatureHex = Buffer.from(signature).toString('hex');
  return {
    messageHash,
    R: signatureHex.slice(0, 64),
    s: signatureHex.slice(64),
  };
}

describe('client-side revocation authentication guards', () => {
  const prisma = new PrismaClient();
  const createdIds = [];
  let selectChunksSpy;

  beforeEach(() => {
    selectChunksSpy = jest
      .spyOn(revocationServiceModule, 'selectChunksForReencryption')
      .mockReturnValue([0]);
  });

  afterEach(async () => {
    if (selectChunksSpy) {
      selectChunksSpy.mockRestore();
    }
    await prisma.anonymousRevocation.deleteMany({ where: { fileId: { in: createdIds } } });
    await prisma.fileChunk.deleteMany({ where: { fileId: { in: createdIds } } });
    await prisma.anonymousFileAccess.deleteMany({ where: { fileId: { in: createdIds } } });
    await prisma.file.deleteMany({ where: { id: { in: createdIds } } });
    createdIds.length = 0;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function createFileFixture({ publicKeyHex, chunkCount = 2 }) {
    const masterKey = crypto.randomBytes(32).toString('hex');
    const chunkKeys = {};
    const chunkRecords = [];

    for (let i = 0; i < chunkCount; i += 1) {
      const chunkKeyHex = crypto.randomBytes(32).toString('hex');
      chunkKeys[i] = chunkKeyHex;
      chunkRecords.push({
        id: crypto.randomUUID(),
        chunkIndex: i,
        chunkHash: crypto.randomBytes(32).toString('hex'),
        ipfsCid: `cid-${i}-${crypto.randomBytes(8).toString('hex')}`,
        size: 256,
      });
    }

    const encryptedChunkKeys = encryptChunkKeys(chunkKeys, Buffer.from(masterKey, 'hex'));

    const file = await prisma.file.create({
      data: {
        fileName: 'test.bin',
        totalSize: 1024,
        mimeType: 'application/octet-stream',
        chunkCount,
        metadataHash: crypto.randomBytes(32).toString('hex'),
        encryptedChunkKeys: JSON.stringify(encryptedChunkKeys),
        ownershipPublicKey: publicKeyHex,
        status: 'active',
      },
    });
    createdIds.push(file.id);

    await prisma.fileChunk.createMany({
      data: chunkRecords.map((record) => ({
        ...record,
        fileId: file.id,
      })),
    });

    return {
      file,
      masterKey,
      chunkKeys,
      chunkRecords,
    };
  }

  test('rejects replayed Schnorr ownership proof during manifest preparation', async () => {
    const { privateKey, publicKeyHex } = generateKeyPair();
    const { file, masterKey, chunkKeys } = await createFileFixture({
      publicKeyHex,
      chunkCount: 1,
    });

    const targetHash = crypto.createHash('sha256').update('recipient').digest('hex');
    const timestamp = Date.now();
    const nonce = crypto.randomUUID();
    const message = `revoke-reencrypt:${file.id}:${targetHash}:${timestamp}:${nonce}`;
    const { messageHash, R, s } = signMessage(privateKey, message);

    await prisma.anonymousRevocation.create({
      data: {
        fileId: file.id,
        revokedPublicKeyHash: targetHash,
        proofR: R,
        proofS: s,
        proofMessage: messageHash,
        proofTimestamp: new Date(),
        chunksReencrypted: JSON.stringify([]),
        revocationStrategy: JSON.stringify({ type: 'client-reencryption', status: 'completed' }),
      },
    });

    const keyPackage = {
      masterKey,
      chunkKeys,
    };

    await expect(prepareClientReencryption({
      fileId: file.id,
      revokedPublicKeyHash: targetHash,
      message,
      ownershipProof: {
        R,
        s,
        message: messageHash,
        publicKey: publicKeyHex,
      },
      securityLevel: 'standard',
      keyPackage,
      prismaClient: prisma,
    })).rejects.toThrow('Schnorr proof message has already been used');
  });

  test('requires rotated chunk keys when finalizing manifest', async () => {
    const { privateKey, publicKeyHex } = generateKeyPair();
    const { file, masterKey, chunkKeys, chunkRecords } = await createFileFixture({
      publicKeyHex,
      chunkCount: 2,
    });

    const targetHash = crypto.createHash('sha256').update('recipient').digest('hex');
    const timestamp = Date.now();
    const nonce = crypto.randomUUID();
    const message = `revoke-reencrypt:${file.id}:${targetHash}:${timestamp}:${nonce}`;
    const { messageHash, R, s } = signMessage(privateKey, message);

    const prepareResult = await prepareClientReencryption({
      fileId: file.id,
      revokedPublicKeyHash: targetHash,
      message,
      ownershipProof: {
        R,
        s,
        message: messageHash,
        publicKey: publicKeyHex,
      },
      securityLevel: 'standard',
      keyPackage: {
        masterKey,
        chunkKeys,
      },
      prismaClient: prisma,
    });

    expect(prepareResult.success).toBe(true);

    // Attempt to finalize without rotating chunk key 0 (should fail)
    await expect(finalizeClientReencryption({
      revocationId: prepareResult.revocationId,
      fileId: file.id,
      message,
      ownershipProof: {
        R,
        s,
        message: messageHash,
        publicKey: publicKeyHex,
      },
      keyPackage: {
        masterKey: crypto.randomBytes(32).toString('hex'),
        chunkKeys,
      },
      reencryptedChunks: [
        {
          index: 0,
          oldCid: chunkRecords[0].ipfsCid,
          newCid: `cid-0-new-${prepareResult.revocationId}`,
          hash: crypto.randomBytes(32).toString('hex'),
        },
      ],
      prismaClient: prisma,
    })).rejects.toThrow('Chunk key for index 0 was not rotated');
  });

  test('requires admin override for quick revoke', async () => {
    const ownerPublicKey = crypto.randomBytes(33).toString('hex');
    const { file } = await createFileFixture({
      publicKeyHex: ownerPublicKey,
      chunkCount: 1,
    });

    const targetHash = crypto.createHash('sha256').update('quick-user').digest('hex');

    await prisma.anonymousFileAccess.create({
      data: {
        accessorPublicKeyHash: targetHash,
        fileId: file.id,
        status: 'active',
      },
    });

    await expect(
      revokeAccessByPublicKeyHash(file.id, targetHash, 'quick-test', prisma)
    ).rejects.toThrow('Quick revoke is disabled');
  });
});
