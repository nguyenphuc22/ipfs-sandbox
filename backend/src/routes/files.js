const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { spawn } = require('child_process');
const crypto = require('crypto');
const {
    addFileRecord,
    getFileRecord,
    addRevocationRecord,
    listFileRecords,
    updateFileRecord,
    getRingContext,
    getUserByPublicKey,
} = require('../utils/aotStorage');
const { verifyLsagRingSignature } = require('../utils/ringSignature');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// IPFS API endpoint - use internal container address
const IPFS_API_URL = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';

let schnorrModulePromise;

async function getSchnorrModule() {
    if (!schnorrModulePromise) {
        schnorrModulePromise = import('@noble/secp256k1');
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
    const { schnorr } = await getSchnorrModule();

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
    const isValid = await schnorr.verify(signatureHex, normalizedMessage, storedPublicKey);
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
        const ringMembers = ringContext.ringMemberPublicKeys || [];
        const normalizedOwnerKey = normalizePublicKey(ownershipPublicKey);

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

// Simple test route for debugging
router.get('/viewtest', (req, res) => {
    res.json({ message: 'View test route works' });
});

// Test route to verify view pattern works
router.get('/view/test', (req, res) => {
    res.json({ message: 'View pattern works!' });
});

router.get('/aot/files', (req, res) => {
    const files = listFileRecords();
    res.json({ success: true, files });
});

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

// List files (placeholder - would need database integration)
router.get('/', (req, res) => {
    res.json({ 
        message: 'File listing requires database integration',
        note: 'Use /upload to add files and /:hash to retrieve them'
    });
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
        
        // Get file stats from IPFS
        const ipfsProcess = spawn('ipfs', ['object', 'stat', hash], {
            env: { ...process.env, IPFS_PATH: '/data/ipfs' }
        });

        let statOutput = '';
        let errorOutput = '';

        ipfsProcess.stdout.on('data', (data) => {
            statOutput += data.toString();
        });

        ipfsProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        ipfsProcess.on('close', (code) => {
            if (code === 0) {
                // Parse stats output
                const lines = statOutput.trim().split('\n');
                const metadata = {};
                lines.forEach(line => {
                    const [key, ...valueParts] = line.split(':');
                    if (key && valueParts.length > 0) {
                        metadata[key.trim()] = valueParts.join(':').trim();
                    }
                });
                
                res.json({
                    success: true,
                    hash: hash,
                    metadata: metadata
                });
            } else {
                console.error('IPFS object stat error:', errorOutput);
                res.status(500).json({
                    error: 'Failed to get file metadata from IPFS',
                    details: errorOutput || 'IPFS command failed',
                    exitCode: code
                });
            }
        });

        ipfsProcess.on('error', (error) => {
            console.error('IPFS process error:', error);
            res.status(500).json({
                error: 'Failed to spawn IPFS process',
                details: error.message
            });
        });

    } catch (error) {
        console.error('Metadata retrieval error:', error.message);
        res.status(500).json({ 
            error: 'Failed to retrieve file metadata from IPFS',
            details: error.message
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
        
        // Use direct IPFS command
        const ipfsProcess = spawn('ipfs', ['cat', hash], {
            env: { ...process.env, IPFS_PATH: '/data/ipfs' }
        });

        let fileBuffer = Buffer.alloc(0);
        let errorOutput = '';

        ipfsProcess.stdout.on('data', (data) => {
            fileBuffer = Buffer.concat([fileBuffer, data]);
        });

        ipfsProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        ipfsProcess.on('close', (code) => {
            if (code === 0) {
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
            } else {
                console.error('IPFS cat error:', errorOutput);
                res.status(500).json({
                    error: 'Failed to retrieve file from IPFS',
                    details: errorOutput || 'IPFS command failed',
                    exitCode: code
                });
            }
        });

        ipfsProcess.on('error', (error) => {
            console.error('IPFS process error:', error);
            res.status(500).json({
                error: 'Failed to spawn IPFS process',
                details: error.message
            });
        });

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
        
        // Use direct IPFS command instead of HTTP API to avoid 405 issues
        const ipfsProcess = spawn('ipfs', ['cat', hash], {
            env: { ...process.env, IPFS_PATH: '/data/ipfs' }
        });

        let fileBuffer = Buffer.alloc(0);
        let errorOutput = '';

        ipfsProcess.stdout.on('data', (data) => {
            fileBuffer = Buffer.concat([fileBuffer, data]);
        });

        ipfsProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        ipfsProcess.on('close', (code) => {
            if (code === 0) {
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
            } else {
                // Error
                console.error('IPFS cat error:', errorOutput);
                res.status(500).json({
                    error: 'Failed to retrieve file from IPFS',
                    details: errorOutput || 'IPFS command failed',
                    exitCode: code
                });
            }
        });

        ipfsProcess.on('error', (error) => {
            console.error('IPFS process error:', error);
            res.status(500).json({
                error: 'Failed to spawn IPFS process',
                details: error.message
            });
        });

    } catch (error) {
        console.error('Retrieval error:', error.message);
        res.status(500).json({ 
            error: 'Failed to retrieve file from IPFS',
            details: error.message,
            ipfsApiUrl: IPFS_API_URL
        });
    }
});

module.exports = router;
