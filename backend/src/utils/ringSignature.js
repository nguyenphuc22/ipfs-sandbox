const crypto = require('crypto');

let secpModulePromise;
let sha256Promise;

async function loadSecpModule() {
    if (!secpModulePromise) {
        secpModulePromise = import('@noble/secp256k1');
    }
    return secpModulePromise;
}

async function loadSha256() {
    if (!sha256Promise) {
        sha256Promise = import('@noble/hashes/sha2.js').then((m) => m.sha256);
    }
    return sha256Promise;
}

function ensureBuffer(input, encodingHint = 'auto') {
    if (Buffer.isBuffer(input)) {
        return input;
    }
    if (input instanceof Uint8Array) {
        return Buffer.from(input);
    }
    if (typeof input === 'string') {
        const trimmed = input.trim();
        if (encodingHint === 'hex' || (encodingHint === 'auto' && /^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length % 2 === 0)) {
            return Buffer.from(trimmed.replace(/^0x/, ''), 'hex');
        }
        return Buffer.from(trimmed, 'utf-8');
    }
    throw new Error('Unsupported input type for buffer conversion');
}

function normalizeHex(value) {
    if (typeof value !== 'string') {
        throw new Error('Hex value must be a string');
    }
    const trimmed = value.trim().toLowerCase();
    return trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
}

/**
 * Ensure public key is in compressed format (66 hex chars with 02/03 prefix)
 * Converts x-only (64 chars) to compressed format by trying both parities
 */
async function ensureCompressedPublicKey(publicKey) {
    const { Point } = await loadSecpModule();
    const normalized = normalizeHex(publicKey);

    // Already compressed
    if (normalized.length === 66 && (normalized.startsWith('02') || normalized.startsWith('03'))) {
        return normalized;
    }

    // X-only format (64 chars) - try both parities
    if (normalized.length === 64) {
        for (const prefix of ['02', '03']) {
            try {
                const point = Point.fromHex(`${prefix}${normalized}`);
                return Buffer.from(point.toRawBytes(true)).toString('hex');
            } catch (error) {
                // Try next prefix
            }
        }
        throw new Error('Invalid x-only public key - neither parity works');
    }

    // Uncompressed format (130 chars) - convert to compressed
    if (normalized.length === 130) {
        const point = Point.fromHex(normalized);
        return Buffer.from(point.toRawBytes(true)).toString('hex');
    }

    throw new Error(`Unsupported public key format: length ${normalized.length}`);
}

function mod(a, b) {
    const result = a % b;
    return result >= 0n ? result : result + b;
}

async function randomScalar() {
    const { utils, CURVE } = await loadSecpModule();
    while (true) {
        const randomBytes = Buffer.from(utils.randomPrivateKey());
        const scalar = mod(BigInt('0x' + randomBytes.toString('hex')), CURVE.n);
        if (scalar > 0n) {
            return scalar;
        }
    }
}

async function hashToScalar(...parts) {
    const { CURVE } = await loadSecpModule();
    const sha256 = await loadSha256();
    const buffer = Buffer.concat(parts.map((part) => ensureBuffer(part)));
    const digest = Buffer.from(sha256(buffer));
    return mod(BigInt('0x' + digest.toString('hex')), CURVE.n);
}

async function hashToPoint(publicKeyHex) {
    const { Point, CURVE } = await loadSecpModule();
    const sha256 = await loadSha256();
    const normalized = ensureBuffer(normalizeHex(publicKeyHex), 'hex');
    console.log('[hashToPoint] Input publicKeyHex:', publicKeyHex.substring(0, 20));
    for (let counter = 0; counter < 256; counter += 1) {
        const counterBuffer = Buffer.alloc(4);
        counterBuffer.writeUInt32BE(counter, 0);
        const digest = Buffer.from(sha256(Buffer.concat([normalized, counterBuffer])));
        const scalar = mod(BigInt('0x' + digest.toString('hex')), CURVE.n);
        if (counter < 3) {
            console.log(`[hashToPoint] counter=${counter}, bytes=[${Array.from(counterBuffer)}], digest=${digest.toString('hex').substring(0, 16)}...`);
        }
        if (scalar === 0n) {
            continue;
        }
        try {
            const result = Point.BASE.multiply(scalar);
            console.log(`[hashToPoint] Success at counter=${counter}`);
            return result;
        } catch (error) {
            // Retry with next counter value
        }
    }
    throw new Error('Failed to hash public key to curve point');
}

function scalarToHex(value) {
    if (typeof value !== 'bigint') {
        throw new Error('Scalar must be bigint');
    }
    return value.toString(16).padStart(64, '0');
}

async function createLsagRingSignature({
    message,
    ringPublicKeys,
    signerIndex,
    signerPrivateKey,
}) {
    if (!Array.isArray(ringPublicKeys) || ringPublicKeys.length < 2) {
        throw new Error('Ring signature requires at least two public keys');
    }

    const { Point, CURVE } = await loadSecpModule();
    const sha256 = await loadSha256();
    const normalizedRing = ringPublicKeys.map((key) => normalizeHex(String(key)));

    if (signerIndex < 0 || signerIndex >= normalizedRing.length) {
        throw new Error('signerIndex is out of range for provided ring');
    }

    const signerScalar = mod(BigInt('0x' + normalizeHex(String(signerPrivateKey))), CURVE.n);
    if (signerScalar === 0n) {
        throw new Error('Invalid signer private key');
    }

    const ringPoints = normalizedRing.map((hex) => Point.fromHex(hex));
    const signerPoint = ringPoints[signerIndex];
    if (!signerPoint) {
        throw new Error('Failed to parse signer public key');
    }

    const hashedPoint = await hashToPoint(normalizedRing[signerIndex]);
    const keyImagePoint = hashedPoint.multiply(signerScalar);

    const ringSize = normalizedRing.length;
    const s = new Array(ringSize).fill(0n);
    const c = new Array(ringSize).fill(0n);

    const messageBuffer = ensureBuffer(message);
    const messageDigest = Buffer.from(sha256(messageBuffer)).toString('hex');

    const u = await randomScalar();
    const LSigner = Point.BASE.multiply(u);
    const RSigner = hashedPoint.multiply(u);

    const nextIndex = (signerIndex + 1) % ringSize;
    c[nextIndex] = await hashToScalar(messageBuffer, LSigner.toRawBytes(true), RSigner.toRawBytes(true));

    let index = nextIndex;
    while (index !== signerIndex) {
        s[index] = await randomScalar();
        const hpPoint = await hashToPoint(normalizedRing[index]);
        const L = Point.BASE.multiply(s[index]).add(ringPoints[index].multiply(c[index]));
        const R = hpPoint.multiply(s[index]).add(keyImagePoint.multiply(c[index]));
        const followingIndex = (index + 1) % ringSize;
        c[followingIndex] = await hashToScalar(
            messageBuffer,
            L.toRawBytes(true),
            R.toRawBytes(true),
        );
        index = followingIndex;
    }

    if (typeof c[signerIndex] === 'undefined') {
        throw new Error('Failed to derive challenge for signer index');
    }

    s[signerIndex] = mod(u - c[signerIndex] * signerScalar, CURVE.n);

    if (typeof c[0] === 'undefined') {
        throw new Error('Failed to derive initial ring challenge');
    }

    return {
        scheme: 'lsag-secp256k1',
        ringMembers: normalizedRing,
        keyImage: Buffer.from(keyImagePoint.toRawBytes(true)).toString('hex'),
        c0: scalarToHex(c[0]),
        s: s.map((value) => scalarToHex(value)),
        messageDigest,
        messageEncoding: /^[0-9a-fA-F]+$/.test(message) && message.length % 2 === 0 ? 'hex' : 'utf8',
    };
}

function parseRingSignature(input) {
    if (typeof input === 'string') {
        return JSON.parse(input);
    }
    if (input && typeof input === 'object') {
        return input;
    }
    throw new Error('Invalid ring signature payload');
}

async function verifyLsagRingSignature({
    message,
    ringSignature,
    expectedRingPublicKeys = [],
}) {
    const signature = parseRingSignature(ringSignature);
    const { Point, CURVE } = await loadSecpModule();
    const sha256 = await loadSha256();

    if (signature.scheme !== 'lsag-secp256k1') {
        throw new Error('Unsupported ring signature scheme');
    }

    if (!Array.isArray(signature.ringMembers) || signature.ringMembers.length < 2) {
        throw new Error('Ring signature must include ringMembers array');
    }
    if (!Array.isArray(signature.s) || signature.s.length !== signature.ringMembers.length) {
        throw new Error('Invalid s vector in ring signature');
    }

    // Normalize all ring members to compressed format
    console.log('[Ring Signature] Normalizing ring members to compressed format...');
    console.log('[Ring Signature] Raw ring members received:', signature.ringMembers);
    const normalizedRing = await Promise.all(
        signature.ringMembers.map(async (key, index) => {
            console.log(`[Ring Signature] Processing member ${index}:`, {
                fullKey: key,
                length: key?.length,
                type: typeof key,
            });
            const compressed = await ensureCompressedPublicKey(key);
            console.log(`[Ring Signature] Normalized member ${index}:`, {
                original: key?.substring?.(0, 20),
                originalLength: key?.length,
                compressed: compressed.substring(0, 20),
                compressedLength: compressed.length,
            });
            return compressed;
        })
    );

    if (expectedRingPublicKeys && expectedRingPublicKeys.length > 0) {
        // Also normalize expected keys to compressed format
        const expectedNormalized = await Promise.all(
            expectedRingPublicKeys.map(key => ensureCompressedPublicKey(key))
        );
        const expected = new Set(expectedNormalized);
        const provided = new Set(normalizedRing);

        console.log('[Ring Signature] Comparing ring members:', {
            expectedCount: expected.size,
            providedCount: provided.size,
            expected: Array.from(expected).map(k => k.substring(0, 20)),
            provided: Array.from(provided).map(k => k.substring(0, 20)),
        });

        if (expected.size !== provided.size) {
            throw new Error('Ring members mismatch: different sizes');
        }
        for (const key of expected) {
            if (!provided.has(key)) {
                throw new Error(`Ring members mismatch: missing key ${key.substring(0, 20)}`);
            }
        }
    }

    const messageBuffer = ensureBuffer(message, signature.messageEncoding || 'auto');
    const digest = Buffer.from(sha256(messageBuffer)).toString('hex');
    if (signature.messageDigest && signature.messageDigest !== digest) {
        throw new Error('Ring signature message digest mismatch');
    }

    console.log('[Ring Signature] Starting verification with:', {
        ringSize: normalizedRing.length,
        keyImageLength: signature.keyImage?.length,
        c0Length: signature.c0?.length,
        sCount: signature.s?.length,
        ringMembersInOrder: normalizedRing.map((k, idx) => ({
            index: idx,
            prefix: k.substring(0, 20),
            suffix: k.substring(k.length - 10),
        })),
    });

    const keyImagePoint = Point.fromHex(normalizeHex(signature.keyImage));
    let c = mod(BigInt('0x' + normalizeHex(signature.c0)), CURVE.n);
    const initialC = c;

    for (let i = 0; i < normalizedRing.length; i += 1) {
        const ringMemberKey = normalizedRing[i];
        console.log(`[Ring Signature] Verifying member ${i}:`, {
            keyLength: ringMemberKey?.length,
            keyPrefix: ringMemberKey?.substring(0, 10),
            keySuffix: ringMemberKey?.substring(ringMemberKey.length - 10),
        });

        try {
            const publicKeyPoint = Point.fromHex(ringMemberKey);
            console.log(`[Ring Signature] Member ${i} point created successfully`);
        } catch (error) {
            console.error(`[Ring Signature] FAILED to create point for member ${i}:`, {
                error: error.message,
                key: ringMemberKey,
                keyLength: ringMemberKey?.length,
            });
            throw error;
        }

        const publicKeyPoint = Point.fromHex(ringMemberKey);
        const sScalar = mod(BigInt('0x' + normalizeHex(signature.s[i])), CURVE.n);
        if (sScalar <= 0n) {
            throw new Error('Ring signature response scalar is invalid');
        }

        console.log(`[Ring Signature] Member ${i} inputs:`, {
            currentC: c.toString(16).padStart(64, '0').substring(0, 20) + '...',
            s: sScalar.toString(16).padStart(64, '0').substring(0, 20) + '...',
        });

        const hpPoint = await hashToPoint(normalizedRing[i]);
        const L = Point.BASE.multiply(sScalar).add(publicKeyPoint.multiply(c));
        const R = hpPoint.multiply(sScalar).add(keyImagePoint.multiply(c));

        const LBytes = L.toRawBytes(true);
        const RBytes = R.toRawBytes(true);
        console.log(`[Ring Signature] Member ${i} L/R points:`, {
            LLength: LBytes.length,
            LPrefix: Buffer.from(LBytes).toString('hex').substring(0, 20),
            RLength: RBytes.length,
            RPrefix: Buffer.from(RBytes).toString('hex').substring(0, 20),
        });

        c = await hashToScalar(messageBuffer, LBytes, RBytes);
        console.log(`[Ring Signature] Member ${i} computed next c:`, c.toString(16).padStart(64, '0').substring(0, 20) + '...');
    }

    console.log('[Ring Signature] Final verification check:', {
        finalC: c.toString(16).padStart(64, '0'),
        initialC: initialC.toString(16).padStart(64, '0'),
        matches: c === initialC,
    });

    if (c !== initialC) {
        console.error('[Ring Signature] VERIFICATION FAILED:', {
            finalC: c.toString(16).padStart(64, '0'),
            initialC: initialC.toString(16).padStart(64, '0'),
            difference: 'Values do not match',
        });
        throw new Error('Invalid ring signature');
    }

    console.log('[Ring Signature] ✓ Verification successful!');
    return true;
}

async function derivePublicKeyFromPrivateKey(privateKey) {
    const { Point } = await loadSecpModule();
    const scalar = normalizeHex(String(privateKey));
    const point = Point.fromPrivateKey(scalar);
    return Buffer.from(point.toRawBytes(true)).toString('hex');
}

module.exports = {
    createLsagRingSignature,
    verifyLsagRingSignature,
    derivePublicKeyFromPrivateKey,
};
