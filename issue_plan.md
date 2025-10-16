# Kế hoạch xử lý Anonymous Download Fix

## Task 6 – Mobile Anonymous Flow Alignment ✅ **HOÀN THÀNH**
- [x] Xoá dependency `GatewayApiService.getUserFiles/logAuditEvent` và chuyển toàn bộ UI (File list, integrity alert, viewer) dùng `AnonymousFileAccessService` ✅ **HOÀN THÀNH**
  - Xác nhận không còn direct calls đến GatewayApiService.getUserFiles/logAuditEvent trong components
  - IPFSFileList component (mobile/src/components/ipfs/IPFSFileList.tsx:100-129) đã sử dụng AnonymousFileAccessService
  - FileViewer component (mobile/src/components/ipfs/FileViewer.tsx:122-124) đã sử dụng anonymousFileAccessService.logAnonymousAuditEvent
  - IPFSService.getUserFiles (mobile/src/services/IPFSService.ts:153-208) đã gọi anonymousService.listAccessibleFilesWithParams
  - GatewayApiService methods (getUserFiles, reportIntegrityAlert, logAuditEvent) chỉ được gọi thông qua service layer abstraction
- [x] Cập nhật `IPFSFileList`, hooks (`useIPFS`, `useEnhancedStorage`) để không truyền `userId`, chỉ hoạt động với publicKey hash ✅ **HOÀN THÀNH**
  - Backend: Loại bỏ `userId` khỏi `aotStorage.js` (registerUser, SAMPLE_USERS, normalizeData) - backend/src/utils/aotStorage.js
  - Frontend: Loại bỏ tất cả logic `userId` trong `useAOTIdentity` hook:
    - [x] Xóa `userId: matched.userId` và `userId: response.user.userId` từ resolveIdentityFromContext và registerIdentity
    - [x] Xóa check `if (!current.userId)` từ ensureIdentity
    - [x] Thêm migration logic trong deserializeIdentity để loại bỏ userId từ stored identity
  - Frontend: Rà soát và xác nhận các hooks/components không dùng userId:
    - [x] useIPFS hook (mobile/src/hooks/useIPFS.ts) - chỉ có comment
    - [x] FileListScreen.tsx - chỉ có comment
    - [x] AnonymousFileAccessService.ts - chỉ có comment
  - Tests: ✅ Backend tests xác nhận không có userId leakage:
    - "✅ No userId leak detected"
    - "✅ Uses publicKeyHash (not userId)"
    - "✅ E2E Test Complete: All 7 records verified - NO userId leaks detected!"
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

## Task 8 – Documentation & Flow Alignment ✅ **HOÀN THÀNH**
- [x] Cập nhật `DOWNLOAD_FLOW_FINAL.md` loại bỏ các bước dựa vào `userId`, mô tả anonymous endpoints (`/api/files/anonymous-list`, `/api/files/:id/anonymous-access`) và ring signature nonce flow ✅ **HOÀN THÀNH**
  - Viết lại hoàn toàn file với anonymous flow (Phiên bản 2.0 Anonymous)
  - Loại bỏ tất cả đề cập đến userId, req.user.userId, userFileAccess
  - Mô tả chi tiết 4 anonymous endpoints:
    - `POST /api/files/anonymous-list` - List accessible files by publicKey
    - `POST /api/files/:id/anonymous-access` - Get chunk manifest (NO master key)
    - `POST /api/files/:id/anonymous-integrity-alert` - Report chunk hash mismatch
    - `POST /api/audit/anonymous-log` - Log audit events anonymously
  - Thêm section "Ring Signature Nonce Flow" với:
    - Nonce protocol specification (fresh 32-byte random nonce mỗi request)
    - Message format examples (action:params:timestamp:nonce)
    - Nonce generation (client) và verification (backend)
    - Anti-replay attack mechanism
  - Cập nhật database schema: AnonymousFileAccess, AnonymousAuditLog, IntegrityAlert
  - Tất cả authentication dùng publicKey + ringSignature + nonce, KHÔNG có userId
  - Backend dùng publicKeyHash = SHA256(publicKey) để track anonymous users

- [x] Sửa sơ đồ + mô tả trong `SYSTEM_ARCHITECTURE.md` phản ánh bảng `AnonymousFileAccess`/`AnonymousAuditLog` và UI dựa trên `publicKeyHash` ✅ **HOÀN THÀNH**
  - [x] Mermaid flow trong mục Chunk-based Storage đã đổi "Store in user_file_access" thành `AnonymousFileAccess`.
  - [x] Bảng UX "Access Negotiation Sheet" (dòng 482) đã cập nhật thông điệp cho anonymous hash (accessorPublicKeyHash).
  - Cập nhật "File Download Flow - Anonymous (Slide Version)" với mermaid diagram mới:
    - Note: "HOÀN TOÀN ẨN DANH - KHÔNG có userId"
    - Flow: Generate nonce → Create ring signature → POST /anonymous-list
    - Backend: Calculate publicKeyHash = SHA256(publicKey)
    - Query: AnonymousFileAccess WHERE accessorPublicKeyHash
    - Log: AnonymousAuditLog với publicKeyHash only
  - Cập nhật "Database Schema Relationships (Anonymous Architecture)":
    - Thêm entities: AnonymousFileAccess, AnonymousAuditLog, IntegrityAlert
    - Fields: accessorPublicKeyHash, publicKeyHash, reportedByPublicKeyHash
    - KHÔNG có userId trong anonymous tables
    - Relationships: File → AnonymousFileAccess, File → AnonymousAuditLog
  - Thêm note: "HOÀN TOÀN ẨN DANH: Backend KHÔNG lưu userId cho anonymous access"

- [x] Tạo `backend/test-anonymous-routes-priority.md` checklist/manual log xác nhận router anonymous mount trước legacy và không leak `userId` ✅ **HOÀN THÀNH**
  - **Checklist 1: Route Mounting Priority**
    - Verify anonymous routes được app.use() TRƯỚC legacy routes
    - Test tất cả anonymous endpoints accessible (POST /anonymous-list, /anonymous-access, etc.)
    - Expected: 400/401 (not 404) khi missing fields
  - **Checklist 2: No userId Leak - Code Inspection**
    - Grep test cho anonymous-endpoints-addition.js (should return EMPTY)
    - Grep test cho FileAccessService.js (should be empty or only in comments)
    - Verify database queries dùng publicKeyHash, KHÔNG dùng userId
  - **Checklist 3: No userId Leak - Database Inspection**
    - AnonymousFileAccess table: Column accessorPublicKeyHash EXISTS, userId DOES NOT exist
    - AnonymousAuditLog table: Column publicKeyHash EXISTS, userId DOES NOT exist
    - IntegrityAlert table: Column reportedByPublicKeyHash EXISTS, reportedByUserId DOES NOT exist
    - SQL PRAGMA table_info() checks
  - **Checklist 4: No userId Leak - Runtime Testing**
    - Test anonymous-list endpoint với curl
    - Verify backend logs use publicKeyHash, NOT userId
    - Verify response KHÔNG chứa userId field
  - **Checklist 5: End-to-End Test**
    - Complete flow: List → Access → Integrity Alert → Audit Log
    - Database final verification: All tables use publicKeyHash
    - SQL query: COUNT records with publicKeyHash validation
    - Expected: "✅ Uses publicKeyHash (not userId)" for all tables
  - File includes manual test commands (curl), SQL queries, và checklist signature fields

- [x] Cập nhật `New_Thesis.md` để phản ánh implementation không có userId ✅ **HOÀN THÀNH**
  - [x] Đã thêm phần mở đầu mô tả anonymous flow và publicKeyHash.
  - [x] Sơ đồ chunk storage (dòng 211) đã đổi "user_file_access" thành `AnonymousFileAccess`.
  - [x] Các code snippet revocation (dòng 318, 732, 826, 887, 1074) đã chuyển `targetUser` thành `targetPublicKeyHash`.
  - [x] Section revocation payload đã cập nhật thành `targetPublicKeyHash` (dòng 445: "revoke:" + fileId + ":" + targetPublicKeyHash).

**Tóm tắt Task 8:**
- ✅ `DOWNLOAD_FLOW_FINAL.md` và `backend/test-anonymous-routes-priority.md` đã đúng với anonymous flow.
- ✅ `SYSTEM_ARCHITECTURE.md` đã cập nhật tất cả thuật ngữ cũ - UX table (dòng 482) sử dụng `AnonymousFileAccess` và `accessorPublicKeyHash`.
- ✅ `New_Thesis.md` đã cập nhật tất cả references - diagram (dòng 211), code snippets (318, 732, 826, 887, 1074), và revocation payload (dòng 445) đều dùng `targetPublicKeyHash` và `AnonymousFileAccess`.
- ✅ Tất cả documentation đã được đồng bộ với anonymous implementation - không còn userId/targetUser references.

## Task 9 – Anonymous Upload Alignment ✅ **HOÀN THÀNH**
- [x] **Bỏ phụ thuộc `userId` trong upload route**
  - [x] `backend/src/routes/files-legacy-upload.js` (`/chunked-upload`) đã loại bỏ `getUserByPublicKey()` và chỉ dùng `ownershipPublicKey`
  - [x] Tính trực tiếp `uploaderPublicKeyHash = SHA256(ownershipPublicKey)` và truyền xuống service (files-legacy-upload.js ~443-452)
  - [x] Đã xoá `ownerUserId`/`ownerIdentifier` khỏi payload `/aot-upload` (files-legacy-upload.js ~314-335)
- [x] **Cập nhật service `uploadFileWithChunks` dùng publicKey hash**
  - [x] Đổi chữ ký hàm nhận `{ uploaderPublicKeyHash, ownershipPublicKey }` thay vì `userId` (fileChunkService.js header)
  - [x] Đã bỏ truy vấn `prisma.user.findUnique({ id: userId })`
  - [x] Sử dụng `uploaderPublicKeyHash` trực tiếp để tạo `AnonymousFileAccess` & audit log
- [x] **Điều chỉnh schema Prisma & migration**
  - [x] Thêm cột `uploaderPublicKeyHash String?`, cho phép `uploaderId` nullable và optional relation (schema.prisma File model)
  - [x] Thêm index `@@index([uploaderPublicKeyHash])`
  - [x] Migration `20251015150722_add_uploader_public_key_hash` + script `backend/prisma/data-migration-uploader-hash.js` đã được tạo (chưa xác nhận chạy thực tế)
- [x] **Đồng bộ test & seed** ✅
  - [x] `backend/src/services/__tests__/RingSignatureService.test.js` đã mock đầy đủ Prisma (`$executeRaw`, `anonymousAuditLog`, replay caches) cho flow mới
  - [x] `backend/src/services/__tests__/RingSignatureService.integration.test.js` và `AnonymousFlow.e2e.test.js` chạy full anonymous flow, cleanup Prisma `$disconnect`
  - [x] `npm test` (script chạy `node --experimental-vm-modules ./node_modules/jest/bin/jest.js`) PASS 9/9 suites, 75/75 tests ngày 16/10/2025
  - [x] `backend/data/aot-records.json` đã thêm `publicKeyHash` cho seed users và `uploaderPublicKeyHash` cho file demo (không còn record `publicKey: null`)
- [x] **Cập nhật tài liệu**
  - [x] `backend/ANONYMOUS_UPLOAD_IMPLEMENTATION.md` cập nhật status COMPLETE, bỏ ghi chú pending seed cleanup
  - [x] `SYSTEM_ARCHITECTURE.md` mô tả ring context lấy từ `aotStorage` + ownership metadata, `User` chỉ còn vai trò legacy

**Tình trạng Task 9 (16/10):**
- ✅ Route/service/schema đã chuyển sang `uploaderPublicKeyHash`
- ✅ Prisma schema/migration đã thêm trường mới
- ✅ Backend test suite xanh (`npm test` script mới)
- ✅ RingSignatureService không còn phụ thuộc `User`, lấy key từ `getRingContext` + `File.ownershipPublicKey`
- ✅ Seed `aot-records.json` phản ánh mô hình anonymous
- ✅ Documentation (`ANONYMOUS_UPLOAD_IMPLEMENTATION.md`, `SYSTEM_ARCHITECTURE.md`) đã đồng bộ
- 📌 Không còn hạng mục mở

## Task 10 – Khôi phục Anonymous Upload Endpoint ✅ **HOÀN THÀNH**
- [x] **Triaging lỗi 404 từ mobile upload**
  - Đã xác nhận `server.js` chỉ mount `anonymous-endpoints-addition.js` và `files.js`
  - Xoá `backend/src/routes/files-legacy-upload.js`; chuyển toàn bộ handler sang router chính
  - `/api/files/aot-upload` và `/api/files/chunked-upload` hiện nằm trong `backend/src/routes/files.js`
- [x] **Hợp nhất / mount lại router upload**
  - Rewire multer + upload handler trực tiếp trong `files.js`
  - Upload flow tiếp tục dùng `uploaderPublicKeyHash` và verification logic từ Task 9
- [x] **Bổ sung regression test cho endpoint upload**
  - Thêm `backend/src/routes/__tests__/uploadRoutes.test.js` kiểm tra route tồn tại và trả về 400 (không 404) khi thiếu file
  - Test xác minh `/aot-upload` và `/chunked-upload` đều có handler hợp lệ
- [x] **Cập nhật tài liệu & client nếu cần**
  - `backend/test-anonymous-routes-priority.md` bổ sung bước smoke test cho hai route upload
  - `backend/ANONYMOUS_UPLOAD_IMPLEMENTATION.md` cập nhật reference sang `backend/src/routes/files.js`

## Task 11 – Ổn định Anonymous Upload Handler ⚠️ **CÒN 1 VIỆC**
- [x] **Tái hiện lỗi runtime `addFileRecord is not defined`**
  - Logcat 16/10 08:54 cho thấy `/api/files/aot-upload` trả về 500 với `{ success: false, error: 'addFileRecord is not defined' }`
  - Regression test `backend/src/routes/__tests__/uploadRoutes.test.js` tái tạo flow upload với payload hợp lệ và fail nếu handler thiếu dependency
- [x] **Sửa import thiếu trong `files.js`**
  - Destructuring từ `../utils/aotStorage` đã bổ sung `addFileRecord` (runtime không còn lỗi ReferenceError)
  - `npm test -- --runTestsByPath src/routes/__tests__/uploadRoutes.test.js` PASS 3/3 cases (17/10)
- [x] **Bổ sung kiểm thử phòng ngừa**
  - `uploadRoutes.test.js` mock Axios + aotStorage để assert `addFileRecord` được gọi và response `201` chứa `fileId`, `cid`, `ringMembers`
- [ ] **Thông báo mobile QA**
  - Sau khi fix, xác nhận mobile upload thành công end-to-end
  - Cập nhật logbook/test checklist về lỗi 500 đã được khắc phục

## Task 12 – Khôi phục Anonymous Audit Logging ❗️ **MỚI**
- [ ] **Đồng bộ schema Prisma trong môi trường Docker**
  - Mobile log 09:10 báo `[Anonymous Audit] Error logging event: TypeError: Network request failed`
  - Backend container trả về `no such table: AnonymousAuditLog` và thiếu cột `File.ownershipPublicKey` ⇒ database volume chưa chạy migration `20251015150722_add_uploader_public_key_hash`
  - Hành động: chạy `npx prisma migrate deploy` (hoặc `db push`) bên trong service `gateway-1`, đảm bảo volume `prisma/data/app.db` dùng chung với local schema mới
- [ ] **Khởi tạo dữ liệu tối thiểu cho container**
  - Sau khi migration, seed `AnonymousAuditLog`/`File` để RingSignatureService có `ownershipPublicKey`
  - Cập nhật tài liệu khởi động Docker Compose (README / start-system.sh) bổ sung bước migrate + seed
- [ ] **Sửa lỗi ReferenceError trong catch block**
  - `backend/src/routes/anonymous-endpoints-addition.js` catch sử dụng `eventType` ngoài scope gây crash thứ cấp
  - Đưa `let eventType` ra ngoài hoặc ghi log bằng `params?.eventType` để tránh crash khi lỗi Prisma xảy ra
- [ ] **Bổ sung regression test cho audit log endpoint**
  - Viết Jest test mô phỏng `POST /api/files/audit/anonymous-log` với payload hợp lệ, xác minh 200 + ghi bản ghi trong SQLite
  - Thêm case negative: thiếu bảng (mock prisma) → expect fallback log nhưng vẫn trả 500 có message rõ ràng
- [ ] **Smoke test mobile anonymous flow**
  - Sau khi schema + code fix, chạy lại chuỗi: upload → anonymous-list → view → log audit event
  - Ghi nhận kết quả vào `test-anonymous-routes-priority.md` và cập nhật trạng thái Task 12
