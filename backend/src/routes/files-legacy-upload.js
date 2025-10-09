const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');
const {
    addFileRecord,
    getFileRecord,
    addRevocationRecord,
    listFileRecords,
    listFileRecordsByOwnershipKey,
    updateFileRecord,
    getRingContext,
    getUserByPublicKey,
} = require('../utils/aotStorage');
const { verifyLsagRingSignature } = require('../utils/ringSignature');
const {
    uploadFileWithChunks,
    reportIntegrityAlert,
} = require('../services/fileChunkService');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// IPFS API endpoint - use internal container address
const IPFS_API_URL = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';

async function getSchnorrModule() {
    if (!this.schnorrModulePromise) {
        this.schnorrModulePromise = import('@noble/curves/secp256k1.js').then(m => m.schnorr);
    }
    return this.schnorrModulePromise;
}

function normalizeHex(hex) {
    if (typeof hex !== 'string') {
        return '';
    }
    const trimmed = hex.trim().toLowerCase();
    return trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
}

function toMessageHex(message) {
    if (typeof message !== 'string') {
        return null;
    }

    const normalized = normalizeHex(message);
    const isHex = /^[0-9a-f]+$/i.test(normalized);
    if (isHex && normalized.length === 64) {
        return normalized;
    }

    const buffer = Buffer.from(message, 'utf-8');
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return hash;
}

async function verifySchnorrProof({
    R,
    s,
    message,
    publicKey,
}, expectedPublicKey) {
    const schnorr = await getSchnorrModule();

    const normalizedR = normalizeHex(R);
    const normalizedS = normalizeHex(s);
    const normalizedMessage = toMessageHex(message);
    const proofPublicKey = normalizeHex(publicKey);
    const storedPublicKey = normalizeHex(expectedPublicKey);

    if (!normalizedR || !normalizedS || !normalizedMessage) {
        throw new Error('Incomplete Schnorr proof payload');
    }

    if (!proofPublicKey || proofPublicKey !== storedPublicKey) {
        throw new Error('Ownership public key mismatch');
    }

    if (normalizedR.length !== 64 || normalizedS.length !== 64) {
        throw new Error('Schnorr proof components must be 32-byte hex values');
    }

    const signatureHex = `${normalizedR}${normalizedS}`;
    const signatureBytes = Buffer.from(signatureHex, 'hex');
    const messageBytes = Buffer.from(normalizedMessage, 'hex');

    // Convert 33-byte compressed public key to 32-byte x-only public key if needed
    let publicKeyBytes = Buffer.from(storedPublicKey, 'hex');
    if (publicKeyBytes.length === 33) {
        // Remove the first byte (02 or 03 prefix) to get x-only public key
        publicKeyBytes = publicKeyBytes.slice(1);
    } else if (publicKeyBytes.length !== 32) {
        throw new Error(`Invalid public key length: expected 32 or 33 bytes, got ${publicKeyBytes.length}`);
    }

    const isValid = schnorr.verify(signatureBytes, messageBytes, publicKeyBytes);
    if (!isValid) {
        throw new Error('Invalid Schnorr ownership proof');
    }
    return true;
}

function tryParseJson(value) {
    if (!value || typeof value !== 'string') {
        return null;
    }
    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
    }
}

function normalizePublicKey(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.trim().toLowerCase().replace(/^0x/, '');
}

// Upload file to IPFS
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const response = await axios.post(`${IPFS_API_URL}/api/v0/add`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        const ipfsResponse = response.data;
        const hash = ipfsResponse.Hash;

        res.json({
            success: true,
            hash: hash,
            name: req.file.originalname,
            size: req.file.size,
            ipfsUrl: `http://localhost:8080/ipfs/${hash}`,
            apiUrl: `http://localhost:5001/api/v0/cat?arg=${hash}`
        });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({ 
            error: 'Failed to upload file to IPFS',
            details: error.message 
        });
    }
});

router.post('/aot-upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File is required' });
        }

        const metadataHash = (req.body.metadataHash || '').trim();
        const ringSignature = (req.body.ringSignature || '').trim();
        const escrowedIdentity = (req.body.escrowedIdentity || '').trim();
        const ownershipPublicKey = (req.body.ownershipPublicKey || '').trim();
        const ownershipProof = {
            R: req.body.ownershipProofR || req.body['ownershipProof[R]'],
            s: req.body.ownershipProofS || req.body['ownershipProof[s]'],
            message: req.body.ownershipProofMessage || req.body['ownershipProof[message]'],
            publicKey: req.body.ownershipProofPublicKey || ownershipPublicKey,
        };

        if (!metadataHash || !ownershipPublicKey) {
            return res.status(400).json({ error: 'metadataHash and ownershipPublicKey are required' });
        }

        await verifySchnorrProof(ownershipProof, ownershipPublicKey);

        const ringContext = getRingContext();
        let ringMembers = ringContext.ringMemberPublicKeys || [];
        const normalizedOwnerKey = normalizePublicKey(ownershipPublicKey);

        const availableRingMap = new Map(
            (ringContext.ringMemberPublicKeys || []).map((key) => [normalizePublicKey(key), key])
        );

        const requestedRingMembersRaw = req.body.ringMembers || req.body['ringMembers[]'];
        console.log('[AOT Upload] Received ring members:', {
            type: typeof requestedRingMembersRaw,
            isArray: Array.isArray(requestedRingMembersRaw),
            value: requestedRingMembersRaw,
        });

        if (requestedRingMembersRaw) {
            let parsedRingMembers;
            if (typeof requestedRingMembersRaw === 'string') {
                try {
                    parsedRingMembers = JSON.parse(requestedRingMembersRaw);
                    console.log('[AOT Upload] Parsed ring members from JSON:', parsedRingMembers);
                } catch (error) {
                    parsedRingMembers = [requestedRingMembersRaw];
                    console.log('[AOT Upload] Using single ring member (parse failed):', parsedRingMembers);
                }
            } else if (Array.isArray(requestedRingMembersRaw)) {
                parsedRingMembers = requestedRingMembersRaw;
                console.log('[AOT Upload] Using ring members array directly:', parsedRingMembers);
            }

            if (Array.isArray(parsedRingMembers) && parsedRingMembers.length > 0) {
                const normalizedSet = new Set();
                parsedRingMembers.forEach((value, index) => {
                    if (typeof value === 'string') {
                        const normalized = normalizePublicKey(value);
                        console.log(`[AOT Upload] Ring member ${index}:`, {
                            original: value.substring(0, 20) + '...',
                            normalized: normalized.substring(0, 20) + '...',
                            length: normalized.length,
                        });
                        normalizedSet.add(normalized);
                    }
                });

                if (!normalizedSet.has(normalizedOwnerKey)) {
                    normalizedSet.add(normalizedOwnerKey);
                    console.log('[AOT Upload] Added owner key to ring');
                }

                // IMPORTANT: Sort ring members lexicographically to ensure deterministic order
                // This MUST match the order used in mobile app
                ringMembers = Array.from(normalizedSet)
                    .map((key) => availableRingMap.get(key) || key)
                    .sort((a, b) => a.localeCompare(b));
                console.log('[AOT Upload] Final ring members (sorted):', {
                    count: ringMembers.length,
                    members: ringMembers.map(k => k.substring(0, 20) + '...'),
                });
            }
        }

        if (ringMembers.length >= 2) {
            const ringIncludesOwner = ringMembers
                .map((member) => normalizePublicKey(member))
                .includes(normalizedOwnerKey);
            if (!ringIncludesOwner) {
                return res.status(400).json({
                    error: 'Ownership public key is not part of the registered ring',
                });
            }

            if (!ringSignature) {
                return res.status(400).json({
                    error: 'ringSignature is required when a ring is configured',
                });
            }

            console.log('[AOT Upload] About to verify ring signature with:', {
                message: metadataHash,
                ringSignatureLength: ringSignature?.length,
                expectedRingPublicKeys: ringMembers.map(k => ({
                    length: k?.length,
                    prefix: k?.substring(0, 20),
                })),
            });

            await verifyLsagRingSignature({
                message: metadataHash,
                ringSignature,
                expectedRingPublicKeys: ringMembers,
            });

            console.log('[AOT Upload] Ring signature verified successfully!');
        }

        const parsedRingSignature = ringSignature
            ? tryParseJson(ringSignature) || { raw: ringSignature }
            : null;
        const ownerRecord = getUserByPublicKey(ownershipPublicKey);

        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const response = await axios.post(`${IPFS_API_URL}/api/v0/add`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        const ipfsResponse = response.data;
        const hash = ipfsResponse.Hash;

        const record = addFileRecord({
            fileId: crypto.randomUUID(),
            cid: hash,
            name: req.file.originalname,
            size: req.file.size,
            metadataHash,
            ownershipPublicKey,
            ringSignature,
            storedRingSignature: parsedRingSignature,
            escrowedIdentity,
            ownerUserId: ownerRecord?.userId || null,
            ownerIdentifier: ownerRecord?.identifier || null,
            ringMembersUsed: ringMembers,
            ringContextSnapshot: {
                adjudicatorPublicKey: ringContext.adjudicatorPublicKey,
                ringMemberPublicKeys: ringMembers,
            },
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({
            success: true,
            fileId: record.fileId,
            cid: record.cid,
            name: record.name,
            size: record.size,
            metadataHash: record.metadataHash,
            ownershipPublicKey: record.ownershipPublicKey,
            ringMembers: record.ringMembersUsed,
        });
    } catch (error) {
        console.error('AOT upload error:', error);
        const message = error instanceof Error ? error.message : 'Failed to process AOT upload';
        const statusCode = message.includes('Schnorr') || message.includes('mismatch')
            ? 400
            : 500;
        res.status(statusCode).json({ success: false, error: message });
    }
});

// ============================================================================
// NEW CHUNKED UPLOAD WITH AOT (Thesis Implementation)
// ============================================================================

router.post('/chunked-upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File is required' });
        }

        const metadataHash = (req.body.metadataHash || '').trim();
        const ringSignature = (req.body.ringSignature || '').trim();
        const escrowedIdentity = (req.body.escrowedIdentity || '').trim();
        const ownershipPublicKey = (req.body.ownershipPublicKey || '').trim();

        // Parse Schnorr proof
        const ownershipProof = {
            R: req.body.ownershipProofR || req.body['ownershipProof[R]'],
            s: req.body.ownershipProofS || req.body['ownershipProof[s]'],
            message: req.body.ownershipProofMessage || req.body['ownershipProof[message]'],
            publicKey: req.body.ownershipProofPublicKey || ownershipPublicKey,
        };

        if (!metadataHash || !ownershipPublicKey) {
            return res.status(400).json({
                error: 'metadataHash and ownershipPublicKey are required'
            });
        }

        // Verify Schnorr ownership proof
        await verifySchnorrProof(ownershipProof, ownershipPublicKey);

        // Parse ring members
        const ringContext = getRingContext();
        let ringMembers = ringContext.ringMemberPublicKeys || [];
        const normalizedOwnerKey = normalizePublicKey(ownershipPublicKey);

        const requestedRingMembersRaw = req.body.ringMembers || req.body['ringMembers[]'];
        if (requestedRingMembersRaw) {
            let parsedRingMembers;
            if (typeof requestedRingMembersRaw === 'string') {
                try {
                    parsedRingMembers = JSON.parse(requestedRingMembersRaw);
                } catch (error) {
                    parsedRingMembers = [requestedRingMembersRaw];
                }
            } else if (Array.isArray(requestedRingMembersRaw)) {
                parsedRingMembers = requestedRingMembersRaw;
            }

            if (Array.isArray(parsedRingMembers) && parsedRingMembers.length > 0) {
                const normalizedSet = new Set();
                parsedRingMembers.forEach((value) => {
                    if (typeof value === 'string') {
                        normalizedSet.add(normalizePublicKey(value));
                    }
                });

                if (!normalizedSet.has(normalizedOwnerKey)) {
                    normalizedSet.add(normalizedOwnerKey);
                }

                // IMPORTANT: Sort ring members lexicographically for deterministic order
                ringMembers = Array.from(normalizedSet).sort((a, b) => a.localeCompare(b));
            }
        }

        // Verify ring signature if ring size >= 2
        if (ringMembers.length >= 2) {
            const ringIncludesOwner = ringMembers
                .map((member) => normalizePublicKey(member))
                .includes(normalizedOwnerKey);

            if (!ringIncludesOwner) {
                return res.status(400).json({
                    error: 'Ownership public key is not part of the registered ring',
                });
            }

            if (!ringSignature) {
                return res.status(400).json({
                    error: 'ringSignature is required when a ring is configured',
                });
            }

            await verifyLsagRingSignature({
                message: metadataHash,
                ringSignature,
                expectedRingPublicKeys: ringMembers,
            });
        }

        // Get user ID (for demo, we'll use ownership public key as user ID)
        const ownerRecord = getUserByPublicKey(ownershipPublicKey);
        const userId = ownerRecord?.userId || ownershipPublicKey;

        // Upload file with chunking
        console.log('[Route] Starting chunked upload for:', req.file.originalname);
        const result = await uploadFileWithChunks({
            fileBuffer: req.file.buffer,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            userId,
            metadataHash,
            ownershipPublicKey,
            schnorrProof: ownershipProof,
            ringSignature,
            ringPublicKeys: ringMembers,
            escrowedIdentity,
        });

        res.status(201).json(result);

    } catch (error) {
        console.error('[Route] Chunked upload error:', error);
        const message = error instanceof Error ? error.message : 'Failed to process chunked upload';
        const statusCode = message.includes('Schnorr') || message.includes('mismatch')
            ? 400
            : 500;
        res.status(statusCode).json({ success: false, error: message });
    }
});

module.exports = router;