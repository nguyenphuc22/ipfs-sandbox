# 🚨 THIẾT KẾ LẠI DOWNLOAD FLOW - ĐẢM BẢO TÍNH ẨN DANH

**Ngày gốc:** 2025-10-09  
**Cập nhật gần nhất:** 2025-10-18  
**Trạng thái hiện tại:** ✅ ĐÃ HOÀN THÀNH – Download flow thực tế đã chuyển sang manifest + IPFS chunk giống mô tả trong `TASK_B_C_IMPLEMENTATION_SUMMARY.md`.

> **Ghi chú:** Tài liệu bên dưới được giữ lại như bản thiết kế/retrospective. Xem thêm `mobile/src/services/chunkDownloadManager.ts` và `backend/src/routes/anonymous-endpoints-addition.js` cho implementation mới. Những cảnh báo “VI PHẠM” trong nội dung gốc đã được xử lý bởi Task B & C (16/10/2025).

## ✅ Tóm tắt cập nhật 2025-10-16
- `chunkDownloadManager.downloadFile()` hiện tải chunk thật từ IPFS bằng CID, giải mã AES-GCM với key package lưu local, kiểm tra SHA-256 hash và ghép file.
- Backend `POST /api/files/client-chunked-upload` + `POST /api/files/:fileId/anonymous-access` chỉ xử lý manifest/metadata; không còn đọc dữ liệu thô hay trả master/chunk key.
- `ChunkEncryptionService` + `KeyPackageStorage` lưu fingerprint để đảm bảo download kiểm tra đúng key package.
- ⚠️ Jest suites cần Node.js ≥ 20.19 để import `@noble/hashes/sha2`; khi chạy trên Node 18 sẽ gặp lỗi module resolution (đã ghi chú trong `issue_plan.md`).
- Task D còn lại: bổ sung integration test upload→download, smoke test end-to-end và cập nhật tài liệu hướng dẫn vận hành.

## ✅ Tóm tắt cập nhật 2025-10-18
- Chuyển `grant` từ demo một chiều sang **quản trị toàn bộ vòng đời quyền truy cập** (grant + revoke) dành cho chủ sở hữu file.
- Đề xuất nhóm endpoint mới: `GET /api/files/:id/anonymous-grants` (liệt kê), `POST /api/files/:id/anonymous-grants` (thêm người nhận) và `DELETE /api/files/:id/anonymous-grants/:grantId` (thu hồi) – tất cả đều yêu cầu Schnorr + LSAG để xác thực chủ sở hữu.
- Mobile app sẽ có **Access Manager modal** với hai danh sách: public key đã được cấp quyền và các đề cử mới; thao tác click để thêm/bỏ, tự động sync sau khi backend xác nhận.
- Khi revoke thành công, backend ghi `anonymousAuditLog` với event `grant_revoked`, cập nhật `anonymousFileAccess.status = 'revoked'` và phát tín hiệu để client xóa cache/ẩn file khỏi danh sách người nhận.
- Các nội dung chi tiết và kế hoạch thực thi được chuyển sang `issue_plan.md` (phiên bản 2025-10-18) để triển khai ngay sau đợt cập nhật này.
- Trên mobile, danh sách anonymous sử dụng `ETag` + `Last-Modified` để đồng bộ: nhận 304 → dùng snapshot cục bộ, đồng thời tự động lọc `status='revoked'`, xóa key package tương ứng và gửi audit event `delete_cache`; UI hiển thị banner "granted/revoked" ngay lập tức.
- Bổ sung script `scripts/reset-anonymous-grants.js` giúp QA/dev reset dữ liệu demo nhanh chóng (xóa AnonymousFileAccess + audit liên quan theo `fileId`/`recipient`).

---

## 📋 MỤC LỤC

1. [Phân tích vấn đề](#1-phân-tích-vấn-đề)
2. [Nguồn gốc thiết kế sai](#2-nguồn-gốc-thiết-kế-sai)
3. [Thiết kế mới - Anonymous Download](#3-thiết-kế-mới---anonymous-download)
4. [Migration plan](#4-migration-plan)
5. [Implementation roadmap](#5-implementation-roadmap)
6. **[🎯 GIẢI PHÁP ĐƠN GIẢN CHO DEMO](#6-giải-pháp-đơn-giản-cho-demo)** ⭐ NEW

---

## 1. PHÂN TÍCH VẤN ĐỀ

### 1.1. Mâu thuẫn logic nghiêm trọng

```
┌─────────────────────────────────────────────────────────────┐
│          MÂU THUẪN TÍNH ẨN DANH TRONG HỆ THỐNG              │
└─────────────────────────────────────────────────────────────┘

Upload Flow (✅ Ẩn danh):
  - Sử dụng Ring Signature
  - Schnorr AOT cho ownership proof
  - Backend KHÔNG biết ai upload
  - Escrowed identity chỉ Adjudicator mới mở được

        ⬇️  File được upload ẩn danh

Download Flow (❌ ĐỊNH DANH HOÀN TOÀN):
  - JWT chứa userId trong header
  - Backend query: "userId='abc' muốn xem file nào?"
  - UserFileAccess.userId → Liên kết trực tiếp user ↔ file
  - AuditLog.userId → Biết chính xác ai download file gì, lúc nào
      orderBy: {
        grantedAt: 'desc'
      }
    });

    // 4. Transform response (KHÔNG có userId)
    const files = accessGrants.map(grant => ({
      fileId: grant.file.id,
      fileName: grant.file.fileName,
      fileSize: grant.file.totalSize,
      chunkCount: grant.file.chunkCount,
      mimeType: grant.file.mimeType,

      // ✅ Owner info: chỉ có public key, không có userId
      ownerPublicKey: grant.file.ownershipPublicKey,
      ownershipStatus: grant.file.status,

      // Access info (không có grantedBy userId)
      grantedAt: grant.grantedAt,
      expiresAt: grant.expiresAt,
      accessCount: grant.accessCount,

      uploadedAt: grant.file.createdAt,
    }));

    // 5. Log audit (KHÔNG có userId)
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

    console.log(`[Anonymous List] Found ${files.length} accessible files for hash ${publicKeyHash.substring(0, 16)}...`);

    return res.json({
      success: true,
      files: files,
      totalCount: files.length,
    });

  } catch (error) {
    console.error('[Anonymous List] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

#### **B. Access Negotiation (Anonymous)**

```typescript
/**
 * POST /api/files/:fileId/anonymous-access
 * Lấy manifest và policy (KHÔNG cần userId)
 */
router.post('/files/:fileId/anonymous-access', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { publicKey, ringSignature, timestamp, nonce } = req.body;

    // 1. Verify ring signature
    const message = `access:${fileId}:${timestamp}:${nonce}`;
    const isValidRing = await verifyRingSignature({
      publicKey,
      signature: ringSignature,
      message,
      ringPublicKeys: await getAllPublicKeys(),
    });

    if (!isValidRing) {
      return res.status(403).json({
        success: false,
        error: 'Invalid ring signature'
      });
    }

    // 2. Hash public key
    const publicKeyHash = sha256(publicKey);

    // 3. Verify access grant (bằng publicKeyHash, không phải userId)
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
      return res.status(403).json({
        success: false,
        error: 'Access denied or revoked'
      });
    }

    // 4. Check expiration
    if (accessGrant.expiresAt && accessGrant.expiresAt < new Date()) {
      return res.status(403).json({
        success: false,
        error: 'Access expired'
      });
    }

    // 5. Build chunk manifest (KHÔNG chứa userId)
    const chunkManifest = accessGrant.file.chunks.map(chunk => ({
      index: chunk.chunkIndex,
      cid: chunk.ipfsCid,
      size: chunk.size,
      hash: chunk.chunkHash,  // SHA-256 for integrity
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

    // 7. Log audit (KHÔNG có userId)
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

    // 8. Return manifest (KHÔNG có master key - user tự quản lý)
    return res.json({
      success: true,
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
    });

  } catch (error) {
    console.error('[Anonymous Access] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

#### **C. Integrity Alert (Anonymous)**

```typescript
/**
 * POST /api/files/:fileId/anonymous-integrity-alert
 * Report chunk hash mismatch (KHÔNG cần userId)
 */
router.post('/files/:fileId/anonymous-integrity-alert', async (req, res) => {
  try {
    const { fileId } = req.params;
    const {
      publicKey,
      ringSignature,
      chunkIndex,
      expectedHash,
      actualHash,
      retryCount,
      timestamp,
      nonce
    } = req.body;

    // 1. Verify ring signature
    const message = `integrity-alert:${fileId}:${chunkIndex}:${timestamp}:${nonce}`;
    const isValidRing = await verifyRingSignature({
      publicKey,
      signature: ringSignature,
      message,
      ringPublicKeys: await getAllPublicKeys(),
    });

    if (!isValidRing) {
      return res.status(403).json({
        success: false,
        error: 'Invalid ring signature'
      });
    }

    // 2. Hash public key
    const publicKeyHash = sha256(publicKey);

    // 3. Create integrity alert (KHÔNG lưu userId)
    await prisma.integrityAlert.create({
      data: {
        fileId: fileId,
        chunkIndex: chunkIndex,
        expectedHash: expectedHash,
        actualHash: actualHash,

        // ✅ Lưu publicKeyHash thay vì userId
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

    console.log(`[Integrity Alert] Chunk ${chunkIndex} mismatch for file ${fileId}`);

    return res.json({
      success: true,
      message: 'Integrity alert recorded',
      recommendation: retryCount < 3 ? 'retry' : 'contact_owner'
    });

  } catch (error) {
    console.error('[Integrity Alert] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

### 3.4. Mobile implementation mới

```typescript
// src/services/AnonymousFileAccessService.ts

import { sha256 } from 'crypto-js';
import { createRingSignature, getSecretKey, getPublicKey } from './CryptoService';

export class AnonymousFileAccessService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Lấy danh sách file có quyền (KHÔNG dùng userId)
   */
  async listAccessibleFiles(): Promise<AccessibleFile[]> {
    try {
      // 1. Lấy keypair từ secure storage
      const publicKey = await getPublicKey();
      const secretKey = await getSecretKey();

      // 2. Tạo ring signature
      const timestamp = Date.now();
      const nonce = this.generateNonce();
      const message = `list-files:${timestamp}:${nonce}`;

      const ringSignature = await createRingSignature({
        message,
        secretKey,
        publicKey,
        ringPublicKeys: await this.fetchAllPublicKeys(),
      });

      // 3. Request (KHÔNG có JWT, KHÔNG có userId)
      const response = await fetch(`${this.baseUrl}/api/files/anonymous-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ✅ KHÔNG có Authorization header với userId
        },
        body: JSON.stringify({
          publicKey,
          ringSignature,
          timestamp,
          nonce,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
   * Access negotiation (KHÔNG dùng userId)
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
        ringPublicKeys: await this.fetchAllPublicKeys(),
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
        if (response.status === 403) {
          throw new Error('Access denied or revoked');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
   * Report integrity alert (KHÔNG dùng userId)
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
        ringPublicKeys: await this.fetchAllPublicKeys(),
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
   * Generate random nonce for replay attack prevention
   */
  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Fetch all public keys for ring signature
   */
  private async fetchAllPublicKeys(): Promise<string[]> {
    // Implementation: fetch from backend or cache
    // This is needed for ring signature verification
    return [];
  }
}
```

---

## 4. MIGRATION PLAN

### 4.1. Breaking changes

```
❌ KHÔNG THỂ migrate dữ liệu cũ tự động
❌ CẦN reset database và data
✅ Tạo migration script để chuyển đổi

Lý do:
- UserFileAccess.userId không thể convert thành publicKeyHash
  (vì không có publicKey trong old records)
- AuditLog.userId đã bị leak identity
  (không thể anonymous hóa retroactively)
```

### 4.2. Migration steps

#### **Step 1: Backup data cũ**

```bash
# Backup database hiện tại
cp backend/prisma/dev.db backend/prisma/dev.db.backup-$(date +%Y%m%d)

# Export audit logs cho reference
sqlite3 backend/prisma/dev.db "SELECT * FROM AuditLog" > audit_backup.csv
```

#### **Step 2: Update schema**

```bash
# 1. Cập nhật schema.prisma với models mới
# 2. Tạo migration
cd backend
npx prisma migrate dev --name anonymous_download_redesign

# 3. Generate Prisma client mới
npx prisma generate
```

#### **Step 3: Update codebase**

```bash
# Files cần update:
backend/src/routes/files.js           # API endpoints
backend/src/services/FileAccessService.ts
backend/src/services/AuditService.ts
mobile/src/services/AnonymousFileAccessService.ts
mobile/src/screens/FileListScreen.tsx
mobile/src/screens/FileDownloadScreen.tsx
```

#### **Step 4: Testing**

```bash
# 1. Test anonymous file list
# 2. Test access negotiation với ring signature
# 3. Test integrity alerts
# 4. Test audit logs không có userId
# 5. Test sharing workflow
```

---

## 5. IMPLEMENTATION ROADMAP

### Phase 1: Database & Schema (1 week)

```
Week 1:
- [ ] Update schema.prisma với AnonymousFileAccess
- [ ] Update schema.prisma với AnonymousAuditLog
- [ ] Update schema.prisma với AnonymousSharingRequest
- [ ] Run migration
- [ ] Verify schema integrity
```

### Phase 2: Backend APIs (2 weeks)

```
Week 2-3:
- [ ] Implement POST /api/files/anonymous-list
- [ ] Implement POST /api/files/:id/anonymous-access
- [ ] Implement POST /api/files/:id/anonymous-integrity-alert
- [ ] Implement ring signature verification
- [ ] Implement public key hashing
- [ ] Update audit logging
```

### Phase 3: Mobile App (2 weeks)

```
Week 4-5:
- [ ] Implement AnonymousFileAccessService
- [ ] Update FileListScreen với anonymous API
- [ ] Update FileDownloadScreen với ring signature
- [ ] Update integrity alert với anonymous reporting
- [ ] Test end-to-end flow
```

### Phase 4: Testing & Documentation (1 week)

```
Week 6:
- [ ] Unit tests cho backend APIs
- [ ] Integration tests cho anonymous flow
- [ ] UI tests cho mobile app
- [ ] Update documentation
- [ ] Security audit
```

---

## 6. KẾT LUẬN

### 6.1. Tóm tắt vấn đề

```
🔴 VẤN ĐỀ NGHIÊM TRỌNG:
- Upload flow ẩn danh (Ring Signature + Schnorr AOT)
- Download flow ĐỊNH DANH (userId trong mọi nơi)
- Mâu thuẫn logic → Ring Signature vô nghĩa

🔴 HẬU QUẢ:
- Backend biết chính xác ai download file gì
- Audit trail leak identity hoàn toàn
- Vi phạm mục tiêu ẩn danh của hệ thống
```

### 6.2. Giải pháp

```
✅ THIẾT KẾ MỚI:
- Dùng publicKey + ringSignature thay vì userId
- AnonymousFileAccess với publicKeyHash
- AnonymousAuditLog không có userId
- Mọi request verify ring signature

✅ KẾT QUẢ:
- True anonymity trong cả upload và download
- Backend chỉ biết "AI ĐÓ" có quyền, không biết chính xác ai
- Ring Signature có ý nghĩa thực sự
- Đạt mục tiêu "anonymous accountability"
```

### 6.3. Next steps

Xem file **NEXT_IMPLEMENTATION_FIX.md** để biết chi tiết các bước implement.

---

## 6. 🎯 GIẢI PHÁP ĐƠN GIẢN CHO DEMO

**⚠️ LƯU Ý QUAN TRỌNG:** Đây là dự án **DEMO**, không phải production system!

### 6.1. Tại sao demo không cần migration phức tạp?

```
❌ PRODUCTION SYSTEM:
- Có dữ liệu thật của users
- Cần migrate millions of records
- Phải backup và rollback được
- Zero downtime requirement
- Audit trail không được mất

✅ DEMO PROJECT:
- Chỉ có test data
- Không có user thật
- Có thể reset database bất cứ lúc nào
- Mất data test không quan trọng
- Focus vào demonstrating concept
```

### 6.2. So sánh approaches

| Aspect | Production Approach | Demo Approach |
|--------|---------------------|---------------|
| **Database Migration** | Complex migration scripts | `npx prisma migrate reset` |
| **Data Conversion** | Convert all existing data | Create new test data |
| **Backup** | Multiple backups + restore plans | Optional: `cp dev.db dev.db.backup` |
| **Rollback** | Complex rollback procedures | `rm dev.db && npx prisma migrate dev` |
| **Testing** | Comprehensive test suites | Manual testing + basic checks |
| **Time Required** | 6 weeks | 3-4 weeks |
| **Risk Level** | HIGH (data loss risk) | MEDIUM (can reset anytime) |
| **Complexity** | Very complex | Simple and straightforward |

### 6.3. Demo Implementation Strategy

#### **Bước 1: Reset Database (5 phút)**

```bash
# Backup cũ (optional)
cp backend/prisma/dev.db backend/prisma/dev.db.backup-$(date +%Y%m%d)

# Reset toàn bộ database
cd backend
npx prisma migrate reset --force --skip-seed

# Apply new schema
npx prisma migrate dev --name anonymous_download_redesign

# Generate Prisma Client
npx prisma generate

echo "✅ Database reset complete!"
```

**Kết quả:**
- Database mới với schema ẩn danh
- Không có data cũ (OK cho demo)
- Sẵn sàng cho test data mới

#### **Bước 2: Seed Demo Data (10 phút)**

```typescript
// backend/prisma/seed-demo.ts
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo data...');

  // 1. Create demo users
  const alice = await prisma.user.create({
    data: {
      displayLabel: 'Alice Demo',
      publicKey: '04a1b2c3d4e5f6...',
      role: 'user',
    }
  });

  const bob = await prisma.user.create({
    data: {
      displayLabel: 'Bob Demo',
      publicKey: '04f6e5d4c3b2a1...',
      role: 'user',
    }
  });

  console.log('✅ Created demo users');

  // 2. Create demo file
  const file = await prisma.file.create({
    data: {
      fileName: 'demo-thesis.pdf',
      totalSize: 2048000,
      chunkCount: 8,
      ownershipPublicKey: 'schnorr-public-key-demo',
      ringSignature: 'demo-ring-signature',
      status: 'active',
    }
  });

  // 3. Grant anonymous access
  const aliceHash = crypto.createHash('sha256')
    .update(alice.publicKey)
    .digest('hex');

  await prisma.anonymousFileAccess.create({
    data: {
      accessorPublicKeyHash: aliceHash,
      fileId: file.id,
      status: 'active',
    }
  });

  console.log('✅ Demo data seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Run:**
```bash
npx ts-node backend/prisma/seed-demo.ts
```

#### **Bước 3: Implement Core Features (2 tuần)**

**Focus ONLY on:**
- ✅ Anonymous file list API
- ✅ Anonymous access negotiation API
- ✅ Basic ring signature verification (có thể mock)
- ✅ Mobile UI với anonymous flow
- ✅ Basic integrity check

**Skip for demo:**
- ❌ Complex migration logic
- ❌ Backward compatibility với old system
- ❌ Comprehensive error handling
- ❌ Production-grade security
- ❌ Performance optimization
- ❌ Comprehensive test suites

#### **Bước 4: Test & Demo Prep (1 tuần)**

```bash
# Quick test script
#!/bin/bash

echo "🧪 Testing anonymous download flow..."

# Test 1: List files anonymously
echo "1. Testing anonymous file list..."
curl -X POST http://localhost:3000/api/files/anonymous-list \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "04a1b2c3...",
    "ringSignature": "demo-sig",
    "timestamp": 1234567890,
    "nonce": "random-nonce"
  }'

# Test 2: Access negotiation
echo "2. Testing access negotiation..."
curl -X POST http://localhost:3000/api/files/file-id/anonymous-access \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "04a1b2c3...",
    "ringSignature": "demo-sig",
    "timestamp": 1234567890,
    "nonce": "random-nonce"
  }'

echo "✅ Manual testing complete!"
```

### 6.4. Demo Advantages

**Ưu điểm của approach đơn giản:**

1. **⚡ Nhanh hơn 50%**
   - Không mất thời gian viết migration scripts
   - Không cần test data conversion
   - Không cần backup/restore procedures

2. **🔄 Dễ thử nghiệm**
   - Reset và thử lại nhiều lần
   - Không sợ làm hỏng data production
   - Có thể A/B test different approaches

3. **📱 Focus vào UX**
   - Concentrate on demonstrating concept
   - Polish UI/UX thay vì infrastructure
   - Show clear before/after comparison

4. **🎯 Demo-friendly**
   - Dễ giải thích cho giảng viên
   - Clear separation: Old vs New
   - Can show both systems side-by-side

### 6.5. Demo Checklist

```
Tuần 1: Database & Backend
- [ ] Reset database với schema mới
- [ ] Seed demo data
- [ ] Implement anonymous-list API
- [ ] Implement anonymous-access API
- [ ] Basic ring signature verification

Tuần 2: Mobile App
- [ ] Create AnonymousFileAccessService
- [ ] Update FileListScreen UI
- [ ] Update FileDownloadScreen UI
- [ ] Basic integrity check flow
- [ ] Polish UI for demo
- [x] Wire Storage Monitor tab với shared download session manager
- [x] Đồng bộ ChunkMonitorPanel với realtime chunk progress & key package state
- [x] Bổ sung tài liệu hướng dẫn Storage Monitor trong DOWNLOAD_FLOW_FINAL.md

Tuần 3: Testing & Prep
- [ ] Manual testing all flows
- [ ] Fix critical bugs only
- [ ] Prepare demo script
- [ ] Create demo slides
- [ ] Practice presentation
- [x] Unit test: chunkDownloadManager (retry + integrity guard)
- [x] Component test: ChunkMonitorPanel hiển thị phase & lỗi
- [ ] Lint + Jest full suite (đang cleanup cảnh báo kế thừa)

Tuần 4: Polish (Optional)
- [ ] UI/UX improvements
- [ ] Add demo data scenarios
- [ ] Final rehearsal
```

### 6.6. Nếu có lỗi - Rollback siêu đơn giản

```bash
# Rollback về version cũ (30 giây)
git checkout HEAD~1 backend/prisma/schema.prisma
rm backend/prisma/dev.db
npx prisma migrate dev

echo "✅ Rolled back to old version!"
```

### 6.7. Kết luận cho Demo

**TL;DR:**
- ✅ **Drop database và tạo lại** thay vì migrate
- ✅ **Seed new data** thay vì convert old data
- ✅ **Focus core features** thay vì edge cases
- ✅ **Manual testing** thay vì comprehensive tests
- ✅ **3-4 weeks** thay vì 6 weeks

**Demo mantra:**
> "Don't migrate - Regenerate!"
> "Demo data không quan trọng - Concept demonstration mới quan trọng!"

**Perfect for:**
- Academic thesis demonstration
- Proof of concept
- Architecture validation
- UI/UX showcase
- Giảng viên presentation

**NOT for:**
- Production deployment
- Real user data
- Enterprise systems
- Long-term maintenance

---

**Người viết:** Claude Code
**Review:** Cần review bởi team security và cryptography expert
**Ưu tiên:** 🔴 CRITICAL - Cần sửa ngay
**⚠️ CẬP NHẬT:** Đã có giải pháp đơn giản cho demo project
