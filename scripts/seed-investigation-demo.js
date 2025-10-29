#!/usr/bin/env node
/* eslint-disable no-console */
const { PrismaClient } = require('../backend/generated/prismaClient');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Hybrid Adjudicator demo data...');

  const adminPublicKey = 'admin-demo-public-key';
  const uploaderKey = '024c3cb8bf5e1bf3a808aa7cf7c56ab10715d62adb0fa74b20dbb6c18909b8badd';
  const uploaderHash = require('crypto').createHash('sha256').update(uploaderKey).digest('hex');

  const file = await prisma.file.upsert({
    where: { metadataHash: 'demo-manifest-hash' },
    update: {},
    create: {
      fileName: 'demo-report.pdf',
      totalSize: 1024,
      mimeType: 'application/pdf',
      chunkCount: 1,
      metadataHash: 'demo-manifest-hash',
      encryptedChunkKeys: JSON.stringify({ encryptedData: 'demo', iv: 'iv', authTag: 'auth' }),
      ownershipPublicKey: uploaderKey,
      uploaderPublicKeyHash: uploaderHash,
      escrowedIdentity: 'demo-escrow',
      metadata: JSON.stringify({ clientChunked: true, uploadTimestamp: new Date().toISOString() }),
    },
  });

  await prisma.validationToken.upsert({
    where: { fileId: file.id },
    update: {},
    create: {
      tokenId: 'demo-token-id',
      fileId: file.id,
      fileMetadataHash: 'demo-manifest-hash',
      userPublicKeyHash: uploaderHash,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      signature: 'deadbeef',
      adjudicatorPublicKey: 'demo-adjudicator-key',
    },
  });

  await prisma.validationTokenAudit.upsert({
    where: { tokenId: 'demo-token-id' },
    update: {},
    create: {
      tokenId: 'demo-token-id',
      userPublicKey: uploaderKey,
      userPublicKeyHash: uploaderHash,
      fileMetadataHash: 'demo-manifest-hash',
      requestNonce: 'demo-nonce',
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      signature: 'deadbeef',
    },
  });

  await prisma.bannedUser.upsert({
    where: { publicKey: 'banned-public-key-demo' },
    update: { reason: 'Demo banned user', bannedByAdmin: adminPublicKey, bannedAt: new Date() },
    create: {
      publicKey: 'banned-public-key-demo',
      reason: 'Demo banned user',
      bannedByAdmin: adminPublicKey,
    },
  });

  const legalAuthorization = 'Court Order #DEMO-2025';
  const adminApprovalPayload = {
    version: 1,
    adminUser: adminPublicKey,
    fileId: file.id,
    investigationReason: 'Seeded honeypot suspicion',
    legalAuthorization,
    signedAt: new Date().toISOString(),
    signature: 'demo-seed-signature',
  };

  await prisma.investigationAudit.create({
    data: {
      investigationId: `demo-investigation-${Date.now()}`,
      fileId: file.id,
      reason: 'Seeded honeypot suspicion',
      adminApproval: JSON.stringify(adminApprovalPayload),
      legalAuthorization,
      decryptedPublicKey: uploaderKey,
    },
  });

  await prisma.anonymousAuditLog.create({
    data: {
      eventType: 'admin_flag',
      fileId: file.id,
      metadata: JSON.stringify({ reason: 'Seeded suspicious behaviour', adminUser: adminPublicKey, severity: 'high' }),
    },
  });

  console.log('✅ Seed complete. File ID:', file.id);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
