/**
 * Test script to verify @noble package imports work correctly
 * Run with: node test-noble-imports.js
 */

console.log('Testing @noble package imports...\n');

// Test 1: @noble/secp256k1
console.log('1. Testing @noble/secp256k1');
try {
  const secp = require('@noble/secp256k1');
  console.log('   Available exports:', Object.keys(secp).join(', '));

  // Check if 'secp256k1' object exists
  if (secp.secp256k1) {
    console.log('   ✅ secp256k1 object exists');
  } else {
    console.log('   ❌ secp256k1 object DOES NOT exist (this is expected!)');
  }

  // Check for named exports
  if (secp.utils) {
    console.log('   ✅ utils export exists');
    console.log('   ✅ utils.randomPrivateKey:', typeof secp.utils.randomPrivateKey);
  }
  if (secp.getPublicKey) {
    console.log('   ✅ getPublicKey export exists');
  }
  if (secp.getSharedSecret) {
    console.log('   ✅ getSharedSecret export exists');
  }
} catch (err) {
  console.log('   ❌ Error:', err.message);
}

// Test 2: @noble/hashes
console.log('\n2. Testing @noble/hashes');
try {
  const hashes = require('@noble/hashes/sha2.js');
  console.log('   Available exports:', Object.keys(hashes).join(', '));
  if (hashes.sha256) {
    console.log('   ✅ sha256 export exists');
  }
} catch (err) {
  console.log('   ❌ Error:', err.message);
}

try {
  const utils = require('@noble/hashes/utils.js');
  console.log('   Available utils:', Object.keys(utils).join(', '));
  if (utils.bytesToHex) {
    console.log('   ✅ bytesToHex export exists');
  }
  if (utils.randomBytes) {
    console.log('   ✅ randomBytes export exists');
  }
} catch (err) {
  console.log('   ❌ Error:', err.message);
}

// Test 3: @noble/ciphers
console.log('\n3. Testing @noble/ciphers');
try {
  // Try with .js extension
  const chachaWithJs = require('@noble/ciphers/chacha.js');
  console.log('   ✅ chacha.js works:', !!chachaWithJs.xchacha20poly1305);
} catch (err) {
  console.log('   ❌ chacha.js failed:', err.message);
}

try {
  // Try without .js extension
  const chachaNoJs = require('@noble/ciphers/chacha');
  console.log('   ✅ chacha (no .js) works:', !!chachaNoJs.xchacha20poly1305);
} catch (err) {
  console.log('   ❌ chacha (no .js) failed:', err.message);
}

// Test 4: Actual usage test
console.log('\n4. Testing actual usage');
try {
  const { utils, getPublicKey, getSharedSecret } = require('@noble/secp256k1');
  const { bytesToHex } = require('@noble/hashes/utils.js');

  // Generate a random private key
  const privateKey = utils.randomPrivateKey();
  console.log('   ✅ Generated private key:', bytesToHex(privateKey).substring(0, 16) + '...');

  // Derive public key
  const publicKey = getPublicKey(privateKey, true);
  console.log('   ✅ Derived public key:', bytesToHex(publicKey).substring(0, 16) + '...');

  console.log('\n✅ ALL TESTS PASSED!');
} catch (err) {
  console.log('   ❌ Usage test failed:', err.message);
  console.log('   Stack:', err.stack);
}
