# QA Checklist – Anonymous Access Lifecycle (Grant / Revoke)

**Phiên bản:** 2025-10-18  
**Phạm vi:** Backend Express + Prisma, Mobile React Native (Access Manager & Recipient sync)  
**Mục tiêu:** Đảm bảo trải nghiệm grant/revoke ẩn danh hoạt động end-to-end, bao gồm đồng bộ người nhận, cache, audit và tooling hỗ trợ QA.

---

## 1. Chuẩn Bị Môi Trường
- [ ] Khởi động toàn bộ stack (`./start-system.sh`) – backend `http://localhost:3000`, IPFS gateway, mobile bundler.
- [ ] Xoá dữ liệu cũ: `node scripts/reset-anonymous-grants.js --yes --dry-run` để kiểm tra, sau đó chạy không `--dry-run`.
- [ ] Đảm bảo Prisma Studio hiển thị bảng `AnonymousFileAccess`, `AnonymousAuditLog` rỗng.
- [ ] Mobile app đã đăng ký ít nhất 2 identity (Owner & Recipient) với public key riêng.

## 2. Edge-to-Edge Grant Flow
- [ ] Owner mở Access Manager modal, thêm public key Recipient → nhận banner "Bạn vừa được cấp quyền".
- [ ] Backend:
  - `AnonymousFileAccess` có record mới (`status='active'`, `accessorPublicKeyHash` đúng hash recipient).
  - `AnonymousAuditLog` sinh `grant_issued` (metadata chứa `recipientPublicKeyHash`, `nonce`).
- [ ] Recipient kéo refresh danh sách `anonymous-list` → file xuất hiện ngay dù `ownershipPublicKey` != public key của recipient, kiểm tra dev log/Redux store để thấy owner key còn nguyên; meta `etag` được lưu trong AsyncStorage (`aot_anonymous_list_cache_v1_<hash>`).
- [ ] UI hiển thị banner "Bạn vừa được cấp quyền" (có thể tắt thủ công).

## 3. Recipient Sync & Cache
- [ ] Ngắt mạng backend (tạm thời) → kéo refresh recipient list → app sử dụng snapshot cục bộ (không crash) và hiển thị badge "Offline cache" trong dev logs.
- [ ] Khôi phục mạng, grant thêm 1 file khác → kiểm tra `meta.etag` và `meta.lastModified` trên response mới, AsyncStorage ghi đè snapshot cũ.

## 4. Revoke & Cleanup
- [ ] Owner revoke public key Recipient trong Access Manager → modal cập nhật `status='revoked'`.
- [ ] Backend logs `grant_revoked`, `AnonymousFileAccess.status='revoked'`, `revokedAt` có giá trị.
- [ ] Gói manifest trả về từ `POST /api/files/revocation/prepare` liệt kê đúng danh sách chunk (chỉ số + CID). Thử gọi `/revocation/finalize` với key cũ → backend trả lỗi "Chunk key for index ... was not rotated".
- [ ] Recipient refresh anonymous list:
  - File vừa revoke **biến mất** khỏi danh sách.
  - Banner "Quyền truy cập đã bị thu hồi" hiển thị (kèm số lượng key package bị xoá).
  - AsyncStorage key `ipfs_key_packages_v1` không còn record cho `fileId` đó.
  - Audit log sinh event `delete_cache` (metadata `reason='grant_revoked'`).
- [ ] Access Manager hiển thị fingerprint mới, clipboard chứa `rotatedKeyPackage` (master key + chunk keys mới); AsyncStorage `ipfs_key_packages_v1` lưu fingerprint khớp với response.
- [ ] Gửi payload thu hồi với Schnorr proof cũ (timestamp > 5 phút) hoặc nonce trùng → backend trả 400 `Schnorr proof timestamp is stale` / `message has already been used`.
- [ ] Thử gọi API quick revoke (`POST /api/files/revoke-quick`) **không** bật `adminOverride` → backend từ chối với thông báo "Quick revoke is disabled".

## 5. Regression Checks
- [ ] Grant lại cùng public key → `operation='updated'`, `grantedAt` mới, banner `granted` hiển thị, Recipient nhận lại file.
- [ ] Sau chuỗi `list → grant → revoke`, mở Prisma Studio (hoặc `sqlite3`) xác nhận event `key_image_verification` mới nhất có `metadata.usageContext='owner-management'` và `metadata.allowedByPolicy=true` (không báo `Invalid ring signature`).
- [ ] Hết hạn (`expiresAt` trong quá khứ) → recipient list tự động lọc ra, banner revoke xuất hiện.
- [ ] Kiểm tra log lint/test: `npm test -- --runTestsByPath src/tests/anonymous-flow.integration.test.ts` (đảm bảo 2 testcase mới PASS, các section cũ đang skip với TODO rõ ràng).

## 6. Tooling & Scripts
- [ ] `node scripts/reset-anonymous-grants.js --file <FILE_ID> --yes` xoá đúng grant/audit theo file, không ảnh hưởng record khác.
- [ ] `node scripts/reset-anonymous-grants.js --recipient <HASH> --dry-run` in ra số lượng record sẽ xoá, không thay đổi DB.
- [ ] Sau khi chạy script, mobile refresh → danh sách sạch, banner không hiển thị.

## 7. Demo Ready Checklist
- [ ] Có sẵn ít nhất 1 file demo với 2 grant active để so sánh (Active vs Revoked).
- [ ] Access Manager modal hiển thị fingerprint/key package rõ ràng (để trình diễn chia sẻ QR).
- [ ] Trước demo chạy `reset-anonymous-grants.js` + upload seed bằng script hoặc thủ công, xác nhận UI banner hoạt động.

---

> **Ghi chú:** Checklist tập trung vào flow grant/revoke mới. Các bước upload/download IPFS chi tiết vẫn tham chiếu `TASK_B_C_IMPLEMENTATION_SUMMARY.md` và `DOWNLOAD_FLOW_FINAL.md`.
