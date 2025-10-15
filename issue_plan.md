# Kế hoạch xử lý Anonymous Download Fix

## Task 6 – Mobile Anonymous Flow Alignment
- [x] Xoá dependency `GatewayApiService.getUserFiles/logAuditEvent` và chuyển toàn bộ UI (File list, integrity alert, viewer) dùng `AnonymousFileAccessService` ✅ **HOÀN THÀNH**
  - Xác nhận không còn direct calls đến GatewayApiService.getUserFiles/logAuditEvent trong components
  - IPFSFileList component (mobile/src/components/ipfs/IPFSFileList.tsx:100-129) đã sử dụng AnonymousFileAccessService
  - FileViewer component (mobile/src/components/ipfs/FileViewer.tsx:122-124) đã sử dụng anonymousFileAccessService.logAnonymousAuditEvent
  - IPFSService.getUserFiles (mobile/src/services/IPFSService.ts:153-208) đã gọi anonymousService.listAccessibleFilesWithParams
  - GatewayApiService methods (getUserFiles, reportIntegrityAlert, logAuditEvent) chỉ được gọi thông qua service layer abstraction
- [ ] Cập nhật `IPFSFileList`, hooks (`useIPFS`, `useEnhancedStorage`) để không truyền `userId`, chỉ hoạt động với publicKey hash ❌ **CHƯA HOÀN THÀNH**
  - `useAOTIdentity` vẫn tạo/persist `userId` trong identity (`resolveIdentityFromContext`, `registerIdentity`, `ensureIdentity` ở `mobile/src/hooks/useAOTIdentity.ts`), nên client chưa thực sự bỏ dependency vào userId.
    - [ ] Refactor `AOTIdentity` shape + storage để chỉ lưu `publicKey`, `identifier`, `displayName`, `registeredAt`; migrate AsyncStorage entry.
    - [ ] Cập nhật `ensureIdentity`/`resolveIdentityFromContext` bỏ logic `identity.userId`, map sang `publicKeyHash`/`identifier`.
  - `AuthService` responses và `registerUser` flow vẫn gán `userId`, và các consumer kiểm tra `identity.userId`, khiến một phần UI vẫn dựa vào giá trị này.
    - [ ] Sửa `AuthService.registerUser` và backend response để trả `publicKeyHash` + alias thay vì `userId`; cập nhật tất cả consumer.
    - [ ] Rà soát hooks (`useIPFS`, `useEnhancedStorage`, `useDownloadFlow`) và components để loại bỏ mọi check `identity.userId`.
  - Cần refactor hook, service và liên quan để loại bỏ hoàn toàn `userId`, đồng thời cập nhật tests xác nhận payloads không chứa `userId`.
    - [ ] Bổ sung/ cập nhật unit & integration tests đảm bảo payloads/tính năng không phụ thuộc `userId`.
- [x] Bổ sung integration smoke test: init identity → fetch anonymous list → negotiate access → download chunk → gửi integrity alert ✅ **HOÀN THÀNH**
  - Test file: mobile/src/tests/anonymous-flow.integration.test.ts
  - Test coverage:
    - Phase 1: Identity initialization (hasIdentity, getCurrentPublicKey)
    - Phase 2: Fetch anonymous file list (listAccessibleFiles, listAccessibleFilesWithParams)
    - Phase 3: Negotiate access (negotiateAccess with chunk manifest)
    - Phase 4: Chunk download simulation (manifest structure verification)
    - Phase 5: Send integrity alert (reportIntegrityAlert with anonymous payload)
    - Phase 6: Audit logging (logAnonymousAuditEvent for multiple event types)
    - Complete flow test: End-to-end workflow verification
  - All tests verify no userId in payloads, only publicKey + ringSignature + timestamp + nonce

## Task 8 – Documentation & Flow Alignment
- [ ] Cập nhật `DOWNLOAD_FLOW_FINAL.md` loại bỏ các bước dựa vào `userId`, mô tả anonymous endpoints (`/api/files/anonymous-list`, `/api/files/:id/anonymous-access`) và ring signature nonce flow.
- [ ] Sửa sơ đồ + mô tả trong `SYSTEM_ARCHITECTURE.md` phản ánh bảng `AnonymousFileAccess`/`AnonymousAuditLog` và UI dựa trên `publicKeyHash`.
- [ ] Tạo `backend/test-anonymous-routes-priority.md` checklist/manual log xác nhận router anonymous mount trước legacy và không leak `userId`.