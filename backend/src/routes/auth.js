const express = require('express');
const {
    registerUser,
    getUserByIdentifier,
    listUsers,
    getRingContext,
    setAdjudicatorPublicKey,
    getAdjudicatorPublicKey,
} = require('../utils/aotStorage');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Auth API is ready',
        availableEndpoints: ['/register', '/login', '/logout', '/context', '/users'],
    });
});

router.get('/context', (req, res) => {
    try {
        const context = getRingContext();
        res.json({ success: true, context });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/users', (req, res) => {
    try {
        const users = listUsers();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/register', (req, res) => {
    try {
        const { identifier, displayName, publicKey, escrowedIdentity } = req.body || {};

        if (!identifier || !publicKey) {
            return res.status(400).json({
                success: false,
                error: 'identifier and publicKey are required to register',
            });
        }

        const record = registerUser({
            identifier: String(identifier).trim(),
            displayName: displayName ? String(displayName).trim() : undefined,
            publicKey: String(publicKey).trim(),
            escrowedIdentity: escrowedIdentity ? String(escrowedIdentity) : null,
        });

        const context = getRingContext();
        res.status(201).json({ success: true, user: record, context });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to register user';
        const statusCode = message.includes('already registered') ? 409 : 500;
        res.status(statusCode).json({ success: false, error: message });
    }
});

router.post('/login', (req, res) => {
    try {
        const { identifier, publicKey } = req.body || {};

        if (!identifier) {
            return res.status(400).json({ success: false, error: 'identifier is required' });
        }

        const user = getUserByIdentifier(String(identifier).trim());
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (publicKey && String(publicKey).trim() !== user.publicKey) {
            return res.status(403).json({
                success: false,
                error: 'Public key does not match registered user',
            });
        }

        const context = getRingContext();
        res.json({ success: true, user, context });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logout successful (stateless API)' });
});

router.put('/adjudicator-key', (req, res) => {
    try {
        const { publicKey } = req.body || {};
        if (!publicKey || typeof publicKey !== 'string') {
            return res.status(400).json({ success: false, error: 'publicKey is required' });
        }

        const value = setAdjudicatorPublicKey(publicKey.trim());
        res.json({ success: true, adjudicatorPublicKey: value });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/adjudicator-key', (req, res) => {
    try {
        const key = getAdjudicatorPublicKey();
        res.json({ success: true, adjudicatorPublicKey: key });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
