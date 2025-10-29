
// ============================================================================
// ANONYMOUS DOWNLOAD FLOW - NEW ENDPOINTS
// ============================================================================

const express = require('express');
const crypto = require('crypto');
const { FileAccessService } = require('../services/FileAccessService');
const { RingSignatureService } = require('../services/RingSignatureService');
const { AccessManagementService, AccessManagementEvents } = require('../services/AccessManagementService');
const { secureLog, maskHashForLogging } = require('../utils/monitoring');
const { verifyLsagRingSignature } = require('../utils/ringSignature');
const { verifyValidationToken, ensureNonceUnique } = require('../services/ValidationTokenVerifier');
const { getSchnorr } = require('../utils/schnorr');

const ADJUDICATOR_PUBLIC_KEY = process.env.ADJUDICATOR_PUBLIC_KEY || null;

// Properly declare Router at the top
const router = express.Router();

// Store dependencies for dependency injection
let prismaInstance;
let fileAccessService;
let accessManagementService;

function extractOwnershipProof(payload = {}) {
    if (payload.ownershipProof && typeof payload.ownershipProof === 'object') {
        return payload.ownershipProof;
    }

    return {
        R: payload.ownershipProofR || payload['ownershipProof[R]'],
        s: payload.ownershipProofS || payload['ownershipProof[s]'],
        message: payload.ownershipProofMessage || payload['ownershipProof[message]'],
        publicKey: payload.ownershipProofPublicKey || payload.ownershipPublicKey,
    };
}

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
    accessManagementService = new AccessManagementService({
        prismaClient: prismaInstance,
        ringService: ringSignatureService,
    });

    AccessManagementEvents.removeAllListeners('AccessGrantChanged');
    AccessManagementEvents.on('AccessGrantChanged', (payload) => {
        try {
            const maskedFileId = payload?.fileId || 'unknown';
            secureLog('AccessGrantChanged', `Grant lifecycle event ${payload?.type || 'unknown'} for file ${maskedFileId}`, 'info', {
                fileId: payload?.fileId,
                grantId: payload?.grant?.id,
                status: payload?.grant?.status,
            });
        } catch (error) {
            console.error('[AccessGrantChanged] Failed to log event', error);
        }
    });
    
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
            secureLog('AnonymousList', `Missing required fields in request from IP: ${req.ip}`, 'warn', { ip: req.ip });
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

        const normalizedForEtag = files
            .map((file) => ({
                grantId: file.grantId || file.fileId,
                status: file.status || file.grantStatus || 'active',
                grantedAt: file.grantedAt ? new Date(file.grantedAt).toISOString() : null,
                revokedAt: file.grantRevokedAt ? new Date(file.grantRevokedAt).toISOString() : null,
                fileUpdatedAt: file.fileUpdatedAt ? new Date(file.fileUpdatedAt).toISOString() : null,
                fileLastRevocationAt: file.fileLastRevocationAt ? new Date(file.fileLastRevocationAt).toISOString() : null,
            }))
            .sort((a, b) => (a.grantId || '').localeCompare(b.grantId || ''));

        const timestamps = files.reduce((acc, file) => {
            const entries = [
                file.grantedAt,
                file.expiresAt,
                file.grantRevokedAt,
                file.grantUpdatedAt,
                file.fileUpdatedAt,
                file.fileLastRevocationAt,
            ];

            entries.forEach((value) => {
                if (!value) {
                    return;
                }
                const date = value instanceof Date ? value : new Date(value);
                if (!Number.isNaN(date.getTime())) {
                    acc.push(date.getTime());
                }
            });

            return acc;
        }, []);

        const lastModifiedDate = timestamps.length > 0
            ? new Date(Math.max(...timestamps))
            : new Date(0);
        const lastModifiedHeader = lastModifiedDate.toUTCString();
        const lastModifiedIso = timestamps.length > 0 ? lastModifiedDate.toISOString() : null;

        const etagSource = JSON.stringify({
            grants: normalizedForEtag,
            total: files.length,
        });
        const etag = crypto.createHash('sha256').update(etagSource).digest('hex');

        const ifNoneMatch = req.headers['if-none-match'];
        if (ifNoneMatch && ifNoneMatch === etag) {
            return res
                .set('ETag', etag)
                .set('Last-Modified', lastModifiedHeader)
                .status(304)
                .end();
        }

        const ifModifiedSinceHeader = req.headers['if-modified-since'];
        if (ifModifiedSinceHeader) {
            const sinceDate = new Date(ifModifiedSinceHeader);
            if (!Number.isNaN(sinceDate.getTime()) && lastModifiedDate.getTime() <= sinceDate.getTime()) {
                return res
                    .set('ETag', etag)
                    .set('Last-Modified', lastModifiedHeader)
                    .status(304)
                    .end();
            }
        }

        const activeFiles = files.filter((file) => (file.status || file.grantStatus) !== 'revoked');
        const revokedCount = files.length - activeFiles.length;

        const duration = Date.now() - startTime;
        const publicKeyHash = fileAccessService.ringService.hashPublicKey(publicKey);
        const maskedPublicKeyHash = maskHashForLogging(publicKeyHash, 'publicKeyHash');
        secureLog(
            'AnonymousList',
            `Listed ${activeFiles.length} active / ${revokedCount} revoked files for publicKeyHash: ${maskedPublicKeyHash} [${duration}ms]`,
            'info',
            { publicKeyHash, activeCount: activeFiles.length, revokedCount }
        );

        return res
            .set('ETag', etag)
            .set('Last-Modified', lastModifiedHeader)
            .json({
                success: true,
                files,
                totalCount: files.length,
                meta: {
                    etag,
                    lastModified: lastModifiedIso,
                    activeCount: activeFiles.length,
                    revokedCount,
                },
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

async function handleAnonymousGrantList(req, res) {
    const startTime = Date.now();

    try {
        const { fileId } = req.params;
        const payload = { ...(req.body || {}), ...(req.query || {}) };
        const ownershipProof = extractOwnershipProof(payload);
        const ringSignature = payload.ringSignature || payload.lsagSignature;
        const timestamp = payload.timestamp || payload.requestTimestamp;
        const nonce = payload.nonce;

        if (!ringSignature || !timestamp || !nonce) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: ringSignature, timestamp, nonce',
            });
        }

        const grants = await accessManagementService.listGrants({
            fileId,
            timestamp: Number(timestamp),
            nonce,
            ringSignature,
            ownershipProof,
        });

        const duration = Date.now() - startTime;
        secureLog('AnonymousGrantsList', `Listed ${grants.length} grants for file ${fileId} [${duration}ms]`, 'info', {
            fileId,
        });

        return res.json({
            success: true,
            fileId,
            total: grants.length,
            grants,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        secureLog('AnonymousGrantsList', `Failed to list grants for file ${req.params.fileId}: ${error.message} [${duration}ms]`, 'error', {
            fileId: req.params.fileId,
        });

        return res.status(400).json({
            success: false,
            error: error.message || 'Unable to list grants',
        });
    }
}

/**
 * GET /api/files/:fileId/anonymous-grants
 * List anonymous grants for owner management
 */
router.get('/:fileId/anonymous-grants', handleAnonymousGrantList);
router.post('/:fileId/anonymous-grants/list', handleAnonymousGrantList);

async function handleAnonymousGrantCreation(req, res) {
    const startTime = Date.now();

    try {
        const { fileId } = req.params;
        const {
            targetPublicKey,
            ringSignature,
            timestamp,
            nonce,
            keyPackageFingerprint,
            expiresAt,
            metadata,
        } = req.body || {};

        const ownershipProof = extractOwnershipProof(req.body);

        if (!targetPublicKey || !ringSignature || !timestamp || !nonce || !ownershipProof) {
            secureLog('AnonymousGrant', `Missing required fields for file ${fileId} from IP: ${req.ip}`, 'warn', { fileId, ip: req.ip });
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }

        const result = await accessManagementService.grantAccess({
            fileId,
            targetPublicKey,
            ringSignature,
            timestamp,
            nonce,
            ownershipProof,
            keyPackageFingerprint,
            expiresAt,
            metadata,
        });

        const recipientHash = fileAccessService.ringService.hashPublicKey(targetPublicKey);
        const maskedRecipientHash = maskHashForLogging(recipientHash, 'publicKeyHash');
        const duration = Date.now() - startTime;
        secureLog('AnonymousGrant', `Grant ${result.operation} for file ${fileId} to ${maskedRecipientHash} [${duration}ms]`, 'info', {
            fileId,
            recipientPublicKeyHash: recipientHash,
            operation: result.operation,
        });

        return res.status(result.operation === 'created' ? 201 : 200).json({
            success: true,
            operation: result.operation,
            grant: result.grant,
        });

    } catch (error) {
        const { fileId } = req.params;
        const duration = Date.now() - startTime;
        secureLog('AnonymousGrant', `Error granting access for file ${fileId}: ${error.message} [${duration}ms]`, 'error', {
            fileId,
            ip: req.ip,
        });

        const message = error instanceof Error ? error.message : 'Internal server error';
        const isClientError = [
            'required',
            'invalid',
            'already been used',
            'too old',
            'ownership',
            'not active',
        ].some((token) => message.toLowerCase().includes(token.toLowerCase()));

        const statusCode = message.includes('not found') ? 404 : isClientError ? 400 : 500;

        return res.status(statusCode).json({
            success: false,
            error: message,
        });
    }
}

router.post('/:fileId/anonymous-grants', handleAnonymousGrantCreation);
router.post('/:fileId/anonymous-grant', handleAnonymousGrantCreation);

/**
 * DELETE /api/files/:fileId/anonymous-grants/:grantId
 * Revoke an existing grant
 */
router.delete('/:fileId/anonymous-grants/:grantId', async (req, res) => {
    const startTime = Date.now();

    try {
        const { fileId, grantId } = req.params;
        const {
            ringSignature,
            timestamp,
            nonce,
            reason,
        } = req.body || {};

        const ownershipProof = extractOwnershipProof(req.body);

        if (!ringSignature || !timestamp || !nonce || !ownershipProof) {
            secureLog('AnonymousRevoke', `Missing required fields for grant ${grantId} on file ${fileId}`, 'warn', { fileId, grantId });
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }

        const result = await accessManagementService.revokeAccess({
            fileId,
            grantId,
            ringSignature,
            timestamp,
            nonce,
            ownershipProof,
            reason,
        });

        const duration = Date.now() - startTime;
        secureLog('AnonymousRevoke', `Revocation ${result.operation} for grant ${grantId} on file ${fileId} [${duration}ms]`, 'info', {
            fileId,
            grantId,
            operation: result.operation,
        });

        return res.json({
            success: true,
            operation: result.operation,
            grant: result.grant,
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        secureLog('AnonymousRevoke', `Error revoking grant ${req.params.grantId} on file ${req.params.fileId}: ${error.message} [${duration}ms]`, 'error', {
            fileId: req.params.fileId,
            grantId: req.params.grantId,
        });

        const message = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = message.toLowerCase().includes('not found') ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            error: message,
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
            validationToken,
            timestamp,
            nonce,
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

        if (!validationToken) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: validationToken'
            });
        }

        if (!escrowedIdentity) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: escrowedIdentity'
            });
        }

        if (!timestamp || !nonce) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: timestamp, nonce'
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

        const metadataSource = JSON.stringify({
            fileName,
            fileSize,
            chunkCount,
        });
        const recomputedMetadataHash = crypto.createHash('sha256').update(metadataSource).digest('hex');
        if (recomputedMetadataHash !== metadataHash) {
            return res.status(400).json({
                success: false,
                error: 'metadataHash does not match provided payload',
            });
        }

        let normalizedToken;
        try {
            normalizedToken = typeof validationToken === 'string'
                ? JSON.parse(validationToken)
                : validationToken;
        } catch (parseError) {
            console.error('[Client Chunked Upload] Failed to parse validationToken', parseError);
            return res.status(400).json({
                success: false,
                error: 'Invalid validationToken format',
            });
        }

        // ====================================================================
        // 2. VERIFY VALIDATION TOKEN & NONCE
        // ====================================================================
        try {
            await verifyValidationToken({
                token: normalizedToken,
                metadataHash,
                ownershipPublicKey,
                nonce,
                adjudicatorPublicKey: ADJUDICATOR_PUBLIC_KEY,
            });
            await ensureNonceUnique({ prisma: prismaInstance, nonce });
        } catch (tokenError) {
            console.error('[Client Chunked Upload] ValidationToken verification failed:', tokenError);
            return res.status(403).json({
                success: false,
                error: tokenError instanceof Error ? tokenError.message : 'ValidationToken verification failed',
            });
        }

        // ====================================================================
        // 3. VERIFY OWNERSHIP PROOFS
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
        // 4. SAVE FILE RECORD
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
                    validationTokenId: normalizedToken.tokenId,
                }),
                validationToken: {
                    create: {
                        tokenId: normalizedToken.tokenId,
                        fileMetadataHash: normalizedToken.fileMetadataHash,
                        userPublicKeyHash: normalizedToken.userPublicKeyHash,
                        issuedAt: new Date(Number(normalizedToken.issuedAt)),
                        expiresAt: new Date(Number(normalizedToken.expiresAt)),
                        signature: normalizedToken.signature,
                        adjudicatorPublicKey: normalizedToken.adjudicatorPublicKey,
                    },
                },
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
                    validationTokenId: normalizedToken.tokenId,
                    validationTokenExpiresAt: new Date(Number(normalizedToken.expiresAt)).toISOString(),
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

        if (error?.code === 'P2002' && Array.isArray(error?.meta?.target) && error.meta.target.includes('ValidationToken_signature_key')) {
            return res.status(409).json({
                success: false,
                error: 'ValidationToken already used',
            });
        }

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
