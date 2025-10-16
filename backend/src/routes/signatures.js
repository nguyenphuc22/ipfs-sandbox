const express = require('express');
const {
    createLsagRingSignature,
    verifyLsagRingSignature,
    derivePublicKeyFromPrivateKey,
} = require('../utils/ringSignature');
const { getRingContext } = require('../utils/aotStorage');

const router = express.Router();

router.get('/', (req, res) => {
    const context = getRingContext();
    res.json({
        success: true,
        message: 'Ring signature API is ready',
        ringMembers: context.ringMemberPublicKeys,
    });
});

router.get('/ring', (req, res) => {
    res.json({ success: true, context: getRingContext() });
});

router.post('/create', async (req, res) => {
    try {
        const {
            message,
            ringPublicKeys,
            signerPrivateKey,
            signerPublicKey,
            signerIndex,
            useRegisteredRing = false,
        } = req.body || {};

        if (!message) {
            return res.status(400).json({ success: false, error: 'message is required' });
        }
        if (!signerPrivateKey) {
            return res.status(400).json({ success: false, error: 'signerPrivateKey is required' });
        }

        let ring = Array.isArray(ringPublicKeys) ? ringPublicKeys : [];
        if (useRegisteredRing || ring.length === 0) {
            ring = getRingContext().ringMemberPublicKeys;
        }
        if (!Array.isArray(ring) || ring.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'At least two public keys are required to form a ring',
            });
        }

        let resolvedIndex = typeof signerIndex === 'number' ? signerIndex : -1;
        if (resolvedIndex < 0) {
            if (!signerPublicKey) {
                return res.status(400).json({
                    success: false,
                    error: 'signerIndex or signerPublicKey must be provided',
                });
            }
            const normalized = signerPublicKey.trim().toLowerCase().replace(/^0x/, '');
            resolvedIndex = ring
                .map((key) => key.trim().toLowerCase().replace(/^0x/, ''))
                .findIndex((key) => key === normalized);
            if (resolvedIndex === -1) {
                return res.status(400).json({
                    success: false,
                    error: 'signerPublicKey is not part of the provided ring',
                });
            }
        }

        const signature = await createLsagRingSignature({
            message,
            ringPublicKeys: ring,
            signerIndex: resolvedIndex,
            signerPrivateKey,
        });

        res.status(201).json({ success: true, signature });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create ring signature';
        res.status(400).json({ success: false, error: message });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const {
            message,
            ringSignature,
            expectedRingPublicKeys,
            useRegisteredRing = false,
        } = req.body || {};

        if (!message || !ringSignature) {
            return res.status(400).json({
                success: false,
                error: 'message and ringSignature are required',
            });
        }

        let expected = Array.isArray(expectedRingPublicKeys) ? expectedRingPublicKeys : [];
        if (useRegisteredRing || expected.length === 0) {
            expected = getRingContext().ringMemberPublicKeys;
        }

        const isValid = await verifyLsagRingSignature({
            message,
            ringSignature,
            expectedRingPublicKeys: expected,
        });

        res.json({ success: isValid, valid: isValid });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to verify ring signature';
        res.status(400).json({ success: false, error: message });
    }
});

router.post('/derive-public-key', async (req, res) => {
    try {
        const { privateKey } = req.body || {};
        if (!privateKey) {
            return res.status(400).json({ success: false, error: 'privateKey is required' });
        }
        const publicKey = await derivePublicKeyFromPrivateKey(privateKey);
        res.json({ success: true, publicKey });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;
