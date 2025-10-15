const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Path to the aot-records.json file
const AOT_RECORDS_PATH = path.join(__dirname, '../data/aot-records.json');

async function syncAotStorageToDb() {
  console.log('Starting sync from aotStorage to database...');

  try {
    // Read the aot-records.json file
    if (!fs.existsSync(AOT_RECORDS_PATH)) {
      console.log('aot-records.json file does not exist. Nothing to sync.');
      return;
    }

    const rawData = fs.readFileSync(AOT_RECORDS_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    if (!data.users || !Array.isArray(data.users)) {
      console.log('No users found in aot-records.json or users is not an array. Nothing to sync.');
      return;
    }

    console.log(`Found ${data.users.length} users in aot-records.json`);

    // Process each user and sync to database
    for (const userData of data.users) {
      // Skip users without a publicKey since it's now required
      if (!userData.publicKey) {
        console.log(`Skipping user ${userData.userId} - no public key`);
        continue;
      }

      // Sync user to database
      try {
        const existingUser = await prisma.user.findUnique({
          where: { publicKey: userData.publicKey }
        });

        if (existingUser) {
          // Update existing user if needed
          await prisma.user.update({
            where: { publicKey: userData.publicKey },
            data: {
              displayLabel: userData.displayName || userData.identifier || null,
              updatedAt: new Date()
            }
          });
          console.log(`Updated user with publicKey: ${userData.publicKey.substring(0, 10)}...`);
        } else {
          // Create new user
          await prisma.user.create({
            data: {
              id: userData.userId,
              publicKey: userData.publicKey,
              displayLabel: userData.displayName || userData.identifier || null,
              role: 'user',
              createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
              updatedAt: new Date()
            }
          });
          console.log(`Created user with publicKey: ${userData.publicKey.substring(0, 10)}...`);
        }
      } catch (error) {
        console.error(`Error processing user with publicKey ${userData.publicKey}:`, error.message);
      }
    }

    console.log('Sync completed successfully!');
  } catch (error) {
    console.error('Error during sync:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the sync if this file is executed directly
if (require.main === module) {
  syncAotStorageToDb()
    .then(() => {
      console.log('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { syncAotStorageToDb };