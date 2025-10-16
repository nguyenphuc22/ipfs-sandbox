# Anonymous Upload Implementation (Post Task A/B)

**Date:** 2025-10-16  
**Status:** ✅ COMPLETE — Backend chỉ nhận manifest + encrypted keys, client xử lý toàn bộ chunking/mã hóa.

## 1. Tóm tắt kiến trúc mới
- **Client-side responsibility**: `ChunkEncryptionService` đọc file, chia chunk, mã hóa AES-256-GCM, upload chunk lên IPFS gateway và tạo manifest + encrypted chunk key package.
- **Backend responsibility**: Endpoint `/api/files/client-chunked-upload` chỉ kiểm chứng chứng cứ mật mã, lưu metadata (chunk list, fingerprint) và ghi audit log bằng `uploaderPublicKeyHash = SHA256(ownershipPublicKey)`.
- **Zero-trust**: Server không bao giờ nhận raw file hay master/chunk key; mọi key ở client.

## 2. Thay đổi chính

### 2.1 Mobile
- `mobile/src/services/ChunkEncryptionService.ts`
  - `processFileForChunking()` trả về `manifest`, `chunkKeys`, `encryptedChunkKeys`, `keyPackageFingerprint`.
  - Upload chunk lên IPFS (`POST /api/v0/add`) khi chunk hóa xong.
- `mobile/src/components/ipfs/AOTUploadModal.tsx`
  - Quy trình Task A: chunk + encrypt + upload ngay trên thiết bị.
  - Sau khi nhận phản hồi backend, lưu key package vào `KeyPackageStorage`.
- `mobile/src/services/GatewayApiService.ts`
  - API `uploadWithClientChunking(payload: ClientChunkedUploadPayload)` call endpoint mới.

### 2.2 Backend
- `backend/src/routes/anonymous-endpoints-addition.js`
  - Route `POST /api/files/client-chunked-upload` kiểm chứng Schnorr + LSAG, validate manifest, lưu File, FileChunk, AnonymousFileAccess, AnonymousAuditLog.
  - Trả về metadata và echo lại chunk list, fingerprint; `secureKeyPackage` luôn null.
- Prisma schema giữ `uploaderPublicKeyHash`, metadata `clientChunked: true`, `keyPackageFingerprint`.

### 2.3 Database & Migration
- Migration `20251015150722_add_uploader_public_key_hash` + script `data-migration-uploader-hash.js` đã đi vào production để backfill dữ liệu cũ.
- Các bảng `AnonymousFileAccess`, `AnonymousAuditLog` nay chỉ lưu `publicKeyHash` & fingerprint, không chứa `userId`.

## 3. Luồng upload ẩn danh mới

```
Mobile chọn file → ChunkEncryptionService
  1. Đọc file (fetch URI)
  2. Chia chunk (mặc định 2MB)
  3. Mã hóa AES-256-GCM từng chunk (key ngẫu nhiên)
  4. Upload chunk đã mã hóa lên IPFS → nhận CID
  5. Lưu manifest (index, cid, hash, size) + encrypted chunk keys

Mobile gửi manifest → Gateway
  POST /api/files/client-chunked-upload
  Body: {
    fileName, fileSize, chunkCount,
    chunks: [{ index, cid, hash, size }],
    metadataHash,
    ownershipPublicKey,
    encryptedChunkKeys,
    keyPackageFingerprint,
    schnorr: { R, s, message, publicKey },
    ringSignature (optional),
    ringMembers
  }

Backend xử lý
  1. Validate payload, mỗi chunk khớp index/hash/size
  2. Verify Schnorr & LSAG (nếu có)
  3. Tạo `File` với `uploaderPublicKeyHash = SHA256(ownershipPublicKey)`
  4. Tạo `FileChunk` từ manifest, không download dữ liệu
  5. Tạo `AnonymousFileAccess` (status=active, keyStatus=client-managed)
  6. Ghi audit log `AnonymousAuditLog` (eventType=upload, metadata không chứa userId)
  7. Trả về response không kèm master/chunk key

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

### 4.2 Testing & Runtime Notes
- ✅ Jest suites (`ChunkEncryptionService.test.ts`, `chunkDownloadManager.test.ts`) che phủ hạng mục client.
- ⚠️ Yêu cầu Node.js ≥ 20.19 hoặc mock `@noble/hashes/sha2`; chạy trên Node 18 hiện gặp lỗi `Cannot find module '@noble/hashes/sha2'`.
- ✅ Backend smoke test: gọi trực tiếp `/api/files/client-chunked-upload` với manifest mẫu, kiểm tra DB records & audit log.

## 5. Lợi ích
1. **Zero-trust upload**: server không nắm dữ liệu thô hay key giải mã.
2. **Ẩn danh thực sự**: chỉ lưu hash của public key; không còn `userId` trên toàn pipeline.
3. **Hiệu năng**: upload chunk trực tiếp từ client, giảm round-trip và tải encode tại backend.
4. **Bảo mật**: Schnorr + LSAG đảm bảo proper ownership và anonymity set.
5. **Tương thích download mới**: manifest + fingerprint chuẩn bị cho download flow Task C.

## 6. Tác vụ tiếp theo
- [ ] Hoàn thiện tài liệu README/start-system mô tả pipeline mới.
- [ ] Viết QA checklist quản lý key package (backup, mã hóa thiết bị, telemetry).
- [ ] Script migrate dữ liệu upload cũ sang metadata `clientChunked` (nếu còn bản ghi legacy).
- [ ] Tích hợp integration test upload→download trong CI sau khi môi trường Node được nâng cấp.

## 7. Tài liệu và mã nguồn liên quan
- `mobile/src/services/ChunkEncryptionService.ts`
- `mobile/src/components/ipfs/AOTUploadModal.tsx`
- `mobile/src/services/GatewayApiService.ts`
- `backend/src/routes/anonymous-endpoints-addition.js`
- `backend/prisma/schema.prisma`
- `TASK_B_C_IMPLEMENTATION_SUMMARY.md`
