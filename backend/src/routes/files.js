const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const crypto = require('crypto');
const { getSchnorr } = require('../utils/schnorr');
const {
    addFileRecord,
    getFileRecord,
    addRevocationRecord,
    listFileRecords,
    listFileRecordsByOwnershipKey,
    updateFileRecord,
    getRingContext,
} = require('../utils/aotStorage');
const { verifyLsagRingSignature } = require('../utils/ringSignature');
const {
    uploadFileWithChunks,
    reportIntegrityAlert,
} = require('../services/fileChunkService');
const {
    prepareClientReencryption,
    finalizeClientReencryption,
    getRevocationHistory,
} = require('../services/revocationService');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// IPFS API endpoint - use internal container address
const IPFS_API_URL = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';

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
    const schnorr = await getSchnorr();

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

// ============================================================================
// UPLOAD ENDPOINTS (Anonymous Upload Flow)
// ============================================================================

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
            hash,
            name: req.file.originalname,
            size: req.file.size,
            ipfsUrl: `http://localhost:8080/ipfs/${hash}`,
            apiUrl: `http://localhost:5001/api/v0/cat?arg=${hash}`,
        });
    } catch (error) {
        console.error('[Route] Upload error:', error.message);
        res.status(500).json({
            error: 'Failed to upload file to IPFS',
            details: error.message,
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

                ringMembers = Array.from(normalizedSet)
                    .map((key) => availableRingMap.get(key) || key)
                    .sort((a, b) => a.localeCompare(b));
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

            await verifyLsagRingSignature({
                message: metadataHash,
                ringSignature,
                expectedRingPublicKeys: ringMembers,
            });
        }

        const parsedRingSignature = ringSignature
            ? tryParseJson(ringSignature) || { raw: ringSignature }
            : null;

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
        console.error('[Route] AOT upload error:', error);
        const message = error instanceof Error ? error.message : 'Failed to process AOT upload';
        const statusCode = message.includes('Schnorr') || message.includes('mismatch')
            ? 400
            : 500;
        res.status(statusCode).json({ success: false, error: message });
    }
});

router.post('/chunked-upload', upload.single('file'), async (req, res) => {
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
            return res.status(400).json({
                error: 'metadataHash and ownershipPublicKey are required',
            });
        }

        await verifySchnorrProof(ownershipProof, ownershipPublicKey);

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

                ringMembers = Array.from(normalizedSet).sort((a, b) => a.localeCompare(b));
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

            await verifyLsagRingSignature({
                message: metadataHash,
                ringSignature,
                expectedRingPublicKeys: ringMembers,
            });
        }

        const uploaderPublicKeyHash = crypto
            .createHash('sha256')
            .update(ownershipPublicKey)
            .digest('hex');

        const result = await uploadFileWithChunks({
            fileBuffer: req.file.buffer,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            uploaderPublicKeyHash,
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

// ============================================================================
// DOWNLOAD ENDPOINTS (4-Phase Flow)
// ============================================================================









// Simple test route for debugging
router.get('/viewtest', (req, res) => {
    res.json({ message: 'View test route works' });
});

// Test route to verify view pattern works
router.get('/view/test', (req, res) => {
    res.json({ message: 'View pattern works!' });
});

// Legacy AOT revoke (in-memory storage)
router.post('/aot/revoke', async (req, res) => {
    try {
        const {
            fileId,
            targetUserId,
            ringSignature,
            message,
            ownershipProof = {},
        } = req.body || {};

        if (!fileId || !message) {
            return res.status(400).json({ error: 'fileId and message are required' });
        }

        const record = getFileRecord(fileId);
        if (!record) {
            return res.status(404).json({ error: 'File record not found for provided fileId' });
        }

        const ringContext = getRingContext();
        const ringMembers = ringContext.ringMemberPublicKeys || [];

        if (ringMembers.length >= 2) {
            if (!ringSignature) {
                return res.status(400).json({
                    error: 'ringSignature is required for anonymous revocation',
                });
            }

            await verifyLsagRingSignature({
                message,
                ringSignature,
                expectedRingPublicKeys: ringMembers,
            });
        }

        const requiredProofFields = ['R', 's', 'message', 'publicKey'];
        const missingProofFields = requiredProofFields.filter((key) => {
            const value = ownershipProof?.[key];
            return typeof value !== 'string' || value.trim().length === 0;
        });

        if (missingProofFields.length > 0) {
            return res.status(400).json({
                error: `Invalid ownership proof: missing ${missingProofFields.join(', ')}`,
            });
        }

        const proofPayload = {
            R: ownershipProof.R,
            s: ownershipProof.s,
            message: ownershipProof.message || message,
            publicKey: ownershipProof.publicKey,
        };

        try {
            await verifySchnorrProof(proofPayload, record.ownershipPublicKey);
        } catch (verificationError) {
            console.warn('AOT revocation ownership proof rejected', {
                fileId,
                error: verificationError instanceof Error ? verificationError.message : verificationError,
            });
            return res.status(400).json({
                error: `Invalid ownership proof: ${verificationError instanceof Error ? verificationError.message : 'verification failed'}`,
            });
        }

        const revocation = addRevocationRecord({
            revocationId: crypto.randomUUID(),
            fileId,
            targetUserId: targetUserId || null,
            ringSignature: ringSignature || null,
            storedRingSignature: ringSignature
                ? tryParseJson(ringSignature) || { raw: ringSignature }
                : null,
            message,
            ownershipProof: {
                R: ownershipProof.R,
                s: ownershipProof.s,
                publicKey: ownershipProof.publicKey,
            },
            createdAt: new Date().toISOString(),
        });

        updateFileRecord(fileId, {
            lastRevocationId: revocation.revocationId,
            lastRevocationAt: revocation.createdAt,
        });

        res.json({
            success: true,
            revocationId: revocation.revocationId,
            chunksToReencrypt: [],
            note: 'Partial re-encryption is skipped in the demo implementation.',
        });
    } catch (error) {
        console.error('AOT revocation error:', error);
        const message = error instanceof Error ? error.message : 'Failed to process revocation request';
        const statusCode = message.includes('Schnorr') || message.includes('mismatch')
            ? 400
            : 500;
        res.status(statusCode).json({ success: false, error: message });
    }
});

// ============================================================================
// CLIENT-SIDE RE-ENCRYPTION REVOCATION (Two-Phase Flow)
// ============================================================================

router.post('/revocation/prepare', async (req, res) => {
    try {
        const {
            fileId,
            targetUserId,
            revokedPublicKeyHash,
            ringSignature,
            message,
            ownershipProof = {},
            securityLevel = 'standard',
            keyPackage,
        } = req.body || {};

        if (!fileId || !message) {
            return res.status(400).json({ error: 'fileId and message are required' });
        }

        if (!keyPackage || typeof keyPackage !== 'object') {
            return res.status(400).json({ error: 'keyPackage (masterKey + chunkKeys) is required' });
        }

        let resolvedPublicKeyHash = revokedPublicKeyHash || null;

        if (!resolvedPublicKeyHash && targetUserId) {
            const { PrismaClient } = require('../config/prismaClient');
            const prisma = new PrismaClient();
            const targetUser = await prisma.user.findUnique({
                where: { id: targetUserId },
                select: { publicKey: true },
            });

            if (!targetUser || !targetUser.publicKey) {
                await prisma.$disconnect();
                return res.status(400).json({
                    error: 'Target user not found or does not have a public key',
                });
            }

            const hashed = crypto
                .createHash('sha256')
                .update(targetUser.publicKey)
                .digest('hex');

            await prisma.$disconnect();
            resolvedPublicKeyHash = hashed;
        }

        const result = await prepareClientReencryption({
            fileId,
            revokedPublicKeyHash: resolvedPublicKeyHash,
            message,
            ringSignature,
            ownershipProof,
            securityLevel,
            keyPackage,
        });

        res.json(result);
    } catch (error) {
        console.error('[Route] Revocation manifest prepare error:', error);
        const messageText = error instanceof Error ? error.message : 'Failed to prepare revocation manifest';
        const statusCode = messageText.includes('Schnorr') || messageText.includes('ring') || messageText.includes('key')
            ? 400
            : 500;
        res.status(statusCode).json({ success: false, error: messageText });
    }
});

router.post('/revocation/finalize', async (req, res) => {
    try {
        const {
            revocationId,
            fileId,
            message,
            ringSignature,
            ownershipProof = {},
            keyPackage,
            reencryptedChunks = [],
        } = req.body || {};

        if (!revocationId || !fileId || !message) {
            return res.status(400).json({
                error: 'revocationId, fileId, and message are required',
            });
        }

        if (!keyPackage || typeof keyPackage !== 'object') {
            return res.status(400).json({
                error: 'keyPackage (masterKey + chunkKeys) is required to finalize',
            });
        }

        const result = await finalizeClientReencryption({
            revocationId,
            fileId,
            message,
            ringSignature,
            ownershipProof,
            keyPackage,
            reencryptedChunks,
        });

        res.json(result);
    } catch (error) {
        console.error('[Route] Revocation manifest finalize error:', error);
        const messageText = error instanceof Error ? error.message : 'Failed to finalize revocation manifest';
        const statusCode = messageText.includes('Schnorr') || messageText.includes('ring') || messageText.includes('key')
            ? 400
            : 500;
        res.status(statusCode).json({ success: false, error: messageText });
    }
});

router.post('/revoke-with-reencryption', (req, res) => {
    res.status(410).json({
        success: false,
        error: 'Server-side re-encryption is deprecated. Use /api/files/revocation/prepare and /api/files/revocation/finalize.',
    });
});

// Get revocation history
router.get('/:fileId/revocations', async (req, res) => {
    try {
        const { fileId } = req.params;
        const history = await getRevocationHistory(fileId);
        res.json({ success: true, revocations: history });
    } catch (error) {
        console.error('[Route] Get revocation history error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get revocation history'
        });
    }
});

// View chunked file info (for UUIDs, not IPFS hashes)
router.get('/:fileId/info', async (req, res) => {
    try {
        const { fileId } = req.params;

        // Check if it's a UUID (chunked file) or IPFS hash (legacy)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fileId);

        if (!isUUID) {
            return res.status(400).json({
                error: 'Invalid file ID format. Use /view/:hash for IPFS hashes.'
            });
        }

        const { PrismaClient } = require('../config/prismaClient');
        const prisma = new PrismaClient();

        const file = await prisma.file.findUnique({
            where: { id: fileId },
            include: {
                chunks: {
                    select: {
                        chunkIndex: true,
                        ipfsCid: true,
                        chunkHash: true,
                        size: true,
                    },
                    orderBy: { chunkIndex: 'asc' }
                }
            }
        });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.json({
            success: true,
            file: {
                id: file.id,
                fileName: file.fileName,
                totalSize: file.totalSize,
                chunkCount: file.chunkCount,
                status: file.status,
                ownershipPublicKey: file.ownershipPublicKey,
                createdAt: file.createdAt,
            },
            chunks: file.chunks,
            message: 'This is a chunked file. Use the secure download flow to download it.',
        });

    } catch (error) {
        console.error('[Route] Get file info error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get file info'
        });
    }
});

// Test IPFS API connectivity
router.get('/test-ipfs', async (req, res) => {
    try {
        const testResponse = await axios.post(`${IPFS_API_URL}/api/v0/version`);
        res.json({
            success: true,
            ipfsApiUrl: IPFS_API_URL,
            ipfsVersion: testResponse.data
        });
    } catch (error) {
        res.status(500).json({
            error: 'IPFS API test failed',
            ipfsApiUrl: IPFS_API_URL,
            details: error.message
        });
    }
});

// Helper function to detect content type from filename
function getContentType(filename = '') {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const contentTypes = {
        // Text files
        'txt': 'text/plain',
        'md': 'text/markdown',
        'csv': 'text/csv',
        'json': 'application/json',
        'xml': 'application/xml',
        
        // Document files
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        
        // Spreadsheet files
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        
        // Image files
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp',
        
        // Video files
        'mp4': 'video/mp4',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'mkv': 'video/x-matroska',
        
        // Audio files
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'flac': 'audio/flac',
        
        // Archive files
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed',
        'tar': 'application/x-tar',
        'gz': 'application/gzip'
    };
    
    return contentTypes[ext] || 'application/octet-stream';
}

// Get file metadata from IPFS  
router.get('/metadata/:hash', async (req, res) => {
    try {
        const { hash } = req.params;

        // Use IPFS HTTP API to get file stats
        console.log('METADATA: Fetching file stats from IPFS API:', IPFS_API_URL);
        const response = await axios.post(
            `${IPFS_API_URL}/api/v0/object/stat?arg=${hash}`,
            null,
            { timeout: 10000 }
        );

        console.log('METADATA: Stats retrieved successfully');

        res.json({
            success: true,
            hash: hash,
            metadata: response.data
        });

    } catch (error) {
        console.error('Metadata retrieval error:', error.message);
        res.status(500).json({
            error: 'Failed to retrieve file metadata from IPFS',
            details: error.response?.data?.Message || error.message
        });
    }
});

// View file content from IPFS with proper content type - BEFORE :hash route
router.get('/view/:hash', async (req, res) => {
    console.log('VIEW ROUTE HIT:', req.params, req.query);
    try {
        const { hash } = req.params;
        
        // Validate IPFS hash format for view route too
        console.log('VIEW route validating hash:', hash);
        if (!hash.match(/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{50,})$/)) {
            console.log('VIEW hash validation failed for:', hash);
            return res.status(404).json({ error: 'Invalid IPFS hash format' });
        }
        console.log('VIEW hash validation passed for:', hash);
        const { filename } = req.query; // Optional filename for content-type detection

        // Use IPFS HTTP API to retrieve file
        console.log('VIEW: Fetching file from IPFS API:', IPFS_API_URL);
        const response = await axios.post(
            `${IPFS_API_URL}/api/v0/cat?arg=${hash}`,
            null,
            {
                responseType: 'arraybuffer',
                timeout: 30000, // 30 seconds timeout
            }
        );

        const fileBuffer = Buffer.from(response.data);
        console.log('VIEW: File retrieved successfully, size:', fileBuffer.length);

        // Detect content type
        const contentType = getContentType(filename);
        const displayFilename = filename || `${hash}.bin`;

        // Set appropriate headers for viewing
        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${displayFilename}"`,
            'Content-Length': fileBuffer.length,
            'Cache-Control': 'public, max-age=3600'
        });

        // For text files, convert to string; for binary files, send buffer
        if (contentType.startsWith('text/') || contentType === 'application/json') {
            res.send(fileBuffer.toString('utf8'));
        } else {
            res.send(fileBuffer);
        }

    } catch (error) {
        console.error('File view error:', error.message);
        res.status(500).json({ 
            error: 'Failed to view file from IPFS',
            details: error.message
        });
    }
});

// Get file from IPFS (download) - MUST BE LAST due to :hash parameter
router.get('/:hash', async (req, res) => {
    console.log('HASH ROUTE HIT:', req.params, req.query);
    try {
        const { hash } = req.params;
        
        // Validate IPFS hash format (Qm... or bafy...)
        console.log('Validating hash:', hash);
        if (!hash.match(/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{50,})$/)) {
            console.log('Hash validation failed for:', hash);
            return res.status(404).json({ error: 'Invalid IPFS hash format' });
        }
        console.log('Hash validation passed for:', hash);
        const { download, view, filename } = req.query; // ?download=true or ?view=true

        // Use IPFS HTTP API to retrieve file
        console.log('Fetching file from IPFS API:', IPFS_API_URL);
        const response = await axios.post(
            `${IPFS_API_URL}/api/v0/cat?arg=${hash}`,
            null,
            {
                responseType: 'arraybuffer',
                timeout: 30000, // 30 seconds timeout
            }
        );

        const fileBuffer = Buffer.from(response.data);
        console.log('File retrieved successfully, size:', fileBuffer.length);

        if (view === 'true') {
            // View mode - detect content type and send with proper headers
            const contentType = getContentType(filename);
            const displayFilename = filename || `${hash}.bin`;

            res.set({
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${displayFilename}"`,
                'Content-Length': fileBuffer.length,
                'Cache-Control': 'public, max-age=3600'
            });

            // For text files, convert to string; for binary files, send buffer
            if (contentType.startsWith('text/') || contentType === 'application/json') {
                res.send(fileBuffer.toString('utf8'));
            } else {
                res.send(fileBuffer);
            }
        } else {
            // Download mode - send as binary
            const disposition = download === 'true' ? 'attachment' : 'inline';
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `${disposition}; filename="${hash}"`,
                'Content-Length': fileBuffer.length
            });
            res.send(fileBuffer);
        }

    } catch (error) {
        console.error('Retrieval error:', error.message);
        res.status(500).json({ 
            error: 'Failed to retrieve file from IPFS',
            details: error.message,
            ipfsApiUrl: IPFS_API_URL
        });
    }
});


// ============================================================================

module.exports = router;
