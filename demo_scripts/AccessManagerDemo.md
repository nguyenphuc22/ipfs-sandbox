# Demo Script – Anonymous Access Manager

**Mục tiêu:** Trình diễn vòng đời cấp quyền ẩn danh từ góc nhìn chủ sở hữu & người nhận, nhấn mạnh caching, banner realtime và khả năng reset dữ liệu.

## 0. Chuẩn Bị
- Chạy `node scripts/reset-anonymous-grants.js --yes` để làm sạch dữ liệu.
- Seed 2 identity trên mobile: **Alice (Owner)** và **Bob (Recipient)**.
- Upload 1 file demo từ Alice (ví dụ `demo-contract.pdf`).
- Mở sẵn Prisma Studio (tab `AnonymousFileAccess`, `AnonymousAuditLog`).

## 1. Giới Thiệu
1. Nêu bật: "File chia sẻ hoàn toàn ẩn danh – chỉ dựa trên public key và chữ ký vòng."  
2. Trên mobile (vai Alice), mở File detail và nhấn **Manage Anonymous Access**.

## 2. Grant Quyền
1. Trong Access Manager modal, paste public key của Bob → nhấn **Grant**.
2. Quan sát ngay:
   - Modal báo thành công, Bob xuất hiện ở danh sách "Đang có quyền" với trạng thái `active`.
   - Prisma Studio refresh: xuất hiện record `AnonymousFileAccess` mới.
3. Chuyển sang thiết bị (hoặc emulator) Bob → kéo refresh danh sách:
   - File `demo-contract.pdf` xuất hiện, banner "Bạn vừa được cấp quyền" hiển thị.
   - DevTools/console log cho thấy `etag`, `lastModified` lưu vào cache.

## 3. Revoke Quyền
1. Quay lại Alice → Access Manager → nhấn **Revoke** trên Bob.
2. Giải thích: "Backend đổi `status='revoked'` và audit event `grant_revoked`."
3. Bob refresh danh sách:
   - File biến mất, banner đỏ "Quyền truy cập đã bị thu hồi" + badge "Đã xoá 1 key package".
   - Prisma Studio: `AnonymousFileAccess.status='revoked'`, `AnonymousAuditLog` có entry `delete_cache`.

## 4. Caching & Offline
1. Tạm ngắt backend (hoặc bật chế độ máy bay) trên Bob.
2. Kéo refresh danh sách → vẫn thấy file khác (nếu có) từ snapshot, không crash.
3. Khôi phục backend, grant lại Bob → banner xanh "Bạn vừa được cấp quyền" quay trở lại.

## 5. Tooling QA
1. Chạy live `node scripts/reset-anonymous-grants.js --dry-run` → hiển thị số record sẽ xoá.
2. Chạy lại không `--dry-run` → dữ liệu grant/audit sạch.
3. Bob refresh → danh sách trống, khẳng định script hữu ích khi chuẩn bị demo.

## 6. Kết Thúc
- Nhấn mạnh: "Không còn userId, mọi thao tác dựa trên SHA-256(publicKey)."  
- "UI cập nhật tức thời, đồng bộ với backend bằng ETag/Last-Modified và tự động dọn key package."  
- Nhắc link tài liệu: `DOWNLOAD_FLOW_FINAL.md`, `QA_ANONYMOUS_ACCESS_CHECKLIST.md`.
