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

## Sự cố mới – Upload thất bại trên Android (RangeError) 🚧

**Mô tả nhanh:** Khi người dùng chọn file qua Document Picker trên Android (URI `content://`), ứng dụng crash với lỗi `RangeError: Failed to construct 'Response': The status provided (0) is outside the range [200, 599]`. Lỗi xảy ra trước bước chunking nên upload không chạy.

### Điều kiện tái hiện
- Thiết bị Android sử dụng `AOT Upload Modal` với file nguồn từ Google Drive/Downloads → URI dạng `content://`.
- Đang chạy build Hermes (React Native 0.75) với pipeline chunking mới.
- Nhật ký: `[ChunkEncryption] Reading file from URI: content://...` ngay sau đó Hermes log RangeError.

### Phân tích nguyên nhân gốc (RCA)
1. `ChunkEncryptionService.readFileFromURI` sử dụng `fetch(uri)` để đọc dữ liệu.
2. `fetch` trong môi trường React Native chỉ hỗ trợ HTTP(S); khi nhận `content://`, bridge tạo `Response` với status mặc định `0`.
3. Chuẩn WHATWG không cho phép status `0` → Hermes ném `RangeError` và promise bị reject, pipeline dừng.
4. Không chunk nào được tạo, do đó không có upload nào gửi tới IPFS/backend.

### Hướng xử lý & trạng thái
1. ✅ **Đã thay cơ chế đọc file:** Document Picker luôn `copyTo: 'cachesDirectory'` và `createPickedFileFromDocumentAsset` ưu tiên `fileCopyUri`. Module `react-native-fs` được thêm để đọc cả `file://` và `content://`.
2. ✅ **Đã cập nhật `readFileFromURI`:** Ưu tiên đọc qua `react-native-fs`, chỉ fallback `fetch` cho HTTP/HTTPS; thêm helper `resolveReadableUri`.
3. ⏳ **Quản lý quyền truy cập:** Chưa cần thay đổi bổ sung, sẽ xác minh thêm trong QA checklist.
4. ⏳ **Telemetry bổ sung:** Chưa triển khai, cân nhắc sau khi hoàn tất smoke test.

### Kế hoạch kiểm thử
1. Tái hiện lỗi trên phiên bản cũ để xác nhận baseline.
2. Sau khi vá, thử nghiệm với các nguồn:
  - Google Drive, Downloads, Files app.
  - File dung lượng lớn (>5 MB) và nhỏ (<1 MB).
3. ✅ Đã chạy lại unit test (`ChunkEncryptionService`, `chunkDownloadManager`) trên Node 18 với mock mới (đều PASS).
4. Thực hiện smoke test upload→download end-to-end.

### Công việc theo dõi
- [x] Refactor Document Picker và hàm đọc file.
- [x] Viết unit test/mock cho `readFileFromURI` xử lý `content://`.
- [ ] Cập nhật tài liệu hướng dẫn QA về quyền truy cập file.
- [ ] Ghi chú regression vào `TASK_D` checklist trước khi đóng issue.

## Sự cố mới – AES-GCM không chạy vì thiếu WebCrypto trên Hermes 🚧

**Mô tả nhanh:** Upload thất bại với `TypeError: Cannot read property 'importKey' of undefined` khi pipeline AES-GCM chạy trong `ChunkEncryptionService`. Android build hiện chạy bằng Hermes 0.79.3 không cung cấp `crypto.subtle`, khiến bước nhập key và mã hóa GCM sập ngay từ chunk đầu tiên.

### Điều kiện tái hiện
- Thiết bị Android/Hermes (React Native 0.79.3) sử dụng AOT Upload Modal.
- Chọn bất kỳ file nào sau khi đã pass fix RNFS.
- Nhật ký: `[ChunkEncryption] AES-GCM encryption error: TypeError: Cannot read property 'importKey' of undefined`.

### Phân tích nguyên nhân gốc (RCA)
1. Hermes trên React Native 0.79 mới chỉ cung cấp một phần WebCrypto; `global.crypto` tồn tại nhưng `crypto.subtle` chưa được implement nên trả về `undefined`.
2. `encryptChunkWithAESGCM` và `decryptChunkWithAESGCM` gọi `crypto.subtle.importKey/encrypt/decrypt` trực tiếp, không có kiểm tra fallback.
3. Hàm ném lỗi, pipeline `processFileForChunking` bị reject → upload modal nhận lỗi `Chunk encryption failed`.

### Hướng xử lý & trạng thái
1. ✅ **Phát hiện subtle & fallback tạm thời**: `ensureWebCryptoSupport()` báo lỗi rõ ràng nếu polyfill không khởi tạo được, ngăn promise treo.
2. ✅ **Tích hợp WebCrypto thay thế**: đã chọn `react-native-quick-crypto` + `react-native-get-random-values`, cài đặt và bootstrap trong `mobile/src/services/crypto/webCryptoSupport.ts`.
3. ✅ **Adapter hóa ChunkEncryptionService**: upload & download flow giờ lấy `subtle`/RNG thông qua helper, dễ dàng hoán đổi implementation khi cần.
4. ⏳ **Cập nhật test**: mock adapter mới trong `ChunkEncryptionService.test.ts`, thêm test cho nhánh “thiếu WebCrypto”.

### Kế hoạch kiểm thử
- Unit test: xác nhận encrypt/decrypt chạy với adapter mới, đồng thời nhánh báo lỗi khi thiếu crypto.
- Thiết bị thật/Emulator Android Hermes: chạy upload file cỡ nhỏ & lớn.
- Regression iOS: đảm bảo polyfill/adapter không phá môi trường webkit (nếu iOS đã có subtle).

### Công việc theo dõi
- [x] Đánh giá & chọn giải pháp WebCrypto (quick-crypto vs native AES trong crypto-lib).
- [x] Triển khai adapter + wiring vào ChunkEncryptionService.
- [ ] Cập nhật tài liệu build (thêm hướng dẫn cài đặt polyfill/native module).
- [ ] Smoke test upload trên Android & iOS sau khi vá.
