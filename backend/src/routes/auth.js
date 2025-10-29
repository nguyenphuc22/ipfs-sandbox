const express = require('express');
const {
    registerUser,
    getUserByIdentifier,
    getUserByPublicKey,
    listUsers,
    getRingContext,
    setAdjudicatorPublicKey,
    getAdjudicatorPublicKey,
} = require('../utils/aotStorage');
const prisma = require('../config/database');

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

router.post('/register', async (req, res) => {
    try {
        const { displayName, publicKey, escrowedIdentity, identifier } = req.body || {};

        if (!displayName || !publicKey) {
            return res.status(400).json({
                success: false,
                error: 'displayName and publicKey are required to register',
            });
        }

        // Register in JSON storage (legacy)
        const record = registerUser({
            identifier: identifier ? String(identifier).trim() : undefined,
            displayName: String(displayName).trim(),
            publicKey: String(publicKey).trim(),
            escrowedIdentity: escrowedIdentity ? String(escrowedIdentity) : null,
        });

        // Also register in Prisma database for Adjudicator
        try {
            await prisma.user.create({
                data: {
                    publicKey: String(publicKey).trim(),
                    displayLabel: String(displayName).trim(),
                    role: 'user',
                },
            });
        } catch (dbError) {
            // If user already exists in DB, that's okay - continue
            if (!dbError.message || !dbError.message.includes('Unique constraint')) {
                console.warn('[Auth] Failed to save user to database:', dbError.message);
            }
        }

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
        const { publicKey, displayName, identifier } = req.body || {};

        if (!publicKey && !identifier) {
            return res.status(400).json({ success: false, error: 'publicKey is required' });
        }

        const trimmedKey = publicKey ? String(publicKey).trim() : null;
        const fallbackIdentifier = identifier ? String(identifier).trim() : null;
        const user = trimmedKey
            ? getUserByPublicKey(trimmedKey)
            : fallbackIdentifier
                ? getUserByIdentifier(fallbackIdentifier)
                : null;
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (trimmedKey && trimmedKey !== user.publicKey) {
            return res.status(403).json({
                success: false,
                error: 'Public key does not match registered user',
            });
        }

        if (displayName && String(displayName).trim() !== user.displayName) {
            console.warn('[Auth] Display name mismatch during login attempt');
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
