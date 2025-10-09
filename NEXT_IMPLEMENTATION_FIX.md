# 🔧 NEXT IMPLEMENTATION FIX - Anonymous Download Flow (DEMO VERSION)

**Ngày:** 2025-10-09
**Mức độ ưu tiên:** 🔴 CRITICAL
**Ước tính thời gian:** 3-4 weeks (đơn giản hóa cho demo)
**⚠️ LƯU Ý:** Đây là phiên bản demo - KHÔNG CẦN migration phức tạp, có thể reset database

---

## 📋 MỤC LỤC

1. [Overview](#1-overview)
2. [Files cần thay đổi](#2-files-cần-thay-đổi)
3. [Phase 1: Database Schema](#phase-1-database-schema)
4. [Phase 2: Backend API](#phase-2-backend-api)
5. [Phase 3: Mobile App](#phase-3-mobile-app)
6. [Phase 4: Testing](#phase-4-testing)
7. [Rollback Plan](#rollback-plan)
8. [Checklist](#checklist)

---

## 1. OVERVIEW

### 1.1. Mục tiêu

```
✅ Loại bỏ userId khỏi download flow
✅ Implement public key based access
✅ Add ring signature verification cho mọi request
✅ Update audit logs để ẩn danh
✅ Maintain backward compatibility (nếu có thể)
```

### 1.2. Breaking Changes Summary (DEMO - Simplified)

| Component | Old | New | Breaking? | Demo Solution |
|-----------|-----|-----|-----------|---------------|
| **UserFileAccess** | `userId` (string) | `accessorPublicKeyHash` (string) | ✅ YES | **Drop & recreate table** |
| **AuditLog** | `userId` (string) | `publicKeyHash` (string) | ✅ YES | **Drop & recreate table** |
| **API Endpoint** | `GET /api/files/my-files` (JWT) | `POST /api/files/anonymous-list` (Ring Sig) | ✅ YES | Create new endpoints |
| **Mobile Service** | `GatewayApiService` (JWT) | `AnonymousFileAccessService` (Ring Sig) | ✅ YES | New service class |
| **Database** | SQLite schema v1 | SQLite schema v2 | ✅ YES | **Prisma migrate reset** |

✅ **DEMO: Có thể reset database và tạo lại từ đầu - KHÔNG cần migrate data cũ**

---

## 2. FILES CẦN THAY ĐỔI

### 2.1. Backend Files

```
backend/
├── prisma/
│   ├── schema.prisma                    ⚠️ CRITICAL - Database schema
│   └── migrations/
│       └── YYYYMMDD_anonymous_download/ ⚠️ NEW - Migration script
│
├── src/
│   ├── routes/
│   │   └── files.js                     ⚠️ CRITICAL - API endpoints
│   │
│   ├── services/
│   │   ├── FileAccessService.ts         ⚠️ NEW - Anonymous access logic
│   │   ├── RingSignatureService.ts      ⚠️ UPDATE - Add verification
│   │   └── AuditService.ts              ⚠️ UPDATE - Remove userId
│   │
│   └── middleware/
│       └── anonymousAuth.ts             ⚠️ NEW - Ring signature middleware
```

### 2.2. Mobile Files

```
mobile/
├── src/
│   ├── services/
│   │   ├── AnonymousFileAccessService.ts  ⚠️ NEW - Replace GatewayApiService
│   │   ├── CryptoService.ts               ⚠️ UPDATE - Add ring signature
│   │   └── KeyManagementService.ts        ⚠️ UPDATE - Public key management
│   │
│   ├── screens/
│   │   ├── FileListScreen.tsx             ⚠️ UPDATE - Use anonymous API
│   │   ├── FileDownloadScreen.tsx         ⚠️ UPDATE - Ring signature flow
│   │   └── FileSharingScreen.tsx          ⚠️ UPDATE - Anonymous sharing
│   │
│   └── hooks/
│       └── useAnonymousFileAccess.ts      ⚠️ NEW - React hook
```

### 2.3. Documentation Files

```
docs/
├── ANONYMOUS_DOWNLOAD_REDESIGN.md        ✅ DONE - Problem analysis
├── NEXT_IMPLEMENTATION_FIX.md            ✅ DONE - This file
├── DOWNLOAD_FLOW_FINAL.md                ⚠️ UPDATE - Rewrite with new design
└── API_REFERENCE.md                      ⚠️ UPDATE - Document new endpoints
```

---

## PHASE 1: DATABASE SCHEMA (DEMO - Simplified)

**Timeline:** Day 1-2
**Priority:** 🔴 CRITICAL (blocking other phases)

### 🎯 Demo Approach: DROP & RECREATE (No Migration Needed)

**Lý do:**
- Dự án demo không cần giữ data cũ
- Không có production data cần migrate
- Đơn giản và nhanh hơn nhiều
- Dễ test và rollback

### Step 1.1: ~~Backup hiện tại~~ (SKIP - Không cần cho demo)

**⚠️ LƯU Ý CHO DEMO:**
- Nếu muốn giữ data test cũ, chỉ cần copy file `dev.db` thủ công
- Hoặc chấp nhận reset toàn bộ database

```bash
# (Optional) Backup đơn giản cho demo
cp backend/prisma/dev.db backend/prisma/dev.db.backup-$(date +%Y%m%d)
```

### Step 1.2: Update schema.prisma

**File:** `backend/prisma/schema.prisma`

#### A. Add new models

```prisma
// ============================================================================
// ANONYMOUS FILE ACCESS (Thay thế UserFileAccess)
// ============================================================================

model AnonymousFileAccess {
  id                    String    @id @default(uuid())

  // ✅ Public key hash thay vì userId
  accessorPublicKeyHash String    // SHA256(publicKey)
  fileId                String
  file                  File      @relation(fields: [fileId], references: [id], onDelete: Cascade)

  // Access metadata
  grantedAt             DateTime  @default(now())
  expiresAt             DateTime?

  // Proof tracking
  lastAccessProof       String?   // Latest ring signature
  lastAccessAt          DateTime?
  accessCount           Int       @default(0)

  // Key management
  keyStatus             String    @default("client-managed")
  keyPackageFingerprint String?

  // Status
  status                String    @default("active")

  @@unique([accessorPublicKeyHash, fileId])
  @@index([accessorPublicKeyHash])
  @@index([fileId])
  @@index([status])
}

// ============================================================================
// ANONYMOUS AUDIT LOG (Thay thế AuditLog)
// ============================================================================

model AnonymousAuditLog {
  id                String    @id @default(uuid())

  eventType         String
  fileId            String?

  // ✅ Public key hash thay vì userId
  publicKeyHash     String?
  deviceFingerprint String?

  // Cryptographic proof
  ringSignature     String?
  ringPublicKeys    String?

  // Event data
  metadata          String?

  timestamp         DateTime  @default(now())

  @@index([publicKeyHash])
  @@index([eventType])
  @@index([timestamp])
  @@index([fileId])
}

// ============================================================================
// ANONYMOUS SHARING REQUEST
// ============================================================================

model AnonymousSharingRequest {
  id                    String    @id @default(uuid())

  fileId                String
  file                  File      @relation(fields: [fileId], references: [id])

  // ✅ Public key hashes
  sharerPublicKeyHash   String
  recipientPublicKeyHash String

  // Proofs
  ownershipProof        String
  ringSignature         String

  // Metadata
  keyPackageFingerprint String?

  status                String    @default("pending")
  requestedAt           DateTime  @default(now())
  respondedAt           DateTime?

  @@index([sharerPublicKeyHash])
  @@index([recipientPublicKeyHash])
  @@index([fileId])
  @@index([status])
}

// ============================================================================
// UPDATE INTEGRITY ALERT
// ============================================================================

model IntegrityAlert {
  id                String    @id @default(uuid())
  fileId            String
  file              File      @relation(fields: [fileId], references: [id], onDelete: Cascade)

  chunkIndex        Int
  expectedHash      String
  actualHash        String?

  // ✅ CHANGE: publicKeyHash thay vì userId
  reportedByPublicKeyHash String
  reportedAt        DateTime  @default(now())

  resolved          Boolean   @default(false)
  resolvedAt        DateTime?
  resolution        String?

  @@index([fileId])
  @@index([resolved])
  @@index([reportedByPublicKeyHash])
}
```

#### B. Deprecate old models

```prisma
// ============================================================================
// DEPRECATED MODELS (Keep for migration reference)
// ============================================================================

model UserFileAccess {
  id                    String    @id @default(uuid())
  userId                String    // ❌ DEPRECATED
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  fileId                String
  file                  File      @relation(fields: [fileId], references: [id], onDelete: Cascade)

  grantedAt             DateTime  @default(now())
  grantedBy             String?
  expiresAt             DateTime?

  keyStatus             String    @default("client-managed")
  hasLocalKey           Boolean   @default(false)
  keyIssuedAt           DateTime?
  keyPackageFingerprint String?

  status                String    @default("active")
  revokedAt             DateTime?

  @@unique([userId, fileId])
  @@index([userId])
  @@index([fileId])
  @@index([status])
  @@index([keyStatus])
  @@map("_deprecated_user_file_access")  // Rename table
}

model AuditLog {
  id                String    @id @default(uuid())
  eventType         String
  fileId            String?
  file              File?     @relation(fields: [fileId], references: [id], onDelete: SetNull)

  userId            String?   // ❌ DEPRECATED
  deviceId          String?
  ipAddress         String?

  metadata          String?
  timestamp         DateTime  @default(now())

  @@index([fileId])
  @@index([userId])
  @@index([eventType])
  @@index([timestamp])
  @@map("_deprecated_audit_log")  // Rename table
}
```

### Step 1.3: Reset và tạo database mới (DEMO - Đơn giản)

```bash
cd backend

# 🎯 DEMO APPROACH: Reset toàn bộ database
npx prisma migrate reset --force --skip-seed

# Generate migration với schema mới
npx prisma migrate dev --name anonymous_download_redesign

# Generate Prisma Client
npx prisma generate

# Verify migration
npx prisma migrate status
```

### ~~Step 1.4: Migration script (data conversion)~~ (SKIP - Không cần cho demo)

**⚠️ DEMO: Không cần convert data**

Lý do:
- Không có production data cần giữ lại
- Tạo data test mới nhanh hơn nhiều
- Đơn giản và ít lỗi hơn

**Thay vào đó - Seed data mới (Optional):**

```typescript
// backend/prisma/seed-anonymous.ts
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function seedAnonymousDemo() {
  console.log('🌱 Seeding demo data for anonymous system...');

  // 1. Create demo users with public keys
  const user1 = await prisma.user.create({
    data: {
      displayLabel: 'Alice Demo',
      publicKey: '04abc123...', // Demo public key
      role: 'user',
    }
  });

  const user2 = await prisma.user.create({
    data: {
      displayLabel: 'Bob Demo',
      publicKey: '04def456...', // Demo public key
      role: 'user',
    }
  });

  console.log('✅ Created demo users');

  // 2. Create demo files with Schnorr ownership
  const demoFile = await prisma.file.create({
    data: {
      fileName: 'demo-document.pdf',
      totalSize: 1024000,
      chunkCount: 4,
      mimeType: 'application/pdf',
      ownershipPublicKey: '04schnorr...', // Schnorr public key
      ringSignature: 'demo-ring-sig',
      ringPublicKeys: JSON.stringify([user1.publicKey, user2.publicKey]),
      escrowedIdentity: 'encrypted-identity',
      status: 'active',
    }
  });

  console.log('✅ Created demo file');

  // 3. Grant access với publicKeyHash
  const publicKeyHash = crypto.createHash('sha256')
    .update(user1.publicKey)
    .digest('hex');

  await prisma.anonymousFileAccess.create({
    data: {
      accessorPublicKeyHash: publicKeyHash,
      fileId: demoFile.id,
      status: 'active',
      accessCount: 0,
    }
  });

  console.log('✅ Created demo access grant');
  console.log('✅ Seeding completed!');
}

seedAnonymousDemo()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Run seed (Optional):**
```bash
npx ts-node backend/prisma/seed-anonymous.ts
```

---

## PHASE 2: BACKEND API (DEMO - Simplified)

**Timeline:** Week 1 (Day 3-5)
**Dependencies:** Phase 1 completed
**Focus:** Create new endpoints, keep old ones for compatibility (optional)

### Step 2.1: Create Ring Signature Service

**File:** `backend/src/services/RingSignatureService.ts`

```typescript
import crypto from 'crypto';
import elliptic from 'elliptic';

const ec = new elliptic.ec('secp256k1');

export interface RingSignatureVerification {
  publicKey: string;
  signature: string;
  message: string;
  ringPublicKeys: string[];
}

export class RingSignatureService {
  /**
   * Verify ring signature
   */
  async verifyRingSignature(params: RingSignatureVerification): Promise<boolean> {
    try {
      const { publicKey, signature, message, ringPublicKeys } = params;

      // 1. Verify publicKey is in ring
      if (!ringPublicKeys.includes(publicKey)) {
        console.warn('[Ring Signature] Public key not in ring');
        return false;
      }

      // 2. Parse signature
      const sig = JSON.parse(signature);

      // 3. Verify ring signature
      // TODO: Implement actual ring signature verification
      // This is a placeholder - you need to implement the full algorithm
      // based on your ring signature scheme (e.g., Borromean, LSAG, etc.)

      const messageHash = crypto.createHash('sha256').update(message).digest('hex');

      // Verify key image uniqueness (prevent double-signing)
      // Verify signature components
      // ...

      console.log('[Ring Signature] Verification passed');
      return true;

    } catch (error) {
      console.error('[Ring Signature] Verification error:', error);
      return false;
    }
  }

  /**
   * Get all public keys for ring
   */
  async getAllPublicKeys(): Promise<string[]> {
    // TODO: Fetch from database or cache
    // Return all registered users' public keys
    return [];
  }

  /**
   * Hash public key
   */
  hashPublicKey(publicKey: string): string {
    return crypto.createHash('sha256').update(publicKey).digest('hex');
  }
}
```

### Step 2.2: Create Anonymous File Access Service

**File:** `backend/src/services/FileAccessService.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { RingSignatureService } from './RingSignatureService';

const prisma = new PrismaClient();
const ringService = new RingSignatureService();

export class FileAccessService {
  /**
   * List files accessible by public key
   */
  async listAccessibleFiles(params: {
    publicKey: string;
    ringSignature: string;
    timestamp: number;
    nonce: string;
  }): Promise<any[]> {
    const { publicKey, ringSignature, timestamp, nonce } = params;

    // 1. Verify ring signature
    const isValid = await ringService.verifyRingSignature({
      publicKey,
      signature: ringSignature,
      message: `list-files:${timestamp}:${nonce}`,
      ringPublicKeys: await ringService.getAllPublicKeys(),
    });

    if (!isValid) {
      throw new Error('Invalid ring signature');
    }

    // 2. Hash public key
    const publicKeyHash = ringService.hashPublicKey(publicKey);

    // 3. Query access grants
    const accessGrants = await prisma.anonymousFileAccess.findMany({
      where: {
        accessorPublicKeyHash: publicKeyHash,
        status: 'active',
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      },
      include: {
        file: {
          select: {
            id: true,
            fileName: true,
            totalSize: true,
            chunkCount: true,
            mimeType: true,
            ownershipPublicKey: true,
            status: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        grantedAt: 'desc'
      }
    });

    // 4. Transform response
    const files = accessGrants.map(grant => ({
      fileId: grant.file.id,
      fileName: grant.file.fileName,
      fileSize: grant.file.totalSize,
      chunkCount: grant.file.chunkCount,
      mimeType: grant.file.mimeType,
      ownerPublicKey: grant.file.ownershipPublicKey,
      ownershipStatus: grant.file.status,
      grantedAt: grant.grantedAt,
      expiresAt: grant.expiresAt,
      accessCount: grant.accessCount,
      uploadedAt: grant.file.createdAt,
    }));

    // 5. Log audit
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'file_list_query',
        publicKeyHash: publicKeyHash,
        ringSignature: ringSignature,
        timestamp: new Date(),
        metadata: JSON.stringify({
          fileCount: files.length,
          queryTimestamp: timestamp,
          nonce: nonce,
        })
      }
    });

    return files;
  }

  /**
   * Negotiate access to specific file
   */
  async negotiateAccess(params: {
    fileId: string;
    publicKey: string;
    ringSignature: string;
    timestamp: number;
    nonce: string;
  }): Promise<any> {
    const { fileId, publicKey, ringSignature, timestamp, nonce } = params;

    // 1. Verify ring signature
    const message = `access:${fileId}:${timestamp}:${nonce}`;
    const isValid = await ringService.verifyRingSignature({
      publicKey,
      signature: ringSignature,
      message,
      ringPublicKeys: await ringService.getAllPublicKeys(),
    });

    if (!isValid) {
      throw new Error('Invalid ring signature');
    }

    // 2. Hash public key
    const publicKeyHash = ringService.hashPublicKey(publicKey);

    // 3. Verify access grant
    const accessGrant = await prisma.anonymousFileAccess.findUnique({
      where: {
        accessorPublicKeyHash_fileId: {
          accessorPublicKeyHash: publicKeyHash,
          fileId: fileId,
        }
      },
      include: {
        file: {
          include: {
            chunks: {
              orderBy: { chunkIndex: 'asc' }
            }
          }
        }
      }
    });

    if (!accessGrant || accessGrant.status !== 'active') {
      throw new Error('Access denied or revoked');
    }

    // 4. Check expiration
    if (accessGrant.expiresAt && accessGrant.expiresAt < new Date()) {
      throw new Error('Access expired');
    }

    // 5. Build chunk manifest
    const chunkManifest = accessGrant.file.chunks.map(chunk => ({
      index: chunk.chunkIndex,
      cid: chunk.ipfsCid,
      size: chunk.size,
      hash: chunk.chunkHash,
    }));

    // 6. Update access stats
    await prisma.anonymousFileAccess.update({
      where: { id: accessGrant.id },
      data: {
        lastAccessAt: new Date(),
        lastAccessProof: ringSignature,
        accessCount: { increment: 1 },
      }
    });

    // 7. Log audit
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'access_negotiation',
        fileId: fileId,
        publicKeyHash: publicKeyHash,
        ringSignature: ringSignature,
        timestamp: new Date(),
        metadata: JSON.stringify({
          chunkCount: chunkManifest.length,
          fileSize: accessGrant.file.totalSize,
          accessCount: accessGrant.accessCount + 1,
        })
      }
    });

    // 8. Return manifest
    return {
      file: {
        id: accessGrant.file.id,
        name: accessGrant.file.fileName,
        size: accessGrant.file.totalSize,
        chunkCount: accessGrant.file.chunkCount,
        mimeType: accessGrant.file.mimeType,
      },
      chunkManifest: chunkManifest,
      ownershipPolicy: {
        publicKey: accessGrant.file.ownershipPublicKey,
        status: accessGrant.file.status,
        revoked: accessGrant.file.status === 'revoked',
      },
      grantContext: {
        grantedAt: accessGrant.grantedAt,
        expiresAt: accessGrant.expiresAt,
        accessCount: accessGrant.accessCount + 1,
      }
    };
  }

  /**
   * Report integrity alert
   */
  async reportIntegrityAlert(params: {
    fileId: string;
    publicKey: string;
    ringSignature: string;
    chunkIndex: number;
    expectedHash: string;
    actualHash: string | null;
    retryCount: number;
    timestamp: number;
    nonce: string;
  }): Promise<void> {
    const {
      fileId, publicKey, ringSignature,
      chunkIndex, expectedHash, actualHash,
      retryCount, timestamp, nonce
    } = params;

    // 1. Verify ring signature
    const message = `integrity-alert:${fileId}:${chunkIndex}:${timestamp}:${nonce}`;
    const isValid = await ringService.verifyRingSignature({
      publicKey,
      signature: ringSignature,
      message,
      ringPublicKeys: await ringService.getAllPublicKeys(),
    });

    if (!isValid) {
      throw new Error('Invalid ring signature');
    }

    // 2. Hash public key
    const publicKeyHash = ringService.hashPublicKey(publicKey);

    // 3. Create integrity alert
    await prisma.integrityAlert.create({
      data: {
        fileId: fileId,
        chunkIndex: chunkIndex,
        expectedHash: expectedHash,
        actualHash: actualHash,
        reportedByPublicKeyHash: publicKeyHash,
        reportedAt: new Date(),
        resolved: false,
      }
    });

    // 4. Log audit
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'integrity_alert',
        fileId: fileId,
        publicKeyHash: publicKeyHash,
        ringSignature: ringSignature,
        timestamp: new Date(),
        metadata: JSON.stringify({
          chunkIndex,
          expectedHash: expectedHash.substring(0, 16) + '...',
          actualHash: actualHash ? actualHash.substring(0, 16) + '...' : null,
          retryCount,
        })
      }
    });
  }
}
```

### Step 2.3: Update API Routes

**File:** `backend/src/routes/files.js`

```javascript
const express = require('express');
const { FileAccessService } = require('../services/FileAccessService');

const router = express.Router();
const fileAccessService = new FileAccessService();

/**
 * POST /api/files/anonymous-list
 * List files accessible by public key
 */
router.post('/files/anonymous-list', async (req, res) => {
  try {
    const { publicKey, ringSignature, timestamp, nonce } = req.body;

    // Validate input
    if (!publicKey || !ringSignature || !timestamp || !nonce) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Get accessible files
    const files = await fileAccessService.listAccessibleFiles({
      publicKey,
      ringSignature,
      timestamp,
      nonce,
    });

    return res.json({
      success: true,
      files: files,
      totalCount: files.length,
    });

  } catch (error) {
    console.error('[Anonymous List] Error:', error);

    if (error.message === 'Invalid ring signature') {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/files/:fileId/anonymous-access
 * Negotiate access to specific file
 */
router.post('/files/:fileId/anonymous-access', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { publicKey, ringSignature, timestamp, nonce } = req.body;

    // Validate input
    if (!publicKey || !ringSignature || !timestamp || !nonce) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Negotiate access
    const manifest = await fileAccessService.negotiateAccess({
      fileId,
      publicKey,
      ringSignature,
      timestamp,
      nonce,
    });

    return res.json({
      success: true,
      ...manifest
    });

  } catch (error) {
    console.error('[Anonymous Access] Error:', error);

    if (error.message === 'Invalid ring signature') {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes('Access denied') || error.message.includes('Access expired')) {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/files/:fileId/anonymous-integrity-alert
 * Report chunk integrity issue
 */
router.post('/files/:fileId/anonymous-integrity-alert', async (req, res) => {
  try {
    const { fileId } = req.params;
    const {
      publicKey, ringSignature,
      chunkIndex, expectedHash, actualHash,
      retryCount, timestamp, nonce
    } = req.body;

    // Report integrity alert
    await fileAccessService.reportIntegrityAlert({
      fileId,
      publicKey,
      ringSignature,
      chunkIndex,
      expectedHash,
      actualHash,
      retryCount,
      timestamp,
      nonce,
    });

    return res.json({
      success: true,
      message: 'Integrity alert recorded',
      recommendation: retryCount < 3 ? 'retry' : 'contact_owner'
    });

  } catch (error) {
    console.error('[Integrity Alert] Error:', error);

    if (error.message === 'Invalid ring signature') {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
```

### Step 2.4: Deprecate old endpoints

```javascript
/**
 * ❌ DEPRECATED: GET /api/files/my-files
 * Use POST /api/files/anonymous-list instead
 */
router.get('/files/my-files', async (req, res) => {
  return res.status(410).json({
    success: false,
    error: 'This endpoint is deprecated. Use POST /api/files/anonymous-list instead.',
    migration: {
      oldEndpoint: 'GET /api/files/my-files',
      newEndpoint: 'POST /api/files/anonymous-list',
      requiredFields: ['publicKey', 'ringSignature', 'timestamp', 'nonce']
    }
  });
});
```

---

## PHASE 3: MOBILE APP (DEMO - Simplified)

**Timeline:** Week 2 (Day 6-10)
**Dependencies:** Phase 2 completed
**Focus:** New UI screens và services, có thể giữ old code để so sánh

### Step 3.1: Create AnonymousFileAccessService

**File:** `mobile/src/services/AnonymousFileAccessService.ts`

```typescript
import CryptoJS from 'crypto-js';
import { createRingSignature } from './RingSignatureService';
import { getPublicKey, getSecretKey } from './KeyManagementService';

export interface AccessibleFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  chunkCount: number;
  mimeType: string;
  ownerPublicKey: string;
  ownershipStatus: string;
  grantedAt: string;
  expiresAt: string | null;
  accessCount: number;
  uploadedAt: string;
}

export interface FileAccessManifest {
  file: {
    id: string;
    name: string;
    size: number;
    chunkCount: number;
    mimeType: string;
  };
  chunkManifest: Array<{
    index: number;
    cid: string;
    size: number;
    hash: string;
  }>;
  ownershipPolicy: {
    publicKey: string;
    status: string;
    revoked: boolean;
  };
  grantContext: {
    grantedAt: string;
    expiresAt: string | null;
    accessCount: number;
  };
}

export class AnonymousFileAccessService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * List accessible files (anonymous)
   */
  async listAccessibleFiles(): Promise<AccessibleFile[]> {
    try {
      const publicKey = await getPublicKey();
      const secretKey = await getSecretKey();

      const timestamp = Date.now();
      const nonce = this.generateNonce();
      const message = `list-files:${timestamp}:${nonce}`;

      const ringSignature = await createRingSignature({
        message,
        secretKey,
        publicKey,
      });

      const response = await fetch(`${this.baseUrl}/api/files/anonymous-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey,
          ringSignature,
          timestamp,
          nonce,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[Anonymous Access] Found ${data.files.length} accessible files`);

      return data.files;

    } catch (error) {
      console.error('[Anonymous Access] Error listing files:', error);
      throw error;
    }
  }

  /**
   * Negotiate access to file (anonymous)
   */
  async negotiateAccess(fileId: string): Promise<FileAccessManifest> {
    try {
      const publicKey = await getPublicKey();
      const secretKey = await getSecretKey();

      const timestamp = Date.now();
      const nonce = this.generateNonce();
      const message = `access:${fileId}:${timestamp}:${nonce}`;

      const ringSignature = await createRingSignature({
        message,
        secretKey,
        publicKey,
      });

      const response = await fetch(`${this.baseUrl}/api/files/${fileId}/anonymous-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey,
          ringSignature,
          timestamp,
          nonce,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[Access Negotiation] Got manifest for file ${fileId}`);

      return data;

    } catch (error) {
      console.error('[Access Negotiation] Error:', error);
      throw error;
    }
  }

  /**
   * Report integrity alert (anonymous)
   */
  async reportIntegrityAlert(params: {
    fileId: string;
    chunkIndex: number;
    expectedHash: string;
    actualHash: string | null;
    retryCount: number;
  }): Promise<void> {
    try {
      const publicKey = await getPublicKey();
      const secretKey = await getSecretKey();

      const timestamp = Date.now();
      const nonce = this.generateNonce();
      const message = `integrity-alert:${params.fileId}:${params.chunkIndex}:${timestamp}:${nonce}`;

      const ringSignature = await createRingSignature({
        message,
        secretKey,
        publicKey,
      });

      await fetch(`${this.baseUrl}/api/files/${params.fileId}/anonymous-integrity-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey,
          ringSignature,
          ...params,
          timestamp,
          nonce,
        })
      });

      console.log(`[Integrity Alert] Reported chunk ${params.chunkIndex} mismatch`);

    } catch (error) {
      console.error('[Integrity Alert] Error:', error);
      // Don't throw - integrity alert is best-effort
    }
  }

  /**
   * Generate random nonce
   */
  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}
```

### Step 3.2: Update FileListScreen

**File:** `mobile/src/screens/FileListScreen.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AnonymousFileAccessService, AccessibleFile } from '../services/AnonymousFileAccessService';
import { API_BASE_URL } from '../config';

const anonymousService = new AnonymousFileAccessService(API_BASE_URL);

const FileListScreen = ({ navigation }: any) => {
  const [files, setFiles] = useState<AccessibleFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);

      // ✅ NEW: Use anonymous API
      const accessibleFiles = await anonymousService.listAccessibleFiles();
      setFiles(accessibleFiles);

      console.log(`[File List] Loaded ${accessibleFiles.length} files`);

    } catch (error: any) {
      console.error('[File List] Error:', error);

      if (error.message.includes('Invalid ring signature')) {
        Alert.alert('Lỗi xác thực', 'Ring signature không hợp lệ. Vui lòng thử lại.');
      } else {
        Alert.alert('Lỗi', 'Không thể tải danh sách file');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFiles();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderFileItem = ({ item }: { item: AccessibleFile }) => (
    <TouchableOpacity
      style={styles.fileCard}
      onPress={() => {
        navigation.navigate('FileDownload', {
          fileId: item.fileId,
          fileName: item.fileName,
        });
      }}
      disabled={item.ownershipStatus === 'revoked'}
    >
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.fileName}
        </Text>
        <Text style={styles.fileSize}>
          {formatFileSize(item.fileSize)} • {item.chunkCount} chunks
        </Text>
        <Text style={styles.fileDate}>
          Access count: {item.accessCount}
        </Text>
      </View>

      <View style={styles.statusBadge}>
        {item.ownershipStatus === 'revoked' ? (
          <View style={styles.revokedBadge}>
            <Text style={styles.revokedText}>⚠️ Revoked</Text>
          </View>
        ) : (
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>✓ Active</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>Chưa có file nào</Text>
      <Text style={styles.emptyText}>
        Upload file mới hoặc yêu cầu người khác chia sẻ với bạn
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>File của tôi (Anonymous)</Text>
        <Text style={styles.subtitle}>
          {files.length} file có quyền truy cập
        </Text>
      </View>

      {loading && files.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={item => item.fileId}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={
            files.length === 0 ? styles.emptyListContainer : styles.listContainer
          }
        />
      )}
    </View>
  );
};

export default FileListScreen;
```

---

## PHASE 4: TESTING & DEMO PREP

**Timeline:** Week 3-4 (Day 11-15)
**Focus:** Basic testing + Demo preparation

### 4.1. Backend Tests

**File:** `backend/tests/anonymous-access.test.ts`

```typescript
import { describe, it, expect, beforeAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { FileAccessService } from '../src/services/FileAccessService';
import { RingSignatureService } from '../src/services/RingSignatureService';

const prisma = new PrismaClient();
const fileAccessService = new FileAccessService();
const ringService = new RingSignatureService();

describe('Anonymous File Access', () => {
  beforeAll(async () => {
    // Setup test data
  });

  it('should list accessible files with valid ring signature', async () => {
    const result = await fileAccessService.listAccessibleFiles({
      publicKey: 'test-public-key',
      ringSignature: 'valid-signature',
      timestamp: Date.now(),
      nonce: 'test-nonce',
    });

    expect(result).toBeInstanceOf(Array);
  });

  it('should reject invalid ring signature', async () => {
    await expect(
      fileAccessService.listAccessibleFiles({
        publicKey: 'test-public-key',
        ringSignature: 'invalid-signature',
        timestamp: Date.now(),
        nonce: 'test-nonce',
      })
    ).rejects.toThrow('Invalid ring signature');
  });

  it('should verify access grant by public key hash', async () => {
    const result = await fileAccessService.negotiateAccess({
      fileId: 'test-file-id',
      publicKey: 'test-public-key',
      ringSignature: 'valid-signature',
      timestamp: Date.now(),
      nonce: 'test-nonce',
    });

    expect(result.file).toBeDefined();
    expect(result.chunkManifest).toBeInstanceOf(Array);
  });

  it('should log audit without userId', async () => {
    // Test that audit logs don't contain userId
    const logs = await prisma.anonymousAuditLog.findMany({
      where: {
        eventType: 'file_list_query'
      }
    });

    logs.forEach(log => {
      expect(log.publicKeyHash).toBeDefined();
      expect(log).not.toHaveProperty('userId');
    });
  });
});
```

### 4.2. Integration Tests

```bash
# Test full flow
npm run test:e2e

# Test anonymous file list
curl -X POST http://localhost:3000/api/files/anonymous-list \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "test-key",
    "ringSignature": "test-sig",
    "timestamp": 1234567890,
    "nonce": "test-nonce"
  }'

# Test access negotiation
curl -X POST http://localhost:3000/api/files/test-file-id/anonymous-access \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "test-key",
    "ringSignature": "test-sig",
    "timestamp": 1234567890,
    "nonce": "test-nonce"
  }'
```

---

## ROLLBACK PLAN (DEMO - Super Simple)

### If implementation fails - Just reset everything

```bash
#!/bin/bash
# scripts/demo-reset.sh

echo "🔄 Resetting demo to clean state..."

# 1. Checkout original schema
git checkout HEAD~1 backend/prisma/schema.prisma

# 2. Reset database
cd backend
npx prisma migrate reset --force --skip-seed

# 3. Regenerate Prisma client
npx prisma generate

# 4. (Optional) Restore old backup
# cp backend/prisma/dev.db.backup-YYYYMMDD backend/prisma/dev.db

echo "✅ Reset completed - back to clean state"
```

**Hoặc đơn giản hơn:**
```bash
# Just delete database and recreate
rm backend/prisma/dev.db
npx prisma migrate dev
```

---

## CHECKLIST (DEMO - Simplified)

### Phase 1: Database (Day 1-2) ✅
- [ ] ~~Backup current database~~ (Skip - not needed)
- [ ] Update schema.prisma with new models
- [ ] Run `npx prisma migrate reset --force`
- [ ] Run `npx prisma migrate dev --name anonymous_download_redesign`
- [ ] ~~Verify data conversion~~ (Skip - no old data)
- [ ] Quick test: Create demo data manually

### Phase 2: Backend (Day 3-5) ✅
- [ ] ~~Implement RingSignatureService~~ (Can use mock/placeholder for demo)
- [ ] Implement FileAccessService (core logic only)
- [ ] Create new API endpoints (POST /api/files/anonymous-list, etc.)
- [ ] ~~Deprecate old endpoints~~ (Keep both for demo comparison)
- [ ] Update audit logging (basic version)
- [ ] ~~Write unit tests~~ (Optional for demo)
- [ ] Manual API testing with Postman/curl

### Phase 3: Mobile (Day 6-10) ✅
- [ ] Create AnonymousFileAccessService
- [ ] Update FileListScreen (or create new AnonymousFileListScreen)
- [ ] Update FileDownloadScreen UI
- [ ] ~~Update FileSharingScreen~~ (Can demo with mock)
- [ ] ~~Remove JWT auth~~ (Keep both auth methods for demo)
- [ ] Add ring signature creation (basic version)
- [ ] Manual UI testing on emulator

### Phase 4: Testing & Demo (Day 11-15) ✅
- [ ] ~~Backend unit tests~~ (Skip - demo only)
- [ ] ~~Integration tests~~ (Skip - demo only)
- [ ] Basic UI walkthrough testing
- [ ] ~~End-to-end tests~~ (Manual testing sufficient)
- [ ] ~~Security audit~~ (Skip - not production)
- [ ] ~~Performance testing~~ (Basic checks only)
- [ ] Prepare demo script
- [ ] Create demo slides/presentation
- [ ] Practice demo walkthrough

### ~~Phase 5: Deployment~~ (Not needed for demo)
- N/A - This is a demo project

---

## CONCLUSION (DEMO VERSION)

Việc chuyển đổi sang anonymous download flow là **CRITICAL** để đảm bảo tính nhất quán của hệ thống:

✅ **Upload:** Ring Signature + Schnorr AOT → Ẩn danh
✅ **Download:** Public Key + Ring Signature → Ẩn danh
✅ **Result:** True end-to-end anonymity

**Estimated completion:** 3-4 weeks (demo version)

**Risk level:** 🟡 MEDIUM (demo - có thể reset database bất cứ lúc nào)

**Demo Advantages:**
- ✅ Không cần migration phức tạp → Nhanh hơn 50%
- ✅ Có thể reset và thử lại nhiều lần
- ✅ Focus vào core features, bỏ qua edge cases
- ✅ Dễ dàng rollback bằng cách xóa database
- ✅ Có thể giữ cả old và new code để so sánh trong demo

**Recommended Approach for Demo:**
1. **Week 1:** Database schema + Backend APIs (core features only)
2. **Week 2:** Mobile app (basic UI + key workflows)
3. **Week 3-4:** Testing + Demo preparation + Polish UI

**Key Simplifications for Demo:**
- ❌ No complex data migration
- ❌ No backup/restore procedures
- ❌ No production-grade error handling
- ❌ No comprehensive test suites
- ❌ No deployment procedures
- ✅ Focus on demonstrating the concept
- ✅ Working prototype with manual testing
- ✅ Clear UI to show anonymous flow

---

**Người viết:** Claude Code
**Date:** 2025-10-09
**Status:** Ready for demo implementation
**Version:** Demo-simplified v1.0
