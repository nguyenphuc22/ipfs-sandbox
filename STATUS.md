# Current Demo Status

## Backend
- ✅ `anonymous-endpoints-addition.js` mount trước `files.js`, `FileAccessService` truy vấn `AnonymousFileAccess` bằng `accessorPublicKeyHash` và trả manifest không chứa `userId`.
- ✅ `RingSignatureService` đã tích hợp kiểm chứng LSAG đầy đủ + lưu toàn bộ nonce/keyImage để chống replay theo `issue_plan.md#task-5` (44 tests pass).
- ✅ Prisma migrations (20251009154345, 20251014120425) đã loại bỏ toàn bộ PII khỏi bảng `User`; `revocationService.executePartialReencryption()` và `revokeAccessByPublicKeyHash()` chỉ nhận `revokedPublicKeyHash`.
- ⚠️ Chưa có checklist/test thủ công xác nhận anonymous router luôn mount trước legacy routes và không expose path cũ (thiếu `backend/test-anonymous-routes-priority.md`).

## Mobile
- ✅ UI (`IPFSFileList`, `FileViewer`), services (`AnonymousFileAccessService`, `IPFSService`) và integration test `mobile/src/tests/anonymous-flow.integration.test.ts` hoạt động với anonymous payloads (publicKey + ringSignature + timestamp + nonce).
- ⚠️ Hook danh tính (`useAOTIdentity`) vẫn sinh/persist `userId` (xem `mobile/src/hooks/useAOTIdentity.ts`), `AuthService.registerUser()` trả `user.userId`, và nhiều consumer kiểm tra `identity.userId` → UI vẫn phụ thuộc `userId`, trái với thiết kế tại `ANONYMOUS_DOWNLOAD_REDESIGN.md#31`.

## Data & Audit Layer
- ✅ `fileChunkService` tạo `AnonymousFileAccess` mặc định bằng `hash(publicKey)` khi upload, toàn bộ audit/revocation log sử dụng `maskHashForLogging`.
- ✅ `AnonymousAuditLog` ghi đầy đủ event list/access/integrity/revoke mà không chứa `userId`.

## Documentation Gaps
- ⚠️ `DOWNLOAD_FLOW_FINAL.md` và `SYSTEM_ARCHITECTURE.md` vẫn mô tả luồng dựa trên `userId` (`/api/files/my-files`, JWT, ownerDisplayName) → chưa phản ánh flow ẩn danh mới.
- ⚠️ Chưa có checklist triển khai (Docs/QA) cho việc mount anonymous router và xác nhận UI bỏ hoàn toàn `userId`.
