#!/usr/bin/env node

/**
 * Sync users from aot-records.json to Prisma database
 * This ensures both storage systems are in sync
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../generated/prismaClient');

const prisma = new PrismaClient();

async function syncUsers() {
    try {
        // Read JSON storage
        const jsonPath = path.join(__dirname, '../data/aot-records.json');
        if (!fs.existsSync(jsonPath)) {
            console.log('[Sync] No aot-records.json found, skipping sync');
            return;
        }

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const users = data.users || [];

        console.log(`[Sync] Found ${users.length} users in JSON storage`);

        let synced = 0;
        let skipped = 0;

        for (const user of users) {
            try {
                // Check if user already exists in database
                const existing = await prisma.user.findUnique({
                    where: { publicKey: user.publicKey }
                });

                if (existing) {
                    skipped++;
                    continue;
                }

                // Create user in database
                await prisma.user.create({
                    data: {
                        publicKey: user.publicKey,
                        displayLabel: user.displayName,
                        role: 'user',
                    }
                });

                synced++;
                console.log(`[Sync] ✓ Synced user: ${user.displayName} (${user.publicKey.slice(0, 16)}...)`);
            } catch (error) {
                console.error(`[Sync] Failed to sync user ${user.publicKey}:`, error.message);
            }
        }

        console.log(`[Sync] Complete: ${synced} synced, ${skipped} already existed`);
    } catch (error) {
        console.error('[Sync] Error syncing users:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

syncUsers();
