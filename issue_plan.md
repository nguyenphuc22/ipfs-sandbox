# Issue Plan: Căn chỉnh luồng thu hồi với luận văn AOT

**Last Updated:** 2025-10-21

## Implementation Note (Oct 2025)
Hiện bản build triển khai re-encryption ngay trên backend để tận dụng CPU và băng thông của gateway. Owner vẫn phải cung cấp `keyPackage` (master key + chunk keys) kèm Schnorr proof; backend xác minh rồi tự tải chunk từ IPFS, giải mã và re-encrypt. Mobile giữ vai trò chuẩn bị khóa và giám sát audit cho tới khi luồng client-side hoàn thiện.

## Bối cảnh
- Luồng thu hồi hiện đã xoay master key và re-encrypt lại các chunk được chọn, nhưng thao tác diễn ra trên backend khác với kiến trúc mô tả trong `New_Thesis.md` (owner tự re-encrypt trên thiết bị).
- Backend chưa kiểm chứng Schnorr ownership proof trước khi gọi re-encryption, khiến bất kỳ actor nào có `keyPackage` cũ đều có thể kích hoạt thu hồi.
- Tồn tại API "quick revoke" bỏ qua re-encryption/master-key rotation; nhánh này không xuất hiện trong luận văn và có nguy cơ làm lệch chính sách ẩn danh.

## Mục tiêu
- Bảo đảm chỉ chủ sở hữu hợp lệ (Schnorr proof + ring signature đúng) mới được phép thu hồi.
- Đưa re-encryption về phía client theo thiết kế trong luận văn, hoặc cập nhật tài liệu nếu buộc phải giữ server-side và mô tả rõ tác động tới ẩn danh.
- Giải quyết đường "quick revoke" để không làm suy yếu quy trình chuẩn.

## Công việc cần làm
1. **Bổ sung kiểm chứng Schnorr proof và ring signature trên backend**
   - ✅ (21/10/2025) `verifySchnorrOwnership` + replay guard đã được tích hợp vào `revocationService.prepareClientReencryption` kèm audit log.
   - ✅ Ring signature được kiểm tra lại trước khi finalize; các lỗi bị ghi lại qua `secureLog`.
   - ✅ Test mới `revocationService.auth.test.js` phủ các nhánh replay, thiếu rotate, quick revoke.

2. **Di chuyển re-encryption sang client theo luận văn**
   - ✅ Backend cung cấp hai endpoint mới `/api/files/revocation/prepare` và `/api/files/revocation/finalize`; server chỉ phát manifest và xác thực kết quả.
   - ✅ Mobile Access Manager tự tải chunk từ IPFS, giải mã bằng key cục bộ, sinh key mới, upload lại CID và gửi `rotatedKeyPackage` cho backend.
   - ✅ Luồng không truyền plaintext chunk lên backend; chỉ metadata + CID mới được gửi về.

3. **Xử lý API "quick revoke"**
   - ✅ Giữ route nhưng trả 410 trừ khi bật `ENABLE_QUICK_REVOKE`/`adminOverride`; test QA cập nhật để xác nhận hành vi này.

4. **Cập nhật tài liệu và checklist**
   - ✅ Tài liệu (`New_Thesis.md`, `STATUS.md`, `QA_ANONYMOUS_ACCESS_CHECKLIST.md`, README) đã mô tả rõ revocation hai pha + yêu cầu chia sẻ key package mới.

   5. **Sửa lỗi Schnorr verification + sự cố build Prisma**
      - 🚧 Khi owner thu hồi trên app Android, backend ném lỗi `Cannot read properties of undefined (reading 'fromHex')`. Nguyên nhân: `verifySchnorrOwnership` đang cố dùng `secp256k1.Point` nhưng module mới chỉ expose `ProjectivePoint`, dẫn đến `Point` undefined.
      - �️ Task backend: cập nhật `ownershipProof.js` dùng `ProjectivePoint` (hoặc import chính xác `Point`) và bổ sung test cho proof hợp lệ/thiếu trường để đảm bảo trả `400 Invalid Schnorr proof` thay vì throw.
      - 📱 Task mobile: vẫn kiểm tra payload trước khi gửi; thêm guard hiển thị thông báo nếu tạo proof thất bại.
      - 🧪 Hoàn tất khi thu hồi chạy thành công, backend log `Client manifest ... finalized` và test mới pass.
      - 🐳 Đồng thời, sửa lỗi build Docker `npx prisma generate` (không tải được binary trên linux-musl-arm64). Cần cấu hình proxy hoặc thêm `binaryTargets` phù hợp rồi rebuild (`docker compose build gateway`). Khi script `start-system.sh` chạy lại phải qua bước Prisma generate.
