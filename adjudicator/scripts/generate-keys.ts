import { schnorr, secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes, randomBytes } from '@noble/hashes/utils';

function generateKeyPair() {
  const privateKey = randomBytes(32);
  const publicKey = schnorr.getPublicKey(privateKey);
  return {
    privateKey: bytesToHex(privateKey),
    publicKey: bytesToHex(publicKey),
  };
}

function generateEciesPair() {
  const privateKey = randomBytes(32);
  const publicKey = secp256k1.getPublicKey(privateKey, true);
  return {
    privateKey: bytesToHex(privateKey),
    publicKey: bytesToHex(publicKey),
  };
}

const schnorrPair = generateKeyPair();
const eciesPair = generateEciesPair();

console.log('=== Adjudicator Key Material ===');
console.log('Schnorr Private Key:', schnorrPair.privateKey);
console.log('Schnorr Public Key :', schnorrPair.publicKey);
console.log('ECIES Private Key  :', eciesPair.privateKey);
console.log('ECIES Public Key   :', eciesPair.publicKey);

console.log('\nSet the following environment variables in adjudicator/.env and backend/.env:');
console.log(`ADJUDICATOR_PRIVATE_KEY=${schnorrPair.privateKey}`);
console.log(`ADJUDICATOR_PUBLIC_KEY=${schnorrPair.publicKey}`);
console.log(`ADJUDICATOR_ECIES_PRIVATE_KEY=${eciesPair.privateKey}`);
console.log(`ADJUDICATOR_ECIES_PUBLIC_KEY=${eciesPair.publicKey}`);
