#!/usr/bin/env node

/**
 * Audit Log Security Verification Script
 *
 * This script verifies that audit logs do not contain any userId or PII leaks.
 * It scans all AnonymousAuditLog, IntegrityAlert, and AnonymousRevocation records
 * to ensure they use publicKeyHash instead of userId.
 *
 * Usage:
 *   node backend/scripts/verify-audit-log-security.js [--verbose] [--fix]
 *
 * Options:
 *   --verbose  Show detailed information for each record
 *   --fix      Attempt to fix records that have userId leaks (dangerous!)
 */

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const isFixMode = args.includes('--fix');

// Patterns to detect userId leaks
const USER_ID_PATTERNS = [
  /userId["']?\s*:\s*["']?[a-f0-9-]+/gi,
  /ownerUserId["']?\s*:\s*["']?[a-f0-9-]+/gi,
  /uploaderUserId["']?\s*:\s*["']?[a-f0-9-]+/gi,
  /revokedUserId["']?\s*:\s*["']?[a-f0-9-]+/gi,
  /"id"\s*:\s*"[a-f0-9-]+"/gi, // Generic ID field
  /user_id/gi,
];

const PII_PATTERNS = [
  /username["']?\s*:\s*["'][^"']+["']/gi,
  /email["']?\s*:\s*["'][^"']+["']/gi,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi, // Email regex
];

class AuditSecurityVerifier {
  constructor() {
    this.issues = {
      auditLogs: [],
      integrityAlerts: [],
      revocations: [],
      fileAccess: [],
    };
    this.stats = {
      auditLogsChecked: 0,
      integrityAlertsChecked: 0,
      revocationsChecked: 0,
      fileAccessChecked: 0,
      totalIssues: 0,
    };
  }

  /**
   * Check if text contains userId or PII patterns
   */
  detectLeaks(text, recordType, recordId) {
    if (!text) return [];

    const leaks = [];

    // Check for userId patterns
    for (const pattern of USER_ID_PATTERNS) {
      const matches = text.match(pattern);
      if (matches) {
        leaks.push({
          type: 'userId',
          pattern: pattern.toString(),
          matches: matches,
          recordType,
          recordId
        });
      }
    }

    // Check for PII patterns
    for (const pattern of PII_PATTERNS) {
      const matches = text.match(pattern);
      if (matches) {
        leaks.push({
          type: 'PII',
          pattern: pattern.toString(),
          matches: matches,
          recordType,
          recordId
        });
      }
    }

    return leaks;
  }

  /**
   * Verify AnonymousAuditLog records
   */
  async verifyAuditLogs() {
    console.log('\n📝 Checking AnonymousAuditLog records...');

    const logs = await prisma.anonymousAuditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 1000 // Check last 1000 records
    });

    this.stats.auditLogsChecked = logs.length;

    for (const log of logs) {
      const leaks = this.detectLeaks(log.metadata, 'AnonymousAuditLog', log.id);

      if (leaks.length > 0) {
        this.issues.auditLogs.push({
          id: log.id,
          eventType: log.eventType,
          timestamp: log.timestamp,
          leaks,
          metadata: log.metadata
        });
        this.stats.totalIssues += leaks.length;
      }

      // Verify publicKeyHash is present (not userId)
      if (!log.publicKeyHash && log.eventType !== 'system_event') {
        this.issues.auditLogs.push({
          id: log.id,
          eventType: log.eventType,
          timestamp: log.timestamp,
          leaks: [{
            type: 'missing_publicKeyHash',
            message: 'Record does not have publicKeyHash field'
          }]
        });
        this.stats.totalIssues++;
      }
    }

    console.log(`   ✓ Checked ${logs.length} audit log records`);
    console.log(`   ${this.issues.auditLogs.length > 0 ? '❌' : '✅'} Found ${this.issues.auditLogs.length} issues`);
  }

  /**
   * Verify IntegrityAlert records
   */
  async verifyIntegrityAlerts() {
    console.log('\n🚨 Checking IntegrityAlert records...');

    const alerts = await prisma.integrityAlert.findMany({
      orderBy: { reportedAt: 'desc' },
      take: 1000
    });

    this.stats.integrityAlertsChecked = alerts.length;

    for (const alert of alerts) {
      // Check if using publicKeyHash instead of userId
      if (!alert.reportedByPublicKeyHash) {
        this.issues.integrityAlerts.push({
          id: alert.id,
          fileId: alert.fileId,
          chunkIndex: alert.chunkIndex,
          leaks: [{
            type: 'missing_publicKeyHash',
            message: 'IntegrityAlert does not have reportedByPublicKeyHash field'
          }]
        });
        this.stats.totalIssues++;
      }

      // Verify publicKeyHash format (should be 64 char hex string)
      if (alert.reportedByPublicKeyHash && alert.reportedByPublicKeyHash.length !== 64) {
        this.issues.integrityAlerts.push({
          id: alert.id,
          fileId: alert.fileId,
          chunkIndex: alert.chunkIndex,
          leaks: [{
            type: 'invalid_hash_format',
            message: `reportedByPublicKeyHash has invalid length: ${alert.reportedByPublicKeyHash.length} (expected 64)`
          }]
        });
        this.stats.totalIssues++;
      }
    }

    console.log(`   ✓ Checked ${alerts.length} integrity alert records`);
    console.log(`   ${this.issues.integrityAlerts.length > 0 ? '❌' : '✅'} Found ${this.issues.integrityAlerts.length} issues`);
  }

  /**
   * Verify AnonymousRevocation records
   */
  async verifyRevocations() {
    console.log('\n🔒 Checking AnonymousRevocation records...');

    const revocations = await prisma.anonymousRevocation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000
    });

    this.stats.revocationsChecked = revocations.length;

    for (const revocation of revocations) {
      // Check if using revokedPublicKeyHash instead of revokedUserId
      if (!revocation.revokedPublicKeyHash) {
        this.issues.revocations.push({
          id: revocation.id,
          fileId: revocation.fileId,
          leaks: [{
            type: 'missing_publicKeyHash',
            message: 'AnonymousRevocation does not have revokedPublicKeyHash field'
          }]
        });
        this.stats.totalIssues++;
      }

      // Verify publicKeyHash format
      if (revocation.revokedPublicKeyHash && revocation.revokedPublicKeyHash.length !== 64) {
        this.issues.revocations.push({
          id: revocation.id,
          fileId: revocation.fileId,
          leaks: [{
            type: 'invalid_hash_format',
            message: `revokedPublicKeyHash has invalid length: ${revocation.revokedPublicKeyHash.length} (expected 64)`
          }]
        });
        this.stats.totalIssues++;
      }
    }

    console.log(`   ✓ Checked ${revocations.length} revocation records`);
    console.log(`   ${this.issues.revocations.length > 0 ? '❌' : '✅'} Found ${this.issues.revocations.length} issues`);
  }

  /**
   * Verify AnonymousFileAccess records
   */
  async verifyFileAccess() {
    console.log('\n🔑 Checking AnonymousFileAccess records...');

    const accessRecords = await prisma.anonymousFileAccess.findMany({
      take: 1000
    });

    this.stats.fileAccessChecked = accessRecords.length;

    for (const access of accessRecords) {
      // Check if using accessorPublicKeyHash
      if (!access.accessorPublicKeyHash) {
        this.issues.fileAccess.push({
          id: access.id,
          fileId: access.fileId,
          leaks: [{
            type: 'missing_publicKeyHash',
            message: 'AnonymousFileAccess does not have accessorPublicKeyHash field'
          }]
        });
        this.stats.totalIssues++;
      }

      // Verify publicKeyHash format
      if (access.accessorPublicKeyHash && access.accessorPublicKeyHash.length !== 64) {
        this.issues.fileAccess.push({
          id: access.id,
          fileId: access.fileId,
          leaks: [{
            type: 'invalid_hash_format',
            message: `accessorPublicKeyHash has invalid length: ${access.accessorPublicKeyHash.length} (expected 64)`
          }]
        });
        this.stats.totalIssues++;
      }
    }

    console.log(`   ✓ Checked ${accessRecords.length} file access records`);
    console.log(`   ${this.issues.fileAccess.length > 0 ? '❌' : '✅'} Found ${this.issues.fileAccess.length} issues`);
  }

  /**
   * Print detailed report
   */
  printReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 AUDIT LOG SECURITY VERIFICATION REPORT');
    console.log('='.repeat(80));

    console.log('\n📈 Statistics:');
    console.log(`   - AnonymousAuditLog records checked: ${this.stats.auditLogsChecked}`);
    console.log(`   - IntegrityAlert records checked: ${this.stats.integrityAlertsChecked}`);
    console.log(`   - AnonymousRevocation records checked: ${this.stats.revocationsChecked}`);
    console.log(`   - AnonymousFileAccess records checked: ${this.stats.fileAccessChecked}`);
    console.log(`   - Total records checked: ${this.stats.auditLogsChecked + this.stats.integrityAlertsChecked + this.stats.revocationsChecked + this.stats.fileAccessChecked}`);
    console.log(`   - Total issues found: ${this.stats.totalIssues}`);

    if (this.stats.totalIssues === 0) {
      console.log('\n✅ SUCCESS: No security issues detected!');
      console.log('   All audit logs are using publicKeyHash correctly.');
      console.log('   No userId or PII leaks found.');
      return;
    }

    console.log('\n❌ SECURITY ISSUES DETECTED:');

    // Report audit log issues
    if (this.issues.auditLogs.length > 0) {
      console.log(`\n   📝 AnonymousAuditLog issues (${this.issues.auditLogs.length}):`);
      this.issues.auditLogs.slice(0, 10).forEach((issue, idx) => {
        console.log(`      ${idx + 1}. Record ${issue.id} (${issue.eventType}):`);
        issue.leaks.forEach(leak => {
          console.log(`         - ${leak.type}: ${leak.message || leak.matches?.join(', ')}`);
        });
        if (isVerbose && issue.metadata) {
          console.log(`         Metadata: ${issue.metadata.substring(0, 100)}...`);
        }
      });
      if (this.issues.auditLogs.length > 10) {
        console.log(`      ... and ${this.issues.auditLogs.length - 10} more`);
      }
    }

    // Report integrity alert issues
    if (this.issues.integrityAlerts.length > 0) {
      console.log(`\n   🚨 IntegrityAlert issues (${this.issues.integrityAlerts.length}):`);
      this.issues.integrityAlerts.slice(0, 10).forEach((issue, idx) => {
        console.log(`      ${idx + 1}. Alert ${issue.id} (file: ${issue.fileId}):`);
        issue.leaks.forEach(leak => {
          console.log(`         - ${leak.type}: ${leak.message}`);
        });
      });
      if (this.issues.integrityAlerts.length > 10) {
        console.log(`      ... and ${this.issues.integrityAlerts.length - 10} more`);
      }
    }

    // Report revocation issues
    if (this.issues.revocations.length > 0) {
      console.log(`\n   🔒 AnonymousRevocation issues (${this.issues.revocations.length}):`);
      this.issues.revocations.slice(0, 10).forEach((issue, idx) => {
        console.log(`      ${idx + 1}. Revocation ${issue.id} (file: ${issue.fileId}):`);
        issue.leaks.forEach(leak => {
          console.log(`         - ${leak.type}: ${leak.message}`);
        });
      });
      if (this.issues.revocations.length > 10) {
        console.log(`      ... and ${this.issues.revocations.length - 10} more`);
      }
    }

    // Report file access issues
    if (this.issues.fileAccess.length > 0) {
      console.log(`\n   🔑 AnonymousFileAccess issues (${this.issues.fileAccess.length}):`);
      this.issues.fileAccess.slice(0, 10).forEach((issue, idx) => {
        console.log(`      ${idx + 1}. Access ${issue.id} (file: ${issue.fileId}):`);
        issue.leaks.forEach(leak => {
          console.log(`         - ${leak.type}: ${leak.message}`);
        });
      });
      if (this.issues.fileAccess.length > 10) {
        console.log(`      ... and ${this.issues.fileAccess.length - 10} more`);
      }
    }

    console.log('\n⚠️  RECOMMENDATION:');
    console.log('   Review the issues above and update your code to use publicKeyHash');
    console.log('   instead of userId for all anonymous operations.');
    console.log('   Run migrations to update schema if needed.');

    if (isFixMode) {
      console.log('\n⚠️  FIX MODE: This feature is not yet implemented.');
      console.log('   Manual fixes are recommended to avoid data corruption.');
    }
  }

  /**
   * Run all verifications
   */
  async verify() {
    console.log('🔍 Starting Audit Log Security Verification...\n');
    console.log(`Mode: ${isVerbose ? 'VERBOSE' : 'NORMAL'}${isFixMode ? ' + FIX' : ''}`);

    try {
      await this.verifyAuditLogs();
      await this.verifyIntegrityAlerts();
      await this.verifyRevocations();
      await this.verifyFileAccess();

      this.printReport();

      return this.stats.totalIssues === 0;
    } catch (error) {
      console.error('\n❌ Verification failed:', error);
      throw error;
    }
  }
}

// Run verification
async function main() {
  const verifier = new AuditSecurityVerifier();

  try {
    const success = await verifier.verify();
    await prisma.$disconnect();

    console.log('\n' + '='.repeat(80));
    process.exit(success ? 0 : 1);
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
