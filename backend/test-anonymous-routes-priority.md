# Test Anonymous Routes Priority & No userId Leak

**Mục đích:** Xác nhận rằng anonymous routes được mount trước legacy routes và KHÔNG có userId leak trong toàn bộ anonymous flow.

**Ngày tạo:** 2025-10-15
**Người kiểm tra:** _________________

---

## ✅ CHECKLIST 1: Route Mounting Priority

### 1.1 Anonymous Routes Mount First

- [ ] **File:** `backend/src/server.js` hoặc `backend/src/app.js`
- [ ] **Verify:** Anonymous routes được `app.use()` TRƯỚC legacy routes
- [ ] **Expected order:**
  ```javascript
  // 1. Anonymous routes FIRST
  app.use('/api/files', anonymousRoutes);

  // 2. Legacy routes AFTER
  app.use('/api/files', legacyRoutes);
  ```

**Test method:**
```bash
# Check route registration order
grep -n "app.use.*files" backend/src/server.js
```

**Result:**
```
___________________________________________
___________________________________________
```

**Status:** ☐ PASS ☐ FAIL

---

### 1.2 Anonymous Endpoints Accessible

Test tất cả anonymous endpoints có thể truy cập:

- [ ] **POST /api/files/anonymous-list**
  ```bash
  curl -X POST http://localhost:3000/api/files/anonymous-list \
    -H "Content-Type: application/json" \
    -d '{
      "publicKey": "test-key",
      "ringSignature": "test-sig",
      "timestamp": 1728925234567,
      "nonce": "test-nonce"
    }'
  ```
  **Expected:** 400/401 (not 404)
  **Result:** __________

- [ ] **POST /api/files/:fileId/anonymous-access**
  ```bash
  curl -X POST http://localhost:3000/api/files/test-file-id/anonymous-access \
    -H "Content-Type: application/json" \
    -d '{
      "publicKey": "test-key",
      "ringSignature": "test-sig",
      "timestamp": 1728925234567,
      "nonce": "test-nonce"
    }'
  ```
  **Expected:** 400/401 (not 404)
  **Result:** __________

- [ ] **POST /api/files/:fileId/anonymous-integrity-alert**
  ```bash
  curl -X POST http://localhost:3000/api/files/test-file-id/anonymous-integrity-alert \
    -H "Content-Type: application/json" \
    -d '{
      "publicKey": "test-key",
      "ringSignature": "test-sig",
      "timestamp": 1728925234567,
      "nonce": "test-nonce",
      "chunkIndex": 0,
      "expectedHash": "abc123"
    }'
  ```
  **Expected:** 400/401 (not 404)
  **Result:** __________

- [ ] **POST /api/audit/anonymous-log**
  ```bash
  curl -X POST http://localhost:3000/api/audit/anonymous-log \
    -H "Content-Type: application/json" \
    -d '{
      "eventType": "TEST",
      "fileId": "test-file",
      "publicKey": "test-key",
      "ringSignature": "test-sig",
      "timestamp": 1728925234567,
      "nonce": "test-nonce"
    }'
  ```
  **Expected:** 400/401 (not 404)
  **Result:** __________

- [ ] **POST /api/files/aot-upload**
  ```bash
  curl -X POST http://localhost:3000/api/files/aot-upload \
    -F "metadataHash=deadbeef" \
    -F "ownershipPublicKey=0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
  ```
  **Expected:** 400 (not 404) when file missing
  **Result:** __________

- [ ] **POST /api/files/chunked-upload**
  ```bash
  curl -X POST http://localhost:3000/api/files/chunked-upload \
    -F "metadataHash=feedface" \
    -F "ownershipPublicKey=0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
  ```
  **Expected:** 400 (not 404) when file missing
  **Result:** __________

**Status:** ☐ ALL PASS ☐ SOME FAIL

---

## ✅ CHECKLIST 2: No userId Leak - Code Inspection

### 2.1 Anonymous Routes File

**File:** `backend/src/routes/anonymous-endpoints-addition.js`

- [ ] **Verify:** KHÔNG có `req.user.userId` trong bất kỳ handler nào
- [ ] **Verify:** KHÔNG có `userId` trong request body parsing
- [ ] **Verify:** KHÔNG có `userId` trong database queries
- [ ] **Verify:** Chỉ dùng `publicKey` → `publicKeyHash` để identify users

**Manual grep test:**
```bash
# Should return EMPTY
grep -n "userId" backend/src/routes/anonymous-endpoints-addition.js
```

**Result:**
```
___________________________________________
(Should be empty)
```

**Status:** ☐ PASS ☐ FAIL

---

### 2.2 FileAccessService

**File:** `backend/src/services/FileAccessService.js`

- [ ] **Verify:** `listAccessibleFiles()` KHÔNG dùng userId
- [ ] **Verify:** `negotiateAccess()` KHÔNG dùng userId
- [ ] **Verify:** `reportIntegrityAlert()` KHÔNG dùng userId
- [ ] **Verify:** `logAnonymousAuditEvent()` KHÔNG dùng userId
- [ ] **Verify:** Tất cả methods dùng `publicKeyHash` để query database

**Manual grep test:**
```bash
grep -n "userId" backend/src/services/FileAccessService.js
```

**Result:**
```
___________________________________________
(Should be empty or only in comments)
```

**Status:** ☐ PASS ☐ FAIL

---

### 2.3 Database Queries

**Verify:** Tất cả anonymous queries dùng `publicKeyHash`, KHÔNG dùng `userId`

- [ ] **AnonymousFileAccess queries:**
  ```javascript
  // CORRECT:
  WHERE: {
    accessorPublicKeyHash: publicKeyHash
  }

  // WRONG:
  WHERE: {
    userId: userId  // ❌ KHÔNG được có
  }
  ```

- [ ] **AnonymousAuditLog queries:**
  ```javascript
  // CORRECT:
  data: {
    publicKeyHash: publicKeyHash
  }

  // WRONG:
  data: {
    userId: userId  // ❌ KHÔNG được có
  }
  ```

- [ ] **IntegrityAlert queries:**
  ```javascript
  // CORRECT:
  data: {
    reportedByPublicKeyHash: publicKeyHash
  }

  // WRONG:
  data: {
    reportedByUserId: userId  // ❌ KHÔNG được có
  }
  ```

**Manual code review:**
```bash
# Check all database queries in anonymous routes
grep -A 5 "prisma.anonymousFileAccess" backend/src/services/FileAccessService.js
grep -A 5 "prisma.anonymousAuditLog" backend/src/services/FileAccessService.js
```

**Result:**
```
___________________________________________
___________________________________________
```

**Status:** ☐ PASS ☐ FAIL

---

## ✅ CHECKLIST 3: No userId Leak - Database Inspection

### 3.1 AnonymousFileAccess Table

**Verify schema:**
```bash
npx prisma studio
# Or
sqlite3 backend/prisma/data/app.db
```

- [ ] **Column `accessorPublicKeyHash` exists:** VARCHAR(64)
- [ ] **Column `userId` DOES NOT exist:** (should be missing)
- [ ] **Verify data:** Tất cả records có `accessorPublicKeyHash`, KHÔNG có `userId`

**SQL check:**
```sql
PRAGMA table_info(AnonymousFileAccess);
```

**Expected columns:**
- id
- accessorPublicKeyHash ✅
- fileId
- grantedAt
- expiresAt
- lastAccessProof
- lastAccessAt
- accessCount
- keyStatus
- status

**NOT expected:**
- userId ❌ (should NOT exist)

**Status:** ☐ PASS ☐ FAIL

---

### 3.2 AnonymousAuditLog Table

**Verify schema:**

- [ ] **Column `publicKeyHash` exists:** VARCHAR(64)
- [ ] **Column `userId` DOES NOT exist:** (should be missing)

**SQL check:**
```sql
PRAGMA table_info(AnonymousAuditLog);
```

**Expected columns:**
- id
- eventType
- fileId
- publicKeyHash ✅
- deviceFingerprint
- ringSignature
- ringPublicKeys
- metadata
- timestamp

**NOT expected:**
- userId ❌ (should NOT exist)

**Status:** ☐ PASS ☐ FAIL

---

### 3.3 IntegrityAlert Table

**Verify schema:**

- [ ] **Column `reportedByPublicKeyHash` exists:** VARCHAR(64)
- [ ] **Column `reportedByUserId` DOES NOT exist:** (should be missing)

**SQL check:**
```sql
PRAGMA table_info(IntegrityAlert);
```

**Expected columns:**
- id
- fileId
- chunkIndex
- expectedHash
- actualHash
- reportedByPublicKeyHash ✅
- reportedAt
- resolved
- resolvedAt
- resolution

**NOT expected:**
- reportedByUserId ❌ (should NOT exist)
- userId ❌ (should NOT exist)

**Status:** ☐ PASS ☐ FAIL

---

## ✅ CHECKLIST 4: No userId Leak - Runtime Testing

### 4.1 Anonymous List Files Test

**Setup:**
```bash
# Start backend
cd backend && npm start

# In another terminal, run test
```

**Test script:**
```bash
#!/bin/bash
# test-anonymous-list.sh

curl -X POST http://localhost:3000/api/files/anonymous-list \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "04a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    "ringSignature": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    "timestamp": '$(date +%s)000',
    "nonce": "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6"
  }' | jq .
```

**Verify backend logs:**
- [ ] **Console log:** Nên thấy `publicKeyHash:` (masked)
- [ ] **Console log:** KHÔNG nên thấy `userId:`
- [ ] **Response:** KHÔNG chứa field `userId`

**Backend log sample:**
```
[AnonymousList] Successfully listed 3 files for publicKeyHash: abc123****** [45ms]
✅ No userId leak detected
```

**Result:**
```
___________________________________________
___________________________________________
```

**Status:** ☐ PASS ☐ FAIL

---

### 4.2 Anonymous Access Test

**Test script:**
```bash
curl -X POST http://localhost:3000/api/files/test-file-id/anonymous-access \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "04a1b2c3...",
    "ringSignature": "0x1a2b3c...",
    "timestamp": '$(date +%s)000',
    "nonce": "fresh-nonce-here"
  }' | jq .
```

**Verify:**
- [ ] **Response chứa:** `chunkManifest`, `ownershipPolicy`, `grantContext`
- [ ] **Response KHÔNG chứa:** `userId`, `user`, `accessorId`
- [ ] **Backend log:** Uses `publicKeyHash`, NOT `userId`

**Result:**
```
___________________________________________
```

**Status:** ☐ PASS ☐ FAIL

---

### 4.3 Database Query Verification

**After running tests, check database:**

```sql
-- Check AnonymousAuditLog entries
SELECT id, eventType, publicKeyHash,
       CASE
         WHEN publicKeyHash LIKE '%' THEN 'Uses publicKeyHash ✅'
         ELSE 'MISSING publicKeyHash ❌'
       END as status
FROM AnonymousAuditLog
ORDER BY timestamp DESC
LIMIT 5;
```

**Expected result:**
- [ ] **All records have `publicKeyHash`:** ✅
- [ ] **No records have `userId` column:** ✅ (column shouldn't exist)

**SQL result:**
```
___________________________________________
___________________________________________
```

**Status:** ☐ PASS ☐ FAIL

---

## ✅ CHECKLIST 5: End-to-End Test

### 5.1 Complete Anonymous Flow Test

**Test scenario:** Full anonymous download simulation

1. **List files anonymously**
   ```bash
   curl -X POST http://localhost:3000/api/files/anonymous-list \
     -H "Content-Type: application/json" \
     -d '{"publicKey":"04abc...","ringSignature":"0x123...","timestamp":'$(date +%s)000',"nonce":"nonce1"}'
   ```
   - [ ] **Result:** List returned, NO userId in response
   - [ ] **Backend log:** Uses publicKeyHash ✅

2. **Negotiate access**
   ```bash
   curl -X POST http://localhost:3000/api/files/FILE_ID/anonymous-access \
     -H "Content-Type: application/json" \
     -d '{"publicKey":"04abc...","ringSignature":"0x123...","timestamp":'$(date +%s)000',"nonce":"nonce2"}'
   ```
   - [ ] **Result:** Manifest returned, NO userId in response
   - [ ] **Backend log:** Uses publicKeyHash ✅

3. **Report integrity alert**
   ```bash
   curl -X POST http://localhost:3000/api/files/FILE_ID/anonymous-integrity-alert \
     -H "Content-Type: application/json" \
     -d '{
       "publicKey":"04abc...","ringSignature":"0x123...","timestamp":'$(date +%s)000',"nonce":"nonce3",
       "chunkIndex":0,"expectedHash":"abc123","actualHash":"def456","retryCount":3
     }'
   ```
   - [ ] **Result:** Alert recorded, NO userId in response
   - [ ] **Backend log:** Uses publicKeyHash ✅

4. **Log audit event**
   ```bash
   curl -X POST http://localhost:3000/api/audit/anonymous-log \
     -H "Content-Type: application/json" \
     -d '{
       "eventType":"DOWNLOAD_COMPLETE","fileId":"FILE_ID",
       "publicKey":"04abc...","ringSignature":"0x123...","timestamp":'$(date +%s)000',"nonce":"nonce4",
       "metadata":"{\"chunkCount\":5}"
     }'
   ```
   - [ ] **Result:** Event logged, NO userId in response
   - [ ] **Backend log:** Uses publicKeyHash ✅

**E2E Test Status:** ☐ ALL PASS ☐ SOME FAIL

---

### 5.2 Database Final Verification

**After E2E test, verify database has NO userId leaks:**

```sql
-- Check ALL anonymous tables for userId column
SELECT
  'AnonymousFileAccess' as table_name,
  COUNT(*) as total_records,
  CASE
    WHEN COUNT(accessorPublicKeyHash) = COUNT(*) THEN '✅ Uses publicKeyHash (not userId)'
    ELSE '❌ Missing publicKeyHash'
  END as validation
FROM AnonymousFileAccess

UNION ALL

SELECT
  'AnonymousAuditLog' as table_name,
  COUNT(*) as total_records,
  CASE
    WHEN COUNT(publicKeyHash) = COUNT(*) THEN '✅ Uses publicKeyHash (not userId)'
    ELSE '❌ Missing publicKeyHash'
  END as validation
FROM AnonymousAuditLog

UNION ALL

SELECT
  'IntegrityAlert' as table_name,
  COUNT(*) as total_records,
  CASE
    WHEN COUNT(reportedByPublicKeyHash) = COUNT(*) THEN '✅ Uses publicKeyHash (not userId)'
    ELSE '❌ Missing publicKeyHash'
  END as validation
FROM IntegrityAlert;
```

**Expected output:**
```
AnonymousFileAccess    | 7 | ✅ Uses publicKeyHash (not userId)
AnonymousAuditLog      | 12 | ✅ Uses publicKeyHash (not userId)
IntegrityAlert         | 2 | ✅ Uses publicKeyHash (not userId)
```

**Result:**
```
___________________________________________
___________________________________________
___________________________________________
```

**Status:** ☐ PASS ☐ FAIL

---

## 📊 SUMMARY CHECKLIST

### Overall Results

- [ ] **Route Priority:** Anonymous routes mount before legacy ✅
- [ ] **Code Inspection:** No userId in anonymous route handlers ✅
- [ ] **Database Schema:** All anonymous tables use publicKeyHash ✅
- [ ] **Runtime Testing:** All responses use publicKeyHash, not userId ✅
- [ ] **E2E Flow:** Complete anonymous flow works without userId ✅

### Final Verdict

**Total Tests:** ______ / ______
**Pass Rate:** ______%

**Status:** ☐ ✅ ALL TESTS PASSED ☐ ❌ SOME TESTS FAILED

### Notes / Issues Found

```
___________________________________________
___________________________________________
___________________________________________
___________________________________________
```

### Recommendation

- [ ] **READY FOR PRODUCTION** - No userId leaks detected
- [ ] **NEEDS FIX** - userId leaks found (see notes above)

---

**Kiểm tra bởi:** _________________
**Ngày:** _________________
**Chữ ký:** _________________
