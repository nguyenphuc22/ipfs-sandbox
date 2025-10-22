/**
 * Data Migration Script: Populate uploaderPublicKeyHash for existing File records
 *
 * This script computes SHA256(User.publicKey) and populates the uploaderPublicKeyHash
 * field for all existing File records that have an uploaderId.
 *
 * Run with: node backend/prisma/data-migration-uploader-hash.js
 */

const { PrismaClient } = require('../src/config/prismaClient');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function migrateUploaderPublicKeyHash() {
  console.log('[Data Migration] Starting uploaderPublicKeyHash population...');

  try {
    // Get all files with uploaderId
    const filesWithUploader = await prisma.file.findMany({
      where: {
        uploaderId: { not: null },
        uploaderPublicKeyHash: null, // Only migrate files without hash
      },
      include: {
        uploader: true,
      },
    });

    console.log(`[Data Migration] Found ${filesWithUploader.length} files to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const file of filesWithUploader) {
      if (!file.uploader || !file.uploader.publicKey) {
        console.warn(`[Data Migration] Skipping file ${file.id} - uploader has no publicKey`);
        skippedCount++;
        continue;
      }

      // Compute SHA256 hash of the publicKey
      const uploaderPublicKeyHash = crypto
        .createHash('sha256')
        .update(file.uploader.publicKey)
        .digest('hex');

      // Update the file record
      await prisma.file.update({
        where: { id: file.id },
        data: { uploaderPublicKeyHash },
      });

      migratedCount++;
      console.log(`[Data Migration] ✅ File ${file.id} - uploaderPublicKeyHash: ${uploaderPublicKeyHash.substring(0, 16)}...`);
    }

    console.log('\n[Data Migration] Migration complete!');
    console.log(`  ✅ Migrated: ${migratedCount} files`);
    console.log(`  ⚠️  Skipped: ${skippedCount} files`);

  } catch (error) {
    console.error('[Data Migration] Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateUploaderPublicKeyHash()
  .then(() => {
    console.log('[Data Migration] Success!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[Data Migration] Failed:', error);
    process.exit(1);
  });
