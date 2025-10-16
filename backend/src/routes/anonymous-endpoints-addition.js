
// ============================================================================
// ANONYMOUS DOWNLOAD FLOW - NEW ENDPOINTS
// ============================================================================

const express = require('express');
const { FileAccessService } = require('../services/FileAccessService');
const { RingSignatureService } = require('../services/RingSignatureService');
const { secureLog, maskHashForLogging } = require('../utils/monitoring');

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

module.exports = { router, init };

