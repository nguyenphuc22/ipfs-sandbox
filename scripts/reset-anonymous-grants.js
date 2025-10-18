#!/usr/bin/env node

/**
 * Reset Anonymous Grant Data
 *
 * Deletes AnonymousFileAccess, AnonymousRevocation, and related audit entries
 * to refresh demo environments.
 *
 * Usage:
 *  node scripts/reset-anonymous-grants.js [--file <fileId>] [--recipient <publicKeyHash>]
 *       [--dry-run] [--yes] [--verbose]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { PrismaClient } = require('@prisma/client');

function loadEnv() {
  const candidatePaths = [
    path.resolve(__dirname, '../backend/.env.local'),
    path.resolve(__dirname, '../backend/.env'),
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env'),
  ];

  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
    }
  }
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const config = {
    fileId: null,
    recipient: null,
    dryRun: false,
    yes: false,
    verbose: false,
  };

  const consumeNext = (index) => {
    if (index + 1 >= args.length) {
      throw new Error(`Missing value after ${args[index]}`);
    }
    return args[index + 1];
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--dry-run' || arg === '-d') {
      config.dryRun = true;
    } else if (arg === '--yes' || arg === '-y') {
      config.yes = true;
    } else if (arg === '--verbose' || arg === '-v') {
      config.verbose = true;
    } else if (arg.startsWith('--file=')) {
      config.fileId = arg.split('=')[1];
    } else if (arg === '--file' || arg === '-f') {
      config.fileId = consumeNext(i);
      i += 1;
    } else if (arg.startsWith('--recipient=')) {
      config.recipient = arg.split('=')[1];
    } else if (arg === '--recipient' || arg === '-r') {
      config.recipient = consumeNext(i);
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (config.fileId) {
    config.fileId = config.fileId.trim();
  }
  if (config.recipient) {
    config.recipient = config.recipient.trim().toLowerCase();
  }

  return config;
}

function createWhereClause(config) {
  const where = {};
  if (config.fileId) {
    where.fileId = config.fileId;
  }
  if (config.recipient) {
    where.accessorPublicKeyHash = config.recipient;
  }
  return where;
}

function createAuditWhere(config) {
  const where = {};
  if (config.fileId) {
    where.fileId = config.fileId;
  }
  if (config.recipient) {
    // Anonymous audit log stores publicKeyHash under publicKeyHash field
    where.publicKeyHash = config.recipient;
  }
  return where;
}

function formatCount(label, count) {
  return `${label}: ${count}`;
}

async function promptConfirmation(summary) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const question = `${summary}\nType "YES" to confirm: `;

  const answer = await new Promise((resolve) => {
    rl.question(question, (input) => {
      rl.close();
      resolve(input.trim());
    });
  });

  return answer.toLowerCase() === 'yes';
}

async function main() {
  loadEnv();
  const config = parseArgs(process.argv);
  const prisma = new PrismaClient();

  const whereClause = createWhereClause(config);
  const auditWhere = createAuditWhere(config);

  try {
    const [grantCount, revocationCount, auditCount, sharingRequestCount] = await Promise.all([
      prisma.anonymousFileAccess.count({ where: whereClause }),
      prisma.anonymousRevocation.count({ where: whereClause }),
      prisma.anonymousAuditLog.count({ where: {
        AND: [
          auditWhere,
          { eventType: { in: ['grant_issued', 'grant_updated', 'grant_revoked', 'file_list_query'] } },
        ],
      } }),
      prisma.anonymousSharingRequest.count({ where: whereClause }),
    ]);

    if (config.verbose) {
      console.log('[reset-anonymous-grants] Filters:', JSON.stringify({ whereClause, auditWhere }, null, 2));
    }

    if (grantCount === 0 && revocationCount === 0 && auditCount === 0 && sharingRequestCount === 0) {
      console.log('No anonymous grant records matched the provided filters. Nothing to reset.');
      return;
    }

    const summaryLines = [
      'The following records will be deleted:',
      formatCount('• AnonymousFileAccess', grantCount),
      formatCount('• AnonymousRevocation', revocationCount),
      formatCount('• AnonymousAuditLog (grant-related)', auditCount),
      formatCount('• AnonymousSharingRequest', sharingRequestCount),
    ];

    const summaryText = summaryLines.join('\n');
    console.log(summaryText);

    if (config.dryRun) {
      console.log('\nDry run mode enabled. No changes were made.');
      return;
    }

    if (!config.yes) {
      const confirmed = await promptConfirmation(summaryText);
      if (!confirmed) {
        console.log('Abort: user did not confirm.');
        return;
      }
    }

    const deletions = [
      prisma.anonymousAuditLog.deleteMany({
        where: {
          AND: [
            auditWhere,
            { eventType: { in: ['grant_issued', 'grant_updated', 'grant_revoked', 'file_list_query'] } },
          ],
        },
      }),
      prisma.anonymousRevocation.deleteMany({ where: whereClause }),
      prisma.anonymousSharingRequest.deleteMany({ where: whereClause }),
      prisma.anonymousFileAccess.deleteMany({ where: whereClause }),
    ];

    const results = await prisma.$transaction(deletions);

    const [auditDeleted, revocationDeleted, sharingDeleted, grantsDeleted] = results;

    console.log('\nReset complete. Deleted:');
    console.log(formatCount('• AnonymousFileAccess', grantsDeleted.count));
    console.log(formatCount('• AnonymousRevocation', revocationDeleted.count));
    console.log(formatCount('• AnonymousSharingRequest', sharingDeleted.count));
    console.log(formatCount('• AnonymousAuditLog', auditDeleted.count));
  } catch (error) {
    console.error('Failed to reset anonymous grants:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
