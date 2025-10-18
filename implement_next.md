# Lộ trình triển khai tiếp theo: Anonymous Access Management (Grant + Revoke)

**Ngày cập nhật:** 2025-10-18  
**Trạng thái:** Bắt đầu giai đoạn kiểm soát toàn bộ vòng đời quyền truy cập ẩn danh.

## 1. Trọng tâm giai đoạn mới
- Hoàn thiện API cho phép chủ sở hữu *cấp* và *thu hồi* quyền đọc file mà vẫn giữ tính ẩn danh tuyệt đối.
- Chuẩn hóa trải nghiệm mobile: một modal duy nhất quản lý danh sách public key, thao tác thêm/bớt chỉ bằng một chạm.
- Đồng bộ dữ liệu người nhận: đảm bảo grant mới xuất hiện tức thì, revoke làm biến mất file khỏi danh sách người nhận và xoá cache liên quan.
- Bổ sung kiểm thử, tài liệu và checklist QA để trình diễn đầy đủ trong demo.

## 2. Roadmap đề xuất

### Pha 1 – Backend Access Management API
- [ ] Cập nhật Prisma schema (`AnonymousFileAccess`, `AnonymousAuditLog`) với trường `status`, `revokedAt`, `lastOwnerProof`, index `fileId + accessorPublicKeyHash`.
- [ ] Implement service `AccessManagementService` gom logic list/grant/revoke, tái sử dụng `RingSignatureService` + `SchnorrOwnershipService` để xác thực chủ sở hữu.
- [ ] Thêm endpoints:
  - `GET /api/files/:fileId/anonymous-grants`
  - `POST /api/files/:fileId/anonymous-grants`
  - `DELETE /api/files/:fileId/anonymous-grants/:grantId`
  Tất cả yêu cầu Schnorr proof + LSAG và middleware chống replay (nonce store).
- [ ] Ghi audit log (`grant_issued`, `grant_revoked`, `grant_updated`) và phát event nội bộ `AccessGrantChanged` để client có thể polling/subscribe.

### Pha 2 – Mobile Access Manager & Key Package UX
- [ ] Tạo component `AccessManagerModal` (thay modal grant hiện tại) với hai danh sách: "Đang có quyền" và "Thêm mới".
- [ ] Bổ sung service method: `listOwnerGrants`, `grantAccess`, `revokeAccess`, `syncGrantJournal` trong `AnonymousFileAccessService`.
- [ ] Hỗ trợ thao tác thêm public key mới bằng nhập/dán/scan, toggle revoke, và hiển thị trạng thái (`active`, `revoked`, `pending`).
- [ ] Khi grant thành công, tự động sao chép key package JSON hoặc hiển thị QR code; log hướng dẫn chia sẻ cho demo.

### Pha 3 – Recipient Experience & Đồng bộ đa thiết bị
- [ ] Mobile phía người nhận: refresh danh sách `anonymous-list` theo `lastModified`/ETag để phản ánh revoke ngay lập tức.
- [ ] Xử lý badge `Revoked`, xoá cache file và khóa truy cập nếu grant bị thu hồi.
- [ ] Bổ sung thông báo UI khi owner cấp quyền mới (toast hoặc banner "Bạn vừa được cấp quyền").
- [ ] Thêm script dev (`scripts/reset-anonymous-grants.js`) phục vụ reset dữ liệu demo.

### Pha 4 – Kiểm thử, tài liệu & vận hành
- [ ] Viết integration test end-to-end: upload → grant → recipient download → revoke → recipient bị chặn.
- [ ] Cập nhật `README.md`, `HUONG_DAN_PHAT_TRIEN.md`, `DOWNLOAD_FLOW_FINAL.md` với flow mới.
- [ ] Lập QA checklist bao gồm kiểm tra audit log, fingerprint, trạng thái revoke, và chia sẻ key package.
- [ ] Chuẩn bị demo script/slide minh họa Access Manager cho sự kiện giới thiệu.

## 3. Phụ thuộc & rủi ro
- **Node.js ≥ 20.19** vẫn là yêu cầu cho Jest khi dùng `@noble/hashes`; nếu CI chưa nâng cấp cần mock module trước khi bật test mới.
- **Bộ nhớ mobile**: lưu snapshot danh sách grant để offline; cần đảm bảo cleanup khi revoke để tránh cache quá hạn.
- **Chữ ký mật mã**: phải thống nhất message format (`grant:fileId:timestamp:nonce`, `revoke:fileId:grantId:timestamp:nonce`) giữa backend và mobile để tránh lỗi verify.
- **Concurrency**: cân nhắc khoá lạc quan khi owner thực hiện nhiều thao tác grant/revoke liên tiếp.

## 4. Chuẩn bị cho demo
- Xây dựng seed script tạo sẵn 2 file demo: một file cấp quyền cho 2 public key, một file đã revoke để so sánh.
- Thiết lập slide mô tả Access Manager step-by-step (Grant → Share key package → Recipient refresh → Revoke).
- Ghi lại video ngắn (screen capture) làm backup khi demo live gặp sự cố.
