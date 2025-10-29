const crypto = require('crypto');

jest.mock('../../utils/schnorr', () => ({
  getSchnorr: jest.fn(async () => ({ verify: () => true })),
}));

jest.mock('../../services/ValidationTokenVerifier', () => ({
  verifyValidationToken: jest.fn(() => Promise.resolve()),
  ensureNonceUnique: jest.fn(() => Promise.resolve()),
}));

const { verifyValidationToken, ensureNonceUnique } = require('../../services/ValidationTokenVerifier');
const { init, router } = require('../anonymous-endpoints-addition');

const FILE_NAME = 'demo.txt';
const FILE_SIZE = 16;
const CHUNK_COUNT = 1;
const METADATA_HASH = crypto
  .createHash('sha256')
  .update(JSON.stringify({ fileName: FILE_NAME, fileSize: FILE_SIZE, chunkCount: CHUNK_COUNT }))
  .digest('hex');

const VALID_TOKEN = {
  tokenId: 'token-123',
  fileMetadataHash: METADATA_HASH,
  userPublicKeyHash: 'user-hash',
  issuedAt: Date.now(),
  expiresAt: Date.now() + 600_000,
  signature: 'sig',
  adjudicatorPublicKey: 'adj-key',
  requestNonce: 'nonce-123',
};

const basePayload = (overrides = {}) => ({
  fileName: FILE_NAME,
  fileSize: FILE_SIZE,
  mimeType: 'text/plain',
  chunkCount: CHUNK_COUNT,
  chunks: [{ index: 0, cid: 'cid-demo', hash: 'b'.repeat(64), size: FILE_SIZE }],
  metadataHash: METADATA_HASH,
  ownershipPublicKey: '02' + '11'.repeat(32),
  encryptedChunkKeys: { encryptedData: 'data', iv: 'iv', authTag: 'tag' },
  keyPackageFingerprint: 'fingerprint-demo',
  ringMembers: [],
  escrowedIdentity: 'escrow-demo',
  schnorr: {
    R: '00'.repeat(32),
    s: '00'.repeat(32),
    message: METADATA_HASH,
    publicKey: '11'.repeat(32),
  },
  timestamp: Date.now(),
  nonce: 'nonce-123',
  validationToken: VALID_TOKEN,
  ...overrides,
});

const runUpload = (handler, body) =>
  new Promise((resolve) => {
    const req = { body, ip: '127.0.0.1' };
    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        resolve({ statusCode: this.statusCode, body: payload });
      },
    };

    const maybePromise = handler(req, res);
    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.catch((error) => {
        resolve({ statusCode: 500, body: { error: error.message } });
      });
    }
  });

describe('anonymous upload validation route', () => {
  let handler;
  let prisma;

  beforeAll(() => {
    process.env.ADJUDICATOR_PUBLIC_KEY = VALID_TOKEN.adjudicatorPublicKey;
  });

  beforeEach(() => {
    prisma = {
      validationNonce: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'nonce-id' }),
      },
      file: {
        create: jest.fn(async ({ data }) => ({ id: 'file-123', ...data })),
      },
      fileChunk: {
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      anonymousFileAccess: {
        create: jest.fn().mockResolvedValue({}),
      },
      anonymousAuditLog: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    init(prisma);
    handler = router.stack.find(
      (layer) => layer.route && layer.route.path === '/client-chunked-upload'
    ).route.stack[0].handle;

    verifyValidationToken.mockClear();
    ensureNonceUnique.mockClear();
  });

  afterAll(() => {
    delete process.env.ADJUDICATOR_PUBLIC_KEY;
  });

  it('rejects when validationToken missing', async () => {
    const payload = basePayload();
    delete payload.validationToken;

    const { statusCode, body } = await runUpload(handler, payload);

    expect(statusCode).toBe(400);
    expect(body.error).toMatch(/validationtoken/i);
    expect(prisma.file.create).not.toHaveBeenCalled();
  });

  it('accepts valid payload and persists file', async () => {
    const { statusCode, body } = await runUpload(handler, basePayload());

    expect(statusCode).toBe(201);
    expect(body.success).toBe(true);
    expect(verifyValidationToken).toHaveBeenCalledWith(
      expect.objectContaining({ token: VALID_TOKEN })
    );
    expect(ensureNonceUnique).toHaveBeenCalledWith(
      expect.objectContaining({ nonce: 'nonce-123' })
    );
    expect(prisma.file.create).toHaveBeenCalled();
  });

  it('returns 403 when ensureNonceUnique rejects', async () => {
    ensureNonceUnique.mockImplementationOnce(() => Promise.reject(new Error('Nonce already used')));

    const payload = basePayload({ nonce: 'dup' });
    payload.validationToken = { ...VALID_TOKEN, requestNonce: 'dup' };

    const { statusCode, body } = await runUpload(handler, payload);

    expect(statusCode).toBe(403);
    expect(body.error).toMatch(/nonce already used/i);
    expect(prisma.file.create).not.toHaveBeenCalled();
  });
});
