-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "publicKey" TEXT,
    "secretKey" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "totalSize" INTEGER NOT NULL,
    "mimeType" TEXT,
    "chunkCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "metadataHash" TEXT NOT NULL,
    "encryptedChunkKeys" TEXT NOT NULL,
    "ringSignature" TEXT,
    "ringPublicKeys" TEXT,
    "escrowedIdentity" TEXT,
    "ownershipPublicKey" TEXT NOT NULL,
    "ownershipCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaderId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastRevocationId" TEXT,
    "lastRevocationAt" DATETIME,
    CONSTRAINT "File_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FileChunk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "chunkHash" TEXT NOT NULL,
    "ipfsCid" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "encryptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FileChunk_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFileAccess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "grantedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,
    "expiresAt" DATETIME,
    "keyStatus" TEXT NOT NULL DEFAULT 'client-managed',
    "hasLocalKey" BOOLEAN NOT NULL DEFAULT false,
    "keyIssuedAt" DATETIME,
    "keyPackageFingerprint" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "revokedAt" DATETIME,
    CONSTRAINT "UserFileAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserFileAccess_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnonymousRevocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "revokedUserId" TEXT,
    "proofR" TEXT NOT NULL,
    "proofS" TEXT NOT NULL,
    "proofMessage" TEXT NOT NULL,
    "proofTimestamp" DATETIME NOT NULL,
    "ringSignature" TEXT,
    "ringPublicKeys" TEXT,
    "chunksReencrypted" TEXT NOT NULL,
    "revocationStrategy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executedBySystem" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AnonymousRevocation_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntegrityAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "expectedHash" TEXT NOT NULL,
    "actualHash" TEXT,
    "reportedBy" TEXT NOT NULL,
    "reportedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" DATETIME,
    "resolution" TEXT,
    CONSTRAINT "IntegrityAlert_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "fileId" TEXT,
    "userId" TEXT,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Signature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "signerId" TEXT NOT NULL,
    "ringUserIds" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "isOpened" BOOLEAN NOT NULL DEFAULT false,
    "openingProof" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Signature_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Signature_signerId_fkey" FOREIGN KEY ("signerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "File_ownershipPublicKey_idx" ON "File"("ownershipPublicKey");

-- CreateIndex
CREATE INDEX "File_uploaderId_idx" ON "File"("uploaderId");

-- CreateIndex
CREATE INDEX "File_status_idx" ON "File"("status");

-- CreateIndex
CREATE INDEX "FileChunk_ipfsCid_idx" ON "FileChunk"("ipfsCid");

-- CreateIndex
CREATE UNIQUE INDEX "FileChunk_fileId_chunkIndex_key" ON "FileChunk"("fileId", "chunkIndex");

-- CreateIndex
CREATE INDEX "UserFileAccess_userId_idx" ON "UserFileAccess"("userId");

-- CreateIndex
CREATE INDEX "UserFileAccess_fileId_idx" ON "UserFileAccess"("fileId");

-- CreateIndex
CREATE INDEX "UserFileAccess_status_idx" ON "UserFileAccess"("status");
CREATE INDEX "UserFileAccess_keyStatus_idx" ON "UserFileAccess"("keyStatus");

-- CreateIndex
CREATE UNIQUE INDEX "UserFileAccess_userId_fileId_key" ON "UserFileAccess"("userId", "fileId");

-- CreateIndex
CREATE INDEX "AnonymousRevocation_fileId_idx" ON "AnonymousRevocation"("fileId");

-- CreateIndex
CREATE INDEX "AnonymousRevocation_revokedUserId_idx" ON "AnonymousRevocation"("revokedUserId");

-- CreateIndex
CREATE INDEX "AnonymousRevocation_createdAt_idx" ON "AnonymousRevocation"("createdAt");

-- CreateIndex
CREATE INDEX "IntegrityAlert_fileId_idx" ON "IntegrityAlert"("fileId");

-- CreateIndex
CREATE INDEX "IntegrityAlert_resolved_idx" ON "IntegrityAlert"("resolved");

-- CreateIndex
CREATE INDEX "AuditLog_fileId_idx" ON "AuditLog"("fileId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_eventType_idx" ON "AuditLog"("eventType");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");
