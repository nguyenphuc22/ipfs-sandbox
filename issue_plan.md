# Kế hoạch xử lý Anonymous Download Fix

**Last Updated:** 2025-10-16

## Progress Overview
- ✅ **Task A:** Di chuyển chunking & mã hóa sang client (HOÀN THÀNH)
- ✅ **Task B:** Điều chỉnh backend nhận manifest (HOÀN THÀNH)
- ✅ **Task C:** Hoàn thiện download flow ẩn danh (HOÀN THÀNH)
- ⏳ **Task D:** Kiểm thử & tài liệu (ĐANG CHỜ TRIỂN KHAI)

---

## Task A – Di chuyển chunking & mã hóa sang client ✅
- [x] **Xây dựng module chunking trên mobile**
  - `mobile/src/services/ChunkEncryptionService.ts` giờ đảm nhận toàn bộ pipeline đọc file → chia chunk → mã hóa → upload IPFS (`processAndUploadFile`).
  - Backend không còn gọi `processFileForChunking`; upload thử nghiệm đã chuyển sang client.
- [x] **Cập nhật `AOTUploadModal` & `GatewayApiService`**
  - `AOTUploadModal` (mobile/src/components/ipfs/AOTUploadModal.tsx:306-372) kích hoạt chunking client-side, hiển thị tiến độ và gửi manifest.
  - `GatewayApiService.uploadWithClientChunking` (mobile/src/services/GatewayApiService.ts:771-828) POST manifest tới backend mới.
- [x] **Lưu key package an toàn phía client**
  - Sau upload, key package được lưu vào AsyncStorage qua `saveKeyPackage` (mobile/src/components/ipfs/AOTUploadModal.tsx:381-411).

**Ghi chú tiếp theo:**
- Bổ sung hướng dẫn QA về quản lý key package (AsyncStorage/Keychain) và cân nhắc mã hóa ở tầng thiết bị nếu yêu cầu bảo mật tăng cao.
- Thiết lập runner Node.js ≥ 20.19 để Jest có thể import `@noble/hashes/sha2` (hiện tại chạy trên Node 18 sẽ fail module resolution).

## Task B – Điều chỉnh backend nhận manifest ✅
- [x] **Refactor `/api/files/aot-upload` / `/chunked-upload`**
  - Endpoint mới `/api/files/client-chunked-upload` (backend/src/routes/anonymous-endpoints-addition.js:344-599) nhận manifest + encrypted keys, không còn xử lý file raw.
  - Upload handler tạo bản ghi File/Chunk/Audit thuần metadata và đánh dấu `clientChunked` trong metadata JSON.
- [x] **Zero-Trust Architecture**
  - Backend chỉ lưu CID + hash + fingerprint, không nắm master/chunk keys (secureKeyPackage trả về null keys).
  - LSAG + Schnorr kiểm chứng quyền sở hữu trước khi ghi DB.

**Ghi chú tiếp theo:**
- Viết script migrate dữ liệu cũ sang schema `clientChunked` nếu cần hỗ trợ backward compatibility.
- Theo dõi log Prisma để chắc chắn audit log không “bể” khi thiếu bảng (liên quan Task 12).

## Task C – Hoàn thiện download flow ẩn danh ✅
- [x] **Thực thi tải chunk thực tế trong mobile**
  - `mobile/src/services/chunkDownloadManager.ts` tải chunk qua `/api/v0/cat`, giải mã AES-GCM với chunk key, và verify SHA-256 hash trước khi lưu tạm bộ nhớ.
- [x] **File reassembly & hook/UI**
  - Hàm `reassembleFile` ghép các chunk đã giải mã; hook `useChunkDownloader` và UI gọi `chunkDownloadManager.downloadFile()` để thực thi luồng thật.
  - Có retry từng chunk và kiểm tra fingerprint key package.

**Ghi chú tiếp theo:**
- Bổ sung telemetry về tốc độ tải/decrypt để QA đánh giá hiệu năng.
- Đảm bảo mobile integration test (`mobile/__tests__/chunkDownloadManager.test.ts`) chạy trong CI khi cấu hình Jest được bật.
- Hoàn thiện manual mock cho `@noble/hashes/sha2` hoặc nâng cấp Node runner để tránh lỗi Jest tương tự Task A.

## Task D – Kiểm thử & tài liệu ⏳
- [ ] **Viết test tự động**
  - ✅ Unit test chunking client-side (`ChunkEncryptionService.test.ts`) & download manager đã sẵn sàng nhưng yêu cầu Node.js ≥ 20.19.
  - [ ] Hoàn thiện integration test upload→download thực (Task D).
- [ ] **Cập nhật tài liệu vận hành**
  - README/start-system chưa có hướng dẫn pipeline mới.
- [ ] **Smoke test end-to-end**
  - Chưa chạy do chờ hoàn thiện hạ tầng Jest/IPFS cho pipeline mới.

**Việc cần làm:**
1. Ổn định môi trường test (Node 20.19 hoặc mock module) rồi bật lại Jest suites trong CI.
2. Sau đó bổ sung integration test và cập nhật tài liệu.
3. Thực hiện smoke test end-to-end và ghi log vào tài liệu liên quan.
