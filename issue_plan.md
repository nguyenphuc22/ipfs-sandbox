# Kế hoạch triển khai: Anonymous Access Lifecycle

**Last Updated:** 2025-10-18

## Mục tiêu
- Cho phép chủ sở hữu quản lý toàn bộ vòng đời quyền truy cập ẩn danh (grant, cập nhật, revoke) bằng chữ ký Schnorr + LSAG.
- Đảm bảo mobile app hiển thị rõ danh sách public key được cấp quyền, thao tác thêm/bớt chỉ bằng một chạm.
- Đồng bộ phía người nhận để phản ánh grant/revoke tức thời và xử lý key package an toàn.
- Hoàn thiện kiểm thử, audit log và tài liệu phục vụ demo chính thức.

## Phạm vi
- Backend Express + Prisma, mobile React Native, tài liệu vận hành/QA.
- Không mở rộng sang adjudicator/escrow workflow ở giai đoạn này.

---

## Initiative 1 – Backend Access Management API (TODO)
- [x] Cập nhật Prisma schema (`AnonymousFileAccess`, `AnonymousAuditLog`) thêm các trường `status`, `revokedAt`, `lastOwnerProof`, index `fileId + accessorPublicKeyHash`.
- [x] Tạo service `AccessManagementService` gom logic list/grant/revoke, tái sử dụng `RingSignatureService` & `SchnorrOwnershipService`.
- [x] Triển khai REST endpoints:
  - `GET /api/files/:fileId/anonymous-grants`
  - `POST /api/files/:fileId/anonymous-grants`
  - `DELETE /api/files/:fileId/anonymous-grants/:grantId`
  (Tất cả yêu cầu Schnorr proof + LSAG, middleware chống replay theo nonce.)
- [x] Ghi `anonymousAuditLog` với event `grant_issued`, `grant_updated`, `grant_revoked`; phát event nội bộ `AccessGrantChanged` để phục vụ mobile sync.

## Initiative 2 – Mobile Access Manager UX (TODO)
- [x] Xây dựng component `AccessManagerModal` hiển thị hai danh sách: "Đang có quyền" (active) và "Thêm mới" (input/dán/scan).
- [x] Mở rộng `AnonymousFileAccessService` với method `listOwnerGrants`, `grantAccess`, `revokeAccess`, `syncGrantJournal`.
- [x] Cho phép người dùng thêm public key, chỉnh expiry, toggle revoke; hiển thị trạng thái (`active`, `revoked`, `pending`).
- [ ] Sau grant thành công: copy tự động key package JSON, hiển thị QR code optional và toast hướng dẫn chia sẻ. *(Clipboard hoạt động; QR/toast chưa triển khai.)*
- [x] UI phản hồi realtime sau khi backend xác nhận (loading state, optimistic update, error handling).

## Initiative 3 – Recipient Sync & Key Package Handling (TODO)
- [ ] Mobile phía người nhận: cập nhật `anonymous-list` sử dụng `lastModified`/ETag, ẩn file khi `status='revoked'`.
- [ ] Thêm badge "Revoked" và logic xoá cache/key package khi quyền bị thu hồi.
- [ ] Thông báo UI khi owner grant mới (toast hoặc banner "Bạn vừa được cấp quyền").
- [ ] Script hỗ trợ QA (`scripts/reset-anonymous-grants.js`) để reset dữ liệu demo.

## Initiative 4 – Validation & Documentation (TODO)
- [ ] Integration test end-to-end: upload → grant → recipient download → revoke → recipient bị chặn.
- [ ] Cập nhật tài liệu (`DOWNLOAD_FLOW_FINAL.md`, `ANONYMOUS_DOWNLOAD_REDESIGN.md`, `HUONG_DAN_PHAT_TRIEN.md`, `README.md`) với flow grant/revoke.
- [ ] Lập QA checklist (audit log, fingerprint, key package, retry cases).
- [ ] Chuẩn bị demo script & slide Access Manager, ghi lại video backup.

---

**Ghi chú trạng thái:**
- AccessManagerModal đã sẵn sàng nhưng chưa được nối vào luồng chính (`IPFSFileList`) nên chủ file hiện vẫn thấy giao diện cấp quyền legacy.
- QR code/toast chia sẻ key package, recipient sync, QA script và bộ tài liệu/demo vẫn cần thực hiện.

## Cột mốc đề xuất
- **Milestone 1:** Backend API + migration hoàn tất, seed data demo sẵn sàng.
- **Milestone 2:** Mobile Access Manager hoạt động end-to-end (grant + revoke) với backend mới.
- **Milestone 3:** Recipient trải nghiệm đầy đủ, integration test xanh.
- **Milestone 4:** Tài liệu/QA/demo kit hoàn thiện, sẵn sàng trình chiếu.