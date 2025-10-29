const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const prisma = require('../config/database');
const { secureLog } = require('../utils/monitoring');

const ADJUDICATOR_SERVICE_URL = process.env.ADJUDICATOR_SERVICE_URL || 'http://localhost:4000';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || null;
const ADMIN_HMAC_SECRET = process.env.ADMIN_HMAC_SECRET || null;

function buildAdminApprovalPayload({
    adminUser,
    fileId,
    investigationReason,
    legalAuthorization,
}) {
    const normalizedAdminUser = (adminUser || '').trim() || 'admin-console';
    const normalizedReason = (investigationReason || '').trim();
    const normalizedLegalAuth = (legalAuthorization || '').trim();
    const signedAt = new Date().toISOString();

    const payload = {
        version: 1,
        adminUser: normalizedAdminUser,
        fileId,
        investigationReason: normalizedReason,
        legalAuthorization: normalizedLegalAuth,
        signedAt,
    };

    if (ADMIN_HMAC_SECRET) {
        const canonical = JSON.stringify(payload);
        const signature = crypto
            .createHmac('sha256', ADMIN_HMAC_SECRET)
            .update(canonical)
            .digest('hex');
        return JSON.stringify({ ...payload, signature });
    }

    return JSON.stringify(payload);
}

function verifySignature(req) {
    if (!ADMIN_HMAC_SECRET) {
        return true;
    }

    const providedSignature = req.headers['x-admin-signature'];
    if (!providedSignature) {
        return false;
    }

    const payload = JSON.stringify(req.body || {});
    const expected = crypto
        .createHmac('sha256', ADMIN_HMAC_SECRET)
        .update(payload)
        .digest('hex');

    const expectedBuffer = Buffer.from(expected, 'hex');
    const providedBuffer = Buffer.from(providedSignature, 'hex');

    if (expectedBuffer.length !== providedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

function requireHmac(req, res) {
    if (!verifySignature(req)) {
        return res.status(401).json({ success: false, error: 'Invalid admin signature' });
    }
    return null;
}

function ensureAdminAuth(req, res, next) {
    if (!ADMIN_API_KEY) {
        return next();
    }

    const providedKey = req.headers['x-admin-key'];
    if (providedKey !== ADMIN_API_KEY) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    return next();
}

router.post('/investigate', ensureAdminAuth, async (req, res) => {
    const signatureError = requireHmac(req, res);
    if (signatureError) {
        return signatureError;
    }

    const { fileId, reason, legalAuthorization } = req.body || {};
    const adminUser = req.headers['x-admin-user'] || 'admin-console';

    if (!fileId || !reason || !legalAuthorization) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: fileId, reason, legalAuthorization',
        });
    }

    try {
        const file = await prisma.file.findUnique({
            where: { id: fileId },
            include: {
                validationToken: true,
            },
        });

        if (!file) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        if (!file.escrowedIdentity) {
            return res.status(400).json({ success: false, error: 'Escrowed identity not available for this file' });
        }

        const adminApproval = buildAdminApprovalPayload({
            adminUser,
            fileId,
            investigationReason: reason,
            legalAuthorization,
        });

        const adjudicatorResponse = await fetch(`${ADJUDICATOR_SERVICE_URL}/api/decrypt-escrow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileId,
                escrowedIdentity: file.escrowedIdentity,
                investigationReason: reason,
                adminApproval,
                legalAuthorization,
            }),
        });

        const adjudicatorJson = await adjudicatorResponse.json();

        if (!adjudicatorResponse.ok || !adjudicatorJson.success) {
            const errorMessage = adjudicatorJson?.error || `Adjudicator responded with status ${adjudicatorResponse.status}`;
            secureLog('AdminInvestigate', `Adjudicator rejection for file ${fileId}: ${errorMessage}`, 'warn');
            return res.status(400).json({ success: false, error: errorMessage });
        }

        secureLog('AdminInvestigate', `Investigation completed for file ${fileId}`, 'info', {
            fileId,
            investigationId: adjudicatorJson.report?.legalCompliance?.investigationId,
        });

        return res.json({ success: true, report: adjudicatorJson.report, validationToken: file.validationToken });
    } catch (error) {
        console.error('[Admin Investigate] Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/ban', ensureAdminAuth, async (req, res) => {
    const signatureError = requireHmac(req, res);
    if (signatureError) {
        return signatureError;
    }

    const { publicKey, reason } = req.body || {};
    const adminUser = req.headers['x-admin-user'] || 'admin-console';

    if (!publicKey || !reason) {
        return res.status(400).json({ success: false, error: 'Missing required fields: publicKey, reason' });
    }

    try {
        const record = await prisma.bannedUser.upsert({
            where: { publicKey },
            update: { reason, bannedByAdmin: adminUser, bannedAt: new Date() },
            create: { publicKey, reason, bannedByAdmin: adminUser },
        });

        secureLog('AdminBan', `Public key ${publicKey.substring(0, 12)}… banned by ${adminUser}`, 'warn', {
            publicKey,
            adminUser,
        });

        return res.json({ success: true, bannedUser: record });
    } catch (error) {
        console.error('[Admin Ban] Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/ban/:publicKey', ensureAdminAuth, async (req, res) => {
    const signatureError = requireHmac(req, res);
    if (signatureError) {
        return signatureError;
    }

    const { publicKey } = req.params;

    if (!publicKey) {
        return res.status(400).json({ success: false, error: 'publicKey is required' });
    }

    try {
        await prisma.bannedUser.delete({ where: { publicKey } });
        secureLog('AdminBan', `Public key ${publicKey.substring(0, 12)}… unbanned`, 'info');
        return res.json({ success: true });
    } catch (error) {
        if (error?.code === 'P2025') {
            return res.status(404).json({ success: false, error: 'Public key not found in banned list' });
        }
        console.error('[Admin Ban Delete] Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/files/:fileId/flag', ensureAdminAuth, async (req, res) => {
    const signatureError = requireHmac(req, res);
    if (signatureError) {
        return signatureError;
    }

    const { fileId } = req.params;
    const { reason, severity = 'medium' } = req.body || {};
    const adminUser = req.headers['x-admin-user'] || 'admin-console';

    if (!fileId || !reason) {
        return res.status(400).json({ success: false, error: 'Missing required fields: fileId, reason' });
    }

    try {
        await prisma.anonymousAuditLog.create({
            data: {
                eventType: 'admin_flag',
                fileId,
                metadata: JSON.stringify({ reason, severity, adminUser }),
            },
        });

        secureLog('AdminFlag', `File ${fileId} flagged by ${adminUser}`, 'warn', {
            fileId,
            adminUser,
            severity,
        });

        return res.json({ success: true });
    } catch (error) {
        console.error('[Admin Flag] Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
