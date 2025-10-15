/**
 * Monitoring Routes
 * Provides endpoints for system monitoring and dashboard metrics
 */

const express = require('express');
const {
  getDashboardMetrics,
  checkNonceReuse,
  checkFailedSignatures,
  getRecentAuditActivity,
  secureLog
} = require('../utils/monitoring');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'IPFS Anonymous Download System'
  });
});

// Dashboard metrics endpoint
router.get('/dashboard', async (req, res) => {
  try {
    const metrics = await getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    secureLog('MonitoringAPI', `Dashboard metrics error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Failed to get dashboard metrics' });
  }
});

// Nonce reuse detection endpoint
router.get('/replay-attacks', async (req, res) => {
  try {
    const nonceReuseData = await checkNonceReuse();
    res.json(nonceReuseData);
  } catch (error) {
    secureLog('MonitoringAPI', `Nonce reuse check error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Failed to check nonce reuse' });
  }
});

// Failed signature detection endpoint
router.get('/failed-signatures', async (req, res) => {
  try {
    const failedSignaturesData = await checkFailedSignatures();
    res.json(failedSignaturesData);
  } catch (error) {
    secureLog('MonitoringAPI', `Failed signatures check error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Failed to check failed signatures' });
  }
});

// Recent audit activity endpoint
router.get('/recent-activity', async (req, res) => {
  try {
    // Get limit from query parameter, default to 50
    const limit = parseInt(req.query.limit) || 50;
    const activity = await getRecentAuditActivity(limit);
    res.json(activity);
  } catch (error) {
    secureLog('MonitoringAPI', `Recent activity check error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Failed to get recent activity' });
  }
});

// Manual trigger for security checks
router.post('/security-check', async (req, res) => {
  try {
    const { checkType } = req.body;
    
    let result;
    switch (checkType) {
      case 'nonce-reuse':
        result = await checkNonceReuse();
        break;
      case 'failed-signatures':
        result = await checkFailedSignatures();
        break;
      case 'dashboard':
        result = await getDashboardMetrics();
        break;
      default:
        return res.status(400).json({ error: 'Invalid checkType. Use: nonce-reuse, failed-signatures, or dashboard' });
    }
    
    res.json(result);
  } catch (error) {
    secureLog('MonitoringAPI', `Security check error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Security check failed' });
  }
});

module.exports = router;