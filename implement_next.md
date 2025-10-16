# Kế hoạch triển khai tiếp theo: Chuyển chunking & mã hóa sang client

**Ngày cập nhật:** 2025-10-16  
**Trạng thái:** Chưa bắt đầu

## 1. Mục tiêu
- Di chuyển toàn bộ bước chia nhỏ, mã hóa và upload chunk từ backend sang mobile client để tuân thủ thiết kế ẩn danh.
- Đảm bảo backend chỉ nhận manifest (chunk CID, hash, size) cùng encrypted chunk keys và các chứng cứ mật mã.
- Cập nhật download flow để mobile sử dụng manifest và key package đã lưu, không phụ thuộc vào việc backend nắm dữ liệu thô.

## 2. Phạm vi công việc
1. **Mobile (React Native)**
   - [ ] Xây dựng module `ChunkEncryptionService` (hoặc tương tự) chịu trách nhiệm:
     - Đọc file từ picker thành stream/buffer.
     - Chia file thành chunk kích thước cấu hình (ví dụ 2MB).
     - Tạo master key & chunk key per-chunk.
     - Mã hóa từng chunk bằng AES-GCM (hoặc thuật toán đang dùng).
     - Upload trực tiếp chunk đã mã hóa lên IPFS gateway (qua HTTP API).
   - [ ] Cập nhật `AOTUploadModal` / `GatewayApiService` để:
     - Upload chunk song song/tuần tự và thu thập CID.
     - Tạo manifest & encrypted chunk key package.
     - Gửi payload rút gọn cho backend (`/api/files/aot-upload` hoặc endpoint mới).
   - [ ] Lưu master key + chunk keys vào secure storage (KeyPackageStorage) ngay sau upload thành công.
   - [ ] Điều chỉnh UI hiển thị tiến trình chunk upload (reuse ChunkMonitorPanel).

2. **Backend (Node/Express)**
   - [ ] Tạo endpoint mới (hoặc điều chỉnh `/aot-upload`) nhận `chunks[]`, `secureKeyPackage`, `metadataHash`, `ringSignature`, `schnorrProof`.
   - [ ] Bỏ hoàn toàn logic `processFileForChunking` khỏi request path chính (chỉ giữ utility cho migrate nếu cần).
   - [ ] Cập nhật Prisma layer để lưu chunk list từ payload thay vì tự tạo.
   - [ ] Đảm bảo audit log chỉ lưu metadata rút gọn, không chứa dữ liệu thô.

3. **Download Flow**
   - [ ] Điều chỉnh `AnonymousFileAccessService` để ưu tiên manifest do client tạo (đối chiếu hash, chunk count).
   - [ ] Hoàn thiện `chunkDownloadManager` để tải thực sự từng chunk từ IPFS bằng CID + chunk key, xác minh hash, ghép file.
   - [ ] Bổ sung cơ chế cache manifest/key package và xử lý khi thiếu.

4. **Bảo mật & Kiểm thử**
   - [ ] Viết unit test cho module chunking/mã hóa (đảm bảo decrypt trả lại dữ liệu gốc).
   - [ ] Viết integration test upload→download để xác thực manifest, integrity hash.
   - [ ] Rà soát log để không ghi plaintext/master key.

## 3. Rủi ro & biện pháp
- **Hiệu năng trên thiết bị yếu:** cân nhắc chunk size nhỏ hơn, sử dụng streaming (react-native-fs).
- **Dung lượng bộ nhớ tạm:** sử dụng buffer theo chunk, tránh giữ toàn bộ file trong RAM.
- **Song song upload:** cần giới hạn concurrency để tránh nghẽn network.
- **Sai lệch manifest:** log và validate chéo bằng hash SHA-256.

## 4. Mốc thực hiện gợi ý
1. Spike kỹ thuật chunking + encrypt trên React Native (1-2 ngày).
2. Hoàn thiện upload pipeline mới (3-4 ngày).
3. Điều chỉnh backend + DB migration (2 ngày).
4. Hoàn thiện download pipeline + kiểm thử tích hợp (3 ngày).
5. Tổng kết, cập nhật tài liệu và demo (1 ngày).

## 5. Tài liệu liên quan
- `ANONYMOUS_DOWNLOAD_REDESIGN.md`
- `DOWNLOAD_FLOW_FINAL.md`
- `New_Thesis.md`
- `backend/src/services/fileChunkService.js`
- `mobile/src/components/ipfs/AOTUploadModal.tsx`
- `mobile/src/services/GatewayApiService.ts`
- `mobile/src/services/chunkDownloadManager.ts`
