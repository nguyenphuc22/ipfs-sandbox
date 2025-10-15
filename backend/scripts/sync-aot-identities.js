#!/usr/bin/env node

/**
 * Sync AOT Identities to User Table
 *
 * This script synchronizes identity data from client-side storage (AsyncStorage/aotStorage)
 * to the minimal User table in the backend database.
 *
 * Usage:
 *   node backend/scripts/sync-aot-identities.js [--source=<json-file>]
 *
 * The source can be:
 * - A JSON file exported from AsyncStorage (default: ./aot-identities-export.json)
 * - Direct database sync from existing data
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Parse command line arguments
const args = process.argv.slice(2);
const sourceArg = args.find(arg => arg.startsWith('--source='));
const sourceFile = sourceArg
  ? sourceArg.split('=')[1]
  : path.join(__dirname, '..', 'aot-identities-export.json');

/**
 * Load identities from JSON export file
 * Expected format:
 * [
 *   {
 *     "publicKey": "03abc...",
 *     "displayName": "Alice",
 *     "createdAt": "2024-10-14T..."
 *   },
 *   ...
 * ]
 */
function loadIdentitiesFromFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`📂 Source file not found: ${filePath}`);
      console.log(`📝 Using empty identity list (will sync existing database users only)`);
      return [];
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const identities = JSON.parse(fileContent);

    console.log(`📂 Loaded ${identities.length} identities from ${filePath}`);
    return identities;
  } catch (error) {
    console.error(`❌ Error reading identity file: ${error.message}`);
    return [];
  }
}

/**
 * Sync a single identity to the User table
 */
async function syncIdentity(identity) {
  const { publicKey, displayName, createdAt } = identity;

  if (!publicKey) {
    console.warn(`⚠️  Skipping identity with missing publicKey`);
    return { success: false, reason: 'missing_public_key' };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { publicKey }
    });

    if (existingUser) {
      // Update display name if provided and different
      if (displayName && existingUser.displayLabel !== displayName) {
        await prisma.user.update({
          where: { publicKey },
          data: {
            displayLabel: displayName,
            updatedAt: new Date()
          }
        });
        console.log(`✅ Updated user: ${publicKey.substring(0, 16)}... (displayName: ${displayName})`);
        return { success: true, action: 'updated' };
      } else {
        console.log(`ℹ️  User already exists: ${publicKey.substring(0, 16)}...`);
        return { success: true, action: 'skipped' };
      }
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          publicKey,
          displayLabel: displayName || null,
          role: 'user',
          createdAt: createdAt ? new Date(createdAt) : new Date(),
          updatedAt: new Date()
        }
      });
      console.log(`✨ Created new user: ${publicKey.substring(0, 16)}... (displayName: ${displayName || 'N/A'})`);
      return { success: true, action: 'created' };
    }
  } catch (error) {
    console.error(`❌ Error syncing identity ${publicKey.substring(0, 16)}...: ${error.message}`);
    return { success: false, reason: error.message };
  }
}

/**
 * Sync all users from File table (for users who uploaded files but aren't in User table)
 */
async function syncUsersFromFileUploaders() {
  console.log('\n📊 Syncing users from File uploaders...');

  try {
    // Get all unique uploader IDs from File table
    const uploaders = await prisma.file.findMany({
      select: {
        uploaderId: true,
        uploader: {
          select: {
            publicKey: true,
            displayLabel: true
          }
        }
      },
      distinct: ['uploaderId']
    });

    let syncCount = 0;
    for (const fileRecord of uploaders) {
      if (fileRecord.uploader && fileRecord.uploader.publicKey) {
        const result = await syncIdentity({
          publicKey: fileRecord.uploader.publicKey,
          displayName: fileRecord.uploader.displayLabel
        });

        if (result.action === 'created') {
          syncCount++;
        }
      }
    }

    console.log(`✅ Synced ${syncCount} users from File table`);
    return syncCount;
  } catch (error) {
    console.error(`❌ Error syncing from File table: ${error.message}`);
    return 0;
  }
}

/**
 * Main sync function
 */
async function main() {
  console.log('🚀 Starting AOT Identity Sync\n');

  const stats = {
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0
  };

  // 1. Load identities from file
  const identities = loadIdentitiesFromFile(sourceFile);

  // 2. Sync each identity
  console.log('\n📝 Syncing identities from file...');
  for (const identity of identities) {
    const result = await syncIdentity(identity);
    if (result.success) {
      stats[result.action]++;
    } else {
      stats.failed++;
    }
  }

  // 3. Sync users from existing database records (File uploaders)
  const dbSyncCount = await syncUsersFromFileUploaders();
  stats.created += dbSyncCount;

  // 4. Print summary
  console.log('\n📊 Sync Summary:');
  console.log(`   ✨ Created: ${stats.created}`);
  console.log(`   ✅ Updated: ${stats.updated}`);
  console.log(`   ℹ️  Skipped: ${stats.skipped}`);
  console.log(`   ❌ Failed: ${stats.failed}`);
  console.log(`   📈 Total: ${stats.created + stats.updated + stats.skipped + stats.failed}`);

  // 5. Verify final state
  const totalUsers = await prisma.user.count();
  console.log(`\n✅ Total users in database: ${totalUsers}`);

  await prisma.$disconnect();
}

// Run the script
main()
  .then(() => {
    console.log('\n✅ Sync completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  });
