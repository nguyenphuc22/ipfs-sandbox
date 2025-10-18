-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnonymousFileAccess" (
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
    "revokedAt" DATETIME,
    "lastOwnerProof" TEXT,
    CONSTRAINT "AnonymousFileAccess_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AnonymousFileAccess" (
    "id", "accessorPublicKeyHash", "fileId", "grantedAt", "expiresAt", "lastAccessProof",
    "lastAccessAt", "accessCount", "keyStatus", "keyPackageFingerprint", "status"
) SELECT
    "id", "accessorPublicKeyHash", "fileId", "grantedAt", "expiresAt", "lastAccessProof",
    "lastAccessAt", "accessCount", "keyStatus", "keyPackageFingerprint", "status"
FROM "AnonymousFileAccess";
DROP TABLE "AnonymousFileAccess";
ALTER TABLE "new_AnonymousFileAccess" RENAME TO "AnonymousFileAccess";
CREATE UNIQUE INDEX "AnonymousFileAccess_accessorPublicKeyHash_fileId_key" ON "AnonymousFileAccess"("accessorPublicKeyHash", "fileId");
CREATE INDEX "AnonymousFileAccess_accessorPublicKeyHash_idx" ON "AnonymousFileAccess"("accessorPublicKeyHash");
CREATE INDEX "AnonymousFileAccess_fileId_idx" ON "AnonymousFileAccess"("fileId");
CREATE INDEX "AnonymousFileAccess_status_idx" ON "AnonymousFileAccess"("status");
CREATE INDEX "AnonymousFileAccess_fileId_accessorPublicKeyHash_idx" ON "AnonymousFileAccess"("fileId", "accessorPublicKeyHash");

CREATE TABLE "new_AnonymousAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "fileId" TEXT,
    "publicKeyHash" TEXT,
    "deviceFingerprint" TEXT,
    "ringSignature" TEXT,
    "ringPublicKeys" TEXT,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "revokedAt" DATETIME,
    "lastOwnerProof" TEXT
);
INSERT INTO "new_AnonymousAuditLog" (
    "id", "eventType", "fileId", "publicKeyHash", "deviceFingerprint", "ringSignature",
    "ringPublicKeys", "metadata", "timestamp"
) SELECT
    "id", "eventType", "fileId", "publicKeyHash", "deviceFingerprint", "ringSignature",
    "ringPublicKeys", "metadata", "timestamp"
FROM "AnonymousAuditLog";
DROP TABLE "AnonymousAuditLog";
ALTER TABLE "new_AnonymousAuditLog" RENAME TO "AnonymousAuditLog";
CREATE INDEX "AnonymousAuditLog_publicKeyHash_idx" ON "AnonymousAuditLog"("publicKeyHash");
CREATE INDEX "AnonymousAuditLog_eventType_idx" ON "AnonymousAuditLog"("eventType");
CREATE INDEX "AnonymousAuditLog_timestamp_idx" ON "AnonymousAuditLog"("timestamp");
CREATE INDEX "AnonymousAuditLog_fileId_idx" ON "AnonymousAuditLog"("fileId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
