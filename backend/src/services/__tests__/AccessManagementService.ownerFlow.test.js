const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { AccessManagementService } = require('../AccessManagementService');
const { RingSignatureService } = require('../RingSignatureService');

jest.mock('../../utils/schnorr', () => ({
  getSchnorr: jest.fn().mockResolvedValue({
    verify: jest.fn().mockReturnValue(true),
  }),
}));

const OWNER_PUBLIC_KEY = `02${'aa'.repeat(32)}`;
const RING_MEMBERS = [
  OWNER_PUBLIC_KEY,
  `03${'bb'.repeat(32)}`,
  `02${'cc'.repeat(32)}`,
];
const OWNER_KEY_IMAGE = `02${'dd'.repeat(32)}`;
const TARGET_PUBLIC_KEY = `03${'ee'.repeat(32)}`;

function randomHex(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function buildSignature(message) {
  return JSON.stringify({
    scheme: 'lsag-secp256k1',
    ringMembers: RING_MEMBERS,
    keyImage: OWNER_KEY_IMAGE,
    c0: randomHex(32),
    s: RING_MEMBERS.map(() => randomHex(32)),
    messageDigest: crypto.createHash('sha256').update(message).digest('hex'),
    messageEncoding: 'hex',
  });
}

describe('AccessManagementService - Owner Flow Key Image Reuse', () => {
  let prisma;
  let ringService;
  let accessService;
  let verifyLsagSpy;
  let getAllPublicKeysSpy;
  let currentFile;

  const ownershipProof = {
    R: 'a'.repeat(64),
    s: 'b'.repeat(64),
    message: 'owner-proof-message',
    publicKey: OWNER_PUBLIC_KEY,
  };

  beforeAll(() => {
    prisma = new PrismaClient();
    ringService = new RingSignatureService(prisma);
    accessService = new AccessManagementService({ prismaClient: prisma, ringService });
    verifyLsagSpy = jest
      .spyOn(ringService, 'verifyLsagSignature')
      .mockResolvedValue(true);
    getAllPublicKeysSpy = jest
      .spyOn(ringService, 'getAllPublicKeys')
      .mockImplementation(async () => RING_MEMBERS);
  });

  afterAll(async () => {
    if (verifyLsagSpy) {
      verifyLsagSpy.mockRestore();
    }
    if (getAllPublicKeysSpy) {
      getAllPublicKeysSpy.mockRestore();
    }

    await prisma.anonymousAuditLog.deleteMany({
      where: { fileId: currentFile?.id || undefined },
    }).catch(() => {});
    await prisma.anonymousFileAccess.deleteMany({
      where: { fileId: currentFile?.id || undefined },
    }).catch(() => {});
    if (currentFile) {
      await prisma.file.deleteMany({ where: { id: currentFile.id } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.anonymousAuditLog.deleteMany({ where: { eventType: 'key_image_verification' } });
    await prisma.anonymousFileAccess.deleteMany({ where: {} });
    await prisma.file.deleteMany({ where: { ownershipPublicKey: OWNER_PUBLIC_KEY } });

    currentFile = await prisma.file.create({
      data: {
        fileName: 'test-document.pdf',
        totalSize: 2048,
        mimeType: 'application/pdf',
        chunkCount: 1,
        metadataHash: randomHex(32),
        encryptedChunkKeys: randomHex(16),
        ownershipPublicKey: OWNER_PUBLIC_KEY,
        status: 'active',
      },
    });
  });

  afterEach(async () => {
    await prisma.anonymousFileAccess.deleteMany({ where: {} });
    await prisma.anonymousAuditLog.deleteMany({ where: {} });
  });

  test('allows sequential owner actions with shared key image', async () => {
    const firstTimestamp = Date.now();

    const listNonce1 = `nonce-${firstTimestamp}-list1`;
    const listMessage1 = `list-grants:${currentFile.id}:${firstTimestamp}:${listNonce1}`;
    const listSignature1 = buildSignature(listMessage1);

    const firstList = await accessService.listGrants({
      fileId: currentFile.id,
      timestamp: firstTimestamp,
      nonce: listNonce1,
      ringSignature: listSignature1,
      ownershipProof,
    });

    expect(Array.isArray(firstList)).toBe(true);
    expect(firstList.length).toBe(0);

    const grantTimestamp = Date.now();
    const grantNonce = `nonce-${grantTimestamp}-grant`;
    const recipientHash = ringService.hashPublicKey(TARGET_PUBLIC_KEY);
    const grantMessage = `grant:${currentFile.id}:${recipientHash}:${grantTimestamp}:${grantNonce}`;
    const grantSignature = buildSignature(grantMessage);

    const grantResult = await accessService.grantAccess({
      fileId: currentFile.id,
      targetPublicKey: TARGET_PUBLIC_KEY,
      timestamp: grantTimestamp,
      nonce: grantNonce,
      ringSignature: grantSignature,
      ownershipProof,
    });

    expect(grantResult.operation).toBe('created');
    expect(grantResult.grant.fileId).toBe(currentFile.id);

    const listTimestamp2 = Date.now();
    const listNonce2 = `nonce-${listTimestamp2}-list2`;
    const listMessage2 = `list-grants:${currentFile.id}:${listTimestamp2}:${listNonce2}`;
    const listSignature2 = buildSignature(listMessage2);

    const secondList = await accessService.listGrants({
      fileId: currentFile.id,
      timestamp: listTimestamp2,
      nonce: listNonce2,
      ringSignature: listSignature2,
      ownershipProof,
    });

    expect(secondList.length).toBe(1);
    expect(secondList[0].status).toBe('active');

    const revokeTimestamp = Date.now();
    const revokeNonce = `nonce-${revokeTimestamp}-revoke`;
    const revokeMessage = `revoke:${currentFile.id}:${grantResult.grant.id}:${revokeTimestamp}:${revokeNonce}`;
    const revokeSignature = buildSignature(revokeMessage);

    const revokeResult = await accessService.revokeAccess({
      fileId: currentFile.id,
      grantId: grantResult.grant.id,
      timestamp: revokeTimestamp,
      nonce: revokeNonce,
      ringSignature: revokeSignature,
      ownershipProof,
    });

    expect(revokeResult.operation).toBe('revoked');
    expect(revokeResult.grant.status).toBe('revoked');

    const finalTimestamp = Date.now();
    const listNonce3 = `nonce-${finalTimestamp}-list3`;
    const listMessage3 = `list-grants:${currentFile.id}:${finalTimestamp}:${listNonce3}`;
    const listSignature3 = buildSignature(listMessage3);

    const finalList = await accessService.listGrants({
      fileId: currentFile.id,
      timestamp: finalTimestamp,
      nonce: listNonce3,
      ringSignature: listSignature3,
      ownershipProof,
    });

    expect(finalList.length).toBe(1);
    expect(finalList[0].status).toBe('revoked');

    const keyImageLogs = await prisma.anonymousAuditLog.findMany({
      where: {
        eventType: 'key_image_verification',
        publicKeyHash: ringService.hashPublicKey(OWNER_PUBLIC_KEY),
        fileId: currentFile.id,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    expect(keyImageLogs.length).toBeGreaterThanOrEqual(3);

    const reuseLogs = keyImageLogs
      .map((entry) => ({ entry, metadata: JSON.parse(entry.metadata || '{}') }))
      .filter(({ metadata }) => metadata.reused === true);

    expect(reuseLogs.length).toBeGreaterThanOrEqual(2);
    reuseLogs.forEach(({ metadata, entry }) => {
      expect(entry.status).toBe('allowed');
      expect(metadata.allowedByPolicy).toBe(true);
      expect(metadata.usageContext).toBe('owner-management');
    });
  });
});
