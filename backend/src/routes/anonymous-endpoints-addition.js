
// ============================================================================
// ANONYMOUS DOWNLOAD FLOW - NEW ENDPOINTS
// ============================================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Helper: Hash public key using SHA-256
 */
function hashPublicKey(publicKey) {
    return crypto.createHash('sha256').update(publicKey).digest('hex');
}

/**
 * Helper: Verify ring signature (simplified for demo)
 */
async function verifyAnonymousRingSignature({ publicKey, signature, message }) {
    // For demo: Basic verification
    // In production: Implement full ring signature verification
    try {
        const allUsers = await prisma.user.findMany({
            select: { publicKey: true },
            where: { publicKey: { not: null } }
        });

        const ringPublicKeys = allUsers.map(u => u.publicKey).filter(k => k !== null);

        if (!ringPublicKeys.includes(publicKey)) {
            console.warn('[Anonymous] Public key not in ring');
            return false;
        }

        // For demo: Accept if publicKey is in ring
        console.log('[Anonymous] Ring signature verification passed (demo mode)');
        return true;
    } catch (error) {
        console.error('[Anonymous] Verification error:', error);
        return false;
    }
}

/**
 * POST /files/anonymous-list
 * List files accessible by public key (anonymous)
 */
router.post('/files/anonymous-list', async (req, res) => {
    try {
        const { publicKey, ringSignature, timestamp, nonce } = req.body;

        // Validate input
        if (!publicKey || !ringSignature || !timestamp || !nonce) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: publicKey, ringSignature, timestamp, nonce'
            });
        }

        // Verify timestamp freshness (5 minutes max age)
        const now = Date.now();
        const age = now - timestamp;
        if (age < 0 || age > 5 * 60 * 1000) {
            return res.status(403).json({
                success: false,
                error: 'Request timestamp is invalid or too old'
            });
        }

        // Verify ring signature
        const message = `list-files:${timestamp}:${nonce}`;
        const isValid = await verifyAnonymousRingSignature({
            publicKey,
            signature: ringSignature,
            message
        });

        if (!isValid) {
            return res.status(403).json({
                success: false,
                error: 'Invalid ring signature'
            });
        }

        // Hash public key
        const publicKeyHash = hashPublicKey(publicKey);

        // Query access grants by publicKeyHash (NOT userId)
        const accessGrants = await prisma.anonymousFileAccess.findMany({
            where: {
                accessorPublicKeyHash: publicKeyHash,
                status: 'active',
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gte: new Date() } }
                ]
            },
            include: {
                file: {
                    select: {
                        id: true,
                        fileName: true,
                        totalSize: true,
                        chunkCount: true,
                        mimeType: true,
                        ownershipPublicKey: true,
                        status: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: {
                grantedAt: 'desc'
            }
        });

        // Transform response (no userId)
        const files = accessGrants.map(grant => ({
            fileId: grant.file.id,
            fileName: grant.file.fileName,
            fileSize: grant.file.totalSize,
            chunkCount: grant.file.chunkCount,
            mimeType: grant.file.mimeType,
            ownerPublicKey: grant.file.ownershipPublicKey,
            ownershipStatus: grant.file.status,
            grantedAt: grant.grantedAt,
            expiresAt: grant.expiresAt,
            accessCount: grant.accessCount,
            uploadedAt: grant.file.createdAt,
        }));

        // Log audit (no userId)
        await prisma.anonymousAuditLog.create({
            data: {
                eventType: 'file_list_query',
                publicKeyHash: publicKeyHash,
                ringSignature: ringSignature,
                timestamp: new Date(),
                metadata: JSON.stringify({
                    fileCount: files.length,
                    queryTimestamp: timestamp,
                    nonce: nonce,
                })
            }
        });

        console.log(`[Anonymous List] Found ${files.length} files for publicKeyHash: ${publicKeyHash.substring(0, 16)}...`);

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
 * POST /files/:fileId/anonymous-access
 * Negotiate access to specific file (anonymous)
 */
router.post('/files/:fileId/anonymous-access', async (req, res) => {
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

        // Verify timestamp
        const now = Date.now();
        const age = now - timestamp;
        if (age < 0 || age > 5 * 60 * 1000) {
            return res.status(403).json({
                success: false,
                error: 'Request timestamp is invalid or too old'
            });
        }

        // Verify ring signature
        const message = `access:${fileId}:${timestamp}:${nonce}`;
        const isValid = await verifyAnonymousRingSignature({
            publicKey,
            signature: ringSignature,
            message
        });

        if (!isValid) {
            return res.status(403).json({
                success: false,
                error: 'Invalid ring signature'
            });
        }

        // Hash public key
        const publicKeyHash = hashPublicKey(publicKey);

        // Verify access grant by publicKeyHash
        const accessGrant = await prisma.anonymousFileAccess.findUnique({
            where: {
                accessorPublicKeyHash_fileId: {
                    accessorPublicKeyHash: publicKeyHash,
                    fileId: fileId,
                }
            },
            include: {
                file: {
                    include: {
                        chunks: {
                            orderBy: { chunkIndex: 'asc' }
                        }
                    }
                }
            }
        });

        if (!accessGrant || accessGrant.status !== 'active') {
            return res.status(403).json({
                success: false,
                error: 'Access denied or revoked'
            });
        }

        // Check expiration
        if (accessGrant.expiresAt && accessGrant.expiresAt < new Date()) {
            return res.status(403).json({
                success: false,
                error: 'Access expired'
            });
        }

        // Build chunk manifest
        const chunkManifest = accessGrant.file.chunks.map(chunk => ({
            index: chunk.chunkIndex,
            cid: chunk.ipfsCid,
            size: chunk.size,
            hash: chunk.chunkHash,
        }));

        // Update access stats
        await prisma.anonymousFileAccess.update({
            where: { id: accessGrant.id },
            data: {
                lastAccessAt: new Date(),
                lastAccessProof: ringSignature,
                accessCount: { increment: 1 },
            }
        });

        // Log audit
        await prisma.anonymousAuditLog.create({
            data: {
                eventType: 'access_negotiation',
                fileId: fileId,
                publicKeyHash: publicKeyHash,
                ringSignature: ringSignature,
                timestamp: new Date(),
                metadata: JSON.stringify({
                    chunkCount: chunkManifest.length,
                    fileSize: accessGrant.file.totalSize,
                    accessCount: accessGrant.accessCount + 1,
                })
            }
        });

        console.log(`[Access Negotiation] Granted access to file ${fileId}`);

        // Return manifest
        return res.json({
            success: true,
            file: {
                id: accessGrant.file.id,
                name: accessGrant.file.fileName,
                size: accessGrant.file.totalSize,
                chunkCount: accessGrant.file.chunkCount,
                mimeType: accessGrant.file.mimeType,
            },
            chunkManifest: chunkManifest,
            ownershipPolicy: {
                publicKey: accessGrant.file.ownershipPublicKey,
                status: accessGrant.file.status,
                revoked: accessGrant.file.status === 'revoked',
            },
            grantContext: {
                grantedAt: accessGrant.grantedAt,
                expiresAt: accessGrant.expiresAt,
                accessCount: accessGrant.accessCount + 1,
            }
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
 * POST /files/:fileId/anonymous-integrity-alert
 * Report chunk integrity issue (anonymous)
 */
router.post('/files/:fileId/anonymous-integrity-alert', async (req, res) => {
    try {
        const { fileId } = req.params;
        const {
            publicKey, ringSignature,
            chunkIndex, expectedHash, actualHash,
            retryCount, timestamp, nonce
        } = req.body;

        // Verify timestamp
        const now = Date.now();
        const age = now - timestamp;
        if (age < 0 || age > 5 * 60 * 1000) {
            return res.status(403).json({
                success: false,
                error: 'Request timestamp is invalid or too old'
            });
        }

        // Verify ring signature
        const message = `integrity-alert:${fileId}:${chunkIndex}:${timestamp}:${nonce}`;
        const isValid = await verifyAnonymousRingSignature({
            publicKey,
            signature: ringSignature,
            message
        });

        if (!isValid) {
            return res.status(403).json({
                success: false,
                error: 'Invalid ring signature'
            });
        }

        // Hash public key
        const publicKeyHash = hashPublicKey(publicKey);

        // Create integrity alert
        await prisma.integrityAlert.create({
            data: {
                fileId: fileId,
                chunkIndex: chunkIndex,
                expectedHash: expectedHash,
                actualHash: actualHash,
                reportedByPublicKeyHash: publicKeyHash,
                reportedAt: new Date(),
                resolved: false,
            }
        });

        // Log audit
        await prisma.anonymousAuditLog.create({
            data: {
                eventType: 'integrity_alert',
                fileId: fileId,
                publicKeyHash: publicKeyHash,
                ringSignature: ringSignature,
                timestamp: new Date(),
                metadata: JSON.stringify({
                    chunkIndex,
                    expectedHash: expectedHash.substring(0, 16) + '...',
                    actualHash: actualHash ? actualHash.substring(0, 16) + '...' : null,
                    retryCount,
                })
            }
        });

        console.log(`[Integrity Alert] Chunk ${chunkIndex} mismatch for file ${fileId}`);

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

