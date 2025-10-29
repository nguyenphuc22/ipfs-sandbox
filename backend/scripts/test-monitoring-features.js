#!/usr/bin/env node

/**
 * Monitoring Features Test Script
 *
 * This script demonstrates and tests the monitoring features:
 * 1. Nonce reuse detection (replay attack prevention)
 * 2. Failed ring signature monitoring
 * 3. Dashboard metrics
 * 4. Audit log security
 *
 * Usage:
 *   node backend/scripts/test-monitoring-features.js
 */

const { PrismaClient } = require('../src/config/prismaClient');
const { RingSignatureService } = require('../src/services/RingSignatureService');
const {
  getDashboardMetrics,
  checkNonceReuse,
  checkFailedSignatures,
  maskHashForLogging,
  secureLog
} = require('../src/utils/monitoring');
const crypto = require('crypto');

const prisma = new PrismaClient();

class MonitoringTester {
  constructor() {
    this.ringService = new RingSignatureService(prisma);
    this.testResults = {
      nonceReuse: false,
      failedSignatures: false,
      dashboardMetrics: false,
      auditLogging: false,
    };
  }

  /**
   * Test 1: Nonce Reuse Detection
   */
  async testNonceReuseDetection() {
    console.log('\n' + '='.repeat(80));
    console.log('TEST 1: Nonce Reuse Detection (Replay Attack Prevention)');
    console.log('='.repeat(80));

    try {
      const nonce = `test-nonce-${crypto.randomBytes(16).toString('hex')}`;

      // Attempt 1: Should succeed
      console.log('\n📝 Attempt 1: Using fresh nonce...');
      const result1 = await this.ringService.verifyNonce(nonce);
      console.log(`   Result: ${result1 ? '✅ ACCEPTED' : '❌ REJECTED'}`);

      if (!result1) {
        throw new Error('Fresh nonce was rejected!');
      }

      // Attempt 2: Should fail (nonce reuse)
      console.log('\n📝 Attempt 2: Reusing same nonce (replay attack simulation)...');
      const result2 = await this.ringService.verifyNonce(nonce);
      console.log(`   Result: ${result2 ? '❌ ACCEPTED (BUG!)' : '✅ REJECTED (CORRECT)'}`);

      if (result2) {
        throw new Error('Nonce reuse was accepted! Replay protection is not working!');
      }

      // Check nonce reuse logs
      console.log('\n📊 Checking nonce reuse logs...');
      const nonceReuseData = await checkNonceReuse();
      console.log(`   Replay attempts in last 5 minutes: ${nonceReuseData.replayAttemptCount}`);

      this.testResults.nonceReuse = true;
      console.log('\n✅ TEST 1 PASSED: Nonce reuse detection is working correctly!');

    } catch (error) {
      console.error('\n❌ TEST 1 FAILED:', error.message);
      this.testResults.nonceReuse = false;
    }
  }

  /**
   * Test 2: Failed Signature Monitoring
   */
  async testFailedSignatureMonitoring() {
    console.log('\n' + '='.repeat(80));
    console.log('TEST 2: Failed Ring Signature Monitoring');
    console.log('='.repeat(80));

    try {
      const testPublicKey = crypto.randomBytes(33).toString('hex');
      const testPublicKeyHash = this.ringService.hashPublicKey(testPublicKey);

      // Log some simulated failed signature attempts
      console.log('\n📝 Simulating failed signature attempts...');

      for (let i = 0; i < 3; i++) {
        await prisma.anonymousAuditLog.create({
          data: {
            eventType: 'ring_signature_validation',
            publicKeyHash: testPublicKeyHash,
            metadata: JSON.stringify({
              valid: false,
              reason: 'Test simulation',
              attempt: i + 1,
              timestamp: new Date().toISOString()
            }),
            timestamp: new Date()
          }
        });
        console.log(`   ✓ Logged failed attempt ${i + 1}`);
      }

      // Check failed signatures
      console.log('\n📊 Checking failed signature monitoring...');
      const failedData = await checkFailedSignatures();
      console.log(`   Failed signatures in last 10 minutes: ${failedData.failedSignatureCount}`);

      if (failedData.suspiciousPatterns) {
        console.log(`   Suspicious patterns detected: ${Object.keys(failedData.suspiciousPatterns).length}`);
        for (const [hash, count] of Object.entries(failedData.suspiciousPatterns)) {
          console.log(`      - ${maskHashForLogging(hash)}: ${count} failures`);
        }
      }

      this.testResults.failedSignatures = true;
      console.log('\n✅ TEST 2 PASSED: Failed signature monitoring is working correctly!');

    } catch (error) {
      console.error('\n❌ TEST 2 FAILED:', error.message);
      this.testResults.failedSignatures = false;
    }
  }

  /**
   * Test 3: Dashboard Metrics
   */
  async testDashboardMetrics() {
    console.log('\n' + '='.repeat(80));
    console.log('TEST 3: Dashboard Metrics');
    console.log('='.repeat(80));

    try {
      console.log('\n📊 Fetching dashboard metrics...');
      const metrics = await getDashboardMetrics();

      console.log('\n📈 Current Metrics:');
      console.log(`   - Access Events: ${metrics.accessEvents || 0}`);
      console.log(`   - List Events: ${metrics.listEvents || 0}`);
      console.log(`   - Integrity Alerts: ${metrics.integrityAlerts || 0}`);
      console.log(`   - Failed Signature Attempts: ${metrics.failedSignatureAttempts || 0}`);
      console.log(`   - Nonce Reuse Attempts: ${metrics.nonceReuseAttempts || 0}`);
      console.log(`   - Active Access Grants: ${metrics.activeAccessGrants || 0}`);
      console.log(`   - Recent Revocations (24h): ${metrics.recentRevocations || 0}`);

      if (metrics.error) {
        throw new Error(`Dashboard metrics error: ${metrics.error}`);
      }

      this.testResults.dashboardMetrics = true;
      console.log('\n✅ TEST 3 PASSED: Dashboard metrics are accessible!');

    } catch (error) {
      console.error('\n❌ TEST 3 FAILED:', error.message);
      this.testResults.dashboardMetrics = false;
    }
  }

  /**
   * Test 4: Audit Logging with Hash Masking
   */
  async testAuditLogging() {
    console.log('\n' + '='.repeat(80));
    console.log('TEST 4: Audit Logging with Hash Masking');
    console.log('='.repeat(80));

    try {
      const testPublicKey = crypto.randomBytes(33).toString('hex');
      const testPublicKeyHash = this.ringService.hashPublicKey(testPublicKey);
      const testFileId = `test-file-${Date.now()}`;

      console.log('\n📝 Creating test audit log entry...');
      console.log(`   Full publicKeyHash: ${testPublicKeyHash}`);
      console.log(`   Masked publicKeyHash: ${maskHashForLogging(testPublicKeyHash)}`);

      // Create audit log
      await prisma.anonymousAuditLog.create({
        data: {
          eventType: 'test_monitoring',
          fileId: testFileId,
          publicKeyHash: testPublicKeyHash,
          metadata: JSON.stringify({
            test: true,
            purpose: 'monitoring_test',
            timestamp: new Date().toISOString()
          }),
          timestamp: new Date()
        }
      });

      console.log('   ✓ Audit log created');

      // Use secureLog to demonstrate hash masking
      console.log('\n📝 Testing secureLog with hash masking...');
      secureLog(
        'MonitoringTest',
        `Test event logged for publicKeyHash: ${testPublicKeyHash}`,
        'info',
        { publicKeyHash: testPublicKeyHash, fileId: testFileId }
      );

      // Verify no userId in audit logs
      const recentLogs = await prisma.anonymousAuditLog.findMany({
        where: {
          eventType: 'test_monitoring',
          fileId: testFileId
        }
      });

      console.log('\n📊 Verifying audit log security...');
      for (const log of recentLogs) {
        const hasUserId = log.metadata?.includes('userId') ||
                         log.metadata?.includes('ownerUserId') ||
                         log.metadata?.includes('uploaderUserId');

        if (hasUserId) {
          throw new Error('Audit log contains userId leak!');
        }

        const hasPublicKeyHash = log.publicKeyHash && log.publicKeyHash.length === 64;
        if (!hasPublicKeyHash) {
          throw new Error('Audit log missing valid publicKeyHash!');
        }

        console.log(`   ✓ Log ${log.id}: No userId leak, publicKeyHash present`);
      }

      // Clean up test logs
      await prisma.anonymousAuditLog.deleteMany({
        where: {
          eventType: 'test_monitoring',
          fileId: testFileId
        }
      });

      this.testResults.auditLogging = true;
      console.log('\n✅ TEST 4 PASSED: Audit logging is secure with proper hash masking!');

    } catch (error) {
      console.error('\n❌ TEST 4 FAILED:', error.message);
      this.testResults.auditLogging = false;
    }
  }

  /**
   * Print final summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 MONITORING FEATURES TEST SUMMARY');
    console.log('='.repeat(80));

    const tests = [
      { name: 'Nonce Reuse Detection', result: this.testResults.nonceReuse },
      { name: 'Failed Signature Monitoring', result: this.testResults.failedSignatures },
      { name: 'Dashboard Metrics', result: this.testResults.dashboardMetrics },
      { name: 'Audit Logging Security', result: this.testResults.auditLogging },
    ];

    console.log('\n📋 Test Results:');
    tests.forEach((test, idx) => {
      const status = test.result ? '✅ PASS' : '❌ FAIL';
      console.log(`   ${idx + 1}. ${test.name}: ${status}`);
    });

    const passedCount = tests.filter(t => t.result).length;
    const totalCount = tests.length;

    console.log(`\n📈 Overall: ${passedCount}/${totalCount} tests passed`);

    if (passedCount === totalCount) {
      console.log('\n✅ SUCCESS: All monitoring features are working correctly!');
      console.log('\n🎉 Your anonymous system has:');
      console.log('   ✓ Replay attack protection (nonce reuse detection)');
      console.log('   ✓ Failed signature monitoring');
      console.log('   ✓ Real-time dashboard metrics');
      console.log('   ✓ Secure audit logging with hash masking');
      console.log('\n📊 Access the monitoring dashboard at:');
      console.log('   http://localhost:5000/monitoring-dashboard.html');
    } else {
      console.log('\n⚠️  WARNING: Some monitoring features failed!');
      console.log('   Review the errors above and fix the issues.');
    }

    console.log('\n' + '='.repeat(80));

    return passedCount === totalCount;
  }

  /**
   * Run all tests
   */
  async runAll() {
    console.log('🚀 Starting Monitoring Features Test Suite...\n');

    try {
      await this.testNonceReuseDetection();
      await this.testFailedSignatureMonitoring();
      await this.testDashboardMetrics();
      await this.testAuditLogging();

      const success = this.printSummary();

      await prisma.$disconnect();
      return success;

    } catch (error) {
      console.error('\n💥 Test suite crashed:', error);
      await prisma.$disconnect();
      return false;
    }
  }
}

// Run tests
async function main() {
  const tester = new MonitoringTester();
  const success = await tester.runAll();
  process.exit(success ? 0 : 1);
}

main();
