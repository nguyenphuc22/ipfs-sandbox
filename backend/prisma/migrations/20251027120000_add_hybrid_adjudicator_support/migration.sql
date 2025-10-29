-- CreateTable
CREATE TABLE "ValidationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileMetadataHash" TEXT NOT NULL,
    "userPublicKeyHash" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "signature" TEXT NOT NULL,
    "adjudicatorPublicKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ValidationToken_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ValidationToken_fileId_key" ON "ValidationToken"("fileId");
CREATE UNIQUE INDEX "ValidationToken_tokenId_key" ON "ValidationToken"("tokenId");
CREATE UNIQUE INDEX "ValidationToken_signature_key" ON "ValidationToken"("signature");
CREATE INDEX "ValidationToken_userPublicKeyHash_idx" ON "ValidationToken"("userPublicKeyHash");
CREATE INDEX "ValidationToken_fileMetadataHash_idx" ON "ValidationToken"("fileMetadataHash");

-- CreateTable
CREATE TABLE "InvestigationAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investigationId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "adminApproval" TEXT NOT NULL,
    "legalAuthorization" TEXT NOT NULL,
    "decryptedPublicKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestigationAudit_investigationId_key" ON "InvestigationAudit"("investigationId");
CREATE INDEX "InvestigationAudit_fileId_idx" ON "InvestigationAudit"("fileId");
CREATE INDEX "InvestigationAudit_decryptedPublicKey_idx" ON "InvestigationAudit"("decryptedPublicKey");

-- CreateTable
CREATE TABLE "ValidationNonce" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nonce" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ValidationNonce_nonce_key" ON "ValidationNonce"("nonce");
CREATE INDEX "ValidationNonce_nonce_idx" ON "ValidationNonce"("nonce");

-- CreateTable
CREATE TABLE "ValidationTokenAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenId" TEXT NOT NULL,
    "userPublicKey" TEXT NOT NULL,
    "userPublicKeyHash" TEXT NOT NULL,
    "fileMetadataHash" TEXT NOT NULL,
    "requestNonce" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "signature" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ValidationTokenAudit_tokenId_key" ON "ValidationTokenAudit"("tokenId");
CREATE INDEX "ValidationTokenAudit_userPublicKey_idx" ON "ValidationTokenAudit"("userPublicKey");
CREATE INDEX "ValidationTokenAudit_userPublicKeyHash_idx" ON "ValidationTokenAudit"("userPublicKeyHash");
CREATE INDEX "ValidationTokenAudit_requestNonce_idx" ON "ValidationTokenAudit"("requestNonce");

-- CreateTable
CREATE TABLE "BannedUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicKey" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "bannedByAdmin" TEXT NOT NULL,
    "bannedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "BannedUser_publicKey_key" ON "BannedUser"("publicKey");
CREATE INDEX "BannedUser_publicKey_idx" ON "BannedUser"("publicKey");
