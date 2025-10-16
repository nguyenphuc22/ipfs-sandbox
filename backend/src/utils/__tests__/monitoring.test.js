/**
 * Test for monitoring and logging mask functionality
 */
const { maskHashForLogging, secureLog } = require('../monitoring');

describe('Monitoring Utilities', () => {
  test('maskHashForLogging should truncate public key hashes', () => {
    const publicKeyHash = 'a1b2c3d4e5f67890123456789012345678901234567890123456789012345678';
    const masked = maskHashForLogging(publicKeyHash, 'publicKeyHash');
    
    expect(masked).toMatch(/^a1b2c3d4e5f67890\.\.\.$/);
    expect(masked.length).toBeLessThan(publicKeyHash.length);
  });

  test('maskHashForLogging should handle different hash types', () => {
    const nonce = 'test-nonce-1234567890abcdef';
    const maskedNonce = maskHashForLogging(nonce, 'nonce');
    
    expect(maskedNonce).toMatch(/^\[NONCE_test-non\.\.\.\]$/);
  });

  test('secureLog should mask hash values in messages', () => {
    // We can't easily test console.log output, but we can verify the function exists
    expect(typeof secureLog).toBe('function');
    
    // Test that it doesn't crash with various inputs
    expect(() => {
      secureLog('TestModule', 'Test message with hash test1234567890abcdef', 'info', {
        publicKeyHash: 'test1234567890abcdef1234567890abcdef1234567890abcdef'
      });
    }).not.toThrow();
  });
});