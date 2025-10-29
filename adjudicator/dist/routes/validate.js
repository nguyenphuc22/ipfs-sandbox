"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ValidationService_1 = require("../services/ValidationService");
const router = (0, express_1.Router)();
router.post('/validate-upload', async (req, res) => {
    try {
        const { userPublicKey, fileMetadataHash, timestamp, nonce } = req.body ?? {};
        if (!userPublicKey || !fileMetadataHash || !timestamp || !nonce) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: userPublicKey, fileMetadataHash, timestamp, nonce',
            });
        }
        const token = await ValidationService_1.validationService.issueValidationToken({
            userPublicKey,
            fileMetadataHash,
            timestamp,
            nonce,
        });
        return res.json({ success: true, validationToken: token });
    }
    catch (error) {
        console.error('[Adjudicator] Validation error', error);
        return res.status(403).json({
            success: false,
            error: error instanceof Error ? error.message : 'Validation failed',
        });
    }
});
exports.default = router;
