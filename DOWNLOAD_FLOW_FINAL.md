# Luồng Download và View File - Anonymous Flow

**Phiên bản:** 2.0 Anonymous
**Ngày cập nhật:** 2025-10-15
**Ngôn ngữ:** Tiếng Việt

---

## **MỤC LỤC**

1. [Tổng quan](#tổng-quan)
2. [Kiến trúc Anonymous Flow](#kiến-trúc-anonymous-flow)
3. [Anonymous Endpoints](#anonymous-endpoints)
4. [Ring Signature Nonce Flow](#ring-signature-nonce-flow)
5. [Giai đoạn 0: Hiển thị danh sách file](#giai-đoạn-0-hiển-thị-danh-sách-file)
6. [Giai đoạn 1: Thương lượng quyền truy cập](#giai-đoạn-1-thương-lượng-quyền-truy-cập)
7. [Giai đoạn 2: Lấy khóa giải mã](#giai-đoạn-2-lấy-khóa-giải-mã)
8. [Giai đoạn 3: Tải và xác thực chunks](#giai-đoạn-3-tải-và-xác-thực-chunks)
9. [Giai đoạn 4: Ghép file và hiển thị](#giai-đoạn-4-ghép-file-và-hiển-thị)
10. [UI/UX Design](#uiux-design)

---

## **TỔNG QUAN**

### **Mục tiêu**

Luồng download **HOÀN TOÀN ẨN DANH** được thiết kế để đảm bảo:

- ✅ **Ẩn danh tuyệt đối:** KHÔNG có userId, chỉ dùng publicKey + ringSignature
- ✅ **Bảo mật:** Backend KHÔNG giữ master key, user tự quản lý
- ✅ **Tính toàn vẹn:** Verify SHA256 hash cho mọi chunk
- ✅ **Giám sát:** Audit trail ghi log theo publicKeyHash (không lộ danh tính)
- ✅ **Demo-friendly:** 4 giai đoạn rõ ràng với UI trực quan

### **Nguyên tắc thiết kế**

1. **Zero-knowledge architecture:** Backend KHÔNG BAO GIỜ biết user identity
2. **Public key-based:** Mọi thao tác authenticate bằng publicKey + ring signature
3. **Nonce protocol:** Mỗi request có fresh nonce để chống replay attack
4. **Hash-based tracking:** Backend dùng SHA256(publicKey) thay vì userId
5. **Client-managed keys:** Master key và chunk keys KHÔNG BAO GIỜ gửi lên server

---

## **KIẾN TRÚC ANONYMOUS FLOW**

### **Sơ đồ luồng tổng thể**

```
┌─────────────────────────────────────────────────────────┐
│              ANONYMOUS DOWNLOAD FLOW                     │
└─────────────────────────────────────────────────────────┘

Giai đoạn 0: Danh sách file (Anonymous List)
    ↓
    Mobile → Backend: POST /api/files/anonymous-list
    Body: { publicKey, ringSignature, timestamp, nonce }
    ↓
    Backend tính: publicKeyHash = SHA256(publicKey)
    Backend query: AnonymousFileAccess WHERE accessorPublicKeyHash
    ↓
    Backend trả về: Danh sách file có quyền truy cập
    Backend GHI LOG: AnonymousAuditLog (KHÔNG lưu userId)

Giai đoạn 1: Thương lượng quyền truy cập (Access Negotiation)
    ↓
    Mobile → Backend: POST /api/files/:id/anonymous-access
    Body: { publicKey, ringSignature, timestamp, nonce }
    ↓
    Backend verify:
      1. Ring signature hợp lệ
      2. Timestamp fresh (< 5 phút)
      3. Nonce chưa dùng
      4. publicKeyHash có trong AnonymousFileAccess
    ↓
    Backend trả về:
      - Chunk manifest (CID list, hash list)
      - Ownership policy
      - Grant context (expiresAt, accessCount)
    ↓
    Backend GHI LOG: ACCESS_NEGOTIATION (publicKeyHash only)
    ↓
    ✅ Master key VẪN Ở CLIENT, KHÔNG gửi lên server

Giai đoạn 2: Lấy khóa giải mã (Key Orchestration - Client Side)
    ↓
    Mobile tìm master key trong SecureStorage
    Key = `masterKey_${fileId}_${publicKeyHash}`
    ↓
    ┌─ Tìm thấy? ────┐
    │                │
    ✅ CÓ          ❌ KHÔNG
    │                │
    │                ↓
    │         Hiển thị "Waiting for Secure Key Package"
    │         User cần nhận master key từ owner
    │         (qua QR code, NFC, P2P messaging)
    │                │
    └────────┬───────┘
             ↓
    Giải mã chunk keys bằng master key (client-side)
    ↓
    Sẵn sàng tải file

Giai đoạn 3: Tải và xác thực chunks (Chunk Retrieval)
    ↓
    Tải song song chunks từ IPFS Gateway
    (Backend KHÔNG tham gia, truy cập trực tiếp IPFS)
    ↓
    Với mỗi chunk:
      1. Fetch từ IPFS: GET /ipfs/{cid}
      2. Decrypt bằng chunk key (client-side)
      3. Tính SHA256 hash (client-side)
      4. So sánh với hash trong manifest
      5. Nếu sai → Retry (max 3 lần)
      6. Vẫn sai → POST /api/files/:id/anonymous-integrity-alert
    ↓
    Integrity alert body: {
      publicKey, ringSignature, timestamp, nonce,
      chunkIndex, expectedHash, actualHash
    }
    ↓
    Tất cả chunks đã verify ✓

Giai đoạn 4: Ghép file và hiển thị (Reconstruction)
    ↓
    Ghép chunks theo thứ tự (0 → 1 → 2 → ...)
    ↓
    Verify tổng kích thước
    ↓
    Tạo secure cache (AES-256, TTL 24h)
    ↓
    Hiển thị "✅ AOT Integrity Verified"
    ↓
    POST /api/audit/anonymous-log
    Body: {
      eventType: 'DOWNLOAD_COMPLETE',
      fileId, publicKey, ringSignature,
      timestamp, nonce, metadata: {...}
    }
    ↓
    FILE SẴN SÀNG XEM!
```

---

## **ANONYMOUS ENDPOINTS**

### **Danh sách Endpoints Mới**

Tất cả endpoints KHÔNG sử dụng userId, chỉ authenticate bằng publicKey + ringSignature:

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/api/files/anonymous-list` | POST | List accessible files | publicKey + ringSignature + nonce |
| `/api/files/:id/anonymous-access` | POST | Get chunk manifest | publicKey + ringSignature + nonce |
| `/api/files/:id/anonymous-integrity-alert` | POST | Report chunk issue | publicKey + ringSignature + nonce |
| `/api/audit/anonymous-log` | POST | Log audit event | publicKey + ringSignature + nonce |

### **Request Body Format (Chuẩn cho tất cả endpoints)**

```json
{
  "publicKey": "04a1b2c3...",     // User's public key (hex)
  "ringSignature": "0x1a2b3c...", // Ring signature (hex)
  "timestamp": 1728925234567,     // Unix timestamp (ms)
  "nonce": "e5f6a7b8c9d0..."     // Fresh 32-byte random nonce (hex)
}
```

### **Backend Verification Flow**

```javascript
// Verification steps cho MỌI anonymous request:

// 1. Verify ring signature
const isValid = await ringSignatureService.verify({
    message: `${action}:${params}:${timestamp}:${nonce}`,
    ringSignature,
    publicKey
});

// 2. Check timestamp freshness (< 5 minutes)
if (Math.abs(Date.now() - timestamp) > 5 * 60 * 1000) {
    return res.status(401).json({ error: 'Timestamp expired' });
}

// 3. Check nonce reuse (anti-replay)
if (await checkNonceReuse(publicKey, nonce)) {
    return res.status(401).json({ error: 'Nonce already used' });
}

// 4. Calculate publicKeyHash (for database lookup)
const publicKeyHash = crypto
    .createHash('sha256')
    .update(publicKey)
    .digest('hex');

// 5. Query database by publicKeyHash (NO userId!)
const access = await prisma.anonymousFileAccess.findUnique({
    where: { accessorPublicKeyHash: publicKeyHash }
});
```

---

## **RING SIGNATURE NONCE FLOW**

### **Nonce Protocol Specification**

Để chống replay attack, mọi anonymous request PHẢI kèm theo:

1. **Fresh nonce:** Random 32-byte hex string, unique mỗi request
2. **Timestamp:** Unix timestamp (milliseconds), valid trong 5 phút
3. **Ring signature:** Sign message = `${action}:${params}:${timestamp}:${nonce}`

### **Message Format Examples**

```typescript
// Format: action:params:timestamp:nonce

// Example 1: List files
const message1 = `list-files:${timestamp}:${nonce}`;
// Result: "list-files:1728925234567:a1b2c3d4..."

// Example 2: Access file
const message2 = `access-file:${fileId}:${timestamp}:${nonce}`;
// Result: "access-file:uuid-1234:1728925234567:e5f6a7b8..."

// Example 3: Integrity alert
const message3 = `integrity-alert:${fileId}:${chunkIndex}:${timestamp}:${nonce}`;
// Result: "integrity-alert:uuid-1234:5:1728925234567:c9d0e1f2..."

// Example 4: Audit log
const message4 = `audit-log:${eventType}:${fileId}:${timestamp}:${nonce}`;
// Result: "audit-log:DOWNLOAD_COMPLETE:uuid-1234:1728925234567:f3g4h5i6..."
```

### **Nonce Generation (Client)**

```typescript
// mobile/src/utils/nonceGenerator.ts

import * as Crypto from 'expo-crypto';

export function generateNonce(): string {
    // Generate 32 bytes of random data
    const randomBytes = Crypto.getRandomBytes(32);

    // Convert to hex string
    const nonce = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return nonce; // 64 characters hex
}
```

### **Nonce Verification (Backend)**

```javascript
// backend/src/utils/nonceStore.js

const usedNonces = new Map(); // In-memory (use Redis in production)

function checkNonceReuse(publicKey, nonce) {
    const key = `${publicKey}:${nonce}`;

    if (usedNonces.has(key)) {
        console.warn('[Nonce] Replay attack detected:', key);
        return true; // Nonce already used
    }

    // Mark as used (expire after 10 minutes)
    usedNonces.set(key, Date.now());
    setTimeout(() => usedNonces.delete(key), 10 * 60 * 1000);

    return false; // Fresh nonce
}

module.exports = { checkNonceReuse };
```

---

## **GIAI ĐOẠN 0: HIỂN THỊ DANH SÁCH FILE**

### **Endpoint: POST /api/files/anonymous-list**

**Request:**
```json
{
  "publicKey": "04a1b2c3...",
  "ringSignature": "0x1a2b3c...",
  "timestamp": 1728925234567,
  "nonce": "e5f6a7b8..."
}
```

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "fileId": "uuid-1234",
      "fileName": "document.pdf",
      "fileSize": 1024000,
      "chunkCount": 4,
      "mimeType": "application/pdf",
      "ownershipPublicKey": "04x1y2z3...",
      "ownershipStatus": "active",
      "grantedAt": "2025-10-15T10:00:00Z",
      "expiresAt": null,
      "uploadedAt": "2025-10-10T08:00:00Z"
    }
  ],
  "totalCount": 1
}
```

### **Backend Implementation**

```javascript
// backend/src/routes/anonymous-endpoints-addition.js

router.post('/anonymous-list', async (req, res) => {
    const { publicKey, ringSignature, timestamp, nonce } = req.body;

    // Validate input
    if (!publicKey || !ringSignature || !timestamp || !nonce) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields'
        });
    }

    // Verify ring signature
    const message = `list-files:${timestamp}:${nonce}`;
    const isValid = await ringSignatureService.verify({
        message,
        ringSignature,
        publicKey
    });

    if (!isValid) {
        return res.status(401).json({ error: 'Invalid ring signature' });
    }

    // Check timestamp
    if (Math.abs(Date.now() - timestamp) > 5 * 60 * 1000) {
        return res.status(401).json({ error: 'Timestamp expired' });
    }

    // Check nonce reuse
    if (await checkNonceReuse(publicKey, nonce)) {
        return res.status(401).json({ error: 'Nonce already used' });
    }

    // Calculate publicKeyHash (NO userId!)
    const publicKeyHash = crypto
        .createHash('sha256')
        .update(publicKey)
        .digest('hex');

    // Query by publicKeyHash
    const accessGrants = await prisma.anonymousFileAccess.findMany({
        where: {
            accessorPublicKeyHash: publicKeyHash,
            status: 'active',
            OR: [
                { expiresAt: null },
                { expiresAt: { gte: new Date() } }
            ]
        },
        include: {
            file: true
        },
        orderBy: {
            grantedAt: 'desc'
        }
    });

    const files = accessGrants.map(grant => ({
        fileId: grant.file.id,
        fileName: grant.file.fileName,
        fileSize: grant.file.totalSize,
        chunkCount: grant.file.chunkCount,
        mimeType: grant.file.mimeType,
        ownershipPublicKey: grant.file.ownershipPublicKey,
        ownershipStatus: grant.file.status,
        grantedAt: grant.grantedAt,
        expiresAt: grant.expiresAt,
        uploadedAt: grant.file.createdAt
    }));

    // Log to AnonymousAuditLog (NO userId!)
    await prisma.anonymousAuditLog.create({
        data: {
            eventType: 'FILE_LIST',
            publicKeyHash: publicKeyHash,
            ringSignature: ringSignature,
            metadata: JSON.stringify({ fileCount: files.length }),
            timestamp: new Date()
        }
    });

    return res.json({
        success: true,
        files: files,
        totalCount: files.length
    });
});
```

### **Mobile Implementation**

> **Implementation gap (2025-10-16):** Mobile app hiện chưa thực hiện việc split/encrypt/upload chunk theo đúng thiết kế; backend vẫn tự động xử lý file thô. Cần chuyển toàn bộ bước chuẩn hoá chunk sang client để đảm bảo tính ẩn danh.

```typescript
// mobile/src/services/AnonymousFileAccessService.ts

export class AnonymousFileAccessService {
    async listAccessibleFiles(): Promise<FileMetadata[]> {
        const identity = await AOTIdentityManager.getCurrentIdentity();
        if (!identity) {
            throw new Error('No AOT identity found');
        }

        // Generate fresh nonce
        const nonce = generateNonce();
        const timestamp = Date.now();
        const message = `list-files:${timestamp}:${nonce}`;

        // Create ring signature
        const ringSignature = await this.ringService.sign({
            message,
            secretKey: identity.secretKey,
            publicKey: identity.publicKey,
            ring: await this.getRingPublicKeys()
        });

        // Call anonymous endpoint (NO userId!)
        const response = await fetch(`${API_BASE}/api/files/anonymous-list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicKey: identity.publicKey,
                ringSignature,
                timestamp,
                nonce
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.files;
    }
}
```

---

## **GIAI ĐOẠN 1: THƯƠNG LƯỢNG QUYỀN TRUY CẬP**

### **Endpoint: POST /api/files/:fileId/anonymous-access**

**Request:**
```json
{
  "publicKey": "04a1b2c3...",
  "ringSignature": "0x1a2b3c...",
  "timestamp": 1728925234567,
  "nonce": "e5f6a7b8..."
}
```

**Response:**
```json
{
  "success": true,
  "chunkManifest": [
    {
      "index": 0,
      "cid": "QmXa1b2c3...",
      "hash": "sha256:abc123...",
      "size": 256000
    },
    {
      "index": 1,
      "cid": "QmYd4e5f6...",
      "hash": "sha256:def456...",
      "size": 256000
    }
  ],
  "ownershipPolicy": {
    "ownershipPublicKey": "04x1y2z3...",
    "revoked": false,
    "lastRevocationAt": null
  },
  "grantContext": {
    "grantedAt": "2025-10-15T10:00:00Z",
    "expiresAt": null,
    "accessCount": 5,
    "keyStatus": "client-managed"
  },
  "message": "Access negotiation successful - master key remains client-side"
}
```

### **Backend Implementation**

```javascript
router.post('/:fileId/anonymous-access', async (req, res) => {
    const { fileId } = req.params;
    const { publicKey, ringSignature, timestamp, nonce } = req.body;

    // Verify ring signature
    const message = `access-file:${fileId}:${timestamp}:${nonce}`;
    const isValid = await ringSignatureService.verify({
        message,
        ringSignature,
        publicKey
    });

    if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    // Calculate publicKeyHash
    const publicKeyHash = crypto
        .createHash('sha256')
        .update(publicKey)
        .digest('hex');

    // Check access permission (by publicKeyHash, NO userId!)
    const accessGrant = await prisma.anonymousFileAccess.findUnique({
        where: {
            accessorPublicKeyHash_fileId: {
                accessorPublicKeyHash: publicKeyHash,
                fileId: fileId
            }
        },
        include: {
            file: {
                include: {
                    chunks: {
                        orderBy: { chunkIndex: 'asc' }
                    }
                }
            }
        }
    });

    if (!accessGrant || accessGrant.status !== 'active') {
        return res.status(403).json({
            error: 'Access denied'
        });
    }

    // Build chunk manifest
    const chunkManifest = accessGrant.file.chunks.map(chunk => ({
        index: chunk.chunkIndex,
        cid: chunk.ipfsCid,
        hash: chunk.chunkHash,
        size: chunk.size
    }));

    // Ownership policy
    const ownershipPolicy = {
        ownershipPublicKey: accessGrant.file.ownershipPublicKey,
        revoked: accessGrant.file.status !== 'active',
        lastRevocationAt: accessGrant.file.lastRevocationAt
    };

    // Grant context
    const grantContext = {
        grantedAt: accessGrant.grantedAt,
        expiresAt: accessGrant.expiresAt,
        accessCount: accessGrant.accessCount,
        keyStatus: accessGrant.keyStatus
    };

    // Update access count
    await prisma.anonymousFileAccess.update({
        where: { id: accessGrant.id },
        data: {
            accessCount: { increment: 1 },
            lastAccessAt: new Date(),
            lastAccessProof: ringSignature
        }
    });

    // Log to audit
    await prisma.anonymousAuditLog.create({
        data: {
            eventType: 'ACCESS_NEGOTIATION',
            fileId: fileId,
            publicKeyHash: publicKeyHash,
            ringSignature: ringSignature,
            metadata: JSON.stringify({ chunkCount: chunkManifest.length }),
            timestamp: new Date()
        }
    });

    return res.json({
        success: true,
        chunkManifest,
        ownershipPolicy,
        grantContext,
        message: 'Access negotiation successful - master key remains client-side'
    });
});
```

---

## **GIAI ĐOẠN 2: LẤY KHÓA GIẢI MÃ**

> ⚠️ **QUAN TRỌNG:** Master key KHÔNG BAO GIỜ gửi lên backend.
> User tự quản lý trong SecureStorage hoặc nhận từ owner qua kênh P2P.

### **Secure Key Storage**

```typescript
// mobile/src/services/SecureKeyStorage.ts

import * as SecureStore from 'expo-secure-store';

export class SecureKeyStorage {
    async storeMasterKey(
        fileId: string,
        publicKeyHash: string,
        masterKey: string
    ): Promise<void> {
        const key = `masterKey_${fileId}_${publicKeyHash}`;
        await SecureStore.setItemAsync(key, masterKey);
        console.log('[Key Storage] Master key stored');
    }

    async getMasterKey(
        fileId: string,
        publicKeyHash: string
    ): Promise<string | null> {
        const key = `masterKey_${fileId}_${publicKeyHash}`;
        const masterKey = await SecureStore.getItemAsync(key);

        if (masterKey) {
            console.log('[Key Storage] Master key found');
        } else {
            console.log('[Key Storage] Master key not found - need secure key package from owner');
        }

        return masterKey;
    }

    async deleteMasterKey(
        fileId: string,
        publicKeyHash: string
    ): Promise<void> {
        const key = `masterKey_${fileId}_${publicKeyHash}`;
        await SecureStore.deleteItemAsync(key);
        console.log('[Key Storage] Master key deleted');
    }
}
```

### **Key Orchestration Service**

```typescript
export class KeyOrchestrationService {
    private keyStorage = new SecureKeyStorage();

    async resolveChunkKeys(
        fileId: string,
        publicKeyHash: string,
        encryptedChunkKeys?: string
    ): Promise<ChunkKeys | null> {
        // Try to get master key from local storage
        const masterKey = await this.keyStorage.getMasterKey(fileId, publicKeyHash);

        if (!masterKey) {
            console.log('[Key Orchestration] Master key not found');
            return null; // UI will show "Waiting for Secure Key Package"
        }

        // Decrypt chunk keys using master key
        if (!encryptedChunkKeys) {
            console.log('[Key Orchestration] Encrypted chunk keys not provided');
            return null;
        }

        const chunkKeysJson = await this.decryptWithMasterKey(
            encryptedChunkKeys,
            masterKey
        );

        const chunkKeys = JSON.parse(chunkKeysJson);

        console.log('[Key Orchestration] Chunk keys decrypted successfully');
        console.log('[Key Orchestration] Ready to download', Object.keys(chunkKeys).length, 'chunks');

        return chunkKeys;
    }

    async importSecureKeyPackage(keyPackage: SecureKeyPackage): Promise<void> {
        const { fileId, publicKeyHash, encryptedMasterKey, recipientPublicKey } = keyPackage;

        // Verify recipient
        const identity = await AOTIdentityManager.getCurrentIdentity();
        if (identity.publicKey !== recipientPublicKey) {
            throw new Error('Key package not intended for this user');
        }

        // Decrypt master key with user's secret key
        const masterKey = await this.decryptWithSecretKey(
            encryptedMasterKey,
            identity.secretKey
        );

        // Store in SecureStorage
        await this.keyStorage.storeMasterKey(fileId, publicKeyHash, masterKey);

        console.log('[Key Import] Secure key package imported successfully');
    }
}
```

---

## **GIAI ĐOẠN 3: TẢI VÀ XÁC THỰC CHUNKS**

### **Chunk Download Service**

```typescript
export class ChunkDownloadService {
    private readonly IPFS_GATEWAY = 'http://192.168.1.40:8080';
    private readonly MAX_RETRIES = 3;
    private readonly PARALLEL_DOWNLOADS = 4;

    async downloadAndVerifyChunk(
        chunkMeta: ChunkManifest,
        chunkKey: string,
        onProgress: (progress: ChunkProgress) => void
    ): Promise<Uint8Array> {
        const { index, cid, hash } = chunkMeta;

        let lastError: Error | null = null;

        // Retry up to 3 times
        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                onProgress({
                    chunkIndex: index,
                    status: 'downloading',
                    attempt
                });

                // 1. Download from IPFS (NO backend involved)
                const encryptedChunk = await this.fetchFromIPFS(cid);

                // 2. Decrypt chunk
                onProgress({
                    chunkIndex: index,
                    status: 'decrypting',
                    attempt
                });

                const decryptedChunk = await this.decryptChunk(encryptedChunk, chunkKey);

                // 3. Verify hash
                onProgress({
                    chunkIndex: index,
                    status: 'verifying',
                    attempt
                });

                const computedHash = await this.computeSHA256(decryptedChunk);

                if (computedHash !== hash) {
                    throw new Error(`Hash mismatch: expected ${hash}, got ${computedHash}`);
                }

                // Success!
                onProgress({
                    chunkIndex: index,
                    status: 'verified',
                    attempt
                });

                return decryptedChunk;

            } catch (error) {
                lastError = error;

                onProgress({
                    chunkIndex: index,
                    status: 'error',
                    attempt,
                    error: error.message
                });

                if (attempt < this.MAX_RETRIES) {
                    await this.delay(1000 * attempt); // Exponential backoff
                }
            }
        }

        // All retries failed - report to backend
        await this.reportIntegrityAlert(chunkMeta, lastError);

        throw new Error(`Chunk ${index} failed after ${this.MAX_RETRIES} attempts`);
    }

    private async fetchFromIPFS(cid: string): Promise<Uint8Array> {
        const url = `${this.IPFS_GATEWAY}/ipfs/${cid}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`IPFS fetch failed: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    }

    private async computeSHA256(data: Uint8Array): Promise<string> {
        const hashBuffer = await Crypto.digest(
            Crypto.CryptoDigestAlgorithm.SHA256,
            data
        );

        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private async reportIntegrityAlert(
        chunkMeta: ChunkManifest,
        error: Error
    ): Promise<void> {
        const identity = await AOTIdentityManager.getCurrentIdentity();
        const nonce = generateNonce();
        const timestamp = Date.now();

        const message = `integrity-alert:${chunkMeta.fileId}:${chunkMeta.index}:${timestamp}:${nonce}`;

        const ringSignature = await ringService.sign({
            message,
            secretKey: identity.secretKey,
            publicKey: identity.publicKey,
            ring: await getRingPublicKeys()
        });

        await fetch(
            `${API_BASE}/api/files/${chunkMeta.fileId}/anonymous-integrity-alert`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    publicKey: identity.publicKey,
                    ringSignature,
                    chunkIndex: chunkMeta.index,
                    expectedHash: chunkMeta.hash,
                    actualHash: null,
                    retryCount: this.MAX_RETRIES,
                    timestamp,
                    nonce
                })
            }
        );

        console.log('[Integrity Alert] Reported to backend');
    }
}
```

---

## **GIAI ĐOẠN 4: GHÉP FILE VÀ HIỂN THỊ**

### **File Reconstruction**

```typescript
export class FileReconstructionService {
    async reconstructFile(
        chunks: Uint8Array[],
        expectedTotalSize: number
    ): Promise<Uint8Array> {
        // Calculate total size
        const actualTotalSize = chunks.reduce((sum, chunk) => sum + chunk.length, 0);

        if (actualTotalSize !== expectedTotalSize) {
            throw new Error(`Size mismatch: expected ${expectedTotalSize}, got ${actualTotalSize}`);
        }

        // Concatenate chunks
        const fileBuffer = new Uint8Array(actualTotalSize);

        let offset = 0;
        for (const chunk of chunks) {
            fileBuffer.set(chunk, offset);
            offset += chunk.length;
        }

        console.log('[Reconstruction] File reconstructed:', actualTotalSize, 'bytes');

        return fileBuffer;
    }

    async createSecureCache(
        fileId: string,
        fileData: Uint8Array,
        ttl: number = 24 * 60 * 60 * 1000 // 24h
    ): Promise<string> {
        const cacheKey = `cache_${fileId}`;

        // Encrypt with device-specific key
        const deviceKey = await this.getDeviceKey();
        const encryptedData = await this.encryptWithDeviceKey(fileData, deviceKey);

        // Store in filesystem
        const cacheDir = `${FileSystem.cacheDirectory}secure/`;
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });

        const cachePath = `${cacheDir}${cacheKey}`;
        await FileSystem.writeAsStringAsync(cachePath, encryptedData, {
            encoding: FileSystem.EncodingType.Base64
        });

        // Set expiration
        const expiresAt = Date.now() + ttl;
        await AsyncStorage.setItem(`${cacheKey}_expires`, expiresAt.toString());

        console.log('[Cache] Secure cache created:', cachePath);
        console.log('[Cache] Expires at:', new Date(expiresAt).toLocaleString());

        return cachePath;
    }
}
```

### **Audit Logging**

```typescript
export class AuditLoggingService {
    async logDownloadComplete(
        fileId: string,
        metadata: {
            chunkCount: number;
            totalSize: number;
            duration: number;
        }
    ): Promise<void> {
        const identity = await AOTIdentityManager.getCurrentIdentity();
        const nonce = generateNonce();
        const timestamp = Date.now();

        const message = `audit-log:DOWNLOAD_COMPLETE:${fileId}:${timestamp}:${nonce}`;

        const ringSignature = await ringService.sign({
            message,
            secretKey: identity.secretKey,
            publicKey: identity.publicKey,
            ring: await getRingPublicKeys()
        });

        await fetch(`${API_BASE}/api/audit/anonymous-log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventType: 'DOWNLOAD_COMPLETE',
                fileId,
                publicKey: identity.publicKey,
                ringSignature,
                timestamp,
                nonce,
                metadata: JSON.stringify(metadata)
            })
        });

        console.log('[Audit] Download complete event logged');
    }
}
```

---

## **UI/UX DESIGN**

### **Download Progress Screen**

```typescript
const FileDownloadScreen = ({ route }: any) => {
    const { fileId, fileName } = route.params;

    const [phase, setPhase] = useState<DownloadPhase>('negotiating');
    const [chunkProgress, setChunkProgress] = useState<Map<number, ChunkProgress>>(new Map());

    const startDownload = async () => {
        try {
            // Phase 1: Access Negotiation
            setPhase('negotiating');
            const { chunkManifest, ownershipPolicy } =
                await anonymousService.negotiateAccess(fileId);

            // Phase 2: Key Orchestration
            setPhase('resolving-keys');
            const identity = await AOTIdentityManager.getCurrentIdentity();
            const publicKeyHash = crypto.createHash('sha256')
                .update(identity.publicKey).digest('hex');

            const chunkKeys = await keyService.resolveChunkKeys(
                fileId,
                publicKeyHash,
                encryptedChunkKeysFromOwner
            );

            if (!chunkKeys) {
                setPhase('waiting-for-key');
                return;
            }

            // Phase 3: Chunk Download
            setPhase('downloading');

            const chunks = await downloadService.downloadAndVerifyChunks(
                chunkManifest,
                chunkKeys,
                (progress) => {
                    setChunkProgress(prev => {
                        const updated = new Map(prev);
                        updated.set(progress.chunkIndex, progress);
                        return updated;
                    });
                }
            );

            // Phase 4: Reconstruction
            setPhase('reconstructing');

            const fileData = await reconstructionService.reconstructFile(chunks);
            const cachePath = await reconstructionService.createSecureCache(fileId, fileData);

            setPhase('ready');

            await auditService.logDownloadComplete(fileId, {
                chunkCount: chunks.length,
                totalSize: fileData.length,
                duration: Date.now() - startTime
            });

        } catch (error) {
            console.error('[Download] Error:', error);
            setPhase('error');
        }
    };

    return (
        <View style={styles.container}>
            {/* Phase Stepper */}
            <View style={styles.stepper}>
                <PhaseStep icon="🔍" label="Negotiating" active={phase === 'negotiating'} />
                <PhaseStep icon="🔐" label="Keys" active={phase === 'resolving-keys'} />
                <PhaseStep icon="⬇️" label="Download" active={phase === 'downloading'} />
                <PhaseStep icon="🔨" label="Rebuild" active={phase === 'reconstructing'} />
            </View>

            {/* Chunk Progress */}
            {phase === 'downloading' && (
                <FlatList
                    data={Array.from(chunkProgress.entries())}
                    renderItem={({ item: [index, progress] }) => (
                        <ChunkProgressCard chunkIndex={index} progress={progress} />
                    )}
                    keyExtractor={([index]) => index.toString()}
                />
            )}

            {/* Waiting for Key */}
            {phase === 'waiting-for-key' && (
                <View style={styles.waitingContainer}>
                    <Text style={styles.waitingIcon}>🔐</Text>
                    <Text style={styles.waitingTitle}>Waiting for Secure Key Package</Text>
                    <TouchableOpacity style={styles.scanButton}>
                        <Text>📷 Scan QR Code</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Ready State */}
            {phase === 'ready' && (
                <View style={styles.readyContainer}>
                    <Text style={styles.readyIcon}>✅</Text>
                    <Text style={styles.readyTitle}>AOT Integrity Verified</Text>
                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => navigation.navigate('FileViewer', { fileId })}
                    >
                        <Text>View File</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
```

---

### **Storage Monitor Tab trong File Viewer**

- `FileViewer` hiển thị hai tab: **File Preview** và **Storage Monitor**. Tab mới reuse cùng download session nên không cần reload.
- Khi user mở modal, `Storage Monitor` render ngay lập tức trạng thái session hiện tại (kể cả khi download đang diễn ra ở màn hình khác).
- Panel hiển thị ba khối chính:
    1. **Key Package State** – fingerprint master key, trạng thái giải mã, nguồn key (Secure Storage hay QR import).
    2. **Chunk Manifest** – danh sách chunk với cột `Phase`, `Integrity`, `Retries`, `CID` (tap để copy).
    3. **Realtime Logs** – log ngắn gọn cho từng milestone (negotiation, resolve key, download x/total, reconstruction, ready).
- UI có nút copy master fingerprint, nút export chunk state (dùng cho audit) và badge cảnh báo nếu có integrity alert.

#### **Download Session States**

| Phase | Mô tả | UI Indicator |
|-------|-------|--------------|
| `negotiating` | Đang gọi `anonymous-access` để lấy manifest | Badge "Negotiating Access" + spinner |
| `waiting-for-key` | Thiếu Secure Key Package, chờ người dùng scan/import | Card màu vàng với CTA "Scan QR" |
| `resolving-keys` | Đang giải mã chunk keys từ master key | Badge "Decrypting Keys" |
| `downloading` | Tiến trình chunk; mỗi chunk cập nhật `%` và hash status | Progress bar tổng + bảng chunk |
| `reconstructing` | Ghép file và tạo secure cache | Badge "Rebuilding" |
| `ready` | File sẵn sàng xem, integrity verified | Banner xanh + nút "Open Preview" |
| `error` | Có lỗi (network, integrity, decrypt) | Banner đỏ + nút retry |

#### **Shared Download Session Manager**

- Service `mobile/src/services/chunkDownloadManager.ts` tạo **singleton session** theo `fileId`.
- Hook `useChunkDownloader` subscribe vào session, trả về `{ phase, manifest, chunkProgress, errors }` theo thời gian thực.
- `SecureDownloadScreen` khởi tạo session qua `ensureDownloadSession({ fileId, manifest, keyPackage })` và stream progress cho UI chính.
- `FileViewer` chỉ cần `useChunkDownloader(fileId)` để đọc lại dữ liệu – không khởi tạo network request mới.
- Tất cả listener unregister tự động khi component unmount để tránh memory leak.

```typescript
// Ví dụ sử dụng trong FileViewer
const { phase, chunkProgress, keyPackageState, errors } = useChunkDownloader(fileId);

return (
    <StorageMonitorPanel
        phase={phase}
        chunkProgress={chunkProgress}
        keyPackageState={keyPackageState}
        errors={errors}
    />
);
```

#### **Automation & Testing**

- Unit test mới: `mobile/src/services/__tests__/chunkDownloadManager.test.ts` kiểm tra retry, integrity và shared session.
- Component test: `mobile/src/components/ipfs/__tests__/ChunkMonitorPanel.test.tsx` render monitor tab với fake session và assert UI states.
- Chạy nhanh individual suite:
    - `npm test -- chunkDownloadManager`
    - `npm test -- ChunkMonitorPanel`
- Lint vẫn bắt unused vars (xem kế hoạch cleanup trong `STATUS.md`), nhưng download monitor không tạo warning mới.

## **DATABASE SCHEMA (Anonymous)**

```sql
-- Anonymous File Access (NO userId!)
CREATE TABLE AnonymousFileAccess (
    id UUID PRIMARY KEY,
    accessorPublicKeyHash VARCHAR(64),  -- SHA256(publicKey)
    fileId UUID,
    grantedAt TIMESTAMP,
    expiresAt TIMESTAMP,
    lastAccessProof TEXT,               -- Ring signature
    lastAccessAt TIMESTAMP,
    accessCount INT DEFAULT 0,
    keyStatus VARCHAR(20) DEFAULT 'client-managed',
    status VARCHAR(20) DEFAULT 'active',

    UNIQUE(accessorPublicKeyHash, fileId)
);

-- Anonymous Audit Log (NO userId!)
CREATE TABLE AnonymousAuditLog (
    id UUID PRIMARY KEY,
    eventType VARCHAR(50),
    fileId UUID,
    publicKeyHash VARCHAR(64),          -- SHA256(publicKey)
    ringSignature TEXT,
    metadata TEXT,                      -- JSON
    timestamp TIMESTAMP
);

-- Integrity Alerts (Anonymous)
CREATE TABLE IntegrityAlert (
    id UUID PRIMARY KEY,
    fileId UUID,
    chunkIndex INT,
    expectedHash VARCHAR(64),
    actualHash VARCHAR(64),
    reportedByPublicKeyHash VARCHAR(64), -- Anonymous
    reportedAt TIMESTAMP,
    resolved BOOLEAN DEFAULT false
);
```

---

## **TÓM TẮT ANONYMOUS FLOW**

### **Key Principles**

✅ **KHÔNG có userId trong toàn bộ flow**
- Backend KHÔNG lưu userId
- Chỉ dùng publicKeyHash để track anonymous users
- Tất cả authentication bằng publicKey + ringSignature

✅ **Master key KHÔNG BAO GIỜ gửi lên backend**
- User tự quản lý trong SecureStorage
- Nhận từ owner qua kênh P2P (QR code, NFC, messaging)
- Backend chỉ trả về manifest (CID list, hash list)

✅ **Ring Signature + Nonce Protocol**
- Mỗi request có fresh nonce (32-byte random)
- Timestamp valid trong 5 phút
- Message format: `${action}:${params}:${timestamp}:${nonce}`

✅ **Audit Trail Hoàn Toàn Ẩn Danh**
- Backend log vào AnonymousAuditLog
- Chỉ lưu publicKeyHash, ringSignature, metadata
- KHÔNG lưu danh tính thật

### **Security Guarantees**

✅ **Anonymity:** Backend KHÔNG biết user identity
✅ **Privacy:** Master key KHÔNG BAO GIỜ rời khỏi client
✅ **Integrity:** Mọi chunk được verify SHA256 hash
✅ **Accountability:** Audit trail ghi log theo publicKeyHash
✅ **Anti-replay:** Nonce protocol chống replay attack
✅ **Forward secrecy:** Ring signature + fresh nonce mỗi request
✅ **Realtime Storage Monitor:** Người demo có thể theo dõi từng chunk, fingerprint và phase trên cả Download Screen lẫn File Viewer

---

**Kết luận:** Luồng download hoàn toàn ẩn danh, bảo mật, và có thể audit được - đáp ứng yêu cầu của hệ thống anonymous file access với Ring Signature và AOT.
