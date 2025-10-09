/*
  Warnings:

  - You are about to drop the column `reportedBy` on the `IntegrityAlert` table. All the data in the column will be lost.
  - Added the required column `reportedByPublicKeyHash` to the `IntegrityAlert` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AnonymousFileAccess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessorPublicKeyHash" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "grantedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "lastAccessProof" TEXT,
    "lastAccessAt" DATETIME,
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "keyStatus" TEXT NOT NULL DEFAULT 'client-managed',
    "keyPackageFingerprint" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    CONSTRAINT "AnonymousFileAccess_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnonymousAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "fileId" TEXT,
    "publicKeyHash" TEXT,
    "deviceFingerprint" TEXT,
    "ringSignature" TEXT,
    "ringPublicKeys" TEXT,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AnonymousSharingRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "sharerPublicKeyHash" TEXT NOT NULL,
    "recipientPublicKeyHash" TEXT NOT NULL,
    "ownershipProof" TEXT NOT NULL,
    "ringSignature" TEXT NOT NULL,
    "keyPackageFingerprint" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" DATETIME,
    CONSTRAINT "AnonymousSharingRequest_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IntegrityAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "expectedHash" TEXT NOT NULL,
    "actualHash" TEXT,
    "reportedByPublicKeyHash" TEXT NOT NULL,
    "reportedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" DATETIME,
    "resolution" TEXT,
    CONSTRAINT "IntegrityAlert_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_IntegrityAlert" ("actualHash", "chunkIndex", "expectedHash", "fileId", "id", "reportedAt", "resolution", "resolved", "resolvedAt") SELECT "actualHash", "chunkIndex", "expectedHash", "fileId", "id", "reportedAt", "resolution", "resolved", "resolvedAt" FROM "IntegrityAlert";
DROP TABLE "IntegrityAlert";
ALTER TABLE "new_IntegrityAlert" RENAME TO "IntegrityAlert";
CREATE INDEX "IntegrityAlert_fileId_idx" ON "IntegrityAlert"("fileId");
CREATE INDEX "IntegrityAlert_resolved_idx" ON "IntegrityAlert"("resolved");
CREATE INDEX "IntegrityAlert_reportedByPublicKeyHash_idx" ON "IntegrityAlert"("reportedByPublicKeyHash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "AnonymousFileAccess_accessorPublicKeyHash_idx" ON "AnonymousFileAccess"("accessorPublicKeyHash");

-- CreateIndex
CREATE INDEX "AnonymousFileAccess_fileId_idx" ON "AnonymousFileAccess"("fileId");

-- CreateIndex
CREATE INDEX "AnonymousFileAccess_status_idx" ON "AnonymousFileAccess"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousFileAccess_accessorPublicKeyHash_fileId_key" ON "AnonymousFileAccess"("accessorPublicKeyHash", "fileId");

-- CreateIndex
CREATE INDEX "AnonymousAuditLog_publicKeyHash_idx" ON "AnonymousAuditLog"("publicKeyHash");

-- CreateIndex
CREATE INDEX "AnonymousAuditLog_eventType_idx" ON "AnonymousAuditLog"("eventType");

-- CreateIndex
CREATE INDEX "AnonymousAuditLog_timestamp_idx" ON "AnonymousAuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AnonymousAuditLog_fileId_idx" ON "AnonymousAuditLog"("fileId");

-- CreateIndex
CREATE INDEX "AnonymousSharingRequest_sharerPublicKeyHash_idx" ON "AnonymousSharingRequest"("sharerPublicKeyHash");

-- CreateIndex
CREATE INDEX "AnonymousSharingRequest_recipientPublicKeyHash_idx" ON "AnonymousSharingRequest"("recipientPublicKeyHash");

-- CreateIndex
CREATE INDEX "AnonymousSharingRequest_fileId_idx" ON "AnonymousSharingRequest"("fileId");

-- CreateIndex
CREATE INDEX "AnonymousSharingRequest_status_idx" ON "AnonymousSharingRequest"("status");
