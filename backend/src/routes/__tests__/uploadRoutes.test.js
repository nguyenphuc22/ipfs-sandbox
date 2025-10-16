const VALID_OWNERSHIP_PUBLIC_KEY = '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798';

function findRouteHandler(router, method, path) {
    const layer = router.stack.find((routeLayer) => {
        if (!routeLayer.route) {
            return false;
        }
        const matchesPath = routeLayer.route.path === path;
        const handlesMethod = routeLayer.route.methods?.[method.toLowerCase()];
        return matchesPath && handlesMethod;
    });

    if (!layer) {
        return null;
    }

    const stack = layer.route.stack || [];
    return stack.length > 0 ? stack[stack.length - 1].handle : null;
}

function createMockResponse() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        },
    };
}

function loadRouterWithMocks({
    addFileRecordImpl,
    ringContext = {
        adjudicatorPublicKey: null,
        ringMemberPublicKeys: [],
    },
    axiosResponse = {
        data: { Hash: 'QmMockCid1234567890' },
    },
} = {}) {
    jest.resetModules();

    const addFileRecord = addFileRecordImpl || jest.fn((record) => record);
    const getRingContext = jest.fn(() => ringContext);

    jest.doMock('../../utils/aotStorage', () => ({
        getFileRecord: jest.fn(),
        addRevocationRecord: jest.fn(),
        listFileRecords: jest.fn(),
        listFileRecordsByOwnershipKey: jest.fn(),
        updateFileRecord: jest.fn(),
        getRingContext,
        addFileRecord,
    }));

    const axiosPost = jest.fn().mockResolvedValue(axiosResponse);
    jest.doMock('axios', () => ({
        post: axiosPost,
    }));

    const router = require('../files');

    return {
        router,
        mocks: {
            addFileRecord,
            axiosPost,
            getRingContext,
        },
    };
}

afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});

describe('Upload route wiring', () => {
    it('exposes POST /aot-upload and returns 400 when file is missing', async () => {
        const { router } = loadRouterWithMocks();
        const handler = findRouteHandler(router, 'post', '/aot-upload');
        expect(handler).toBeDefined();

        const req = {
            file: undefined,
            body: {
                metadataHash: 'deadbeef',
                ownershipPublicKey: VALID_OWNERSHIP_PUBLIC_KEY,
            },
        };
        const res = createMockResponse();

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('exposes POST /chunked-upload and returns 400 when file is missing', async () => {
        const { router } = loadRouterWithMocks();
        const handler = findRouteHandler(router, 'post', '/chunked-upload');
        expect(handler).toBeDefined();

        const req = {
            file: undefined,
            body: {
                metadataHash: 'feedface',
                ownershipPublicKey: VALID_OWNERSHIP_PUBLIC_KEY,
            },
        };
        const res = createMockResponse();

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

describe('Anonymous upload success flow', () => {
    it('persists file metadata and returns 201 when payload is valid', async () => {
        const addFileRecordImpl = jest.fn((record) => ({
            ...record,
            fileId: 'file-123',
        }));

        const { schnorr } = await import('@noble/curves/secp256k1.js');
        const privateKeyHex = '1'.repeat(64);
        const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');
        const messageHex = 'f'.repeat(64);
        const messageBytes = Buffer.from(messageHex, 'hex');
        const signatureBytes = await schnorr.sign(messageBytes, privateKeyBytes);
        const signatureHex = Buffer.from(signatureBytes).toString('hex');
        const ownershipProofR = signatureHex.slice(0, 64);
        const ownershipProofS = signatureHex.slice(64);
        const publicKeyX = Buffer.from(schnorr.getPublicKey(privateKeyBytes)).toString('hex');
        const ownershipPublicKey = `02${publicKeyX}`;

        const { router, mocks } = loadRouterWithMocks({
            addFileRecordImpl,
        });

        const handler = findRouteHandler(router, 'post', '/aot-upload');
        expect(handler).toBeDefined();

        const req = {
            file: {
                buffer: Buffer.from('mock-data'),
                originalname: 'demo.txt',
                mimetype: 'text/plain',
                size: 9,
            },
            body: {
                metadataHash: 'cafebabe',
                ownershipPublicKey,
                ownershipProofR,
                ownershipProofS,
                ownershipProofMessage: messageHex,
                ownershipProofPublicKey: ownershipPublicKey,
            },
        };
        const res = createMockResponse();

        await handler(req, res);

        expect(mocks.addFileRecord).toHaveBeenCalledTimes(1);
        expect(mocks.addFileRecord.mock.calls[0][0]).toMatchObject({
            cid: 'QmMockCid1234567890',
            metadataHash: 'cafebabe',
            ownershipPublicKey,
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
            success: true,
            cid: 'QmMockCid1234567890',
            metadataHash: 'cafebabe',
        });
        expect(res.body.fileId).toBe('file-123');
        expect(Array.isArray(res.body.ringMembers)).toBe(true);
    });
});
