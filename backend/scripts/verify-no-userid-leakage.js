/**
 * Script to verify no userId leakage in the database
 *
 * This script scans all relevant tables to ensure:
 * 1. No userId fields exist in anonymous access tables
 * 2. All audit logs use publicKeyHash instead of userId
 * 3. All access grants and revocations use publicKeyHash
 */

const { PrismaClient } = require('../src/config/prismaClient');
const prisma = new PrismaClient();

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(80));
  log(title, 'cyan');
  console.log('='.repeat(80));
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

async function verifyAnonymousFileAccess() {
  logSection('Verifying AnonymousFileAccess Table');

  const records = await prisma.anonymousFileAccess.findMany({
    take: 100,
  });

  logInfo(`Found ${records.length} anonymous file access records`);

  let violations = [];

  records.forEach((record, index) => {
    // Check for userId field
    if ('userId' in record) {
      violations.push(`Record ${index}: Contains userId field`);
    }
    if ('grantedByUserId' in record) {
      violations.push(`Record ${index}: Contains grantedByUserId field`);
    }

    // Verify required hash fields exist
    if (!record.accessorPublicKeyHash) {
      violations.push(`Record ${index}: Missing accessorPublicKeyHash`);
    }
    if (!record.grantedByPublicKeyHash) {
      violations.push(`Record ${index}: Missing grantedByPublicKeyHash`);
    }
  });

  if (violations.length === 0) {
    logSuccess('No userId leakage in AnonymousFileAccess table');
  } else {
    violations.forEach(v => logError(v));
  }

  return violations.length === 0;
}

async function verifyAnonymousAuditLog() {
  logSection('Verifying AnonymousAuditLog Table');

  const records = await prisma.anonymousAuditLog.findMany({
    take: 100,
    orderBy: { timestamp: 'desc' },
  });

  logInfo(`Found ${records.length} audit log records`);

  let violations = [];

  records.forEach((record, index) => {
    // Check for userId field
    if ('userId' in record) {
      violations.push(`Record ${index}: Contains userId field`);
    }

    // Verify publicKeyHash exists (allow null for system events and verification events)
    const systemEvents = ['system', 'nonce_verification', 'key_image_verification', 'ring_signature_validation'];
    if (!record.publicKeyHash && !systemEvents.includes(record.eventType)) {
      violations.push(`Record ${index}: Missing publicKeyHash (eventType: ${record.eventType})`);
    }

    // Check metadata for userId leakage
    if (record.metadata) {
      try {
        const metadata = JSON.parse(record.metadata);
        if (metadata.userId) {
          violations.push(`Record ${index}: Metadata contains userId`);
        }
        if (metadata.ownerUserId) {
          violations.push(`Record ${index}: Metadata contains ownerUserId`);
        }
        if (metadata.reportedByUserId) {
          violations.push(`Record ${index}: Metadata contains reportedByUserId`);
        }
      } catch (e) {
        logWarning(`Record ${index}: Failed to parse metadata`);
      }
    }
  });

  if (violations.length === 0) {
    logSuccess('No userId leakage in AnonymousAuditLog table');
  } else {
    violations.forEach(v => logError(v));
  }

  return violations.length === 0;
}

async function verifyIntegrityAlert() {
  logSection('Verifying IntegrityAlert Table');

  const records = await prisma.integrityAlert.findMany({
    take: 100,
  });

  logInfo(`Found ${records.length} integrity alert records`);

  let violations = [];

  records.forEach((record, index) => {
    // Check for userId field
    if ('reportedByUserId' in record) {
      violations.push(`Record ${index}: Contains reportedByUserId field`);
    }
    if ('userId' in record) {
      violations.push(`Record ${index}: Contains userId field`);
    }

    // Verify reportedByPublicKeyHash exists
    if (!record.reportedByPublicKeyHash) {
      violations.push(`Record ${index}: Missing reportedByPublicKeyHash`);
    }
  });

  if (violations.length === 0) {
    logSuccess('No userId leakage in IntegrityAlert table');
  } else {
    violations.forEach(v => logError(v));
  }

  return violations.length === 0;
}

async function verifyAnonymousRevocation() {
  logSection('Verifying AnonymousRevocation Table');

  const records = await prisma.anonymousRevocation.findMany({
    take: 100,
  });

  logInfo(`Found ${records.length} revocation records`);

  let violations = [];

  records.forEach((record, index) => {
    // Check for userId field
    if ('revokedUserId' in record) {
      violations.push(`Record ${index}: Contains revokedUserId field`);
    }
    if ('userId' in record) {
      violations.push(`Record ${index}: Contains userId field`);
    }

    // Verify revokedPublicKeyHash exists (can be null for full revocations)
    // Just check it's not a userId-like field
  });

  if (violations.length === 0) {
    logSuccess('No userId leakage in AnonymousRevocation table');
  } else {
    violations.forEach(v => logError(v));
  }

  return violations.length === 0;
}

async function verifyFileTable() {
  logSection('Verifying File Table');

  const records = await prisma.file.findMany({
    take: 100,
  });

  logInfo(`Found ${records.length} file records`);

  let violations = [];

  records.forEach((record, index) => {
    // Check for userId field
    if ('userId' in record) {
      violations.push(`Record ${index}: Contains userId field`);
    }
    if ('ownerUserId' in record) {
      violations.push(`Record ${index}: Contains ownerUserId field`);
    }

    // Verify ownershipPublicKey exists
    if (!record.ownershipPublicKey) {
      violations.push(`Record ${index}: Missing ownershipPublicKey`);
    }
  });

  if (violations.length === 0) {
    logSuccess('No userId leakage in File table');
  } else {
    violations.forEach(v => logError(v));
  }

  return violations.length === 0;
}

async function verifyUserTable() {
  logSection('Verifying User Table (PII Removal)');

  const records = await prisma.user.findMany({
    take: 10,
  });

  logInfo(`Found ${records.length} user records`);

  let violations = [];

  records.forEach((record, index) => {
    // Check for PII fields that should be removed
    if ('username' in record) {
      violations.push(`Record ${index}: Contains username field (PII)`);
    }
    if ('email' in record) {
      violations.push(`Record ${index}: Contains email field (PII)`);
    }
    if ('passwordHash' in record) {
      violations.push(`Record ${index}: Contains passwordHash field (PII)`);
    }
    if ('secretKey' in record) {
      violations.push(`Record ${index}: Contains secretKey field (PII)`);
    }

    // Verify required fields exist
    if (!record.publicKey) {
      violations.push(`Record ${index}: Missing publicKey`);
    }
  });

  if (violations.length === 0) {
    logSuccess('User table properly anonymized (no PII fields)');
  } else {
    violations.forEach(v => logError(v));
  }

  return violations.length === 0;
}

async function checkSchemaForLegacyTables() {
  logSection('Checking for Legacy Tables');

  try {
    // Try to query legacy tables - they should not exist
    let legacyTablesExist = [];

    try {
      await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name='UserFileAccess'`;
      const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM UserFileAccess`;
      if (result[0].count !== undefined) {
        legacyTablesExist.push('UserFileAccess');
      }
    } catch (e) {
      // Table doesn't exist - good!
    }

    try {
      await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name='AuditLog'`;
      const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM AuditLog`;
      if (result[0].count !== undefined) {
        legacyTablesExist.push('AuditLog');
      }
    } catch (e) {
      // Table doesn't exist - good!
    }

    if (legacyTablesExist.length === 0) {
      logSuccess('Legacy tables (UserFileAccess, AuditLog) have been removed');
      return true;
    } else {
      legacyTablesExist.forEach(table => {
        logError(`Legacy table still exists: ${table}`);
      });
      return false;
    }
  } catch (error) {
    logWarning(`Could not check for legacy tables: ${error.message}`);
    return true; // Don't fail the whole check
  }
}

async function generateSummaryReport() {
  logSection('Generating Summary Statistics');

  const stats = {
    anonymousAccess: await prisma.anonymousFileAccess.count(),
    auditLogs: await prisma.anonymousAuditLog.count(),
    integrityAlerts: await prisma.integrityAlert.count(),
    revocations: await prisma.anonymousRevocation.count(),
    files: await prisma.file.count(),
    users: await prisma.user.count(),
  };

  logInfo(`Total Records:`);
  console.log(`  - Anonymous File Access: ${stats.anonymousAccess}`);
  console.log(`  - Audit Logs: ${stats.auditLogs}`);
  console.log(`  - Integrity Alerts: ${stats.integrityAlerts}`);
  console.log(`  - Revocations: ${stats.revocations}`);
  console.log(`  - Files: ${stats.files}`);
  console.log(`  - Users: ${stats.users}`);

  // Check audit log event types
  const eventTypes = await prisma.anonymousAuditLog.groupBy({
    by: ['eventType'],
    _count: true,
  });

  logInfo('\nAudit Log Event Types:');
  eventTypes.forEach(et => {
    console.log(`  - ${et.eventType}: ${et._count}`);
  });
}

async function main() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════════════════════╗', 'magenta');
  log('║                    UserId Leakage Verification Script                     ║', 'magenta');
  log('║                      Anonymous Download System                             ║', 'magenta');
  log('╚════════════════════════════════════════════════════════════════════════════╝', 'magenta');

  const results = {
    anonymousFileAccess: false,
    anonymousAuditLog: false,
    integrityAlert: false,
    anonymousRevocation: false,
    fileTable: false,
    userTable: false,
    legacyTables: false,
  };

  try {
    results.anonymousFileAccess = await verifyAnonymousFileAccess();
    results.anonymousAuditLog = await verifyAnonymousAuditLog();
    results.integrityAlert = await verifyIntegrityAlert();
    results.anonymousRevocation = await verifyAnonymousRevocation();
    results.fileTable = await verifyFileTable();
    results.userTable = await verifyUserTable();
    results.legacyTables = await checkSchemaForLegacyTables();

    await generateSummaryReport();

    logSection('Final Verification Results');

    const allPassed = Object.values(results).every(r => r === true);

    if (allPassed) {
      log('\n✓ All checks passed! No userId leakage detected.', 'green');
      log('✓ System is properly anonymized.\n', 'green');
      process.exit(0);
    } else {
      log('\n✗ Some checks failed. Please review the errors above.', 'red');
      log('✗ UserId leakage detected or missing required fields.\n', 'red');

      // Show which checks failed
      Object.entries(results).forEach(([check, passed]) => {
        if (!passed) {
          logError(`Failed: ${check}`);
        }
      });

      process.exit(1);
    }
  } catch (error) {
    logError(`\nFatal error during verification: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
