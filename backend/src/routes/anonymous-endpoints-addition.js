
// ============================================================================
// ANONYMOUS DOWNLOAD FLOW - NEW ENDPOINTS
// ============================================================================

const express = require('express');
const crypto = require('crypto');
const { getSchnorr } = require('../utils/schnorr');
const { FileAccessService } = require('../services/FileAccessService');
const { RingSignatureService } = require('../services/RingSignatureService');
const { secureLog, maskHashForLogging } = require('../utils/monitoring');
const { verifyLsagRingSignature } = require('../utils/ringSignature');

// Properly declare Router at the top
const router = express.Router();

// Store dependencies for dependency injection
let prismaInstance;
let fileAccessService;

/**
 * Initialize router with dependency injection
 * @param {PrismaClient} prismaClient - Shared Prisma instance from server.js
 * @returns {express.Router} Configured router instance
 */
function init(prismaClient) {
    prismaInstance = prismaClient;
    
    // Create services with dependency injection
    const ringSignatureService = new RingSignatureService(prismaInstance);
    fileAccessService = new FileAccessService(ringSignatureService, prismaInstance);
    
    // Return the configured router
    return router;
}

/**
 * POST /api/files/anonymous-list
 * List files accessible by public key (anonymous)
 */
router.post('/anonymous-list', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { publicKey, ringSignature, timestamp, nonce } = req.body;

        // Validate input
        if (!publicKey || !ringSignature || !timestamp || !nonce) {
            log('AnonymousList', `Missing required fields in request from IP: ${req.ip}`, 'warn');
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: publicKey, ringSignature, timestamp, nonce'
            });
        }

        const params = {
            publicKey,
            ringSignature,
            timestamp,
            nonce
        };

        // Use FileAccessService to handle the logic
        const files = await fileAccessService.listAccessibleFiles(params);

        const duration = Date.now() - startTime;
        const publicKeyHash = fileAccessService.ringService.hashPublicKey(publicKey);
        const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
        secureLog('AnonymousList', `Successfully listed ${files.length} files for publicKeyHash: ${maskedPublicKeyHash} [${duration}ms]`, 'info', { publicKeyHash });

        return res.json({
            success: true,
            files: files,
            totalCount: files.length,
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        secureLog('AnonymousList', `Error processing list request: ${error.message} [${duration}ms]`, 'error', { ip: req.ip });
        
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * POST /api/files/:fileId/anonymous-access
 * Negotiate access to specific file (anonymous)
 */
router.post('/:fileId/anonymous-access', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { fileId } = req.params;
        const { publicKey, ringSignature, timestamp, nonce } = req.body;

        // Validate input
        if (!publicKey || !ringSignature || !timestamp || !nonce) {
            secureLog('AnonymousAccess', `Missing required fields for file ${fileId} from IP: ${req.ip}`, 'warn', { fileId, ip: req.ip });
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const params = {
            fileId,
            publicKey,
            ringSignature,
            timestamp,
            nonce
        };

        // Use FileAccessService to handle the logic
        const result = await fileAccessService.negotiateAccess(params);

        const duration = Date.now() - startTime;
        const publicKeyHash = fileAccessService.ringService.hashPublicKey(publicKey);
        const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
        secureLog('AnonymousAccess', `Access negotiation successful for file ${fileId} and publicKeyHash: ${maskedPublicKeyHash} [${duration}ms]`, 'info', { fileId, publicKeyHash });

        return res.json({
            success: true,
            ...result
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        secureLog('AnonymousAccess', `Error negotiating access for file ${fileId}: ${error.message} [${duration}ms]`, 'error', { fileId, ip: req.ip });
        
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * POST /api/files/:fileId/anonymous-integrity-alert
 * Report chunk integrity issue (anonymous)
 */
router.post('/:fileId/anonymous-integrity-alert', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { fileId } = req.params;
        const {
            publicKey, ringSignature,
            chunkIndex, expectedHash, actualHash,
            retryCount, timestamp, nonce
        } = req.body;

        // Validate input
        if (!publicKey || !ringSignature || !timestamp || !nonce || chunkIndex === undefined || expectedHash === undefined) {
            secureLog('IntegrityAlert', `Missing required fields for integrity alert on file ${fileId} from IP: ${req.ip}`, 'warn', { fileId, ip: req.ip });
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const params = {
            fileId,
            publicKey,
            ringSignature,
            chunkIndex,
            expectedHash,
            actualHash,
            retryCount,
            timestamp,
            nonce
        };

        // Use FileAccessService to handle the logic
        await fileAccessService.reportIntegrityAlert(params);

        const duration = Date.now() - startTime;
        const publicKeyHash = fileAccessService.ringService.hashPublicKey(publicKey);
        const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
        secureLog('IntegrityAlert', `Integrity alert recorded for file ${fileId}, chunk ${chunkIndex}, by publicKeyHash: ${maskedPublicKeyHash} [${duration}ms]`, 'info', { fileId, chunkIndex, publicKeyHash });

        return res.json({
            success: true,
            message: 'Integrity alert recorded',
            recommendation: retryCount < 3 ? 'retry' : 'contact_owner'
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        secureLog('IntegrityAlert', `Error recording integrity alert for file ${fileId}, chunk ${chunkIndex}: ${error.message} [${duration}ms]`, 'error', { fileId, chunkIndex, ip: req.ip });
        
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * POST /api/audit/anonymous-log
 * Log audit event (anonymous)
 */
router.post('/audit/anonymous-log', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const {
            eventType, fileId, publicKey, ringSignature,
            timestamp, nonce, metadata
        } = req.body;

        // Validate input
        if (!eventType || !fileId || !publicKey || !ringSignature || !timestamp || !nonce) {
            secureLog('AnonymousAuditLog', `Missing required fields for audit event ${eventType} from IP: ${req.ip}`, 'warn', { eventType, fileId, ip: req.ip });
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const params = {
            eventType,
            fileId,
            publicKey,
            ringSignature,
            timestamp,
            nonce,
            metadata: metadata || {}
        };

        // Use FileAccessService to handle the logic
        await fileAccessService.logAnonymousAuditEvent(params);

        const duration = Date.now() - startTime;
        const publicKeyHash = fileAccessService.ringService.hashPublicKey(publicKey);
        const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
        secureLog('AnonymousAuditLog', `Audit event ${eventType} logged for file ${fileId} by publicKeyHash: ${maskedPublicKeyHash} [${duration}ms]`, 'info', { eventType, fileId, publicKeyHash });

        return res.json({
            success: true,
            message: 'Audit event logged'
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        const safeEventType = req.body?.eventType || 'unknown';
        const safeFileId = req.body?.fileId || 'unknown';
        secureLog(
            'AnonymousAuditLog',
            `Error logging audit event ${safeEventType}: ${error.message} [${duration}ms]`,
            'error',
            { eventType: safeEventType, fileId: safeFileId, ip: req.ip }
        );
        
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * Helper: Normalize public key to x-only format (32 bytes)
 */
function normalizePublicKey(publicKeyHex) {
    const cleaned = publicKeyHex.trim().toLowerCase().replace(/^0x/, '');

    if (cleaned.length === 66) {
        // Compressed format (33 bytes): remove prefix byte
        return cleaned.slice(2);
    } else if (cleaned.length === 130) {
        // Uncompressed format (65 bytes): take x-coordinate only
        return cleaned.slice(2, 66);
    } else if (cleaned.length === 64) {
        // Already x-only
        return cleaned;
    }

    throw new Error(`Invalid public key format: ${cleaned.length} chars`);
}

/**
 * Helper: Verify Schnorr proof of ownership
 */
async function verifySchnorrProof({ R, s, message, publicKey }, expectedPublicKey) {
    const schnorr = await getSchnorr();
    if (!R || !s || !message || !publicKey) {
        throw new Error('Missing Schnorr proof components');
    }

    // Normalize both keys for comparison
    const normalizedProvided = normalizePublicKey(publicKey);
    const normalizedExpected = normalizePublicKey(expectedPublicKey);

    if (normalizedProvided !== normalizedExpected) {
        throw new Error(`Public key mismatch: ${normalizedProvided} !== ${normalizedExpected}`);
    }

    // Combine R and s into 64-byte signature
    const rBytes = Buffer.from(R, 'hex');
    const sBytes = Buffer.from(s, 'hex');

    if (rBytes.length !== 32 || sBytes.length !== 32) {
        throw new Error(`Invalid Schnorr proof lengths: R=${rBytes.length}, s=${sBytes.length}`);
    }

    const signatureBytes = new Uint8Array(64);
    signatureBytes.set(rBytes, 0);
    signatureBytes.set(sBytes, 32);

    // Hash the message
    const messageBytes = Buffer.from(message, 'hex');

    // Extract x-coordinate for verification (32 bytes)
    let publicKeyBytes = Buffer.from(publicKey, 'hex');
    if (publicKeyBytes.length === 33) {
        // Remove prefix byte from compressed key
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

/**
 * POST /api/files/client-chunked-upload
 *
 * Receive manifest and encrypted chunk keys from client
 * Client has already uploaded chunks to IPFS
 *
 * Task B Implementation: Backend receives only metadata, not raw file data
 */
router.post('/client-chunked-upload', async (req, res) => {
    const startTime = Date.now();

    try {
        const {
            fileName,
            fileSize,
            mimeType,
            chunkCount,
            chunks,
            metadataHash,
            ownershipPublicKey,
            encryptedChunkKeys,
            keyPackageFingerprint,
            ringSignature,
            escrowedIdentity,
            ringMembers,
            schnorr: ownershipProof
        } = req.body;

        console.log('[Client Chunked Upload] Received upload request:', {
            fileName,
            fileSize,
            chunkCount,
            chunksLength: chunks?.length,
            hasMetadataHash: !!metadataHash,
            hasOwnershipProof: !!ownershipProof,
            hasRingSignature: !!ringSignature,
        });

        // ====================================================================
        // 1. VALIDATE INPUT
        // ====================================================================
        if (!fileName || !fileSize || !chunkCount || !chunks || !Array.isArray(chunks)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: fileName, fileSize, chunkCount, chunks'
            });
        }

        if (!metadataHash || !ownershipPublicKey || !ownershipProof) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: metadataHash, ownershipPublicKey, schnorr'
            });
        }

        if (!encryptedChunkKeys || !keyPackageFingerprint) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: encryptedChunkKeys, keyPackageFingerprint'
            });
        }

        if (chunks.length !== chunkCount) {
            return res.status(400).json({
                success: false,
                error: `Chunk count mismatch: expected ${chunkCount}, got ${chunks.length}`
            });
        }

        // Validate chunk structure
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (chunk.index !== i || !chunk.cid || !chunk.hash || !chunk.size) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid chunk structure at index ${i}`
                });
            }
        }

        // ====================================================================
        // 2. VERIFY OWNERSHIP PROOFS
        // ====================================================================
        console.log('[Client Chunked Upload] Verifying ownership proofs...');

        // Verify Schnorr proof
        try {
            await verifySchnorrProof({
                R: ownershipProof.R,
                s: ownershipProof.s,
                message: ownershipProof.message || metadataHash,
                publicKey: ownershipProof.publicKey || ownershipPublicKey,
            }, ownershipPublicKey);

            console.log('[Client Chunked Upload] Schnorr proof verified');
        } catch (error) {
            console.error('[Client Chunked Upload] Schnorr verification failed:', error);
            return res.status(401).json({
                success: false,
                error: 'Invalid ownership proof',
                details: error.message
            });
        }

        // Verify ring signature (if provided)
        if (ringSignature && ringMembers && ringMembers.length >= 2) {
            try {
                const parsedRingSignature = typeof ringSignature === 'string'
                    ? JSON.parse(ringSignature)
                    : ringSignature;

                await verifyLsagRingSignature({
                    message: metadataHash,
                    ringSignature: parsedRingSignature,
                    expectedRingPublicKeys: ringMembers
                });

                console.log('[Client Chunked Upload] Ring signature verified');
            } catch (error) {
                console.error('[Client Chunked Upload] Ring signature verification failed:', error);
                return res.status(401).json({
                    success: false,
                    error: 'Invalid ring signature',
                    details: error.message
                });
            }
        }

        // ====================================================================
        // 3. SAVE FILE RECORD
        // ====================================================================
        console.log('[Client Chunked Upload] Creating file record...');

        const uploaderPublicKeyHash = crypto
            .createHash('sha256')
            .update(ownershipPublicKey)
            .digest('hex');

        const fileRecord = await prismaInstance.file.create({
            data: {
                fileName,
                totalSize: fileSize,
                mimeType: mimeType || 'application/octet-stream',
                chunkCount,
                metadataHash,
                encryptedChunkKeys: JSON.stringify(encryptedChunkKeys),
                ownershipPublicKey,
                uploaderPublicKeyHash,
                ringSignature: ringSignature ? (typeof ringSignature === 'string' ? ringSignature : JSON.stringify(ringSignature)) : null,
                ringPublicKeys: ringMembers && ringMembers.length > 0 ? JSON.stringify(ringMembers) : null,
                escrowedIdentity: escrowedIdentity || null,
                status: 'active',
                uploaderId: null, // ✅ No userId - anonymous system
                metadata: JSON.stringify({
                    clientChunked: true,
                    keyPackageFingerprint,
                    uploadTimestamp: new Date().toISOString(),
                })
            }
        });

        console.log('[Client Chunked Upload] File record created:', fileRecord.id);

        // ====================================================================
        // 4. SAVE CHUNK RECORDS
        // ====================================================================
        console.log('[Client Chunked Upload] Creating chunk records...');

        const chunkRecords = await prismaInstance.fileChunk.createMany({
            data: chunks.map(chunk => ({
                fileId: fileRecord.id,
                chunkIndex: chunk.index,
                ipfsCid: chunk.cid,
                chunkHash: chunk.hash,
                size: chunk.size,
            }))
        });

        console.log(`[Client Chunked Upload] ${chunkRecords.count} chunk records created`);

        // ====================================================================
        // 5. CREATE ANONYMOUS FILE ACCESS RECORD
        // ====================================================================
        console.log('[Client Chunked Upload] Creating anonymous access record...');

        await prismaInstance.anonymousFileAccess.create({
            data: {
                accessorPublicKeyHash: uploaderPublicKeyHash,
                fileId: fileRecord.id,
                status: 'active',
                keyStatus: 'client-managed', // ✅ Keys managed by client
                keyPackageFingerprint,
                accessCount: 0,
            }
        });

        // ====================================================================
        // 6. LOG AUDIT EVENT
        // ====================================================================
        await prismaInstance.anonymousAuditLog.create({
            data: {
                eventType: 'upload',
                fileId: fileRecord.id,
                publicKeyHash: uploaderPublicKeyHash,
                metadata: JSON.stringify({
                    fileName,
                    fileSize,
                    chunkCount,
                    ownershipPublicKey, // ✅ Include publicKey instead of userId
                    clientChunked: true,
                    uploadedAt: new Date().toISOString(),
                }),
            }
        });

        // ====================================================================
        // 7. RETURN SUCCESS RESPONSE
        // ====================================================================
        const duration = Date.now() - startTime;
        const maskedPublicKeyHash = maskHashForLogging(uploaderPublicKeyHash, 'publicKeyHash');

        secureLog(
            'ClientChunkedUpload',
            `File uploaded successfully: ${fileRecord.id}, ${chunkCount} chunks, by publicKeyHash: ${maskedPublicKeyHash} [${duration}ms]`,
            'info',
            { fileId: fileRecord.id, chunkCount, publicKeyHash: uploaderPublicKeyHash }
        );

        return res.status(201).json({
            success: true,
            fileId: fileRecord.id,
            fileName: fileRecord.fileName,
            totalSize: fileRecord.totalSize,
            chunkCount: fileRecord.chunkCount,
            chunks: chunks.map(c => ({
                index: c.index,
                cid: c.cid,
                hash: c.hash,
            })),
            metadataHash: fileRecord.metadataHash,
            ownershipPublicKey: fileRecord.ownershipPublicKey,
            secureKeyPackage: {
                masterKey: null, // ✅ Backend does NOT have master key
                chunkKeys: {}, // ✅ Backend does NOT have chunk keys
                keyPackageFingerprint, // Only fingerprint for verification
            },
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        console.error('[Client Chunked Upload] Error:', error);

        secureLog(
            'ClientChunkedUpload',
            `Upload failed: ${error.message} [${duration}ms]`,
            'error',
            { ip: req.ip, error: error.message }
        );

        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = { router, init };

