const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Point } = require('@noble/secp256k1');

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

const VALID_PUBLIC_KEY_LENGTHS = new Set([64, 66, 130]);

const DEFAULT_STATE = {
    users: [],
    files: [],
    revocations: [],
    config: {
        adjudicatorPublicKey: process.env.ADJUDICATOR_PUBLIC_KEY || null,
        ringMemberPublicKeys: [],
    },
};

function canonicalizePublicKey(value) {
    if (!value || typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim().toLowerCase();
    const hex = trimmed.replace(/^0x/, '');

    if (!VALID_PUBLIC_KEY_LENGTHS.has(hex.length)) {
        return null;
    }

    try {
        // Point.fromHex accepts x-only, compressed (02/03 prefix) and uncompressed (04 prefix) encodings.
    const point = Point.fromHex(hex);
    // Always persist the canonical compressed representation (02/03 prefix, 33 bytes)
    return Buffer.from(point.toRawBytes(true)).toString('hex');
    } catch (error) {
        return null;
    }
}

function isValidPublicKey(value) {
    return Boolean(canonicalizePublicKey(value));
}

function normalizePublicKeyValue(value) {
    if (!value || typeof value !== 'string') {
        return '';
    }

    return canonicalizePublicKey(value) || '';
}

function sanitizeIdentifierValue(value) {
    if (!value || typeof value !== 'string') {
        return '';
    }

    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 64);
}

function generateIdentifier(displayName, existingIdentifiers) {
    const safeBase = sanitizeIdentifierValue(displayName) || 'user';
    let candidate = safeBase;

    if (!existingIdentifiers.has(candidate)) {
        existingIdentifiers.add(candidate);
        return candidate;
    }

    let attempt = 0;
    while (attempt < 10) {
        attempt += 1;
        candidate = `${safeBase}-${Math.random().toString(36).slice(2, 6)}`;
        if (!existingIdentifiers.has(candidate)) {
            existingIdentifiers.add(candidate);
            return candidate;
        }
    }

    candidate = `user-${crypto.randomUUID().slice(0, 8)}`;
    existingIdentifiers.add(candidate);
    return candidate;
}

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

    normalized.config.ringMemberPublicKeys = normalized.config.ringMemberPublicKeys
        .map((key) => canonicalizePublicKey(key))
        .filter(Boolean);

    const existingIdentifiers = new Set(
        normalized.users
            .map((user) => (typeof user.identifier === 'string' ? sanitizeIdentifierValue(user.identifier) : null))
            .filter(Boolean),
    );

    const existingPublicKeys = new Set(
        normalized.users
            .map((user) =>
                typeof user.publicKey === 'string' ? normalizePublicKeyValue(user.publicKey) : null,
            )
            .filter(Boolean),
    );

    normalized.users = normalized.users.map((user) => {
        if (!user.identifier) {
            const identifier = generateIdentifier(user.displayName || user.publicKey || 'user', existingIdentifiers);
            return {
                ...user,
                identifier,
            };
        }

        const sanitized = sanitizeIdentifierValue(user.identifier);
        if (!sanitized) {
            const identifier = generateIdentifier(user.displayName || user.publicKey || 'user', existingIdentifiers);
            return {
                ...user,
                identifier,
            };
        }

        if (!existingIdentifiers.has(sanitized)) {
            existingIdentifiers.add(sanitized);
        }

        return {
            ...user,
            identifier: sanitized,
        };
    });

    SAMPLE_USERS.forEach((user) => {
        const key = normalizePublicKeyValue(user.publicKey);
        if (!existingPublicKeys.has(key)) {
            normalized.users.push({
                ...user,
                identifier:
                    sanitizeIdentifierValue(user.identifier) ||
                    generateIdentifier(user.displayName || user.publicKey, existingIdentifiers),
                userId: user.userId || crypto.randomUUID(),
                createdAt: user.createdAt || new Date().toISOString(),
            });
            existingPublicKeys.add(key);
        }
    });

    normalized.users = normalized.users.map((user) => {
        const canonicalKey = canonicalizePublicKey(user.publicKey);
        return {
            ...user,
            publicKey: canonicalKey,
        };
    });

    // Ensure ring member list stays in sync with registered users if empty
    if (normalized.config.ringMemberPublicKeys.length === 0 && normalized.users.length > 0) {
        normalized.config.ringMemberPublicKeys = normalized.users
            .map((user) => user.publicKey)
            .filter(Boolean);
    }

    // Deduplicate and drop any invalid keys that may have slipped in before normalization completed.
    normalized.config.ringMemberPublicKeys = Array.from(
        new Set(
            normalized.config.ringMemberPublicKeys
                .map((key) => canonicalizePublicKey(key))
                .filter(Boolean),
        ),
    );

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
    const unique = new Set();

    (data.config.ringMemberPublicKeys || []).forEach((key) => {
        const canonical = canonicalizePublicKey(key);
        if (canonical) {
            unique.add(canonical);
        }
    });

    (data.users || []).forEach((user) => {
        const canonical = canonicalizePublicKey(user.publicKey);
        if (canonical) {
            user.publicKey = canonical;
            unique.add(canonical);
        } else if (user && Object.prototype.hasOwnProperty.call(user, 'publicKey')) {
            user.publicKey = null;
        }
    });

    data.config.ringMemberPublicKeys = Array.from(unique);
}

function registerUser({ identifier, displayName, publicKey, escrowedIdentity = null }) {
    if (!publicKey) {
        throw new Error('publicKey is required');
    }

    const data = readStorage();

    const normalizedPublicKey = String(publicKey).trim();
    const canonicalPublicKey = canonicalizePublicKey(normalizedPublicKey);

    if (!canonicalPublicKey) {
        throw new Error('Invalid secp256k1 public key');
    }

    const publicKeyFingerprint = normalizePublicKeyValue(canonicalPublicKey);
    const normalizedDisplayName = displayName ? String(displayName).trim() : undefined;
    const normalizedIdentifier = identifier ? sanitizeIdentifierValue(String(identifier)) : null;

    const exists = data.users.find((user) => {
        const userPublicKey =
            typeof user.publicKey === 'string' ? normalizePublicKeyValue(user.publicKey) : null;
        const userIdentifier =
            typeof user.identifier === 'string' ? sanitizeIdentifierValue(user.identifier) : null;
        return (
            userPublicKey === publicKeyFingerprint ||
            (normalizedIdentifier && userIdentifier === normalizedIdentifier)
        );
    });
    if (exists) {
        throw new Error('User already registered with provided identifier or public key');
    }

    const identifierSet = new Set(
        data.users
            .map((user) => (typeof user.identifier === 'string' ? sanitizeIdentifierValue(user.identifier) : null))
            .filter(Boolean),
    );

    const resolvedIdentifier =
        normalizedIdentifier || generateIdentifier(normalizedDisplayName || normalizedPublicKey, identifierSet);

    const record = {
        userId: crypto.randomUUID(),
        identifier: resolvedIdentifier,
        displayName: normalizedDisplayName || resolvedIdentifier,
        publicKey: canonicalPublicKey,
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
    const sanitized = sanitizeIdentifierValue(identifier);
    const data = readStorage();
    return data.users.find((user) => user.identifier === sanitized) || null;
}

function getUserByPublicKey(publicKey) {
    if (!publicKey) {
        return null;
    }
    const normalizedKey = normalizePublicKeyValue(publicKey);
    const data = readStorage();
    return (
        data.users.find((user) => {
            if (!user.publicKey) {
                return false;
            }
            return normalizePublicKeyValue(user.publicKey) === normalizedKey;
        }) || null
    );
}

function listFileRecordsByOwnershipKey(publicKey) {
    const normalizedKey = normalizePublicKeyValue(publicKey);
    if (!normalizedKey) {
        return [];
    }

    const data = readStorage();
    return data.files.filter((file) => normalizePublicKeyValue(file.ownershipPublicKey) === normalizedKey);
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
    listFileRecordsByOwnershipKey,
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
