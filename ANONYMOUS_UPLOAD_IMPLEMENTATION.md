# Anonymous Upload Implementation (Post Task A/B)

**Date:** 2025-10-16
**Last Updated:** 2025-10-27
**Status:** ✅ Phase 1 complete — Phase 2 (Hybrid Adjudicator) **in progress** with ValidationToken + EscrowedIdentity already integrated.

> **⚠️ IMPORTANT UPDATE (2025-10-27):**
> Upload flow hiện tại đã hoàn thành **Phase 1** (client-side chunking + Ring Signature authentication).
> **Phase 2 (Hybrid Adjudicator)** đã kích hoạt lớp đầu tiên:
> - **Layer 1 (Real-time)**: ValidationToken từ Adjudicator (policy enforcement)
> - **Layer 2 (Post-hoc)**: EscrowedIdentity (encrypted real publicKey cho investigation)
>
> Xem chi tiết tại **`INVESTIGATION_FLOW.md`** và **`ImplementNext.md`**.

## 1. Tóm tắt kiến trúc mới
- **Client-side responsibility**: `ChunkEncryptionService` đọc file, chia chunk, mã hóa AES-256-GCM, upload chunk lên IPFS gateway và tạo manifest + encrypted chunk key package.
- **Backend responsibility**: Endpoint `/api/files/client-chunked-upload` chỉ kiểm chứng chứng cứ mật mã, lưu metadata (chunk list, fingerprint) và ghi audit log bằng `uploaderPublicKeyHash = SHA256(ownershipPublicKey)`.
- **Zero-trust**: Server không bao giờ nhận raw file hay master/chunk key; mọi key ở client.

## 2. Thay đổi chính

### 2.1 Mobile
- `mobile/src/services/ChunkEncryptionService.ts`
  - `processFileForChunking()` trả về `manifest`, `chunkKeys`, `encryptedChunkKeys`, `keyPackageFingerprint`.
  - Upload chunk lên IPFS (`POST /api/v0/add`) khi chunk hóa xong.
- `mobile/src/services/GatewayApiService.ts`
  - Thêm `requestValidationToken()` gọi `adjudicatorUrl/api/validate-upload`.
  - `uploadWithClientChunking` gửi kèm `validationToken`, `nonce`, `timestamp`, `escrowedIdentity`.
- `mobile/src/services/crypto/escrow.ts`
  - Hàm `createEscrowedIdentity()` (Schnorr shared secret + XChaCha20-Poly1305) mã hóa real public key.
- `mobile/src/components/ipfs/AOTUploadModal.tsx`
  - Quy trình mới: chunk/encrypt → xin ValidationToken → tạo EscrowedIdentity → gửi manifest.
  - UI phản hồi: progress “Đang xin ValidationToken…/Đang mã hóa danh tính…”.
  - Sau khi nhận phản hồi backend, lưu key package vào `KeyPackageStorage`.

### 2.2 Backend
- `backend/src/routes/anonymous-endpoints-addition.js`
  - `POST /api/files/client-chunked-upload`
    - ✅ Verify ValidationToken signature, adjudicator public key, nonce uniqueness (`ValidationNonce`).
    - ✅ Validate EscrowedIdentity format (base64 JSON envelope).
    - ✅ Lưu `ValidationToken` relation + audit log (tokenId, expiresAt, fingerprint).
    - ✅ Tiếp tục kiểm chứng Schnorr + LSAG, tạo FileChunk/AnonymousFileAccess như Phase 1.
- `backend/src/routes/admin.js`
  - `POST /api/admin/investigate` proxy adjudicator decrypt API (requires `ADJUDICATOR_SERVICE_URL`).
- Prisma schema mở rộng: mô hình `ValidationToken`, `ValidationTokenAudit`, `BannedUser`, `ValidationNonce`, `InvestigationAudit`.

### 2.3 Database & Migration
- Migration cũ `20251015150722_add_uploader_public_key_hash` + script `data-migration-uploader-hash.js` vẫn giữ nguyên.
- **Mới**: `ValidationToken`, `ValidationTokenAudit`, `ValidationNonce`, `BannedUser`, `InvestigationAudit` được sync bằng `prisma db push` (`20251027120000_add_hybrid_adjudicator_support`).
- Các bảng `AnonymousFileAccess`, `AnonymousAuditLog` tiếp tục không chứa `userId`, nhưng metadata upload log ghi tokenId + expiry.

## 3. Luồng upload ẩn danh mới

```
Mobile chọn file → ChunkEncryptionService
  1. Đọc file (fetch URI)
  2. Chia chunk (mặc định 2MB)
  3. Mã hóa AES-256-GCM từng chunk (key ngẫu nhiên)
  4. Upload chunk đã mã hóa lên IPFS → nhận CID
  5. Lưu manifest (index, cid, hash, size) + encrypted chunk keys

Mobile xin ValidationToken → Adjudicator service
  - Payload: { userPublicKey, fileMetadataHash, timestamp, nonce }
  - Nhận về: `validationToken` (tokenId, signature, TTL, adjudicatorPublicKey, requestNonce)

Mobile tạo EscrowedIdentity
  - Dùng adjudicatorPublicKey + realPublicKey → derive shared secret (Schnorr ECDH)
  - Mã hóa bằng XChaCha20-Poly1305 → base64 envelope

Mobile gửi manifest → Gateway
  POST /api/files/client-chunked-upload
  Body gồm:
    fileName, fileSize, chunkCount,
    chunks: [{ index, cid, hash, size }],
    metadataHash,
    ownershipPublicKey,
    encryptedChunkKeys,
    keyPackageFingerprint,
    validationToken,
    escrowedIdentity,
    timestamp,
    nonce,
    schnorr proof,
    ringSignature (optional),
    ringMembers

Backend xử lý
  1. Validate payload + metadataHash khớp thực tế
  2. Verify ValidationToken signature + adjudicator key + TTL
  3. Kiểm tra `nonce` chưa dùng (`ValidationNonce`)
  4. Verify EscrowedIdentity format
  5. Verify Schnorr & LSAG (nếu có)
  6. Tạo `File` + relation `ValidationToken`
  7. Tạo `FileChunk`, `AnonymousFileAccess`, ghi `AnonymousAuditLog`
  8. Trả về response không kèm master/chunk key

Mobile nhận response
  - Lưu key package (master + chunk keys + fingerprint) xuống AsyncStorage
  - Cập nhật UI và local cache
```

## 4. Kiểm chứng thực thi

### 4.1 Checklist
- [x] Backend không gọi `prisma.user` trong đường upload mới.
- [x] `File.uploaderPublicKeyHash`, `AnonymousFileAccess.accessorPublicKeyHash`, `AnonymousAuditLog.publicKeyHash` thống nhất dùng SHA-256(publicKey).
- [x] Response `secureKeyPackage` luôn `{ masterKey: null, chunkKeys: {} }`.
- [x] Audit log không còn trường `userId`.
- [x] Manual upload qua `AOTUploadModal` tạo file thành công, kiểm tra SQLite cho thấy `uploaderId` = NULL.
- [x] ValidationToken + escrowedIdentity được gửi kèm và lưu relation `ValidationToken`.

### 4.2 Testing & Runtime Notes
- ✅ Jest suites (`ChunkEncryptionService.test.ts`, `chunkDownloadManager.test.ts`) che phủ hạng mục client.
- ⚠️ Yêu cầu Node.js ≥ 20.19 hoặc mock `@noble/hashes/sha2`; chạy trên Node 18 hiện gặp lỗi `Cannot find module '@noble/hashes/sha2'`.
- ✅ Backend smoke test: gọi trực tiếp `/api/files/client-chunked-upload` với manifest mẫu, kiểm tra DB records & audit log.
- ⚠️ Cần bổ sung test manual/API cho ValidationToken (expiry, nonce reuse, banned user) + investigation round-trip.
- ✅ Unit tests: `backend/src/services/__tests__/ValidationTokenVerifier.test.js` covers valid/expired/signature/nonce scenarios.

## 5. Lợi ích
1. **Zero-trust upload**: server không nắm dữ liệu thô hay key giải mã.
2. **Ẩn danh thực sự**: chỉ lưu hash của public key; không còn `userId` trên toàn pipeline.
3. **Hiệu năng**: upload chunk trực tiếp từ client, giảm round-trip và tải encode tại backend.
4. **Bảo mật**: Schnorr + LSAG đảm bảo proper ownership và anonymity set.
5. **Tương thích download mới**: manifest + fingerprint chuẩn bị cho download flow Task C.

## 6. ~~Tác vụ tiếp theo~~ → **NEXT PHASE: Investigation Flow**

### ✅ Completed (Phase 1)
- [x] Client-side chunking + encryption (AES-256-GCM)
- [x] Upload chunks trực tiếp lên IPFS
- [x] Backend chỉ nhận manifest (không nhận raw data/keys)
- [x] Ring Signature authentication
- [x] Schnorr ownership proof
- [x] Anonymous audit logging với `publicKeyHash`
- [x] Key package management (local storage + fingerprint)
- [x] Access management API (grant/revoke) - đã hoàn thành 2025-10-18

### 🚧 In Progress (Phase 2: Investigation Flow)
**Priority:** HIGH - Triển khai Hybrid Adjudicator Model

**Objective:** Thêm dual-layer accountability vào upload flow:
1. **Layer 1 (Real-time)**: ValidationToken
   - Adjudicator issues token sau policy checks (user exists, not banned, rate limit OK)
   - Token có Schnorr signature của Adjudicator
   - Backend verifies token trước khi accept upload
   - TTL: 10 minutes

2. **Layer 2 (Post-hoc)**: EscrowedIdentity
   - Client ECIES-encrypt real publicKey với Adjudicator's public key
   - Store encrypted identity cùng file record
   - Chỉ Adjudicator có thể decrypt (investigation only)
   - Cross-reference Layer 1 & Layer 2 để detect inconsistencies

**Implementation Tasks:**
- [x] **Bước 1.1**: Tạo Adjudicator Service (microservice) - 2 days
  - ValidationService: issue tokens (Schnorr signature)
  - InvestigationService: decrypt escrowedIdentity
  - Policy enforcement (user validation, rate limiting, ban checks)
- [x] **Bước 1.2**: Update Mobile Upload Flow - 1.5 days
  - Request ValidationToken từ Adjudicator
  - Create EscrowedIdentity (ECIES encryption)
  - Upload với ValidationToken + EscrowedIdentity
- [x] **Bước 1.3**: Update Backend Upload Verification - 1 day
  - Verify ValidationToken signature (Schnorr)
  - Verify EscrowedIdentity format (ECIES structure)
  - Nonce tracking (double-spend prevention)
  - Store both layers vào database
- [x] **Bước 1.4**: Database Schema Updates - 0.5 day
  - Add `ValidationToken` model
  - Add `InvestigationAudit` model
  - Add `ValidationTokenAudit` (Adjudicator DB)
  - Add `BannedUser` model
- [x] **Bước 2.1**: Admin Investigation API - 1 day (proxy adjudicator; auth hardening pending)
  - POST `/api/admin/investigate`
  - Decrypt escrowedIdentity via Adjudicator
  - Generate comprehensive investigation report
- [ ] **Bước 2.2**: Admin Dashboard UI - 1.5 days
  - Investigation form interface
  - Display decrypted identity + activity summary
  - Red flags detection & risk assessment
  - Recommended actions (ban user, flag files)

**Total Effort:** ~9 days (2 weeks)

**Xem chi tiết:** `INVESTIGATION_FLOW.md` và `ImplementNext.md`

## 7. Tài liệu và mã nguồn liên quan
- `mobile/src/services/ChunkEncryptionService.ts`
- `mobile/src/components/ipfs/AOTUploadModal.tsx`
- `mobile/src/services/GatewayApiService.ts`
- `backend/src/routes/anonymous-endpoints-addition.js`
- `backend/prisma/schema.prisma`
- `TASK_B_C_IMPLEMENTATION_SUMMARY.md`
