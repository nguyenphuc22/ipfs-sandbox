# Anonymous Upload Implementation

**Date:** 2025-10-15
**Status:** ✅ COMPLETE *(backend `npm test` suites all green as of 16/10/2025)*

## Overview

Refactored the upload flow to be fully anonymous, removing all dependencies on `userId` and the `User` table. The system now uses `uploaderPublicKeyHash = SHA256(ownershipPublicKey)` to track uploaders anonymously.

## Changes Made

### 1. Database Schema Updates

**File:** `backend/prisma/schema.prisma`

- Added `uploaderPublicKeyHash String?` field to `File` model
- Made `uploaderId String?` nullable
- Made `uploader User?` relation optional
- Added index: `@@index([uploaderPublicKeyHash])`

**Migration:** `20251015150722_add_uploader_public_key_hash`

```sql
-- Added uploaderPublicKeyHash column (nullable)
-- Made uploaderId nullable
-- Added index on uploaderPublicKeyHash
```

**Data Migration:** `backend/prisma/data-migration-uploader-hash.js`
- Script to populate `uploaderPublicKeyHash` for existing File records
- Computes SHA256(User.publicKey) for backward compatibility

### 2. Service Layer Changes

**File:** `backend/src/services/fileChunkService.js`

**Function:** `uploadFileWithChunks()`

**Before:**
```javascript
async function uploadFileWithChunks({
  fileBuffer, fileName, mimeType,
  userId,  // ❌ Required User ID
  // ...
}) {
  // ...

  // ❌ Query User table
  const uploader = await prisma.user.findUnique({
    where: { id: userId }
  });

  const accessorPublicKeyHash = crypto
    .createHash('sha256')
    .update(uploader.publicKey)
    .digest('hex');

  // ❌ Store userId
  const fileRecord = await prisma.file.create({
    data: {
      uploaderId: userId,
      // ...
    },
  });
}
```

**After:**
```javascript
async function uploadFileWithChunks({
  fileBuffer, fileName, mimeType,
  uploaderPublicKeyHash,  // ✅ Public key hash directly
  ownershipPublicKey,     // ✅ For verification
  // ...
}) {
  // ...

  // ✅ NO User table query needed
  const accessorPublicKeyHash = uploaderPublicKeyHash;

  // ✅ Store publicKeyHash, not userId
  const fileRecord = await prisma.file.create({
    data: {
      uploaderPublicKeyHash,  // ✅
      uploaderId: null,       // ✅
      // ...
    },
  });
}
```

### 3. Route Layer Changes

**File:** `backend/src/routes/files.js` (Upload section)

**Endpoint:** `POST /chunked-upload`

**Before:**
```javascript
// ❌ Query User table to get userId
const ownerRecord = getUserByPublicKey(ownershipPublicKey);
const userId = ownerRecord?.userId || ownershipPublicKey;

await uploadFileWithChunks({
  userId,  // ❌
  // ...
});
```

**After:**
```javascript
// ✅ Compute publicKeyHash directly - NO User table query
const uploaderPublicKeyHash = crypto
  .createHash('sha256')
  .update(ownershipPublicKey)
  .digest('hex');

await uploadFileWithChunks({
  uploaderPublicKeyHash,  // ✅
  // ...
});
```

**Endpoint:** `POST /aot-upload`

**Changes:**
- Removed `getUserByPublicKey()` call
- Removed `ownerUserId` and `ownerIdentifier` from `addFileRecord()` call

### 4. Storage Layer

**File:** `backend/src/utils/aotStorage.js`

**Status:** ✅ Already updated in Task 6
- `SAMPLE_USERS` no longer have `userId` field
- `registerUser()` doesn't assign `userId`
- `addFileRecord()` accepts records without `ownerUserId`/`ownerIdentifier`

## Anonymous Upload Flow

### Client → Server

```
1. Client generates Schnorr ownership proof
   proof = schnorr.sign(message, ownershipPrivateKey)

2. Client sends upload request
   POST /chunked-upload
   Body: {
     file: <binary>,
     ownershipPublicKey: "02abc123...",
     ownershipProof: { R, s, message, publicKey },
     metadataHash: "sha256(...)",
     ringSignature: "..." (if ring size >= 2)
   }
```

### Server Processing

```
3. Server verifies Schnorr proof
   ✅ schnorr.verify(proof, ownershipPublicKey)

4. Server computes uploaderPublicKeyHash
   uploaderPublicKeyHash = SHA256(ownershipPublicKey)
   ✅ NO User table query

5. Server uploads chunks to IPFS
   chunks → IPFS → CIDs

6. Server stores File record
   File {
     uploaderPublicKeyHash: "abc123...",  // ✅
     uploaderId: null,                    // ✅
     ownershipPublicKey: "02abc123...",
     // ...
   }

7. Server creates AnonymousFileAccess
   AnonymousFileAccess {
     accessorPublicKeyHash: "abc123...",  // ✅
     fileId: "...",
     // ...
   }

8. Server logs to AnonymousAuditLog
   AnonymousAuditLog {
     eventType: "upload",
     publicKeyHash: "abc123...",  // ✅ (not userId)
     metadata: { ownershipPublicKey, schnorrProof, ... }
   }
```

## Database Schema (After Changes)

```prisma
model File {
  id                   String   @id @default(uuid())
  fileName             String
  totalSize            Int
  // ...
  uploaderId           String?   // ✅ Nullable (legacy support)
  uploaderPublicKeyHash String?  // ✅ NEW: Anonymous uploader tracking
  uploader             User?    @relation("FileUploader", ...)  // ✅ Optional

  @@index([uploaderPublicKeyHash])  // ✅ NEW index
}

model AnonymousFileAccess {
  accessorPublicKeyHash String  // ✅ SHA256(publicKey)
  fileId                String
  // ... NO userId

  @@index([accessorPublicKeyHash])
}

model AnonymousAuditLog {
  eventType     String
  publicKeyHash String?  // ✅ SHA256(publicKey)
  // ... NO userId

  @@index([publicKeyHash])
}
```

## Verification Checklist

- [x] **No User table queries in upload flow**
  - Removed `getUserByPublicKey()` from `/chunked-upload`
  - Removed `prisma.user.findUnique()` from `uploadFileWithChunks()`

- [x] **Uses uploaderPublicKeyHash everywhere**
  - `File.uploaderPublicKeyHash` stored
  - `AnonymousFileAccess.accessorPublicKeyHash` uses same hash
  - `AnonymousAuditLog.publicKeyHash` uses same hash

- [x] **Backward compatibility maintained**
  - `uploaderId` is nullable (not deleted)
  - Data migration script available
  - Existing files still accessible

- [x] **Authentication still secure**
  - Schnorr proof verification unchanged
  - Ring signature verification unchanged
  - publicKeyHash = SHA256(publicKey) for privacy

## Testing

**Manual Testing:**
```bash
# 1. Upload a file anonymously
curl -X POST http://localhost:3000/api/files/chunked-upload \
  -F "file=@test.txt" \
  -F "ownershipPublicKey=02abc123..." \
  -F "ownershipProofR=..." \
  -F "ownershipProofS=..." \
  -F "ownershipProofMessage=..." \
  -F "metadataHash=..."

# 2. Verify database - should see uploaderPublicKeyHash, NOT userId
sqlite3 backend/prisma/data/app.db
sqlite> SELECT id, fileName, uploaderPublicKeyHash, uploaderId FROM File ORDER BY createdAt DESC LIMIT 1;

# Expected:
# - uploaderPublicKeyHash: "abc123..." (64-char hex)
# - uploaderId: NULL

# 3. Verify AnonymousFileAccess created
sqlite> SELECT accessorPublicKeyHash, fileId FROM AnonymousFileAccess ORDER BY grantedAt DESC LIMIT 1;

# Expected:
# - accessorPublicKeyHash matches uploaderPublicKeyHash from File
```

## Benefits

1. **Full Anonymity**: No userId stored or queried during upload
2. **Privacy**: Only hash of public key is stored, not raw public key in user tables
3. **Decoupling**: Upload flow independent of User table
4. **Consistency**: Same pattern as download flow (Task 6, Task 8)
5. **Security**: Schnorr + Ring signature verification unchanged

## Related Tasks

- ✅ **Task 6**: Mobile Anonymous Flow Alignment
- ✅ **Task 8**: Documentation & Flow Alignment
- ✅ **Task 9**: Anonymous Upload Alignment (this task)

## Migration Path

For existing systems:

1. Apply schema migration: `npx prisma migrate dev`
2. Run data migration: `node backend/prisma/data-migration-uploader-hash.js`
3. Deploy updated code
4. Verify no userId leaks in logs/responses

## Notes

- `uploaderId` field kept as nullable for backward compatibility
- Future uploads will have `uploaderId = NULL`, `uploaderPublicKeyHash = SHA256(ownershipPublicKey)`
- Old files with `uploaderId` will continue to work
- System can gradually phase out User table dependency
