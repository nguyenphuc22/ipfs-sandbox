
// ============================================================================
// ANONYMOUS DOWNLOAD FLOW - NEW ENDPOINTS
// ============================================================================

const express = require('express');
const { FileAccessService } = require('../services/FileAccessService');
const { RingSignatureService } = require('../services/RingSignatureService');

// Get Prisma instance from shared context (passed from server.js)
let prisma;
let fileAccessService;

// Function to initialize with shared Prisma instance
function init(prismaClient) {
    prisma = prismaClient;
    const ringSignatureService = new RingSignatureService(prisma);
    fileAccessService = new FileAccessService(ringSignatureService, prisma);
    return router;
}

const router = express.Router();

/**
 * POST /api/files/anonymous-list
 * List files accessible by public key (anonymous)
 */
router.post('/anonymous-list', async (req, res) => {
    try {
        const { publicKey, ringSignature, timestamp, nonce } = req.body;

        // Validate input
        if (!publicKey || !ringSignature || !timestamp || !nonce) {
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

        return res.json({
            success: true,
            files: files,
            totalCount: files.length,
        });

    } catch (error) {
        console.error('[Anonymous List] Error:', error);
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
    try {
        const { fileId } = req.params;
        const { publicKey, ringSignature, timestamp, nonce } = req.body;

        // Validate input
        if (!publicKey || !ringSignature || !timestamp || !nonce) {
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

        return res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('[Anonymous Access] Error:', error);
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
    try {
        const { fileId } = req.params;
        const {
            publicKey, ringSignature,
            chunkIndex, expectedHash, actualHash,
            retryCount, timestamp, nonce
        } = req.body;

        // Validate input
        if (!publicKey || !ringSignature || !timestamp || !nonce || chunkIndex === undefined || expectedHash === undefined) {
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

        return res.json({
            success: true,
            message: 'Integrity alert recorded',
            recommendation: retryCount < 3 ? 'retry' : 'contact_owner'
        });

    } catch (error) {
        console.error('[Integrity Alert] Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = { router, init };

