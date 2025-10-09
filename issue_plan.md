# Kế hoạch xử lý Anonymous Download Fix

## Task 1 – Chuẩn hóa router ẩn danh trên backend
- [ ] Tách `anonymous-endpoints-addition.js` thành module chuẩn (khai báo `express.Router`, import `crypto`, dùng chung Prisma instance).
- [ ] Mount router mới vào `server.js` (`app.use('/api/files', anonymousRoutes)`), đảm bảo không xung đột với route legacy.

## Task 2 – Loại bỏ API download dựa trên `userId`
- [ ] Xóa/disable các endpoint trong `backend/src/routes/files.js` còn query `UserFileAccess`/`userId`.
- [ ] Di chuyển logic upload/chunk giữ lại sang file mới nếu cần (ví dụ `files-legacy-upload.js`).
- [ ] Đảm bảo không còn chỗ nào trả về `userId` trong response download flow.

## Task 3 – Refactor service kiểm soát truy cập 
- [ ] Viết service TS/JS thống nhất (dùng `FileAccessService`/`RingSignatureService`) cho backend runtime hiện tại.
- [ ] Cập nhật `fileChunkService.js` sử dụng Anonymous service, bỏ hẳn hàm `getFileAccessInfo`, `logAuditEvent` legacy.
- [ ] Đảm bảo integrity alert dùng `reportedByPublicKeyHash` và log vào `AnonymousAuditLog`.

## Task 4 – Cleanup schema & migrations
- [ ] Xóa hẳn `UserFileAccess`, `AuditLog` khỏi `schema.prisma` (hoặc rename `_deprecated_*` rồi migrate drop).
- [ ] Tạo migration mới (`prisma migrate dev`) và chạy `prisma generate`.