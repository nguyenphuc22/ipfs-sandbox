-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
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
    "uploaderId" TEXT,
    "uploaderPublicKeyHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastRevocationId" TEXT,
    "lastRevocationAt" DATETIME,
    CONSTRAINT "File_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_File" ("chunkCount", "createdAt", "encryptedChunkKeys", "escrowedIdentity", "fileName", "id", "lastRevocationAt", "lastRevocationId", "metadata", "metadataHash", "mimeType", "ownershipCreatedAt", "ownershipPublicKey", "ringPublicKeys", "ringSignature", "status", "totalSize", "updatedAt", "uploaderId") SELECT "chunkCount", "createdAt", "encryptedChunkKeys", "escrowedIdentity", "fileName", "id", "lastRevocationAt", "lastRevocationId", "metadata", "metadataHash", "mimeType", "ownershipCreatedAt", "ownershipPublicKey", "ringPublicKeys", "ringSignature", "status", "totalSize", "updatedAt", "uploaderId" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE INDEX "File_ownershipPublicKey_idx" ON "File"("ownershipPublicKey");
CREATE INDEX "File_uploaderId_idx" ON "File"("uploaderId");
CREATE INDEX "File_uploaderPublicKeyHash_idx" ON "File"("uploaderPublicKeyHash");
CREATE INDEX "File_status_idx" ON "File"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
