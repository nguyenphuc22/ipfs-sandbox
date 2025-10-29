const crypto = require('crypto');

process.env.ADMIN_HMAC_SECRET = 'demo-secret';

const mockPrisma = {
  bannedUser: {
    upsert: jest.fn().mockResolvedValue({ publicKey: 'test', reason: 'demo' }),
    delete: jest.fn().mockResolvedValue({}),
  },
  anonymousAuditLog: {
    create: jest.fn().mockResolvedValue({}),
  },
  file: {
    findUnique: jest.fn(),
  },
};

jest.mock('../../config/database', () => mockPrisma);
jest.mock('../../utils/monitoring', () => ({ secureLog: jest.fn() }));

const router = require('../admin');

const runRoute = ({ path, method, body = {}, headers = {}, params = {} }) => {
  const layer = router.stack.find(
    (l) => l.route && l.route.path === path && l.route.methods[method]
  );

  if (!layer) {
    throw new Error(`Route ${method.toUpperCase()} ${path} not found`);
  }

  const handlers = layer.route.stack.map((l) => l.handle);

  const req = {
    body,
    headers,
    params,
    method,
    path,
  };

  return new Promise((resolve, reject) => {
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

    let idx = 0;
    const next = (err) => {
      if (err) {
        reject(err);
        return;
      }
      const handler = handlers[idx++];
      if (!handler) {
        resolve({ statusCode: res.statusCode, body: null });
        return;
      }
      try {
        const maybePromise = handler(req, res, next);
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.catch(reject);
        }
      } catch (error) {
        reject(error);
      }
    };
    next();
  });
};

const sign = (payload, secret = process.env.ADMIN_HMAC_SECRET) =>
  crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

describe('Admin routes', () => {
  beforeEach(() => {
    mockPrisma.bannedUser.upsert.mockClear();
    mockPrisma.bannedUser.delete.mockClear();
    mockPrisma.anonymousAuditLog.create.mockClear();
    mockPrisma.file.findUnique.mockReset();
    delete process.env.ADMIN_API_KEY;
    process.env.ADMIN_HMAC_SECRET = 'demo-secret';
  });

  describe('Auth guards', () => {
    it('accepts POST /ban with valid signature', async () => {
      const payload = { publicKey: 'pub', reason: 'demo' };
      const { statusCode, body } = await runRoute({
        path: '/ban',
        method: 'post',
        body: payload,
        headers: { 'x-admin-signature': sign(payload) },
      });

      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);
    });

    it('flags file when signature provided', async () => {
      const payload = { reason: 'investigate', severity: 'high' };
      const { statusCode, body } = await runRoute({
        path: '/files/:fileId/flag',
        method: 'post',
        body: payload,
        params: { fileId: 'file-123' },
        headers: { 'x-admin-signature': sign(payload) },
      });

      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(mockPrisma.anonymousAuditLog.create).toHaveBeenCalled();
    });
  });

  describe('Investigation flow', () => {
    let fetchSpy;

    beforeEach(() => {
      process.env.ADMIN_API_KEY = 'demo-admin-key';
      fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, report: { summary: 'demo-report' } }),
      });

      mockPrisma.file.findUnique.mockResolvedValue({
        id: 'file-1',
        escrowedIdentity: 'escrow-demo',
        validationToken: {},
      });
    });

    afterEach(() => {
      fetchSpy.mockRestore();
      delete process.env.ADMIN_API_KEY;
    });

    it('returns report when upstream succeeds', async () => {
      const payload = { fileId: 'file-1', reason: 'suspicion', legalAuthorization: 'AUTH-1' };
      const { statusCode, body } = await runRoute({
        path: '/investigate',
        method: 'post',
        body: payload,
        headers: {
          'x-admin-key': 'demo-admin-key',
          'x-admin-user': 'admin@test',
          'x-admin-signature': sign(payload),
        },
      });

      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(body.report.summary).toBe('demo-report');
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/decrypt-escrow'),
        expect.objectContaining({ method: 'POST' })
      );

      const fetchOptions = fetchSpy.mock.calls[0][1];
      const postedBody = JSON.parse(fetchOptions.body);
      expect(postedBody).toEqual(
        expect.objectContaining({
          fileId: 'file-1',
          investigationReason: 'suspicion',
          legalAuthorization: 'AUTH-1',
          escrowedIdentity: 'escrow-demo',
          adminApproval: expect.any(String),
        })
      );

      const approval = JSON.parse(postedBody.adminApproval);
      expect(approval).toMatchObject({
        version: 1,
        adminUser: 'admin@test',
        fileId: 'file-1',
        investigationReason: 'suspicion',
        legalAuthorization: 'AUTH-1',
        signedAt: expect.any(String),
        signature: expect.any(String),
      });

      const canonical = JSON.stringify({
        version: 1,
        adminUser: approval.adminUser,
        fileId: approval.fileId,
        investigationReason: approval.investigationReason,
        legalAuthorization: approval.legalAuthorization,
        signedAt: approval.signedAt,
      });

      const expectedSignature = crypto
        .createHmac('sha256', process.env.ADMIN_HMAC_SECRET)
        .update(canonical)
        .digest('hex');

      expect(approval.signature).toBe(expectedSignature);
    });

    it('rejects when legalAuthorization missing', async () => {
      const payload = { fileId: 'file-1', reason: 'suspicion' };
      const { statusCode, body } = await runRoute({
        path: '/investigate',
        method: 'post',
        body: payload,
        headers: {
          'x-admin-key': 'demo-admin-key',
          'x-admin-signature': sign(payload),
        },
      });

      expect(statusCode).toBe(400);
      expect(body.error).toMatch(/legalAuthorization/i);
    });

    it('propagates adjudicator failure', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, error: 'Upstream rejected' }),
      });

      const payload = { fileId: 'file-1', reason: 'suspicion', legalAuthorization: 'AUTH-2' };
      const { statusCode, body } = await runRoute({
        path: '/investigate',
        method: 'post',
        body: payload,
        headers: {
          'x-admin-key': 'demo-admin-key',
          'x-admin-signature': sign(payload),
        },
      });

      expect(statusCode).toBe(400);
      expect(body.error).toMatch(/upstream rejected/i);
    });
  });
});
