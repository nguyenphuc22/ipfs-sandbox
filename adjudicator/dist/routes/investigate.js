"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InvestigationService_1 = require("../services/InvestigationService");
const router = (0, express_1.Router)();
router.post('/decrypt-escrow', async (req, res) => {
    try {
        const { fileId, escrowedIdentity, investigationReason, adminApproval, legalAuthorization } = req.body ?? {};
        if (!fileId || !escrowedIdentity || !investigationReason || !adminApproval || !legalAuthorization) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }
        const report = await InvestigationService_1.investigationService.investigate({
            fileId,
            escrowedIdentity,
            investigationReason,
            adminApproval,
            legalAuthorization,
        });
        return res.json({ success: true, report });
    }
    catch (error) {
        console.error('[Adjudicator] Investigation error', error);
        return res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Investigation failed',
        });
    }
});
exports.default = router;
