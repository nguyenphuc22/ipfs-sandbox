# Kế hoạch xử lý Anonymous Download Fix

## Task A – Di chuyển chunking & mã hóa sang client 🚧
- [ ] **Xây dựng module chunking trên mobile**
  - Tạo service chuyên trách đọc file, chia chunk, sinh master key và chunk key.
  - Mã hóa từng chunk (AES-GCM) và upload trực tiếp lên IPFS bằng gateway HTTP.
  - Thu thập CID, hash, kích thước cho manifest và package hóa khóa (master + chunk keys) theo format chuẩn.
- [ ] **Cập nhật `AOTUploadModal` & `GatewayApiService`**
  - Thay đổi pipeline để upload chunk song song/tuần tự từ client.
  - Payload gửi backend chỉ còn metadataHash, ownershipProofs, ringSignature, escrowedIdentity, manifest, encryptedChunkKeys.
- [ ] **Lưu key package an toàn phía client**
  - Sử dụng `KeyPackageStorage`/AsyncStorage hoặc secure storage để lưu master key + chunk keys ngay sau upload thành công.
  - Mask khóa khi hiển thị debug ( chỉ ở chế độ demo ) và thêm cảnh báo bảo mật.

## Task B – Điều chỉnh backend nhận manifest 🔧
- [ ] **Refactor `/api/files/aot-upload`**
  - Loại bỏ `processFileForChunking` và logic đọc buffer.
  - Validate manifest/chunk hashes, lưu dữ liệu chunk vào Prisma từ payload client.
  - Ghi audit log chỉ chứa thông tin rút gọn (không dữ liệu thô).
- [ ] **Migration & cleanup**
  - Kiểm tra schema Prisma đảm bảo hỗ trợ lưu manifest từ client.
  - Dọn dẹp util không còn dùng, giữ script migrate phục vụ chuyển đổi dữ liệu cũ nếu cần.

## Task C – Hoàn thiện download flow ẩn danh 🧩
- [ ] **Thực thi tải chunk thực tế trong mobile**
  - Hoàn thiện `chunkDownloadManager` & `useChunkDownloader` để tải CID từ IPFS, giải mã bằng chunk key, ghép lại file.
  - Tích hợp kiểm tra hash, báo cáo integrity nếu lệch.
- [ ] **Đồng bộ manifest + key package**
  - `AnonymousFileAccessService` cần đối chiếu manifest server với bản local, xử lý khi thiếu key.
  - Bổ sung cơ chế refresh/invalid manifest và thông báo user.
- [ ] **UI & trải nghiệm**
  - Cập nhật `FileViewer`/`ChunkMonitorPanel` hiển thị tiến trình thực, không còn mô phỏng.
  - Cho phép người dùng tải thủ công Bộ chunk khi lỗi, ghi log audit hợp lệ.

## Task D – Kiểm thử & tài liệu ✅
- [ ] **Viết test tự động**
  - Unit test cho module chunking (encrypt/decrypt roundtrip, hash integrity).
  - Integration test upload→download (có thể chạy trong Jest hoặc harness tùy chỉnh).
  - Test backend đảm bảo nhận manifest thiếu thông tin sẽ trả về 400.
- [ ] **Cập nhật tài liệu vận hành**
  - Điều chỉnh README/start-system để hướng dẫn migrate schema + seed nếu bỏ chunking backend.
  - Bổ sung hướng dẫn QA trong `test-anonymous-routes-priority.md` và tài liệu demo mobile.
- [ ] **Smoke test end-to-end**
  - Sau khi hoàn thành, chạy lại toàn bộ flow ẩn danh (upload, cấp quyền, download, audit).
  - Ghi chú kết quả vào `STATUS.md` hoặc logbook liên quan.
