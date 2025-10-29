"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptEscrowPackage = exports.getPublicKeyHex = exports.verifyMessageSignature = exports.signMessageHex = exports.hashSha256Hex = void 0;
const secp256k1_1 = require("@noble/curves/secp256k1");
const sha256_1 = require("@noble/hashes/sha256");
const utils_1 = require("@noble/hashes/utils");
const chacha_1 = require("@noble/ciphers/chacha");
const util_1 = require("util");
const textDecoder = new util_1.TextDecoder();
function hashSha256Hex(value) {
    const data = typeof value === 'string' ? Buffer.from(value, 'utf8') : value;
    return (0, utils_1.bytesToHex)((0, sha256_1.sha256)(data));
}
exports.hashSha256Hex = hashSha256Hex;
function signMessageHex(privateKeyHex, message) {
    const messageDigest = (0, sha256_1.sha256)(Buffer.from(message, 'utf8'));
    const privateKey = (0, utils_1.hexToBytes)(privateKeyHex);
    const signature = secp256k1_1.schnorr.sign(messageDigest, privateKey);
    return (0, utils_1.bytesToHex)(signature);
}
exports.signMessageHex = signMessageHex;
function verifyMessageSignature(publicKeyHex, signatureHex, message) {
    try {
        const messageDigest = (0, sha256_1.sha256)(Buffer.from(message, 'utf8'));
        const publicKey = (0, utils_1.hexToBytes)(publicKeyHex);
        const signature = (0, utils_1.hexToBytes)(signatureHex);
        return secp256k1_1.schnorr.verify(signature, messageDigest, publicKey);
    }
    catch (error) {
        console.error('[Crypto] Signature verification failed', error);
        return false;
    }
}
exports.verifyMessageSignature = verifyMessageSignature;
function getPublicKeyHex(privateKeyHex) {
    const privateKey = (0, utils_1.hexToBytes)(privateKeyHex);
    const publicKey = secp256k1_1.schnorr.getPublicKey(privateKey);
    return (0, utils_1.bytesToHex)(publicKey);
}
exports.getPublicKeyHex = getPublicKeyHex;
function deriveSharedKey(privateKeyHex, peerPublicKeyHex) {
    const privateKey = (0, utils_1.hexToBytes)(privateKeyHex);
    const publicKey = (0, utils_1.hexToBytes)(peerPublicKeyHex);
    const sharedSecret = secp256k1_1.secp256k1.getSharedSecret(privateKey, publicKey, true);
    const secret = sharedSecret.slice(1);
    return (0, sha256_1.sha256)(secret);
}
function decryptEscrowPackage(adjudicatorPrivateKeyHex, packageBase64) {
    try {
        const decodedJson = Buffer.from(packageBase64, 'base64').toString('utf8');
        const envelope = JSON.parse(decodedJson);
        if (!envelope || envelope.version !== 1) {
            throw new Error('Unsupported escrow package version');
        }
        const sharedKey = deriveSharedKey(adjudicatorPrivateKeyHex, envelope.ephemeralPublicKey);
        const nonce = (0, utils_1.hexToBytes)(envelope.nonce);
        const ciphertext = (0, utils_1.hexToBytes)(envelope.ciphertext);
        const cipher = (0, chacha_1.xchacha20poly1305)(sharedKey, nonce);
        const plaintext = cipher.decrypt(ciphertext);
        return textDecoder.decode(plaintext);
    }
    catch (error) {
        throw new Error(`Escrow decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
exports.decryptEscrowPackage = decryptEscrowPackage;
