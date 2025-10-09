# ✅ Prompt triển khai Anonymous Download Flow

## 1. Bối cảnh & mục tiêu
Hệ thống đang trong nhánh `dev_aot` với mục tiêu chuyển toàn bộ download flow sang chế độ **ẩn danh** đúng như tài liệu `ANONYMOUS_DOWNLOAD_REDESIGN.md`. Tuy nhiên code hiện tại vẫn dựa trên `userId`, khiến backend biết chính xác ai truy cập file nào. Mục tiêu của nhiệm vụ này là hoàn thiện toàn bộ phần thiếu để đảm bảo:

- Mọi quyền truy cập/download được quản lý bằng `accessorPublicKeyHash` (SHA256 của public key), không còn phụ thuộc `userId`.
- Mọi audit log sử dụng bảng `AnonymousAuditLog` mới, không ghi lại định danh trực tiếp.
- Vòng đời download (liệt kê file → thương lượng → integrity alert → audit) vận hành thống nhất qua các endpoint ẩn danh.
- Mobile app chỉ tương tác với các endpoint ẩn danh và gửi proof hợp lệ.

## 2. Quan sát hiện trạng
- `uploadFileWithChunks` vẫn tạo bản ghi trong `UserFileAccess` và `AuditLog`; bảng mới `AnonymousFileAccess` không được populate.
- `/api/files/:fileId/access`, `/api/files/:fileId/integrity-alert`, `/api/files/:fileId/audit` vẫn dựa `userId`. Endpoint ẩn danh trong `files.js` chỉ xử lý manifest/alert khi client gửi `publicKey`, nhưng chữ ký vòng (`ringSignature`) chỉ kiểm tra public key có tồn tại → chưa đạt yêu cầu bảo mật.
- Các service mới trong `backend/src/services/FileAccessService.js` & `RingSignatureService.js` dùng cú pháp ES module/TypeScript nhưng không được sử dụng và không chạy được dưới runtime hiện tại.
- Frontend/mobile vẫn dùng `GatewayApiService` cho phần lớn thao tác download; chỉ `FileListScreen` chuyển sang anonymous API.
- `backend/src/routes/anonymous-endpoints-addition.js` trùng logic với đoạn anonymous trong `files.js` và không được mount.

## 3. Yêu cầu bắt buộc cho agent
1. **Chuẩn hóa backend**
   - Khi upload, tạo hoặc cập nhật quyền trong `AnonymousFileAccess` cho chủ sở hữu bằng hash public key.
   - Chuyển toàn bộ logging sang `AnonymousAuditLog`; ngăn mọi ghi nhận mới vào `AuditLog` hoặc trường `userId`.
   - Thay thế các endpoint download legacy bằng phiên bản ẩn danh, hoặc đảm bảo endpoint legacy chỉ wrap endpoint ẩn danh nhưng không lộ `userId`.
   - Gỡ bỏ/đổi tên các model và quan hệ deprecated (`UserFileAccess`, `AuditLog`) nếu không còn cần thiết; bảo đảm Prisma schema, migration, seed đồng nhất.
   - Hoàn thiện kiểm tra chữ ký vòng: xác minh nonce/timestamp, hash thông điệp, và ít nhất so khớp chữ ký với secret lưu (duy trì demo stub nhưng phải sử dụng `message`). Nếu cần giả lập, phải rõ ràng về giới hạn.

2. **Điều chỉnh dịch vụ backend**
   - Quy hoạch lại `FileAccessService`/`RingSignatureService` cho runtime CommonJS (hoặc chuyển phần còn lại sang ESM đồng bộ). Tích hợp dịch vụ này vào router thay vì để logic trùng lặp.
   - Xóa file trùng (`anonymous-endpoints-addition.js`) hoặc sát nhập, tránh duplication.

3. **Cập nhật mobile app**
   - Đảm bảo mọi màn hình và hook download sử dụng `AnonymousFileAccessService` (hoặc class mới tương đương) bao gồm các bước: list file, negotiate access, integrity alert, audit.
   - Thay thế mọi chỗ dùng `GatewayApiService` để gọi ảnh hưởng download (ví dụ `FileViewer`, hook IPFS) bằng anonymous API.
   - Với chữ ký vòng demo, đồng bộ cấu trúc/giao thức với backend (chứa `message`, `timestamp`, `nonce`, v.v.).

4. **Vệ sinh & migration**
   - Loại bỏ module/route thừa, import không dùng.
   - Đảm bảo Prisma migration đang dùng không phá vỡ dữ liệu (demo có thể reset). Nếu cần migration mới, tạo rõ ràng.
   - Cập nhật README hoặc tài liệu ngắn gọn mô tả luồng ẩn danh sau khi hoàn tất (có thể tái sử dụng phần trong prompt này).

## 4. Tiêu chuẩn hoàn thành
- `AnonymousFileAccess` được populate khi upload hoặc share; download list trả ra đúng dữ liệu, không dùng `userId`.
- Không còn ghi log mới vào `AuditLog`/`UserFileAccess`; mọi truy vết nằm trong bảng anonymous.
- Các endpoint download legacy trả về 410/301 hoặc wrap logic mới nhưng không tiết lộ identity.
- Mobile app chạy được luồng demo end-to-end (manual test) với các endpoint anonymous; integrity alert tạo bản ghi đúng schema mới.
- CI/commands tối thiểu: `npm run lint`/`npm test` (backend + mobile nếu có) hoặc giải pháp khác tùy project. Nếu không có test tự động, mô tả cách kiểm manual.

## 5. Gợi ý triển khai
- Bắt đầu từ backend: sửa upload flow để ghi vào bảng mới → chuyển download manifest → integrity alert → audit logging.
- Refactor routes để sử dụng service chung; convert file service sang CommonJS hoặc bật ESM.
- Đồng bộ mobile: sửa các service/hook trước rồi cập nhật UI nếu cần.
- Sau khi refactor, chạy Prisma migrate reset (nếu acceptable) và smoke test.

## 6. Checklist cho agent
- [ ] Cập nhật upload/thêm quyền ẩn danh.
- [ ] Rewire download manifest và integrity alert sang bảng anonymous.
- [ ] Xóa hoặc vô hiệu hóa route/model legacy.
- [ ] Hoàn thiện ring signature verification/timestamp/nonce.
- [ ] Refactor backend services để tránh duplication.
- [ ] Cập nhật mobile app sử dụng API ẩn danh.
- [ ] Viết doc/README rút gọn.
- [ ] Chạy lại các kiểm tra cần thiết và báo cáo kết quả.

---
Hãy sử dụng prompt này như “ticket” chính: đọc kỹ tài liệu tham chiếu, thực hiện từng mục trong checklist, và báo cáo rõ những gì còn hạn chế (ví dụ chữ ký vòng demo).