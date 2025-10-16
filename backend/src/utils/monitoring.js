/**
 * Monitoring and Logging Utilities
 * 
 * Provides logging masking, dashboard metrics, and monitoring for the anonymous system
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configuration for hash truncation
const HASH_TRUNCATION_LENGTH = 16; // Show only first 16 chars of hash + '...'

/**
 * Truncate and mask sensitive hash values for logging
 * @param {string} hash - Full hash value to mask
 * @param {string} type - Type of hash ('publicKeyHash', 'nonce', etc.)
 * @returns {string} Truncated and masked hash
 */
function maskHashForLogging(hash, type = 'publicKeyHash') {
  if (!hash || typeof hash !== 'string') {
    return '[MASKED]';
  }
  
  // For public key hashes, truncate to first N characters + '...'
  if (type === 'publicKeyHash' || type === 'deviceFingerprint') {
    return `${hash.substring(0, HASH_TRUNCATION_LENGTH)}...`;
  }
  
  // For nonces, just return a generic identifier
  if (type === 'nonce') {
    return `[NONCE_${hash.substring(0, 8)}...]`;
  }
  
  // For general hashes, truncate to first N characters
  return `${hash.substring(0, HASH_TRUNCATION_LENGTH)}...`;
}

/**
 * Enhanced logging function with masking
 * @param {string} module - Module name
 * @param {string} message - Log message
 * @param {string} level - Log level
 * @param {Object} context - Contextual data to mask
 */
function secureLog(module, message, level = 'info', context = {}) {
  const timestamp = new Date().toISOString();
  
  // Mask any hash values in the message
  let maskedMessage = message;
  if (context.publicKeyHash) {
    const maskedHash = maskHashForLogging(context.publicKeyHash, 'publicKeyHash');
    maskedMessage = maskedMessage.replace(context.publicKeyHash, maskedHash);
  }
  
  if (context.nonce) {
    const maskedNonce = maskHashForLogging(context.nonce, 'nonce');
    maskedMessage = maskedMessage.replace(context.nonce, maskedNonce);
  }
  
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${module}] ${maskedMessage}`;
  
  switch (level.toLowerCase()) {
    case 'error':
    case 'warn':
      console.error(logMessage);
      break;
    default:
      console.log(logMessage);
  }
}

/**
 * Get dashboard metrics for monitoring
 * @returns {Object} Dashboard metrics
 */
async function getDashboardMetrics() {
  try {
    // Total anonymous access events
    const accessEventsCount = await prisma.anonymousAuditLog.count({
      where: { eventType: 'access_negotiation' }
    });
    
    // Total file listings
    const listEventsCount = await prisma.anonymousAuditLog.count({
      where: { eventType: 'file_list_query' }
    });
    
    // Integrity alerts
    const integrityAlertsCount = await prisma.integrityAlert.count({});
    
    // Failed ring signature attempts (could be logged as errors)
    const failedSignatureAttempts = await prisma.anonymousAuditLog.count({
      where: {
        eventType: 'ring_signature_validation',
        metadata: { contains: '"valid":false' } // Assumption: failed validations logged with valid:false
      }
    });
    
    // Reused nonces (logged as replay attempts)
    const nonceReuseAttempts = await prisma.anonymousAuditLog.count({
      where: {
        eventType: 'nonce_verification',
        metadata: { contains: '"reused":true' } // Assumption: reused nonces logged with reused:true
      }
    });
    
    // Active anonymous access grants
    const activeAccessGrants = await prisma.anonymousFileAccess.count({
      where: { status: 'active' }
    });
    
    // Recently revoked access (last 24 hours)
    const recentRevocations = await prisma.anonymousFileAccess.count({
      where: {
        status: 'revoked',
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    });
    
    return {
      accessEvents: accessEventsCount,
      listEvents: listEventsCount,
      integrityAlerts: integrityAlertsCount,
      failedSignatureAttempts,
      nonceReuseAttempts,
      activeAccessGrants,
      recentRevocations,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    secureLog('Monitoring', `Error getting dashboard metrics: ${error.message}`, 'error');
    return {
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check for nonce reuse (replay attack detection)
 * @returns {Object} Replay attack detection results
 */
async function checkNonceReuse() {
  try {
    // This would check for nonces that were rejected due to reuse
    // Assuming there are logs for nonce rejections
    const recentLogs = await prisma.anonymousAuditLog.findMany({
      where: {
        eventType: 'nonce_verification',
        timestamp: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    
    const replayAttempts = recentLogs.filter(log => {
      try {
        const metadata = JSON.parse(log.metadata || '{}');
        return metadata.reused === true;
      } catch {
        return false;
      }
    });
    
    return {
      replayAttemptCount: replayAttempts.length,
      replayAttempts: replayAttempts.slice(0, 10), // Return first 10 attempts
      checkedPeriod: 'Last 5 minutes',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    secureLog('Monitoring', `Error checking nonce reuse: ${error.message}`, 'error');
    return { error: error.message };
  }
}

/**
 * Check for failed ring signature attempts
 * @returns {Object} Failed signature analysis
 */
async function checkFailedSignatures() {
  try {
    const recentLogs = await prisma.anonymousAuditLog.findMany({
      where: {
        eventType: 'ring_signature_validation',
        timestamp: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    
    const failedSignatures = recentLogs.filter(log => {
      try {
        const metadata = JSON.parse(log.metadata || '{}');
        return metadata.valid === false;
      } catch {
        return false;
      }
    });
    
    // Group by public key hash to identify suspicious patterns
    const suspiciousPatterns = {};
    failedSignatures.forEach(log => {
      if (log.publicKeyHash) {
        if (!suspiciousPatterns[log.publicKeyHash]) {
          suspiciousPatterns[log.publicKeyHash] = 0;
        }
        suspiciousPatterns[log.publicKeyHash]++;
      }
    });
    
    return {
      failedSignatureCount: failedSignatures.length,
      failedSignatures: failedSignatures.slice(0, 10), // Return first 10 failures
      suspiciousPatterns, // Public key hashes with multiple failures
      checkedPeriod: 'Last 10 minutes',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    secureLog('Monitoring', `Error checking failed signatures: ${error.message}`, 'error');
    return { error: error.message };
  }
}

/**
 * Get recent audit activity
 * @param {number} limit - Number of records to return
 * @returns {Array} Recent audit logs
 */
async function getRecentAuditActivity(limit = 50) {
  try {
    const recentLogs = await prisma.anonymousAuditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      select: {
        id: true,
        eventType: true,
        fileId: true,
        publicKeyHash: true,
        timestamp: true,
        metadata: true
      }
    });
    
    // Mask sensitive information in returned logs
    return recentLogs.map(log => ({
      ...log,
      publicKeyHash: maskHashForLogging(log.publicKeyHash, 'publicKeyHash'),
      metadata: maskMetadata(log.metadata)
    }));
  } catch (error) {
    secureLog('Monitoring', `Error getting recent audit activity: ${error.message}`, 'error');
    return [];
  }
}

/**
 * Mask sensitive information in metadata
 * @param {string|Object} metadata 
 * @returns {string|Object} Masked metadata
 */
function maskMetadata(metadata) {
  if (!metadata) return metadata;
  
  try {
    const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
    
    // Create a copy to avoid modifying original
    const masked = JSON.parse(JSON.stringify(parsed));
    
    // Mask any potential PII in metadata
    if (masked.publicKey) {
      masked.publicKey = maskHashForLogging(masked.publicKey, 'publicKeyHash');
    }
    
    if (masked.ringPublicKeys && Array.isArray(masked.ringPublicKeys)) {
      masked.ringPublicKeys = masked.ringPublicKeys.map(key => 
        maskHashForLogging(key, 'publicKeyHash')
      );
    }
    
    // Remove raw user IDs if present
    delete masked.userId;
    delete masked.ownerUserId;
    
    return typeof metadata === 'string' ? JSON.stringify(masked) : masked;
  } catch {
    return metadata; // Return original if parsing fails
  }
}

/**
 * Log monitoring event with masking
 * @param {string} eventType 
 * @param {string} publicKeyHash 
 * @param {string} fileId 
 * @param {Object} metadata 
 */
async function logMonitoringEvent(eventType, publicKeyHash, fileId = null, metadata = {}) {
  try {
    // Mask sensitive data before logging
    await prisma.anonymousAuditLog.create({
      data: {
        eventType,
        fileId,
        publicKeyHash: publicKeyHash ? maskHashForLogging(publicKeyHash, 'publicKeyHash') : null,
        metadata: JSON.stringify(maskMetadata(metadata)),
        timestamp: new Date()
      }
    });
  } catch (error) {
    // Use secure logging to avoid logging sensitive data during error
    secureLog('Monitoring', `Failed to log monitoring event: ${error.message}`, 'error', {
      eventType,
      publicKeyHash,
      fileId
    });
  }
}

module.exports = {
  maskHashForLogging,
  secureLog,
  getDashboardMetrics,
  checkNonceReuse,
  checkFailedSignatures,
  getRecentAuditActivity,
  maskMetadata,
  logMonitoringEvent
};