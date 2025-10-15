/*
  Warnings:

  - You are about to drop the column `revokedUserId` on the `AnonymousRevocation` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `secretKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Made the column `publicKey` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnonymousRevocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "revokedPublicKeyHash" TEXT,
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
INSERT INTO "new_AnonymousRevocation" ("chunksReencrypted", "createdAt", "executedBySystem", "fileId", "id", "proofMessage", "proofR", "proofS", "proofTimestamp", "revocationStrategy", "ringPublicKeys", "ringSignature") SELECT "chunksReencrypted", "createdAt", "executedBySystem", "fileId", "id", "proofMessage", "proofR", "proofS", "proofTimestamp", "revocationStrategy", "ringPublicKeys", "ringSignature" FROM "AnonymousRevocation";
DROP TABLE "AnonymousRevocation";
ALTER TABLE "new_AnonymousRevocation" RENAME TO "AnonymousRevocation";
CREATE INDEX "AnonymousRevocation_fileId_idx" ON "AnonymousRevocation"("fileId");
CREATE INDEX "AnonymousRevocation_revokedPublicKeyHash_idx" ON "AnonymousRevocation"("revokedPublicKeyHash");
CREATE INDEX "AnonymousRevocation_createdAt_idx" ON "AnonymousRevocation"("createdAt");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicKey" TEXT NOT NULL,
    "displayLabel" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "publicKey", "role", "updatedAt") SELECT "createdAt", "id", "publicKey", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_publicKey_key" ON "User"("publicKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
