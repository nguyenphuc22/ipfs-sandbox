# Kế hoạch Triển khai: Investigation Flow với Hybrid Adjudicator Model

> **Priority Focus**: Luồng Truy vết Danh tính (Investigation Flow)

## Tóm tắt Tình trạng Hiện tại

### ✅ Đã Hoàn thành
- **Upload Flow cơ bản**: Ring signature + Schnorr ownership proof
- **Access Management**: Grant/revoke anonymous access
- **Revocation với Re-encryption**: Client-side re-encryption
- **Anonymous Download Flow**: 5-phase download với integrity verification (100% complete!)
  - `SecureDownloadScreen.tsx`: Full UI
  - `chunkDownloadManager.ts`: Download orchestrator
  - Chunk-by-chunk integrity verification
  - File persistence vào device
- **Mobile Services**: `AnonymousFileAccessService`, `ChunkEncryptionService`, `KeyPackageStorage`
- **Backend Services**: `FileAccessService` với publicKeyHash-based access

### 🎯 Cần Implement cho Investigation Flow

Để triển khai **Enhanced Investigation Flow** (New_Thesis.md lines 1523-1886), cần implement **Hybrid Adjudicator Model** với:
- **Layer 1**: ValidationToken (real-time upload validation)
- **Layer 2**: EscrowedIdentity (post-hoc investigation)

## Kiến trúc Hybrid Adjudicator Model

```
┌──────────────────────────────────────────────────────────┐
│                  HYBRID ADJUDICATOR                       │
│  ┌───────────────────┐    ┌──────────────────────┐      │
│  │  Layer 1: Policy  │    │  Layer 2: Investigation │    │
│  │  Enforcement      │    │  (Escrow Decryptor)     │    │
│  │                   │    │                         │    │
│  │ - User validation │    │ - Decrypt escrowedId    │    │
│  │ - Rate limiting   │    │ - Cross-reference       │    │
│  │ - Issue tokens    │    │ - Behavioral analysis   │    │
│  └───────────────────┘    └──────────────────────┘      │
└──────────────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
  ValidationToken              EscrowedIdentity
  (real-time)                  (post-hoc)
```

---

## Phase 1: Upload Flow Enhancement (HIGH PRIORITY)

### Current State
❌ Upload hiện tại chỉ có:
- Ring signature authentication
- Schnorr ownership proof
- **THIẾU**: ValidationToken từ Adjudicator
- **THIẾU**: EscrowedIdentity (encrypted real publicKey)

### Target State (Theo Thesis)
✅ Upload cần có dual-layer accountability:
1. **Layer 1 (Real-time)**: ValidationToken từ Adjudicator
2. **Layer 2 (Post-hoc)**: EscrowedIdentity encrypted

---

### Bước 1.1: Tạo Adjudicator Service (Backend Microservice)

**File Structure**:
```
adjudicator/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── services/
│   │   ├── ValidationService.ts    # Issue ValidationTokens
│   │   ├── InvestigationService.ts # Decrypt escrowedIdentity
│   │   └── AuditLogger.ts          # Log all actions
│   ├── routes/
│   │   ├── validate.ts             # POST /api/validate-upload
│   │   └── investigate.ts          # POST /api/decrypt-escrow
│   ├── crypto/
│   │   ├── schnorr.ts              # Schnorr signature
│   │   └── ecies.ts                # ECIES decryption
│   └── config/
│       └── adjudicatorKeys.ts      # Adjudicator keypair
├── package.json
└── tsconfig.json
```

**Implementation**:

#### `adjudicator/src/services/ValidationService.ts`
```typescript
import crypto from 'crypto';
import { getSchnorr } from '../crypto/schnorr';

interface ValidationRequest {
  userPublicKey: string;
  fileMetadataHash: string;
  timestamp: number;
  nonce: string;
}

interface ValidationToken {
  fileMetadataHash: string;
  userPublicKeyHash: string;
  issuedAt: number;
  expiresAt: number;
  signature: string;
  adjudicatorPublicKey: string;
}

class ValidationService {
  private adjudicatorPrivateKey: string;
  private adjudicatorPublicKey: string;

  constructor() {
    // Load from secure config
    this.adjudicatorPrivateKey = process.env.ADJUDICATOR_PRIVATE_KEY!;
    this.adjudicatorPublicKey = process.env.ADJUDICATOR_PUBLIC_KEY!;
  }

  // Policy checks: user exists, not banned, rate limit OK
  async validateUser(publicKey: string): Promise<boolean> {
    // 1. Check user exists in database
    const user = await prisma.user.findUnique({
      where: { publicKey },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Check not banned
    const banned = await prisma.bannedUser.findUnique({
      where: { publicKey },
    });
    if (banned) {
      throw new Error('User is banned');
    }

    // 3. Check rate limit (100 tokens per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const tokenCount = await prisma.validationTokenAudit.count({
      where: {
        userPublicKey: publicKey,
        issuedAt: { gte: oneHourAgo },
      },
    });
    if (tokenCount >= 100) {
      throw new Error('Rate limit exceeded');
    }

    return true;
  }

  // Issue ValidationToken
  async issueValidationToken(request: ValidationRequest): Promise<ValidationToken> {
    const { userPublicKey, fileMetadataHash, timestamp, nonce } = request;

    // 1. Policy enforcement
    await this.validateUser(userPublicKey);

    // 2. Verify timestamp freshness (< 5 minutes old)
    const now = Date.now();
    if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
      throw new Error('Request timestamp too old');
    }

    // 3. Verify nonce uniqueness
    const nonceExists = await prisma.usedNonce.findUnique({
      where: { nonce },
    });
    if (nonceExists) {
      throw new Error('Nonce already used');
    }
    await prisma.usedNonce.create({
      data: { nonce, usedAt: new Date() },
    });

    // 4. Create ValidationToken
    const userPublicKeyHash = crypto.createHash('sha256').update(userPublicKey).digest('hex');
    const issuedAt = Date.now();
    const expiresAt = issuedAt + 10 * 60 * 1000; // 10 minutes TTL

    // 5. Sign with Adjudicator's Schnorr private key
    const schnorr = await getSchnorr();
    const tokenMessage = `${fileMetadataHash}:${userPublicKeyHash}:${issuedAt}:${expiresAt}`;
    const messageHash = crypto.createHash('sha256').update(tokenMessage).digest();

    const signature = schnorr.sign(
      messageHash,
      Buffer.from(this.adjudicatorPrivateKey, 'hex')
    );

    // 6. Log for audit trail
    await prisma.validationTokenAudit.create({
      data: {
        tokenId: crypto.randomUUID(),
        userPublicKey,
        userPublicKeyHash,
        fileMetadataHash,
        issuedAt: new Date(issuedAt),
        expiresAt: new Date(expiresAt),
        signature: signature.toString('hex'),
      },
    });

    return {
      fileMetadataHash,
      userPublicKeyHash,
      issuedAt,
      expiresAt,
      signature: signature.toString('hex'),
      adjudicatorPublicKey: this.adjudicatorPublicKey,
    };
  }
}

export const validationService = new ValidationService();
```

#### `adjudicator/src/routes/validate.ts`
```typescript
import express from 'express';
import { validationService } from '../services/ValidationService';

const router = express.Router();

// POST /api/validate-upload
router.post('/validate-upload', async (req, res) => {
  try {
    const { userPublicKey, fileMetadataHash, timestamp, nonce } = req.body;

    // Validate request
    if (!userPublicKey || !fileMetadataHash || !timestamp || !nonce) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Issue ValidationToken
    const token = await validationService.issueValidationToken({
      userPublicKey,
      fileMetadataHash,
      timestamp,
      nonce,
    });

    res.json({
      success: true,
      validationToken: token,
    });
  } catch (error) {
    console.error('[Adjudicator] Validation error:', error);
    res.status(403).json({
      success: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    });
  }
});

export default router;
```

#### `adjudicator/src/services/InvestigationService.ts`
```typescript
import * as eccrypto from 'eccrypto';
import crypto from 'crypto';

interface InvestigationRequest {
  fileId: string;
  escrowedIdentity: string; // ECIES encrypted publicKey
  investigationReason: string;
  adminApproval: string;
  legalAuthorization: string;
}

interface InvestigationReport {
  decryptedIdentity: {
    realPublicKey: string;
    publicKeyHash: string;
    ownershipPublicKey: string;
    consistencyCheck: boolean;
  };
  activitySummary: {
    filesWithSameOwnershipKey: number;
    totalRevocations: number;
    avgTimeBeforeRevoke: number;
    firstUploadTimestamp: Date;
    lastActivityTimestamp: Date;
  };
  redFlags: string[];
  riskAssessment: {
    overallRisk: 'HIGH' | 'MEDIUM' | 'LOW';
    threatType: string;
    confidence: number;
    reasoning: string;
  };
  recommendedActions: string[];
  legalCompliance: {
    investigationId: string;
    requestedBy: string;
    legalAuthorization: string;
    decryptionTimestamp: Date;
    auditLogId: string;
  };
}

class InvestigationService {
  private adjudicatorPrivateKey: Buffer;

  constructor() {
    // Load Adjudicator's ECIES private key
    const privateKeyHex = process.env.ADJUDICATOR_ECIES_PRIVATE_KEY!;
    this.adjudicatorPrivateKey = Buffer.from(privateKeyHex, 'hex');
  }

  // Decrypt escrowedIdentity (Layer 2)
  async decryptEscrowedIdentity(encrypted: string): Promise<string> {
    try {
      // Parse ECIES package
      const encryptedBuffer = Buffer.from(encrypted, 'base64');

      // Decrypt with Adjudicator's private key
      const decrypted = await eccrypto.decrypt(
        this.adjudicatorPrivateKey,
        {
          iv: encryptedBuffer.slice(0, 16),
          ephemPublicKey: encryptedBuffer.slice(16, 81),
          ciphertext: encryptedBuffer.slice(81, -32),
          mac: encryptedBuffer.slice(-32),
        }
      );

      return decrypted.toString('utf8');
    } catch (error) {
      throw new Error('Failed to decrypt escrowedIdentity: ' + error.message);
    }
  }

  // Cross-reference with ValidationToken logs
  async crossReferenceWithLayer1(
    realPublicKey: string,
    fileId: string
  ): Promise<boolean> {
    const publicKeyHash = crypto.createHash('sha256').update(realPublicKey).digest('hex');

    // Get file record
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { validationToken: true },
    });

    if (!file || !file.validationToken) {
      return false;
    }

    // Check if Layer 1 and Layer 2 match
    return file.validationToken.userPublicKeyHash === publicKeyHash;
  }

  // Generate comprehensive investigation report
  async investigate(request: InvestigationRequest): Promise<InvestigationReport> {
    const { fileId, escrowedIdentity, investigationReason, adminApproval, legalAuthorization } = request;

    // 1. Verify investigation authorization
    await this.verifyInvestigationAuthorization(adminApproval, legalAuthorization);

    // 2. Decrypt escrowedIdentity (Layer 2)
    const realPublicKey = await this.decryptEscrowedIdentity(escrowedIdentity);
    const publicKeyHash = crypto.createHash('sha256').update(realPublicKey).digest('hex');

    // 3. Get file record
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        ownershipPublicKey: true,
        createdAt: true,
        validationToken: true,
      },
    });

    if (!file) {
      throw new Error('File not found');
    }

    // 4. Cross-reference Layer 1 (ValidationToken) and Layer 2 (EscrowedIdentity)
    const consistencyCheck = await this.crossReferenceWithLayer1(realPublicKey, fileId);

    // 5. Query all files with same ownershipPublicKey
    const relatedFiles = await prisma.file.findMany({
      where: { ownershipPublicKey: file.ownershipPublicKey },
      include: {
        revocations: true,
      },
    });

    // 6. Analyze revocation patterns
    const totalRevocations = relatedFiles.reduce((sum, f) => sum + f.revocations.length, 0);
    const revocationTimes = relatedFiles.flatMap(f =>
      f.revocations.map(r => r.createdAt.getTime() - f.createdAt.getTime())
    );
    const avgTimeBeforeRevoke = revocationTimes.length > 0
      ? revocationTimes.reduce((sum, t) => sum + t, 0) / revocationTimes.length / (1000 * 60 * 60) // hours
      : 0;

    // 7. Detect behavioral red flags
    const redFlags: string[] = [];
    if (avgTimeBeforeRevoke < 48) {
      redFlags.push('Grants access then revokes quickly (honeypot pattern)');
    }
    if (totalRevocations / relatedFiles.length > 0.4) {
      redFlags.push(`High revocation-to-upload ratio (${Math.round(totalRevocations / relatedFiles.length * 100)}%)`);
    }
    if (relatedFiles.length > 30) {
      redFlags.push(`Uses same ownershipPublicKey repeatedly (${relatedFiles.length} files linkable)`);
    }

    // 8. Risk assessment
    const overallRisk = redFlags.length >= 3 ? 'HIGH' : redFlags.length >= 1 ? 'MEDIUM' : 'LOW';
    const threatType = avgTimeBeforeRevoke < 48 ? 'Honeypot attack' : 'Suspicious behavior';

    // 9. Generate investigation report
    const investigationId = crypto.randomUUID();
    const report: InvestigationReport = {
      decryptedIdentity: {
        realPublicKey,
        publicKeyHash,
        ownershipPublicKey: file.ownershipPublicKey,
        consistencyCheck,
      },
      activitySummary: {
        filesWithSameOwnershipKey: relatedFiles.length,
        totalRevocations,
        avgTimeBeforeRevoke,
        firstUploadTimestamp: new Date(Math.min(...relatedFiles.map(f => f.createdAt.getTime()))),
        lastActivityTimestamp: new Date(Math.max(...relatedFiles.map(f => f.createdAt.getTime()))),
      },
      redFlags,
      riskAssessment: {
        overallRisk,
        threatType,
        confidence: redFlags.length / 5, // 0-1 scale
        reasoning: `PublicKey shows ${redFlags.length} suspicious patterns. ${redFlags.join('; ')}`,
      },
      recommendedActions: [
        'Blacklist publicKey from ValidationToken issuance',
        `Flag all ${relatedFiles.length} files from this ownershipPublicKey`,
        'Notify affected accessors (pseudonymous notification)',
      ],
      legalCompliance: {
        investigationId,
        requestedBy: adminApproval,
        legalAuthorization,
        decryptionTimestamp: new Date(),
        auditLogId: await this.logInvestigation(investigationId, request),
      },
    };

    return report;
  }

  private async verifyInvestigationAuthorization(
    adminApproval: string,
    legalAuthorization: string
  ): Promise<void> {
    // TODO: Implement admin signature verification
    // TODO: Verify legal authorization exists
    if (!adminApproval || !legalAuthorization) {
      throw new Error('Insufficient investigation authorization');
    }
  }

  private async logInvestigation(
    investigationId: string,
    request: InvestigationRequest
  ): Promise<string> {
    const auditLog = await prisma.investigationAudit.create({
      data: {
        investigationId,
        fileId: request.fileId,
        reason: request.investigationReason,
        adminApproval: request.adminApproval,
        legalAuthorization: request.legalAuthorization,
        timestamp: new Date(),
      },
    });
    return auditLog.id;
  }
}

export const investigationService = new InvestigationService();
```

**Checklist Bước 1.1**:
- [x] Create adjudicator service directory structure
- [x] Implement ValidationService (issue tokens)
- [x] Implement InvestigationService (decrypt escrow)
- [ ] Generate Adjudicator keypair (Schnorr + ECIES)
- [x] Add Prisma models: `ValidationTokenAudit`, `InvestigationAudit`, `UsedNonce`, `BannedUser`
- [ ] Deploy adjudicator service (port 4000)
- [ ] Test with Postman

---

### Bước 1.2: Update Upload Flow (Mobile Client)

**File**: `mobile/src/services/UploadService.ts` (hoặc tương tự)

**Changes cần thêm**:

#### Phase A: Request ValidationToken từ Adjudicator
```typescript
interface ValidationToken {
  fileMetadataHash: string;
  userPublicKeyHash: string;
  issuedAt: number;
  expiresAt: number;
  signature: string;
  adjudicatorPublicKey: string;
}

async function requestValidationToken(params: {
  fileMetadata: {
    fileName: string;
    size: number;
    chunkCount: number;
  };
}): Promise<ValidationToken> {
  const publicKey = await getPublicKey();
  const timestamp = Date.now();
  const nonce = generateNonce();

  // 1. Compute file metadata hash
  const fileMetadataHash = sha256Hex(
    JSON.stringify({
      fileName: params.fileMetadata.fileName,
      size: params.fileMetadata.size,
      chunkCount: params.fileMetadata.chunkCount,
    })
  );

  // 2. Request ValidationToken from Adjudicator
  const response = await fetch(`${ADJUDICATOR_URL}/api/validate-upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userPublicKey: publicKey,
      fileMetadataHash,
      timestamp,
      nonce,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get ValidationToken');
  }

  const data = await response.json();
  return data.validationToken;
}
```

#### Phase B: Create EscrowedIdentity
```typescript
import * as eccrypto from 'eccrypto';

async function createEscrowedIdentity(
  userPublicKey: string,
  adjudicatorPublicKey: string
): Promise<string> {
  // ECIES encryption với Adjudicator's public key
  const publicKeyBuffer = Buffer.from(userPublicKey, 'hex');
  const adjudicatorKeyBuffer = Buffer.from(adjudicatorPublicKey, 'hex');

  const encrypted = await eccrypto.encrypt(
    adjudicatorKeyBuffer,
    publicKeyBuffer
  );

  // Serialize ECIES package
  const package = Buffer.concat([
    encrypted.iv,
    encrypted.ephemPublicKey,
    encrypted.ciphertext,
    encrypted.mac,
  ]);

  return package.toString('base64');
}
```

#### Phase C: Upload với Dual-Layer
```typescript
async function uploadFileWithHybridAdjudicator(params: {
  file: File;
  chunks: ChunkInfo[];
  masterKey: string;
  chunkKeys: Record<string, string>;
}): Promise<UploadResult> {
  const publicKey = await getPublicKey();
  const secretKey = await getSecretKey();
  const adjudicatorPublicKey = await getAdjudicatorPublicKey();

  // 1. Request ValidationToken (Layer 1)
  console.log('[Upload] Requesting ValidationToken from Adjudicator...');
  const validationToken = await requestValidationToken({
    fileMetadata: {
      fileName: params.file.name,
      size: params.file.size,
      chunkCount: params.chunks.length,
    },
  });

  // 2. Create EscrowedIdentity (Layer 2)
  console.log('[Upload] Creating EscrowedIdentity...');
  const escrowedIdentity = await createEscrowedIdentity(
    publicKey,
    adjudicatorPublicKey
  );

  // 3. Create Ring Signature (existing)
  const timestamp = Date.now();
  const nonce = generateNonce();
  const message = `upload:${validationToken.fileMetadataHash}:${timestamp}:${nonce}`;
  const ringSignature = await createRingSignature(message, secretKey);

  // 4. Create Schnorr Ownership Proof (existing)
  const ownershipProof = await createSchnorrProof(
    sha256Hex(message),
    secretKey
  );

  // 5. Upload to backend WITH ValidationToken + EscrowedIdentity
  const response = await fetch(`${API_URL}/api/files/upload-chunked`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: params.file.name,
      totalSize: params.file.size,
      chunkCount: params.chunks.length,
      chunks: params.chunks,

      // Layer 1: ValidationToken
      validationToken,

      // Layer 2: EscrowedIdentity
      escrowedIdentity,

      // Existing proofs
      ringSignature,
      ownershipProof,
      timestamp,
      nonce,
    }),
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}
```

**Checklist Bước 1.2**:
- [x] Add `requestValidationToken()` function
- [x] Add `createEscrowedIdentity()` function (ECIES)
- [x] Update upload flow to include ValidationToken + EscrowedIdentity
- [x] Handle ValidationToken errors (rate limit, banned user)
- [x] Add loading states in UI
- [ ] Test full upload flow

---

### Bước 1.3: Update Backend Upload Verification

**File**: `backend/src/routes/files.js`

**Changes**:

```javascript
router.post('/upload-chunked', async (req, res) => {
  const {
    fileName,
    totalSize,
    chunkCount,
    chunks,
    validationToken,
    escrowedIdentity,
    ringSignature,
    ownershipProof,
    timestamp,
    nonce,
  } = req.body;

  try {
    // ============================================================
    // Layer 1: Verify ValidationToken (Adjudicator signature)
    // ============================================================
    console.log('[Upload] Verifying ValidationToken...');

    // 1. Check token expiration
    if (Date.now() > validationToken.expiresAt) {
      return res.status(403).json({ error: 'ValidationToken expired' });
    }

    // 2. Verify file metadata hash
    const actualFileHash = sha256(JSON.stringify({ fileName, size: totalSize, chunkCount }));
    if (actualFileHash !== validationToken.fileMetadataHash) {
      return res.status(403).json({ error: 'File metadata hash mismatch' });
    }

    // 3. Verify Adjudicator's Schnorr signature
    const tokenMessage = `${validationToken.fileMetadataHash}:${validationToken.userPublicKeyHash}:${validationToken.issuedAt}:${validationToken.expiresAt}`;
    const isTokenValid = await verifySchnorrSignature(
      validationToken.signature,
      tokenMessage,
      validationToken.adjudicatorPublicKey
    );

    if (!isTokenValid) {
      return res.status(403).json({ error: 'Invalid ValidationToken signature' });
    }

    // 4. Verify nonce uniqueness (prevent double-spend)
    const nonceUsed = await redis.exists(`nonce_${nonce}`);
    if (nonceUsed) {
      return res.status(403).json({ error: 'Nonce already used' });
    }
    await redis.set(`nonce_${nonce}`, 'used', 'EX', 600); // 10 minutes

    console.log('[Upload] ValidationToken verified ✓');

    // ============================================================
    // Layer 2: Verify EscrowedIdentity format
    // ============================================================
    console.log('[Upload] Verifying EscrowedIdentity format...');

    // Parse ECIES package structure (không decrypt - chỉ verify format)
    const escrowBuffer = Buffer.from(escrowedIdentity, 'base64');
    if (escrowBuffer.length < 113) { // min ECIES package size
      return res.status(400).json({ error: 'Invalid EscrowedIdentity format' });
    }

    console.log('[Upload] EscrowedIdentity format valid ✓');

    // ============================================================
    // Existing verifications (Ring signature, Schnorr proof)
    // ============================================================
    // ... (existing code)

    // ============================================================
    // Store file with BOTH layers
    // ============================================================
    const file = await prisma.file.create({
      data: {
        fileName,
        totalSize,
        chunkCount,
        chunks: {
          create: chunks.map(chunk => ({
            chunkIndex: chunk.index,
            ipfsCid: chunk.cid,
            chunkHash: chunk.hash,
            size: chunk.size,
          })),
        },

        // Layer 1 metadata
        validationToken: {
          create: {
            fileMetadataHash: validationToken.fileMetadataHash,
            userPublicKeyHash: validationToken.userPublicKeyHash,
            issuedAt: new Date(validationToken.issuedAt),
            expiresAt: new Date(validationToken.expiresAt),
            signature: validationToken.signature,
            adjudicatorPublicKey: validationToken.adjudicatorPublicKey,
          },
        },

        // Layer 2 backup
        escrowedIdentity,

        // Existing fields
        ringSignature,
        ownershipPublicKey: ownershipProof.publicKey,
      },
    });

    // Log upload event
    await prisma.anonymousAuditLog.create({
      data: {
        eventType: 'FILE_UPLOADED',
        fileId: file.id,
        publicKeyHash: validationToken.userPublicKeyHash,
        metadata: JSON.stringify({
          validationTokenUsed: true,
          hasEscrowedIdentity: true,
        }),
      },
    });

    res.json({ success: true, fileId: file.id });
  } catch (error) {
    console.error('[Upload] Error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

**Checklist Bước 1.3**:
- [x] Add ValidationToken verification logic
- [x] Add EscrowedIdentity format validation
- [x] Add nonce tracking (database-backed)
- [x] Update Prisma schema: add `ValidationToken` relation
- [x] Test with valid/invalid ValidationToken (unit coverage in `ValidationTokenVerifier.test.ts`)
- [x] Test rejection scenarios (expired token, mismatch, signature tamper)

---

### Bước 1.4: Database Schema Updates

**File**: `backend/prisma/schema.prisma`

```prisma
// Add ValidationToken model
model ValidationToken {
  id                   String   @id @default(uuid())
  fileId               String   @unique
  file                 File     @relation(fields: [fileId], references: [id])

  fileMetadataHash     String
  userPublicKeyHash    String
  issuedAt             DateTime
  expiresAt            DateTime
  signature            String   // Adjudicator's Schnorr signature
  adjudicatorPublicKey String

  createdAt            DateTime @default(now())

  @@index([userPublicKeyHash])
  @@index([fileMetadataHash])
}

// Update File model
model File {
  id                   String            @id @default(uuid())
  fileName             String
  totalSize            BigInt
  chunkCount           Int

  // Layer 1: ValidationToken (relation)
  validationToken      ValidationToken?

  // Layer 2: EscrowedIdentity (backup)
  escrowedIdentity     String            // ECIES encrypted publicKey

  // Existing fields
  ringSignature        String
  ownershipPublicKey   String
  chunks               FileChunk[]
  createdAt            DateTime          @default(now())

  @@index([ownershipPublicKey])
}

// Add InvestigationAudit model
model InvestigationAudit {
  id                   String   @id @default(uuid())
  investigationId      String   @unique
  fileId               String
  reason               String
  adminApproval        String
  legalAuthorization   String
  decryptedPublicKey   String?  // Only filled after decryption
  timestamp            DateTime @default(now())

  @@index([fileId])
  @@index([decryptedPublicKey])
}

// Add ValidationTokenAudit (Adjudicator DB)
model ValidationTokenAudit {
  id                   String   @id @default(uuid())
  tokenId              String   @unique
  userPublicKey        String
  userPublicKeyHash    String
  fileMetadataHash     String
  issuedAt             DateTime
  expiresAt            DateTime
  signature            String
  createdAt            DateTime @default(now())

  @@index([userPublicKey])
  @@index([userPublicKeyHash])
}

// Add BannedUser model (Adjudicator DB)
model BannedUser {
  id                   String   @id @default(uuid())
  publicKey            String   @unique
  bannedAt             DateTime @default(now())
  reason               String
  bannedByAdmin        String

  @@index([publicKey])
}

// Add UsedNonce model (Adjudicator DB)
model UsedNonce {
  id                   String   @id @default(uuid())
  nonce                String   @unique
  usedAt               DateTime @default(now())

  @@index([nonce])
}
```

**Migration**:
```bash
cd backend
npx prisma migrate dev --name add-hybrid-adjudicator-model

cd adjudicator
npx prisma migrate dev --name init-adjudicator-db
```

**Checklist Bước 1.4**:
- [x] Update Prisma schema
- [x] Run migrations / db push
- [x] Verify tables created
- [ ] Seed Adjudicator keypair

---

## Phase 2: Investigation Flow Implementation

### Bước 2.1: Admin Investigation Interface (Backend)

**File**: `backend/src/routes/admin.js`

```javascript
router.post('/investigate', requireAdminAuth, async (req, res) => {
  const { fileId, reason, legalAuthorization } = req.body;
  const adminPublicKey = req.admin.publicKey; // from auth middleware

  try {
    // 1. Get file with escrowedIdentity
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        validationToken: true,
        chunks: true,
        revocations: true,
      },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // 2. Send investigation request to Adjudicator
    const adjudicatorResponse = await fetch(`${ADJUDICATOR_URL}/api/decrypt-escrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Authorization': req.headers.authorization,
      },
      body: JSON.stringify({
        fileId,
        escrowedIdentity: file.escrowedIdentity,
        investigationReason: reason,
        adminApproval: adminPublicKey,
        legalAuthorization,
      }),
    });

    if (!adjudicatorResponse.ok) {
      throw new Error('Adjudicator rejected investigation request');
    }

    const report = await adjudicatorResponse.json();

    // 3. Log investigation
    await prisma.investigationAudit.create({
      data: {
        investigationId: report.legalCompliance.investigationId,
        fileId,
        reason,
        adminApproval: adminPublicKey,
        legalAuthorization,
        decryptedPublicKey: report.decryptedIdentity.realPublicKey,
      },
    });

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('[Investigation] Error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

**Checklist Bước 2.1**:
- [ ] Create admin routes
- [ ] Add admin authentication middleware
- [ ] Implement investigation endpoint
- [ ] Test with test admin credentials

---

### Bước 2.2: Investigation UI (Admin Dashboard)

**File**: `admin-dashboard/src/pages/InvestigationPage.tsx` (React)

```typescript
function InvestigationPage() {
  const [fileId, setFileId] = useState('');
  const [reason, setReason] = useState('');
  const [legalAuth, setLegalAuth] = useState('');
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInvestigate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/investigate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          fileId,
          reason,
          legalAuthorization: legalAuth,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReport(data.report);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Investigation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="investigation-page">
      <h1>File Investigation</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleInvestigate(); }}>
        <input
          type="text"
          placeholder="File ID"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
        />
        <textarea
          placeholder="Investigation Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <input
          type="text"
          placeholder="Legal Authorization (e.g., Court Order #)"
          value={legalAuth}
          onChange={(e) => setLegalAuth(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Investigating...' : 'Start Investigation'}
        </button>
      </form>

      {report && (
        <div className="investigation-report">
          <h2>Investigation Report</h2>

          <section>
            <h3>Decrypted Identity</h3>
            <p><strong>Real Public Key:</strong> {report.decryptedIdentity.realPublicKey}</p>
            <p><strong>Public Key Hash:</strong> {report.decryptedIdentity.publicKeyHash}</p>
            <p><strong>Ownership Public Key:</strong> {report.decryptedIdentity.ownershipPublicKey}</p>
            <p><strong>Consistency Check:</strong> {report.decryptedIdentity.consistencyCheck ? '✅ Verified' : '⚠️ Mismatch'}</p>
          </section>

          <section>
            <h3>Activity Summary</h3>
            <p><strong>Files with Same Ownership Key:</strong> {report.activitySummary.filesWithSameOwnershipKey}</p>
            <p><strong>Total Revocations:</strong> {report.activitySummary.totalRevocations}</p>
            <p><strong>Avg Time Before Revoke:</strong> {report.activitySummary.avgTimeBeforeRevoke} hours</p>
          </section>

          <section>
            <h3>Red Flags</h3>
            <ul>
              {report.redFlags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Risk Assessment</h3>
            <p><strong>Overall Risk:</strong> <span className={`risk-${report.riskAssessment.overallRisk}`}>{report.riskAssessment.overallRisk}</span></p>
            <p><strong>Threat Type:</strong> {report.riskAssessment.threatType}</p>
            <p><strong>Confidence:</strong> {Math.round(report.riskAssessment.confidence * 100)}%</p>
            <p><strong>Reasoning:</strong> {report.riskAssessment.reasoning}</p>
          </section>

          <section>
            <h3>Recommended Actions</h3>
            <ul>
              {report.recommendedActions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Legal Compliance</h3>
            <p><strong>Investigation ID:</strong> {report.legalCompliance.investigationId}</p>
            <p><strong>Requested By:</strong> {report.legalCompliance.requestedBy}</p>
            <p><strong>Legal Authorization:</strong> {report.legalCompliance.legalAuthorization}</p>
            <p><strong>Decryption Timestamp:</strong> {new Date(report.legalCompliance.decryptionTimestamp).toLocaleString()}</p>
          </section>
        </div>
      )}
    </div>
  );
}
```

**Checklist Bước 2.2**:
- [ ] Create admin dashboard project (React/Next.js)
- [ ] Implement InvestigationPage UI
- [ ] Add admin authentication
- [ ] Display investigation reports
- [ ] Add action buttons (ban user, flag files)

---

## Timeline & Priorities

| Phase | Task | Effort | Priority | Deadline |
|-------|------|--------|----------|----------|
| 1.1 | Adjudicator Service | 2 days | **P0** | Week 1 |
| 1.2 | Update Upload Flow (Mobile) | 1.5 days | **P0** | Week 1 |
| 1.3 | Backend Upload Verification | 1 day | **P0** | Week 1 |
| 1.4 | Database Schema Updates | 0.5 day | **P0** | Week 1 |
| 2.1 | Admin Investigation API | 1 day | P1 | Week 2 |
| 2.2 | Investigation UI (Dashboard) | 1.5 days | P1 | Week 2 |
| Testing | E2E Investigation Flow | 1 day | P2 | Week 2 |
| Demo | Prepare Investigation Demo | 0.5 day | P3 | Week 2 |

**Total Effort**: ~9 days (~2 weeks)

---

## Success Criteria

### Technical
- [ ] Adjudicator service running (port 4000)
- [ ] ValidationToken issued correctly
- [ ] Upload requires valid ValidationToken
- [ ] EscrowedIdentity format validated
- [ ] Investigation successfully decrypts escrowedIdentity
- [ ] Cross-reference Layer 1 & Layer 2 works
- [ ] Behavioral analysis detects honeypot patterns

### Security
- [ ] ValidationToken signature cannot be forged
- [ ] EscrowedIdentity only decryptable by Adjudicator
- [ ] Nonce tracking prevents double-spend
- [ ] Investigation requires legal authorization
- [ ] Full audit trail maintained

### Demo
- [ ] Upload file với ValidationToken + EscrowedIdentity
- [ ] Show ValidationToken verification trong backend logs
- [ ] Trigger investigation từ admin dashboard
- [ ] Display comprehensive investigation report
- [ ] Show recommended actions (ban publicKey)

---

## Next Steps

### Immediate (This Week)
1. ✅ Review implementation plan với team
2. ⬜ Setup Adjudicator service project structure
3. ⬜ Generate Adjudicator keypairs (Schnorr + ECIES)
4. ⬜ Implement ValidationService
5. ⬜ Test ValidationToken issuance

### Week 2
1. Update upload flow (mobile + backend)
2. Implement InvestigationService
3. Build admin dashboard
4. E2E testing
5. Demo preparation

---

**Document Version**: 2.0
**Last Updated**: 2025-10-27
**Focus**: Investigation Flow với Hybrid Adjudicator Model
**Status**: Ready for Implementation
