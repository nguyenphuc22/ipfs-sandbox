import { Router } from 'express';
import { investigationService } from '../services/InvestigationService';

const router = Router();

router.post('/decrypt-escrow', async (req, res) => {
  try {
    const { fileId, escrowedIdentity, investigationReason, adminApproval, legalAuthorization } = req.body ?? {};

    if (!fileId || !escrowedIdentity || !investigationReason || !adminApproval || !legalAuthorization) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const report = await investigationService.investigate({
      fileId,
      escrowedIdentity,
      investigationReason,
      adminApproval,
      legalAuthorization,
    });

    return res.json({ success: true, report });
  } catch (error) {
    console.error('[Adjudicator] Investigation error', error);
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Investigation failed',
    });
  }
});

export default router;
