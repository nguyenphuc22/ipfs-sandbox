# Kế hoạch triển khai tiếp theo: Giai đoạn hậu Task A–C

**Ngày cập nhật:** 2025-10-16  
**Trạng thái:** Các hạng mục chính (Task A, B, C) đã hoàn thành ✅ — chuyển trọng tâm sang Task D (kiểm thử, tài liệu, hardening).

## 1. Tổng kết tiến độ
- ✅ **Mobile client**: `ChunkEncryptionService`, `AOTUploadModal`, `GatewayApiService.uploadWithClientChunking` đã hoạt động end-to-end với manifest + encrypted chunk keys.
- ✅ **Backend**: Endpoint `/api/files/client-chunked-upload` lưu trữ manifest, chunk metadata và audit log mà không chạm dữ liệu thô.
- ✅ **Download flow**: `chunkDownloadManager.downloadFile()` tải chunk thật từ IPFS, giải mã AES-GCM, kiểm tra hash và ghép file.
- ✅ **Unit test suites**: `ChunkEncryptionService.test.ts` và `chunkDownloadManager.test.ts` có đủ mocks; ⚠️ cần Node.js ≥ 20.19 hoặc mock `@noble/hashes/sha2` để chạy trên Node 18.
- ⏳ **Integration/Smoke tests + tài liệu vận hành**: chưa cập nhật theo pipeline mới.

## 2. Việc cần làm ngay (Task D)
1. **Ổn định môi trường kiểm thử**
   - [ ] Cấu hình CI/runner dùng Node 20.19+ *hoặc* thêm manual mock cho `@noble/hashes/sha2` nhằm gỡ lỗi `Cannot find module` trong Jest.
   - [ ] Bật lại Jest suites `ChunkEncryptionService` / `chunkDownloadManager` trong pipeline sau khi môi trường sẵn sàng.
2. **Integration & E2E**
   - [ ] Viết test upload→download thật (sử dụng IPFS local gateway) để chứng minh manifest + key package hoạt động.
   - [ ] Chuẩn hóa smoke test end-to-end và log kết quả vào QA sổ tay.
3. **Tài liệu & Onboarding**
   - [ ] Cập nhật README/start-system với luồng client chunking + manifest API mới.
   - [ ] Viết QA checklist cho key package storage, telemetry tốc độ download/decrypt.
4. **Migration & Observability**
   - [ ] Bổ sung script migrate legacy record sang `clientChunked` metadata (nếu còn dữ liệu cũ).
   - [ ] Hoàn thiện dashboard/alert kiểm tra audit log và manifest integrity.

## 3. Chi tiết theo hạng mục

### Mobile (đã triển khai)
- `ChunkEncryptionService.processFileForChunking()` xử lý đọc file → chia chunk → mã hóa AES-256-GCM → upload IPFS.
- `AOTUploadModal` hiển thị tiến trình từng giai đoạn, gửi manifest + encrypted chunk keys đến backend và lưu key package vào `KeyPackageStorage`.
- `GatewayApiService.uploadWithClientChunking()` wrap endpoint mới, không còn upload raw data lên server.
- Việc cần tiếp: telemetry tốc độ/tỷ lệ lỗi, đảm bảo AsyncStorage backup key package và optional mã hóa thiết bị.

### Backend (đã triển khai)
- `/api/files/client-chunked-upload` xác thực Schnorr + LSAG, ghi File/FileChunk/AnonymousFileAccess/Audit mà không giữ master/chunk key.
- Prisma metadata lưu `clientChunked`, `keyPackageFingerprint`, `uploaderPublicKeyHash` (SHA-256) phục vụ audit ẩn danh.
- Việc cần tiếp: script migrate file cũ sang format mới & checklist đảm bảo anonymous router mount trước legacy routes.

### Download flow (đã triển khai)
- `chunkDownloadManager.downloadFile()` và `retryChunk()` chạy đường đi thực: fetch IPFS `/api/v0/cat`, decrypt AES-GCM, verify hash, cache chunk rồi reassemble.
- Hook `useChunkDownloader` và UI `SecureDownloadScreen` đã chuyển sang API mới, có trạng thái `chunks → verifying → assembling → ready`.
- Việc cần tiếp: telemetry tốc độ tải, chiến lược tải song song/streaming cho file lớn, cơ chế resume/parallel download.

### QA & Tooling (đang thực hiện)
- ✅ Jest setup có mock cho RN libraries & crypto.
- ⚠️ Node runtime < 20 hiện khiến Jest không resolve được `@noble/hashes/sha2`; cần fix trước khi bật CI.
- [ ] Bổ sung integration tests & smoke test script (tận dụng `test-ipfs-functionality.sh`).
- [ ] Cập nhật tài liệu QA về quy trình verify manifest + key package.

## 4. Rủi ro & biện pháp
- **Runtime incompatibility:** `@noble/hashes` yêu cầu Node 20.19+ → giải pháp: nâng Node version hoặc thêm manual mock trong Jest/Metro.
- **Hiệu năng thiết bị yếu:** cân nhắc giới hạn concurrency, chunk size linh hoạt, ghi chú trong QA.
- **Dung lượng bộ nhớ:** reassembly đang giữ tất cả chunk trong RAM; cần theo dõi và cân nhắc streaming/saving trực tiếp sau Task D.
- **Log & audit:** tiếp tục kiểm tra `maskHashForLogging` trên các path mới để tránh lộ public key raw.

## 5. Tài liệu tham chiếu
- `ANONYMOUS_UPLOAD_IMPLEMENTATION.md`
- `ANONYMOUS_DOWNLOAD_REDESIGN.md` (cần cập nhật lại mô tả cho luồng mới)
- `DOWNLOAD_FLOW_FINAL.md`
- `TASK_B_C_IMPLEMENTATION_SUMMARY.md`
- `backend/src/routes/anonymous-endpoints-addition.js`
- `mobile/src/services/ChunkEncryptionService.ts`
- `mobile/src/services/chunkDownloadManager.ts`
