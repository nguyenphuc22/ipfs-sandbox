const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../../data');
const STORAGE_PATH = path.join(DATA_DIR, 'aot-records.json');

const SAMPLE_USERS = [
    {
        userId: 'sample-user-1',
        identifier: 'alice',
        displayName: 'Alice (Demo)',
        publicKey: '02d5391e1c3926bc48a31235614d614f71f8b00da84041f92aa35ca8a40008ac3d',
        escrowedIdentity: null,
        createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
        userId: 'sample-user-2',
        identifier: 'bob',
        displayName: 'Bob (Demo)',
        publicKey: '02917370ea1f516c57b0a1430664d966554c3221b6dab7a1299ad21c80c88a85c4',
        escrowedIdentity: null,
        createdAt: '2024-01-02T00:00:00.000Z',
    },
    {
        userId: 'sample-user-3',
        identifier: 'carol',
        displayName: 'Carol (Demo)',
        publicKey: '02e43fdfcbbf9fb62eddb746122d5e70fa4e5ac47d44b128528ab43085d74f950f',
        escrowedIdentity: null,
        createdAt: '2024-01-03T00:00:00.000Z',
    },
    {
        userId: 'sample-user-4',
        identifier: 'dave',
        displayName: 'Dave (Demo)',
        publicKey: '024fe936e790f54644f8bb365490409bc51561c018758f200ad3df5187913a8229',
        escrowedIdentity: null,
        createdAt: '2024-01-04T00:00:00.000Z',
    },
    {
        userId: 'sample-user-5',
        identifier: 'erin',
        displayName: 'Erin (Demo)',
        publicKey: '03c80105d9e2fc11b2acd07dd5459a684c1d9af41d66afa1fba29fef78504e9996',
        escrowedIdentity: null,
        createdAt: '2024-01-05T00:00:00.000Z',
    },
];

const DEFAULT_STATE = {
    users: [],
    files: [],
    revocations: [],
    config: {
        adjudicatorPublicKey: process.env.ADJUDICATOR_PUBLIC_KEY || null,
        ringMemberPublicKeys: [],
    },
};

function ensureStorage() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(STORAGE_PATH)) {
        fs.writeFileSync(STORAGE_PATH, JSON.stringify(DEFAULT_STATE, null, 2), 'utf-8');
        return;
    }

    // Normalize existing storage file to include new fields when upgrading
    try {
        const existing = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
        const normalized = normalizeData(existing);
        if (JSON.stringify(existing) !== JSON.stringify(normalized)) {
            fs.writeFileSync(STORAGE_PATH, JSON.stringify(normalized, null, 2), 'utf-8');
        }
    } catch (error) {
        console.error('[AOTStorage] Failed to parse storage file. Recreating with defaults.', error);
        fs.writeFileSync(STORAGE_PATH, JSON.stringify(DEFAULT_STATE, null, 2), 'utf-8');
    }
}

function normalizeData(data = {}) {
    const normalized = {
        users: Array.isArray(data.users) ? data.users : [],
        files: Array.isArray(data.files) ? data.files : [],
        revocations: Array.isArray(data.revocations) ? data.revocations : [],
        config: {
            adjudicatorPublicKey:
                data?.config?.adjudicatorPublicKey ?? process.env.ADJUDICATOR_PUBLIC_KEY ?? null,
            ringMemberPublicKeys: Array.isArray(data?.config?.ringMemberPublicKeys)
                ? data.config.ringMemberPublicKeys
                : [],
        },
    };

    const existingPublicKeys = new Set(
        normalized.users
            .map((user) => (typeof user.publicKey === 'string' ? user.publicKey.trim().toLowerCase() : null))
            .filter(Boolean),
    );

    SAMPLE_USERS.forEach((user) => {
        const key = user.publicKey.trim().toLowerCase();
        if (!existingPublicKeys.has(key)) {
            normalized.users.push({
                ...user,
                userId: user.userId || crypto.randomUUID(),
                createdAt: user.createdAt || new Date().toISOString(),
            });
            existingPublicKeys.add(key);
        }
    });

    // Ensure ring member list stays in sync with registered users if empty
    if (normalized.config.ringMemberPublicKeys.length === 0 && normalized.users.length > 0) {
        normalized.config.ringMemberPublicKeys = normalized.users
            .map((user) => user.publicKey)
            .filter(Boolean);
    }

    return normalized;
}

function readStorage() {
    ensureStorage();
    const raw = fs.readFileSync(STORAGE_PATH, 'utf-8');
    return normalizeData(JSON.parse(raw));
}

function writeStorage(data) {
    ensureStorage();
    const normalized = normalizeData(data);
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(normalized, null, 2), 'utf-8');
}

function upsertRingMembers(data) {
    const unique = new Set([
        ...data.config.ringMemberPublicKeys,
        ...data.users.map((user) => user.publicKey).filter(Boolean),
    ]);
    data.config.ringMemberPublicKeys = Array.from(unique);
}

function registerUser({ identifier, displayName, publicKey, escrowedIdentity = null }) {
    if (!identifier || !publicKey) {
        throw new Error('identifier and publicKey are required');
    }

    const data = readStorage();

    const exists = data.users.find(
        (user) => user.identifier === identifier || user.publicKey === publicKey,
    );
    if (exists) {
        throw new Error('User already registered with provided identifier or public key');
    }

    const record = {
        userId: crypto.randomUUID(),
        identifier,
        displayName: displayName || identifier,
        publicKey,
        escrowedIdentity,
        createdAt: new Date().toISOString(),
    };

    data.users.push(record);
    upsertRingMembers(data);
    writeStorage(data);

    return record;
}

function listUsers() {
    const data = readStorage();
    return data.users;
}

function getUserByIdentifier(identifier) {
    if (!identifier) {
        return null;
    }
    const data = readStorage();
    return data.users.find((user) => user.identifier === identifier) || null;
}

function getUserByPublicKey(publicKey) {
    if (!publicKey) {
        return null;
    }
    const normalizedKey = publicKey.trim();
    const data = readStorage();
    return data.users.find((user) => user.publicKey === normalizedKey) || null;
}

function setAdjudicatorPublicKey(publicKey) {
    const data = readStorage();
    data.config.adjudicatorPublicKey = publicKey;
    writeStorage(data);
    return publicKey;
}

function getAdjudicatorPublicKey() {
    const data = readStorage();
    return data.config.adjudicatorPublicKey || null;
}

function getRingContext() {
    const data = readStorage();
    upsertRingMembers(data);
    writeStorage(data);
    return {
        adjudicatorPublicKey: data.config.adjudicatorPublicKey,
        ringMemberPublicKeys: data.config.ringMemberPublicKeys,
        users: data.users,
    };
}

function addFileRecord(record) {
    const data = readStorage();
    data.files.push(record);
    writeStorage(data);
    return record;
}

function updateFileRecord(fileId, updates = {}) {
    const data = readStorage();
    const index = data.files.findIndex((item) => item.fileId === fileId);
    if (index === -1) {
        return null;
    }

    data.files[index] = {
        ...data.files[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    writeStorage(data);
    return data.files[index];
}

function getFileRecord(fileId) {
    const data = readStorage();
    return data.files.find((item) => item.fileId === fileId) || null;
}

function listFileRecords() {
    const data = readStorage();
    return data.files;
}

function addRevocationRecord(record) {
    const data = readStorage();
    data.revocations.push(record);
    writeStorage(data);
    return record;
}

function listRevocationRecords() {
    const data = readStorage();
    return data.revocations;
}

module.exports = {
    addFileRecord,
    addRevocationRecord,
    getFileRecord,
    listFileRecords,
    listRevocationRecords,
    updateFileRecord,
    registerUser,
    listUsers,
    getUserByIdentifier,
    getUserByPublicKey,
    getRingContext,
    getAdjudicatorPublicKey,
    setAdjudicatorPublicKey,
};
