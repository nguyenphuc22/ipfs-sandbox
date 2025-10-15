const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const {
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
    reportIntegrityAlert,
} = require('../services/fileChunkService');
const {
    executePartialReencryption,
    getRevocationHistory,
} = require('../services/revocationService');
const router = express.Router();

// IPFS API endpoint - use internal container address
const IPFS_API_URL = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';

let schnorrModulePromise;

async function getSchnorrModule() {
    if (!schnorrModulePromise) {
        schnorrModulePromise = import('@noble/curves/secp256k1.js').then(m => m.schnorr);
    }
    return schnorrModulePromise;
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

        await verifySchnorrProof({
            R: ownershipProof.R,
            s: ownershipProof.s,
            message: ownershipProof.message || message,
            publicKey: ownershipProof.publicKey || record.ownershipPublicKey,
        }, record.ownershipPublicKey);

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
                publicKey: ownershipProof.publicKey || record.ownershipPublicKey,
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
// NEW PARTIAL RE-ENCRYPTION REVOCATION (Thesis Implementation)
// ============================================================================

router.post('/revoke-with-reencryption', async (req, res) => {
    try {
        const {
            fileId,
            targetUserId,
            ringSignature,
            message,
            ownershipProof = {},
            securityLevel = 'standard', // standard, high, maximum
        } = req.body || {};

        if (!fileId || !message) {
            return res.status(400).json({
                error: 'fileId and message are required'
            });
        }

        // Verify ring signature if configured
        const ringContext = getRingContext();
        const ringMembers = ringContext.ringMemberPublicKeys || [];

        if (ringMembers.length >= 2 && ringSignature) {
            await verifyLsagRingSignature({
                message,
                ringSignature,
                expectedRingPublicKeys: ringMembers,
            });
        }

        // Verify Schnorr ownership proof
        if (!ownershipProof.R || !ownershipProof.s) {
            return res.status(400).json({
                error: 'Valid Schnorr ownership proof (R, s) is required'
            });
        }

        // Note: In production, get file ownership key from database
        // For demo, accept publicKey from request
        const ownershipPublicKey = ownershipProof.publicKey;

        await verifySchnorrProof({
            R: ownershipProof.R,
            s: ownershipProof.s,
            message: ownershipProof.message || message,
            publicKey: ownershipPublicKey,
        }, ownershipPublicKey);

        console.log('[Route] Starting partial re-encryption revocation...');

        // Convert targetUserId to publicKeyHash if provided
        let revokedPublicKeyHash = null;
        if (targetUserId) {
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient();
            const targetUser = await prisma.user.findUnique({
                where: { id: targetUserId },
                select: { publicKey: true }
            });

            if (!targetUser || !targetUser.publicKey) {
                return res.status(400).json({
                    error: 'Target user not found or does not have a public key'
                });
            }

            // Hash the public key
            const crypto = require('crypto');
            revokedPublicKeyHash = crypto
                .createHash('sha256')
                .update(targetUser.publicKey)
                .digest('hex');

            await prisma.$disconnect();
        }

        // Execute partial re-encryption with publicKeyHash (not userId)
        const result = await executePartialReencryption(
            fileId,
            revokedPublicKeyHash,
            ownershipProof,
            securityLevel
        );

        res.json(result);

    } catch (error) {
        console.error('[Route] Revocation with re-encryption error:', error);
        const message = error instanceof Error ? error.message : 'Failed to execute revocation';
        const statusCode = message.includes('Schnorr') || message.includes('not found')
            ? 400
            : 500;
        res.status(statusCode).json({ success: false, error: message });
    }
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

        const { PrismaClient } = require('@prisma/client');
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
