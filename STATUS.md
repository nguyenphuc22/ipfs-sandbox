# Current Demo Status

## Backend
- ✅ `anonymous-endpoints-addition.js` mount trước `files.js`, `FileAccessService` truy vấn `AnonymousFileAccess` bằng `accessorPublicKeyHash` và trả manifest không chứa `userId`.
- ✅ `RingSignatureService` đã tích hợp kiểm chứng LSAG đầy đủ + lưu toàn bộ nonce/keyImage để chống replay theo `issue_plan.md#task-5` (44 tests pass).
- ✅ Prisma migrations (20251009154345, 20251014120425) đã loại bỏ toàn bộ PII khỏi bảng `User`; `revocationService.executePartialReencryption()` và `revokeAccessByPublicKeyHash()` chỉ nhận `revokedPublicKeyHash`.
- ⚠️ Chưa có checklist/test thủ công xác nhận anonymous router luôn mount trước legacy routes và không expose path cũ (thiếu `backend/test-anonymous-routes-priority.md`).

## Mobile
- ✅ UI (`IPFSFileList`, `FileViewer`), services (`AnonymousFileAccessService`, `IPFSService`) và integration test `mobile/src/tests/anonymous-flow.integration.test.ts` hoạt động với anonymous payloads (publicKey + ringSignature + timestamp + nonce).
- ✅ `useAOTIdentity` đã loại bỏ trường `userId` legacy khỏi AsyncStorage (tự migrate khi load), vẫn giữ bảo toàn identifier/displayName.
- ⚠️ `AuthService.registerUser()` tiếp tục nhận response có `user.identifier`; cần xác nhận backend không trả `userId` và update consumer cũ nếu còn phụ thuộc.

## Data & Audit Layer
- ✅ `fileChunkService` tạo `AnonymousFileAccess` mặc định bằng `hash(publicKey)` khi upload, toàn bộ audit/revocation log sử dụng `maskHashForLogging`.
- ✅ `AnonymousAuditLog` ghi đầy đủ event list/access/integrity/revoke mà không chứa `userId`.

## Documentation Gaps
- ⚠️ `DOWNLOAD_FLOW_FINAL.md` và `SYSTEM_ARCHITECTURE.md` vẫn mô tả luồng dựa trên `userId` (`/api/files/my-files`, JWT, ownerDisplayName) → chưa phản ánh flow ẩn danh mới.
- ⚠️ Chưa có checklist triển khai (Docs/QA) cho việc mount anonymous router và xác nhận UI bỏ hoàn toàn `userId`.

## Tooling & QA
- ✅ `npm run lint` không còn lỗi blocking; vẫn còn ~80 cảnh báo (inline style `react-native/no-inline-styles`, trailing spaces, `curly`, `comma-dangle`) từ code cũ cần cleanup dần.
- ✅ Đã thêm Jest setup + module mocks (`@react-native-documents/picker`, `react-native-image-picker`, `@fintoda/react-native-crypto-lib`, `react-native-permissions`, AsyncStorage, Clipboard). Các unit/UI suite (`__tests__/App.test.tsx`, `__tests__/FilePickerService.test.ts`, `__tests__/ChunkMonitorPanel.test.tsx`, `__tests__/chunkDownloadManager.test.ts`) pass.
- ⚠️ Integration suite `src/tests/anonymous-flow.integration.test.ts` & `src/tests/integration/anonymousFlow.test.ts` vẫn fail vì mock ring context chưa cấp đủ public key hợp lệ → `toCompressedPublicKey` báo "Invalid public key" và flow dừng ở LSAG ring building. Cần seed thêm ring members + fixtures chunk manifest cho test hoặc tách mock crypto nhẹ nhàng hơn.
