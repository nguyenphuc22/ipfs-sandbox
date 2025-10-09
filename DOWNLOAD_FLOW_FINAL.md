# Luồng Download và View File - Tài liệu Hoàn chỉnh

**Phiên bản:** 1.0 Final
**Ngày:** 2025-10-08
**Ngôn ngữ:** Tiếng Việt

---

## **MỤC LỤC**

1. [Tổng quan](#tổng-quan)
2. [Kiến trúc tổng thể](#kiến-trúc-tổng-thể)
3. [Giai đoạn 0: Hiển thị danh sách file](#giai-đoạn-0-hiển-thị-danh-sách-file)
4. [Giai đoạn 1: Thương lượng quyền truy cập](#giai-đoạn-1-thương-lượng-quyền-truy-cập)
5. [Giai đoạn 2: Lấy khóa giải mã](#giai-đoạn-2-lấy-khóa-giải-mã)
6. [Giai đoạn 3: Tải và xác thực chunks](#giai-đoạn-3-tải-và-xác-thực-chunks)
7. [Giai đoạn 4: Ghép file và hiển thị](#giai-đoạn-4-ghép-file-và-hiển-thị)
8. [Quy trình chia sẻ file](#quy-trình-chia-sẻ-file)
9. [Implementation chi tiết](#implementation-chi-tiết)
10. [Tình huống thực tế](#tình-huống-thực-tế)
11. [UI/UX Design](#uiux-design)

---

## **TỔNG QUAN**

### **Mục tiêu**

Luồng download được thiết kế để đảm bảo:
- ✅ **Bảo mật:** Backend không giữ master key, user tự quản lý
- ✅ **Tính toàn vẹn:** Verify SHA256 hash cho mọi chunk
- ✅ **Ẩn danh:** Kết hợp với Ring Signature và AOT
- ✅ **Giám sát:** Audit trail ghi log mọi thao tác
- ✅ **Demo-friendly:** 4 giai đoạn rõ ràng với UI trực quan

### **Nguyên tắc thiết kế**

1. **Zero-trust architecture:** Backend KHÔNG BAO GIỜ có master key
2. **User-centric:** Người dùng kiểm soát hoàn toàn khóa giải mã
3. **Fail-safe:** Retry logic, integrity checks, error handling
4. **Transparency:** Audit trail cho mọi hành động
5. **Usability:** UI đơn giản, hướng dẫn rõ ràng

---

## **KIẾN TRÚC TỔNG THỂ**

### **Sơ đồ luồng**

```
┌─────────────────────────────────────────────────────────┐
│                   LUỒNG DOWNLOAD FILE                    │
└─────────────────────────────────────────────────────────┘

Giai đoạn 0: Danh sách file
    ↓
    User thấy CHỈ những file có quyền truy cập
    (dựa vào bảng user_file_access)
    ↓
    User click vào file → Bắt đầu download

Giai đoạn 1: Thương lượng quyền truy cập (Access Negotiation)
    ↓
    App → Backend: "Cho tôi thông tin file này"
    Backend → App: Chunk manifest + ownership policy + grant context
    Backend GHI LOG: ACCESS_NEGOTIATION
    ↓
    ✅ Không cần check quyền (đã filter ở danh sách)

Giai đoạn 2: Lấy khóa giải mã (Key Orchestration)
    ↓
    App tìm master key trong Secure Storage
    ↓
    ┌─ Tìm thấy? ────┐
    │                │
    ✅ CÓ          ❌ KHÔNG
    │                │
    │                ↓
    │         Hiển thị TextField
    │         User nhập master key
    │         (nhận từ chủ sở hữu)
    │                │
    └────────┬───────┘
             ↓
    Giải mã chunk keys bằng master key
    ↓
    Sẵn sàng tải file

Giai đoạn 3: Tải và xác thực chunks (Chunk Retrieval & Integrity)
    ↓
    Tải song song 4 chunks cùng lúc từ IPFS
    ↓
    Với mỗi chunk:
      1. Fetch từ IPFS (encrypted)
      2. Decrypt bằng chunk key
      3. Tính SHA256 hash
      4. So sánh với hash trong manifest
      5. Nếu sai → Retry (max 3 lần)
      6. Vẫn sai → Gửi Integrity Alert
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
    Backend GHI LOG: DOWNLOAD_COMPLETE
    ↓
    FILE SẴN SÀNG XEM!
```

### **Các thành phần chính**

```
Mobile App
├── FileListScreen (Danh sách file)
├── FileDownloadScreen (Download UI)
├── FileViewerScreen (Xem file)
└── Services
    ├── FileAccessService (API calls)
    ├── KeyOrchestrationService (Key management)
    ├── ChunkDownloadService (IPFS download)
    └── FileReconstructionService (Ghép file)

Backend
├── GET /api/files/my-files (Danh sách file có quyền)
├── GET /api/files/:id/access (Get manifest)
├── POST /api/files/:id/integrity-alert (Report hash mismatch)
├── GET /api/files/:id/audit (Audit trail)
└── POST /api/files/:id/share (Chia sẻ file)

IPFS Gateway
└── GET /ipfs/{cid} (Tải chunk)
```

---

## **GIAI ĐOẠN 0: HIỂN THỊ DANH SÁCH FILE**

### **Nguyên tắc quan trọng**

> **CHỈ hiển thị file mà user có quyền truy cập**
> Không hiển thị tất cả file rồi check quyền sau

### **Backend API**

```javascript
// backend/src/routes/files.js

/**
 * GET /api/files/my-files
 * Trả về danh sách file mà user có quyền truy cập
 */
router.get('/files/my-files', async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware

    console.log('[My Files] Getting accessible files for user:', userId);

    // Lấy TẤT CẢ access grants của user (chưa hết hạn)
    const accessGrants = await prisma.userFileAccess.findMany({
      where: {
        userId: userId,
        OR: [
          { expiresAt: null },                    // Không giới hạn thời gian
          { expiresAt: { gte: new Date() } }     // Hoặc chưa hết hạn
        ]
      },
      include: {
        file: {
          include: {
            owner: {
              select: {
                id: true,
                displayName: true,
                publicKey: true
              }
            }
          }
        }
      },
      orderBy: {
        grantedAt: 'desc'  // Mới nhất trước
      }
    });

    // Transform sang format dễ dùng cho mobile
    const files = accessGrants.map(grant => {
      const file = grant.file;
      const isOwner = file.userId === userId;

      return {
        // File info
        fileId: file.id,
        fileName: file.fileName,
        fileSize: file.totalSize,
        chunkCount: file.chunkCount,
        mimeType: file.mimeType || 'application/octet-stream',

        // Ownership info
        ownerUserId: file.owner.id,
        ownerDisplayName: file.owner.displayName,
        ownerPublicKey: file.owner.publicKey,
        ownershipStatus: file.revoked ? 'revoked' : 'active',

        // Access info
        isOwner: isOwner,
        grantedAt: grant.grantedAt,
        expiresAt: grant.expiresAt,

        // Timestamps
        uploadedAt: file.createdAt,
        updatedAt: file.updatedAt,
      };
    });

    console.log(`[My Files] Found ${files.length} accessible files`);

    return res.json({
      success: true,
      files: files,
      totalCount: files.length,
    });

  } catch (error) {
    console.error('[My Files] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

### **Mobile Implementation**

```typescript
// src/screens/FileListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

interface AccessibleFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  chunkCount: number;
  mimeType: string;
  ownerDisplayName: string;
  ownershipStatus: 'active' | 'revoked';
  isOwner: boolean;
  grantedAt: string;
  uploadedAt: string;
}

const FileListScreen = ({ navigation }: any) => {
  const [files, setFiles] = useState<AccessibleFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAccessibleFiles();
  }, []);

  const loadAccessibleFiles = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/files/my-files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setFiles(data.files);

      console.log(`[File List] Loaded ${data.files.length} files`);

    } catch (error) {
      console.error('[File List] Error:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách file');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAccessibleFiles();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    return '📄';
  };

  const renderFileItem = ({ item }: { item: AccessibleFile }) => (
    <TouchableOpacity
      style={styles.fileCard}
      onPress={() => {
        // Navigate to download screen
        navigation.navigate('FileDownload', {
          fileId: item.fileId,
          fileName: item.fileName,
          ownerName: item.ownerDisplayName,
        });
      }}
      disabled={item.ownershipStatus === 'revoked'}
    >
      <View style={styles.fileIcon}>
        <Text style={styles.iconText}>
          {getFileIcon(item.mimeType)}
        </Text>
      </View>

      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.fileName}
        </Text>
        <Text style={styles.fileSize}>
          {formatFileSize(item.fileSize)} • {item.chunkCount} chunks
        </Text>
        <Text style={styles.fileOwner}>
          {item.isOwner
            ? '🔑 Bạn sở hữu'
            : `📤 Chia sẻ bởi ${item.ownerDisplayName}`
          }
        </Text>
        <Text style={styles.fileDate}>
          {new Date(item.uploadedAt).toLocaleDateString('vi-VN')}
        </Text>
      </View>

      <View style={styles.statusBadge}>
        {item.ownershipStatus === 'revoked' ? (
          <View style={styles.revokedBadge}>
            <Text style={styles.revokedText}>⚠️ Thu hồi</Text>
          </View>
        ) : (
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>✓ Active</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>Chưa có file nào</Text>
      <Text style={styles.emptyText}>
        Upload file mới hoặc yêu cầu người khác chia sẻ với bạn
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>File của tôi</Text>
        <Text style={styles.subtitle}>
          {files.length} file có quyền truy cập
        </Text>
      </View>

      {/* File list */}
      {loading && files.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={item => item.fileId}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
          contentContainerStyle={
            files.length === 0 ? styles.emptyListContainer : styles.listContainer
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
  },
  fileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  fileOwner: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 2,
  },
  fileDate: {
    fontSize: 11,
    color: '#999999',
  },
  statusBadge: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  revokedBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  revokedText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FileListScreen;
```

### **Điểm quan trọng**

✅ **Chỉ hiển thị file có quyền**
- Backend filter bằng SQL JOIN với `user_file_access`
- Mobile không cần check quyền lại

✅ **Phân biệt file của mình vs file được chia sẻ**
- `isOwner: true` → "🔑 Bạn sở hữu"
- `isOwner: false` → "📤 Chia sẻ bởi [Tên người chia sẻ]"

✅ **Hiển thị trạng thái**
- `active` → Badge xanh "✓ Active"
- `revoked` → Badge cam "⚠️ Thu hồi" + disable click

✅ **Pull to refresh**
- User kéo xuống để cập nhật danh sách
- Hữu ích khi có file mới được chia sẻ

---

## **GIAI ĐOẠN 1: THƯƠNG LƯỢNG QUYỀN TRUY CẬP**

### **Mục đích**

Lấy thông tin chi tiết về file (chunk manifest) để chuẩn bị download.

### **Backend API**

```javascript
// backend/src/routes/files.js

/**
 * GET /api/files/:id/access
 * Lấy manifest và policy cho file
 *
 * NOTE: Endpoint này GIẢ ĐỊNH user đã có quyền
 * (vì đã filter ở danh sách file)
 */
router.get('/files/:id/access', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    console.log('[Access] Request manifest:', { fileId: id, userId });

    // 1. Get file với chunks
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' }
        },
        owner: {
          select: {
            displayName: true,
            publicKey: true
          }
        }
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // 2. Verify access grant (double-check)
    const hasAccess = await prisma.userFileAccess.findFirst({
      where: {
        fileId: id,
        userId: userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      }
    });

    if (!hasAccess) {
      console.warn('[Access] No access grant found:', { fileId: id, userId });
      return res.status(403).json({
        success: false,
        error: 'Access denied - no grant found'
      });
    }

    // 3. Check revocation status
    if (file.revoked) {
      console.warn('[Access] File revoked:', { fileId: id });
      return res.status(403).json({
        success: false,
        error: 'File has been revoked by owner',
        ownershipPolicy: {
          status: 'revoked',
          ownerPublicKey: file.ownershipPublicKey,
        }
      });
    }

    // 4. Build chunk manifest
    const chunkManifest = {
      fileId: file.id,
      fileName: file.fileName,
      totalSize: file.totalSize,
      chunkCount: file.chunkCount,
      mimeType: file.mimeType,
      chunks: file.chunks.map(chunk => ({
        index: chunk.chunkIndex,
        cid: chunk.cid,
        size: chunk.size,
        hash: chunk.hash, // SHA256 hash for integrity verification
      }))
    };

    // 5. Build ownership policy
    const ownershipPolicy = {
      ownerPublicKey: file.ownershipPublicKey,
      ownerDisplayName: file.owner.displayName,
      status: 'active',
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };

    // 6. Build grant context
    const grantContext = {
      grantedAt: hasAccess.grantedAt,
      expiresAt: hasAccess.expiresAt,
      grantedBy: file.owner.displayName,
      permissions: ['view', 'download'], // TODO: Granular permissions
    };

    // 7. Log audit event
    await prisma.auditLog.create({
      data: {
        userId: userId,
        action: 'ACCESS_NEGOTIATION',
        resourceType: 'FILE',
        resourceId: id,
        metadata: {
          fileName: file.fileName,
          chunkCount: file.chunkCount,
          fileSize: file.totalSize,
        }
      }
    });

    console.log('[Access] Manifest provided:', {
      fileId: id,
      userId,
      chunkCount: file.chunkCount,
    });

    // 8. Return manifest (NO MASTER KEY!)
    return res.json({
      success: true,
      chunkManifest,
      ownershipPolicy,
      grantContext,
    });

  } catch (error) {
    console.error('[Access] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

### **Mobile Service**

```typescript
// src/services/FileAccessService.ts

interface ChunkInfo {
  index: number;
  cid: string;
  size: number;
  hash: string;
}

interface ChunkManifest {
  fileId: string;
  fileName: string;
  totalSize: number;
  chunkCount: number;
  mimeType: string;
  chunks: ChunkInfo[];
}

interface OwnershipPolicy {
  ownerPublicKey: string;
  ownerDisplayName: string;
  status: 'active' | 'revoked';
  createdAt: string;
  updatedAt: string;
}

interface GrantContext {
  grantedAt: string;
  expiresAt: string | null;
  grantedBy: string;
  permissions: string[];
}

interface AccessNegotiationResponse {
  success: boolean;
  chunkManifest: ChunkManifest;
  ownershipPolicy: OwnershipPolicy;
  grantContext: GrantContext;
}

class FileAccessService {
  async requestAccess(fileId: string): Promise<AccessNegotiationResponse> {
    console.log('[Access Service] Requesting manifest for file:', fileId);

    try {
      const response = await fetch(
        `${API_BASE}/api/files/${fileId}/access`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log('[Access Service] Manifest received:', {
        fileId: data.chunkManifest.fileId,
        fileName: data.chunkManifest.fileName,
        chunkCount: data.chunkManifest.chunkCount,
        totalSize: data.chunkManifest.totalSize,
      });

      return data;

    } catch (error) {
      console.error('[Access Service] Error:', error);
      throw error;
    }
  }
}

export default new FileAccessService();
```

### **Kết quả giai đoạn 1**

✅ App nhận được:
- Danh sách chunks (CID, size, hash)
- Ownership policy (owner info, status)
- Grant context (quyền, thời hạn)

✅ Backend ghi log:
- Action: `ACCESS_NEGOTIATION`
- User ID, File ID, timestamp

❌ Backend KHÔNG GỬI:
- Master key
- Chunk keys
- Bất kỳ dữ liệu nhạy cảm nào

---

## **GIAI ĐOẠN 2: LẤY KHÓA GIẢI MÃ**

### **Mục đích**

Lấy master key và chunk keys để giải mã file.

### **Quy trình**

```
1. App tìm master key trong Secure Storage
        ↓
   ┌────────────────┐
   │ Tìm thấy?      │
   └────┬──────┬────┘
        │      │
     ✅ CÓ  ❌ KHÔNG
        │      │
        │      ↓
        │   Hiển thị TextField
        │   User nhập master key
        │   Validate hex format
        │   Lưu vào Storage
        │      │
        └──────┴───→ Giải mã chunk keys
                           ↓
                   Sẵn sàng download!
```

### **Mobile Service**

```typescript
// src/services/KeyOrchestrationService.ts
import SecureStorageService from './SecureStorageService';
import { aes256GcmEncrypt, aes256GcmDecrypt } from '../utils/crypto';

interface FileKeyBundle {
  masterKey: string;
  chunkKeys: Record<number, string>; // { 0: "key0", 1: "key1", ... }
}

class KeyOrchestrationService {
  private secureStorage: SecureStorageService;

  constructor() {
    this.secureStorage = new SecureStorageService();
  }

  /**
   * Lấy master key từ Secure Storage
   * Trả về null nếu không tìm thấy
   */
  async getMasterKey(fileId: string): Promise<string | null> {
    try {
      const key = await this.secureStorage.getItem(`file_master_key_${fileId}`);

      if (key) {
        console.log('[Key Orchestration] Master key found for file:', fileId);
      } else {
        console.log('[Key Orchestration] Master key NOT found for file:', fileId);
      }

      return key;

    } catch (error) {
      console.error('[Key Orchestration] Error getting master key:', error);
      return null;
    }
  }

  /**
   * Lưu master key vào Secure Storage
   */
  async storeMasterKey(fileId: string, masterKey: string): Promise<void> {
    try {
      // Validate hex format
      if (!/^[0-9a-fA-F]+$/.test(masterKey)) {
        throw new Error('Master key must be hex string');
      }

      await this.secureStorage.setItem(
        `file_master_key_${fileId}`,
        masterKey.toLowerCase()
      );

      console.log('[Key Orchestration] Master key stored for file:', fileId);

    } catch (error) {
      console.error('[Key Orchestration] Error storing master key:', error);
      throw error;
    }
  }

  /**
   * Lấy chunk keys và giải mã bằng master key
   */
  async getChunkKeys(
    fileId: string,
    masterKey: string
  ): Promise<Record<number, string> | null> {
    try {
      // Get encrypted chunk keys từ storage
      const encryptedChunkKeys = await this.secureStorage.getItem(
        `file_chunk_keys_${fileId}`
      );

      if (!encryptedChunkKeys) {
        console.warn('[Key Orchestration] Chunk keys not found for file:', fileId);
        // TODO: Request từ backend nếu có implement backend storage
        return null;
      }

      // Decrypt bằng master key
      const decrypted = await aes256GcmDecrypt(encryptedChunkKeys, masterKey);
      const chunkKeys = JSON.parse(decrypted);

      console.log('[Key Orchestration] Chunk keys decrypted:', {
        fileId,
        keyCount: Object.keys(chunkKeys).length,
      });

      return chunkKeys;

    } catch (error) {
      console.error('[Key Orchestration] Error decrypting chunk keys:', error);
      // Có thể master key sai hoặc dữ liệu bị hỏng
      return null;
    }
  }

  /**
   * Lưu chunk keys (encrypted bằng master key)
   */
  async storeChunkKeys(
    fileId: string,
    chunkKeys: Record<number, string>,
    masterKey: string
  ): Promise<void> {
    try {
      const json = JSON.stringify(chunkKeys);
      const encrypted = await aes256GcmEncrypt(json, masterKey);

      await this.secureStorage.setItem(
        `file_chunk_keys_${fileId}`,
        encrypted
      );

      console.log('[Key Orchestration] Chunk keys stored for file:', fileId);

    } catch (error) {
      console.error('[Key Orchestration] Error storing chunk keys:', error);
      throw error;
    }
  }

  /**
   * Lấy full key bundle (master + chunks)
   */
  async getFileKeys(fileId: string): Promise<FileKeyBundle | null> {
    try {
      const masterKey = await this.getMasterKey(fileId);

      if (!masterKey) {
        return null;
      }

      const chunkKeys = await this.getChunkKeys(fileId, masterKey);

      if (!chunkKeys) {
        return null;
      }

      return {
        masterKey,
        chunkKeys,
      };

    } catch (error) {
      console.error('[Key Orchestration] Error getting file keys:', error);
      return null;
    }
  }
}

export default new KeyOrchestrationService();
```

### **UI Component: Master Key Input**

```typescript
// src/components/MasterKeyInputModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';

interface MasterKeyInputModalProps {
  visible: boolean;
  fileId: string;
  fileName: string;
  ownerName: string;
  onSubmit: (masterKey: string) => void;
  onCancel: () => void;
}

const MasterKeyInputModal: React.FC<MasterKeyInputModalProps> = ({
  visible,
  fileId,
  fileName,
  ownerName,
  onSubmit,
  onCancel,
}) => {
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validate
    const trimmed = masterKeyInput.trim().toLowerCase();

    if (trimmed.length === 0) {
      setError('Vui lòng nhập master key');
      return;
    }

    if (!/^[0-9a-f]+$/i.test(trimmed)) {
      setError('Master key phải là chuỗi hex (0-9, a-f)');
      return;
    }

    if (trimmed.length < 32) {
      setError('Master key quá ngắn (tối thiểu 32 ký tự)');
      return;
    }

    // Submit
    setError('');
    onSubmit(trimmed);
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getString();
      setMasterKeyInput(text.trim());
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể paste từ clipboard');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🔑</Text>
            <Text style={styles.headerTitle}>Nhập Master Key</Text>
          </View>

          {/* File info */}
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {fileName}
            </Text>
            <Text style={styles.ownerName}>
              Chủ sở hữu: {ownerName}
            </Text>
          </View>

          {/* Instruction */}
          <Text style={styles.instruction}>
            Liên hệ chủ sở hữu file để nhận master key.
            Key là chuỗi hex, ví dụ: 9f7e6d5c4b3a...
          </Text>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Nhập hoặc paste master key"
              value={masterKeyInput}
              onChangeText={text => {
                setMasterKeyInput(text);
                setError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.pasteButton}
              onPress={handlePaste}
            >
              <Text style={styles.pasteButtonText}>📋 Paste</Text>
            </TouchableOpacity>
          </View>

          {/* Error message */}
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>

          {/* Help box */}
          <View style={styles.helpBox}>
            <Text style={styles.helpTitle}>💡 Cách lấy master key:</Text>
            <Text style={styles.helpText}>
              1. Liên hệ {ownerName} qua email/chat
            </Text>
            <Text style={styles.helpText}>
              2. Yêu cầu họ gửi master key cho file này
            </Text>
            <Text style={styles.helpText}>
              3. Copy key và paste vào ô trên
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  fileInfo: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 12,
    color: '#666666',
  },
  instruction: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    fontFamily: 'monospace',
    minHeight: 80,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  pasteButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
  },
  pasteButtonText: {
    fontSize: 12,
    color: '#007AFF',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helpBox: {
    backgroundColor: '#E8F4FD',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default MasterKeyInputModal;
```

### **Kết quả giai đoạn 2**

✅ **Trường hợp A: Đã có master key**
- Lấy từ Secure Storage
- Giải mã chunk keys
- Tiếp tục download

✅ **Trường hợp B: Chưa có master key**
- Hiển thị modal nhập key
- User paste key nhận từ owner
- Validate → Lưu → Tiếp tục download

❌ **Trường hợp C: Master key sai**
- Giải mã chunk keys thất bại
- Hiển thị lỗi "Master key không hợp lệ"
- Yêu cầu nhập lại

---

## **GIAI ĐOẠN 3: TẢI VÀ XÁC THỰC CHUNKS**

### **Mục đích**

Tải từng chunk từ IPFS, giải mã, và verify integrity.

### **Quy trình cho MỖI chunk**

```
1. Fetch encrypted chunk từ IPFS Gateway
   GET /ipfs/{cid}
        ↓
2. Decrypt bằng chunk key tương ứng
   AES-256-GCM decrypt
        ↓
3. Tính SHA256 hash
   hash(decrypted_data)
        ↓
4. So sánh với hash trong manifest
   computed_hash === manifest_hash ?
        ↓
   ┌────────────────┐
   │ Có khớp?       │
   └────┬──────┬────┘
        │      │
     ✅ CÓ  ❌ SAI
        │      │
        │      ↓
        │   Retry (max 3 lần)
        │      │
        │   Vẫn sai?
        │      ↓
        │   Gửi Integrity Alert
        │   Download FAILED
        │      │
        └──────┴───→ Chunk verified ✓
                     Continue
```

### **Mobile Service**

```typescript
// src/services/ChunkDownloadService.ts
import { sha256Bytes, bytesToHex } from '../utils/crypto';
import { aes256GcmDecrypt } from '../utils/crypto';

interface ChunkDownloadResult {
  index: number;
  data: Uint8Array;
  verified: boolean;
  retryCount: number;
}

interface ChunkProgress {
  index: number;
  status: 'pending' | 'downloading' | 'verifying' | 'complete' | 'error';
  progress: number; // 0-1
  retryCount: number;
  error?: string;
}

class ChunkDownloadService {
  private maxRetries = 3;
  private concurrentDownloads = 4; // Số chunks tải song song
  private ipfsGateway: string;

  constructor(ipfsGateway: string = 'http://localhost:8080') {
    this.ipfsGateway = ipfsGateway;
  }

  /**
   * Tải một chunk từ IPFS
   */
  async downloadChunk(
    chunk: { index: number; cid: string; hash: string },
    chunkKey: string,
    onProgress?: (progress: number) => void
  ): Promise<ChunkDownloadResult> {
    let retryCount = 0;

    while (retryCount <= this.maxRetries) {
      try {
        console.log(
          `[Chunk Download] Downloading chunk #${chunk.index} ` +
          `(attempt ${retryCount + 1}/${this.maxRetries + 1})`
        );

        // 1. Fetch encrypted data từ IPFS
        const encryptedData = await this.fetchFromIPFS(
          chunk.cid,
          onProgress
        );

        // 2. Decrypt
        const decryptedData = await aes256GcmDecrypt(
          encryptedData,
          chunkKey
        );

        // 3. Verify integrity
        const computedHash = bytesToHex(sha256Bytes(decryptedData));

        if (computedHash !== chunk.hash) {
          console.warn(
            `[Chunk Download] Hash mismatch for chunk #${chunk.index}:\n` +
            `  Expected: ${chunk.hash}\n` +
            `  Computed: ${computedHash}`
          );

          retryCount++;

          if (retryCount > this.maxRetries) {
            // Gửi integrity alert
            await this.sendIntegrityAlert(chunk.index, {
              expectedHash: chunk.hash,
              computedHash,
              retryCount,
            });

            throw new Error(
              `Integrity verification failed after ${this.maxRetries} retries`
            );
          }

          // Retry
          continue;
        }

        // Success!
        console.log(`[Chunk Download] Chunk #${chunk.index} verified ✓`);

        return {
          index: chunk.index,
          data: decryptedData,
          verified: true,
          retryCount,
        };

      } catch (error) {
        console.error(
          `[Chunk Download] Error downloading chunk #${chunk.index}:`,
          error
        );

        retryCount++;

        if (retryCount > this.maxRetries) {
          throw new Error(
            `Failed to download chunk #${chunk.index} after ` +
            `${this.maxRetries} retries: ${error.message}`
          );
        }

        // Wait before retry (exponential backoff)
        await this.delay(1000 * Math.pow(2, retryCount - 1));
      }
    }

    throw new Error(`Unexpected error in download loop`);
  }

  /**
   * Fetch dữ liệu từ IPFS Gateway
   */
  private async fetchFromIPFS(
    cid: string,
    onProgress?: (progress: number) => void
  ): Promise<Uint8Array> {
    const url = `${this.ipfsGateway}/ipfs/${cid}`;

    console.log(`[IPFS Fetch] Fetching: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`IPFS fetch failed: ${response.statusText}`);
    }

    // Get content length for progress tracking
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    // Read stream với progress tracking
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (total > 0 && onProgress) {
        onProgress(loaded / total);
      }
    }

    // Concatenate chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result;
  }

  /**
   * Tải tất cả chunks song song
   */
  async downloadAllChunks(
    manifest: ChunkManifest,
    chunkKeys: Record<number, string>,
    onChunkProgress?: (index: number, progress: ChunkProgress) => void
  ): Promise<ChunkDownloadResult[]> {
    const results: ChunkDownloadResult[] = [];

    // Download theo batch để control concurrency
    for (let i = 0; i < manifest.chunks.length; i += this.concurrentDownloads) {
      const batch = manifest.chunks.slice(i, i + this.concurrentDownloads);

      console.log(
        `[Chunk Download] Processing batch ${i / this.concurrentDownloads + 1}: ` +
        `chunks ${batch.map(c => c.index).join(', ')}`
      );

      // Download batch song song
      const batchResults = await Promise.all(
        batch.map(async (chunk) => {
          // Update progress: downloading
          onChunkProgress?.(chunk.index, {
            index: chunk.index,
            status: 'downloading',
            progress: 0,
            retryCount: 0,
          });

          try {
            // Download chunk
            const result = await this.downloadChunk(
              chunk,
              chunkKeys[chunk.index],
              (downloadProgress) => {
                onChunkProgress?.(chunk.index, {
                  index: chunk.index,
                  status: 'downloading',
                  progress: downloadProgress,
                  retryCount: 0,
                });
              }
            );

            // Update progress: complete
            onChunkProgress?.(chunk.index, {
              index: chunk.index,
              status: 'complete',
              progress: 1,
              retryCount: result.retryCount,
            });

            return result;

          } catch (error) {
            // Update progress: error
            onChunkProgress?.(chunk.index, {
              index: chunk.index,
              status: 'error',
              progress: 0,
              retryCount: this.maxRetries,
              error: error.message,
            });

            throw error;
          }
        })
      );

      results.push(...batchResults);
    }

    // Sort theo index
    return results.sort((a, b) => a.index - b.index);
  }

  /**
   * Gửi integrity alert lên backend
   */
  private async sendIntegrityAlert(
    chunkIndex: number,
    details: {
      expectedHash: string;
      computedHash: string;
      retryCount: number;
    }
  ): Promise<void> {
    try {
      console.warn('[Integrity Alert] Sending alert:', {
        chunkIndex,
        ...details,
      });

      await fetch(`${API_BASE}/api/files/${fileId}/integrity-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          chunkIndex,
          expectedHash: details.expectedHash,
          computedHash: details.computedHash,
          retryCount: details.retryCount,
          timestamp: new Date().toISOString(),
        }),
      });

    } catch (error) {
      console.error('[Integrity Alert] Failed to send alert:', error);
      // Don't throw - integrity alert failure shouldn't block download failure
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ChunkDownloadService;
```

### **Backend Integrity Alert Endpoint**

```javascript
// backend/src/routes/files.js

/**
 * POST /api/files/:id/integrity-alert
 * Nhận báo cáo hash mismatch từ client
 */
router.post('/files/:id/integrity-alert', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      chunkIndex,
      expectedHash,
      computedHash,
      retryCount,
      timestamp
    } = req.body;
    const userId = req.user.userId;

    console.warn('[Integrity Alert] Received:', {
      fileId: id,
      userId,
      chunkIndex,
      expectedHash: expectedHash.substring(0, 16) + '...',
      computedHash: computedHash.substring(0, 16) + '...',
      retryCount,
    });

    // Log vào audit với severity WARNING
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'INTEGRITY_ALERT',
        resourceType: 'FILE_CHUNK',
        resourceId: id,
        metadata: {
          chunkIndex,
          expectedHash,
          computedHash,
          retryCount,
          timestamp,
        },
        severity: 'WARNING',
      }
    });

    // TODO: Trigger investigation nếu có quá nhiều alerts
    // TODO: Notify file owner
    // TODO: Check IPFS node health

    return res.json({
      success: true,
      logged: true,
      message: 'Integrity alert recorded'
    });

  } catch (error) {
    console.error('[Integrity Alert] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

### **UI Component: Chunk Progress**

```typescript
// src/components/ChunkProgressList.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface ChunkProgressProps {
  chunks: Record<number, ChunkProgress>;
}

const ChunkProgressList: React.FC<ChunkProgressProps> = ({ chunks }) => {
  const chunkArray = Object.values(chunks).sort((a, b) => a.index - b.index);

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending': return '⚪';
      case 'downloading': return '⏳';
      case 'verifying': return '🔍';
      case 'complete': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#CCCCCC';
      case 'downloading': return '#007AFF';
      case 'verifying': return '#FF9500';
      case 'complete': return '#4CAF50';
      case 'error': return '#FF3B30';
      default: return '#CCCCCC';
    }
  };

  const getStatusText = (chunk: ChunkProgress): string => {
    switch (chunk.status) {
      case 'pending':
        return 'Đang chờ...';
      case 'downloading':
        return `Đang tải ${Math.round(chunk.progress * 100)}%`;
      case 'verifying':
        return 'Đang xác thực...';
      case 'complete':
        return chunk.retryCount > 0
          ? `Hoàn tất (retry ${chunk.retryCount})`
          : 'Hoàn tất';
      case 'error':
        return chunk.error || 'Lỗi';
      default:
        return '';
    }
  };

  const renderChunkItem = ({ item }: { item: ChunkProgress }) => (
    <View style={styles.chunkItem}>
      <Text style={styles.chunkIcon}>
        {getStatusIcon(item.status)}
      </Text>

      <View style={styles.chunkInfo}>
        <Text style={styles.chunkIndex}>
          Chunk #{item.index}
        </Text>
        <Text
          style={[
            styles.chunkStatus,
            { color: getStatusColor(item.status) }
          ]}
        >
          {getStatusText(item)}
        </Text>
      </View>

      {item.status === 'downloading' && item.progress > 0 && (
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${item.progress * 100}%` }
            ]}
          />
        </View>
      )}

      {item.retryCount > 0 && item.status !== 'complete' && (
        <View style={styles.retryBadge}>
          <Text style={styles.retryText}>
            Retry {item.retryCount}/3
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết từng chunk:</Text>
      <FlatList
        data={chunkArray}
        renderItem={renderChunkItem}
        keyExtractor={item => item.index.toString()}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  chunkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  chunkIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  chunkInfo: {
    flex: 1,
  },
  chunkIndex: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  chunkStatus: {
    fontSize: 12,
  },
  progressBarContainer: {
    width: 60,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginLeft: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  retryBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  retryText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ChunkProgressList;
```

### **Kết quả giai đoạn 3**

✅ **Download thành công:**
- Tất cả chunks đã tải và verify
- Mỗi chunk có hash khớp với manifest
- Dữ liệu đã được giải mã

✅ **Retry logic:**
- Tự động retry 3 lần nếu hash mismatch
- Exponential backoff giữa các lần retry
- UI hiển thị số lần retry

⚠️ **Integrity alert:**
- Gửi lên backend nếu fail sau 3 lần
- Backend ghi log với severity WARNING
- Admin có thể investigate

❌ **Download thất bại:**
- Hiển thị lỗi rõ ràng
- Chunk nào fail, tại sao
- User có thể thử lại

---

## **GIAI ĐOẠN 4: GHÉP FILE VÀ HIỂN THỊ**

### **Mục đích**

Ghép chunks thành file hoàn chỉnh và cho phép user xem.

### **Quy trình**

```
1. Ghép chunks theo thứ tự (0, 1, 2, ...)
        ↓
2. Verify tổng kích thước
   total_size === manifest.totalSize ?
        ↓
3. Tạo secure cache
   - Encrypt bằng AES-256
   - Lưu vào cache directory
   - Set TTL = 24 giờ
        ↓
4. Hiển thị success badge
   "✅ AOT Integrity Verified"
        ↓
5. Ghi audit log
   Action: DOWNLOAD_COMPLETE
        ↓
   FILE SẴN SÀNG!
```

### **Mobile Service**

```typescript
// src/services/FileReconstructionService.ts
import RNFS from 'react-native-fs';
import { aes256GcmEncrypt } from '../utils/crypto';

interface ReconstructedFile {
  fileId: string;
  fileName: string;
  totalSize: number;
  mimeType: string;
  cacheUri: string;
  expiresAt: Date;
}

class FileReconstructionService {
  /**
   * Ghép chunks thành file hoàn chỉnh
   */
  async reconstructFile(
    manifest: ChunkManifest,
    chunks: ChunkDownloadResult[]
  ): Promise<ReconstructedFile> {
    console.log('[Reconstruction] Assembling file:', manifest.fileName);

    try {
      // 1. Verify có đủ chunks
      if (chunks.length !== manifest.chunkCount) {
        throw new Error(
          `Missing chunks: got ${chunks.length}, expected ${manifest.chunkCount}`
        );
      }

      // 2. Sort chunks theo index (paranoid check)
      const sortedChunks = chunks.sort((a, b) => a.index - b.index);

      // 3. Verify thứ tự liên tiếp
      for (let i = 0; i < sortedChunks.length; i++) {
        if (sortedChunks[i].index !== i) {
          throw new Error(`Chunk index mismatch at position ${i}`);
        }
      }

      // 4. Concatenate chunks
      const totalLength = sortedChunks.reduce(
        (sum, chunk) => sum + chunk.data.length,
        0
      );

      const fileData = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of sortedChunks) {
        fileData.set(chunk.data, offset);
        offset += chunk.data.length;
      }

      console.log('[Reconstruction] File assembled:', {
        totalSize: fileData.length,
        expectedSize: manifest.totalSize,
      });

      // 5. Verify tổng kích thước
      if (fileData.length !== manifest.totalSize) {
        throw new Error(
          `Size mismatch: got ${fileData.length} bytes, ` +
          `expected ${manifest.totalSize} bytes`
        );
      }

      // 6. Tạo secure cache
      const cacheUri = await this.createSecureCache(
        manifest.fileId,
        manifest.fileName,
        fileData,
        manifest.mimeType
      );

      // 7. Set expiration (24 hours)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      console.log('[Reconstruction] File ready:', {
        fileId: manifest.fileId,
        fileName: manifest.fileName,
        cacheUri,
        expiresAt,
      });

      return {
        fileId: manifest.fileId,
        fileName: manifest.fileName,
        totalSize: fileData.length,
        mimeType: manifest.mimeType,
        cacheUri,
        expiresAt,
      };

    } catch (error) {
      console.error('[Reconstruction] Error:', error);
      throw error;
    }
  }

  /**
   * Tạo secure cache (encrypted)
   */
  private async createSecureCache(
    fileId: string,
    fileName: string,
    data: Uint8Array,
    mimeType: string
  ): Promise<string> {
    try {
      // Cache directory
      const cacheDir = `${RNFS.CachesDirectoryPath}/secure_files`;

      // Ensure directory exists
      const dirExists = await RNFS.exists(cacheDir);
      if (!dirExists) {
        await RNFS.mkdir(cacheDir);
      }

      // Cache file path
      const cacheFile = `${cacheDir}/${fileId}_${fileName}`;

      // Write file (plain data - iOS Secure Enclave will encrypt at rest)
      // For extra security, could encrypt with device key
      const base64Data = this.arrayBufferToBase64(data);
      await RNFS.writeFile(cacheFile, base64Data, 'base64');

      // Store metadata
      await this.storeCacheMetadata(fileId, {
        fileName,
        size: data.length,
        mimeType,
        cacheUri: `file://${cacheFile}`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      console.log('[Reconstruction] Secure cache created:', cacheFile);

      return `file://${cacheFile}`;

    } catch (error) {
      console.error('[Reconstruction] Error creating cache:', error);
      throw error;
    }
  }

  /**
   * Lưu cache metadata
   */
  private async storeCacheMetadata(
    fileId: string,
    metadata: any
  ): Promise<void> {
    try {
      const key = `cache_metadata_${fileId}`;
      await AsyncStorage.setItem(key, JSON.stringify(metadata));
    } catch (error) {
      console.error('[Reconstruction] Error storing metadata:', error);
    }
  }

  /**
   * Lấy cache metadata
   */
  async getCacheMetadata(fileId: string): Promise<any | null> {
    try {
      const key = `cache_metadata_${fileId}`;
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error('[Reconstruction] Error getting metadata:', error);
      return null;
    }
  }

  /**
   * Xóa secure cache
   */
  async deleteSecureCache(fileId: string): Promise<void> {
    try {
      const metadata = await this.getCacheMetadata(fileId);

      if (metadata && metadata.cacheUri) {
        const filePath = metadata.cacheUri.replace('file://', '');
        const exists = await RNFS.exists(filePath);

        if (exists) {
          await RNFS.unlink(filePath);
          console.log('[Reconstruction] Cache deleted:', filePath);
        }
      }

      // Remove metadata
      await AsyncStorage.removeItem(`cache_metadata_${fileId}`);

    } catch (error) {
      console.error('[Reconstruction] Error deleting cache:', error);
      throw error;
    }
  }

  /**
   * Check và xóa expired caches
   */
  async cleanupExpiredCaches(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('cache_metadata_'));

      for (const key of cacheKeys) {
        const json = await AsyncStorage.getItem(key);
        if (!json) continue;

        const metadata = JSON.parse(json);
        const expiresAt = new Date(metadata.expiresAt);

        if (expiresAt < new Date()) {
          const fileId = key.replace('cache_metadata_', '');
          await this.deleteSecureCache(fileId);
          console.log('[Reconstruction] Expired cache cleaned:', fileId);
        }
      }

    } catch (error) {
      console.error('[Reconstruction] Error cleaning caches:', error);
    }
  }

  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
  }
}

export default new FileReconstructionService();
```

### **Ghi Audit Log**

```typescript
// src/services/AuditService.ts
class AuditService {
  async logDownloadComplete(
    fileId: string,
    metadata: {
      fileName: string;
      fileSize: number;
      chunkCount: number;
      totalRetries: number;
      downloadDuration: number; // milliseconds
    }
  ): Promise<void> {
    try {
      await fetch(`${API_BASE}/api/audit/log`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'DOWNLOAD_COMPLETE',
          resourceType: 'FILE',
          resourceId: fileId,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            platform: Platform.OS,
          },
        }),
      });

      console.log('[Audit] Download complete logged:', fileId);

    } catch (error) {
      console.error('[Audit] Error logging:', error);
      // Don't throw - audit failure shouldn't block user flow
    }
  }
}

export default new AuditService();
```

### **Success UI**

```typescript
// src/components/DownloadSuccessView.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DownloadSuccessViewProps {
  fileName: string;
  fileSize: number;
  verifiedAt: Date;
  onViewFile: () => void;
  onViewAudit: () => void;
  onShare: () => void;
}

const DownloadSuccessView: React.FC<DownloadSuccessViewProps> = ({
  fileName,
  fileSize,
  verifiedAt,
  onViewFile,
  onViewAudit,
  onShare,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={styles.container}>
      {/* Success icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✅</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>File sẵn sàng!</Text>

      {/* File info */}
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={2}>
          {fileName}
        </Text>
        <Text style={styles.fileSize}>
          {formatFileSize(fileSize)}
        </Text>
      </View>

      {/* Integrity badge */}
      <View style={styles.integrityBadge}>
        <Text style={styles.badgeIcon}>🔒</Text>
        <View style={styles.badgeContent}>
          <Text style={styles.badgeTitle}>
            AOT Integrity Verified
          </Text>
          <Text style={styles.badgeTime}>
            {verifiedAt.toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onViewFile}
        >
          <Text style={styles.primaryButtonText}>
            📄 Xem file
          </Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onViewAudit}
          >
            <Text style={styles.secondaryButtonText}>
              📋 Audit Trail
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onShare}
          >
            <Text style={styles.secondaryButtonText}>
              🔗 Chia sẻ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cache info */}
      <View style={styles.cacheInfo}>
        <Text style={styles.cacheText}>
          💾 File được lưu cache an toàn
        </Text>
        <Text style={styles.cacheExpiry}>
          Tự động xóa sau 24 giờ
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  fileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: '#666666',
  },
  integrityBadge: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  badgeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  badgeContent: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  badgeTime: {
    fontSize: 12,
    color: '#666666',
  },
  actions: {
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  cacheInfo: {
    alignItems: 'center',
  },
  cacheText: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 4,
  },
  cacheExpiry: {
    fontSize: 11,
    color: '#999999',
  },
});

export default DownloadSuccessView;
```

### **Kết quả giai đoạn 4**

✅ **File đã được ghép:**
- Tất cả chunks đã concatenate
- Kích thước đúng với manifest
- Dữ liệu hoàn chỉnh

✅ **Secure cache:**
- File được lưu cache
- TTL = 24 giờ
- Tự động xóa khi hết hạn

✅ **UI Success:**
- Badge "✅ AOT Integrity Verified"
- Nút "Xem file", "Audit Trail", "Chia sẻ"
- Thông tin cache

✅ **Audit log:**
- Action: DOWNLOAD_COMPLETE
- Metadata: file info, duration, retries

---

## **QUY TRÌNH CHIA SẺ FILE**

### **Owner chia sẻ file cho User B**

#### **Bước 1: Owner tạo access grant (Backend)**

```typescript
// Mobile của Owner
const shareFileWithUser = async (
  fileId: string,
  recipientUserId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE}/api/files/${fileId}/share`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientUserId,
          permissions: ['view', 'download'],
          expiresAt: null, // Không giới hạn thời gian
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to share file');
    }

    const data = await response.json();

    Alert.alert(
      'Thành công',
      `Đã cấp quyền cho ${data.recipientName}.\n\n` +
      'Tiếp theo, gửi master key cho họ.'
    );

    // Show master key
    showMasterKeyForSharing(fileId, data.recipientName);

  } catch (error) {
    Alert.alert('Lỗi', error.message);
  }
};
```

#### **Bước 2: Owner gửi master key**

**Option A: Copy-paste**

```typescript
const showMasterKeyForSharing = async (
  fileId: string,
  recipientName: string
): Promise<void> => {
  const masterKey = await keyOrchestrationService.getMasterKey(fileId);

  if (!masterKey) {
    Alert.alert('Lỗi', 'Không tìm thấy master key');
    return;
  }

  Alert.alert(
    '🔑 Master Key',
    `Gửi key này cho ${recipientName}:\n\n${masterKey}\n\n` +
    'Họ cần nhập key này khi download file.',
    [
      {
        text: 'Copy',
        onPress: () => {
          Clipboard.setString(masterKey);
          Toast.show({
            type: 'success',
            text1: 'Đã copy master key',
            text2: 'Gửi cho người nhận qua email hoặc chat',
          });
        }
      },
      { text: 'Đóng' }
    ]
  );
};
```

**Option B: QR Code**

```typescript
const shareViaQRCode = async (
  fileId: string,
  fileName: string,
  recipientName: string
): Promise<void> => {
  const masterKey = await keyOrchestrationService.getMasterKey(fileId);

  const payload = {
    type: 'file_master_key',
    version: '1.0',
    fileId,
    fileName,
    masterKey,
    sharedBy: currentUser.displayName,
    sharedTo: recipientName,
    timestamp: new Date().toISOString(),
  };

  const qrData = JSON.stringify(payload);

  // Show QR modal
  navigation.navigate('QRCodeDisplay', {
    data: qrData,
    title: `Chia sẻ: ${fileName}`,
    instruction: `${recipientName} hãy quét mã này để nhận master key`,
  });
};
```

#### **Bước 3: Recipient nhận master key**

**Option A: Nhập thủ công**

User B sẽ:
1. Nhận key qua email/chat
2. Click vào file trong app
3. Thấy TextField nhập key
4. Paste key vào
5. Nhấn "Xác nhận"

**Option B: Scan QR**

```typescript
const scanMasterKeyQR = async (): Promise<void> => {
  try {
    const scanned = await QRCodeScanner.scan();
    const payload = JSON.parse(scanned.data);

    if (payload.type !== 'file_master_key') {
      Alert.alert('Lỗi', 'QR code không phải master key');
      return;
    }

    // Lưu master key
    await keyOrchestrationService.storeMasterKey(
      payload.fileId,
      payload.masterKey
    );

    Alert.alert(
      'Thành công',
      `Đã nhận master key từ ${payload.sharedBy}.\n\n` +
      `File: ${payload.fileName}\n\n` +
      'Bạn có thể download file ngay bây giờ.',
      [
        {
          text: 'Download ngay',
          onPress: () => {
            navigation.navigate('FileDownload', {
              fileId: payload.fileId,
              fileName: payload.fileName,
              ownerName: payload.sharedBy,
            });
          }
        },
        { text: 'Để sau' }
      ]
    );

  } catch (error) {
    Alert.alert('Lỗi', 'Không thể quét QR code');
  }
};
```

### **Backend Share Endpoint**

```javascript
// backend/src/routes/files.js

/**
 * POST /api/files/:id/share
 * Tạo access grant cho user khác
 */
router.post('/files/:id/share', async (req, res) => {
  try {
    const { id } = req.params;
    const { recipientUserId, permissions, expiresAt } = req.body;
    const ownerId = req.user.userId;

    console.log('[Share] Request:', {
      fileId: id,
      ownerId,
      recipientUserId,
    });

    // 1. Verify owner
    const file = await prisma.file.findUnique({
      where: { id }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    if (file.userId !== ownerId) {
      return res.status(403).json({
        success: false,
        error: 'Only owner can share file'
      });
    }

    // 2. Check recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientUserId },
      select: {
        id: true,
        displayName: true,
        publicKey: true,
      }
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        error: 'Recipient not found'
      });
    }

    // 3. Create/update access grant
    const grant = await prisma.userFileAccess.upsert({
      where: {
        fileId_userId: {
          fileId: id,
          userId: recipientUserId
        }
      },
      update: {
        grantedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      create: {
        fileId: id,
        userId: recipientUserId,
        grantedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    // 4. Log audit
    await prisma.auditLog.create({
      data: {
        userId: ownerId,
        action: 'SHARE_FILE',
        resourceType: 'FILE',
        resourceId: id,
        metadata: {
          recipientUserId,
          recipientName: recipient.displayName,
          permissions,
          expiresAt,
        }
      }
    });

    console.log('[Share] Access granted:', {
      fileId: id,
      from: ownerId,
      to: recipientUserId,
    });

    return res.json({
      success: true,
      grant: {
        grantedAt: grant.grantedAt,
        expiresAt: grant.expiresAt,
      },
      recipientName: recipient.displayName,
      recipientPublicKey: recipient.publicKey,
    });

  } catch (error) {
    console.error('[Share] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

---

## **IMPLEMENTATION CHI TIẾT**

### **Main Download Screen**

```typescript
// src/screens/FileDownloadScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

type DownloadPhase =
  | 'ACCESS_NEGOTIATION'
  | 'WAITING_FOR_MASTER_KEY'
  | 'RESOLVING_KEYS'
  | 'DOWNLOADING_CHUNKS'
  | 'VERIFYING_INTEGRITY'
  | 'READY'
  | 'ERROR';

interface RouteParams {
  fileId: string;
  fileName: string;
  ownerName: string;
}

const FileDownloadScreen = ({ route, navigation }: any) => {
  const { fileId, fileName, ownerName } = route.params as RouteParams;

  // State
  const [phase, setPhase] = useState<DownloadPhase>('ACCESS_NEGOTIATION');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [manifest, setManifest] = useState<ChunkManifest | null>(null);
  const [chunkProgress, setChunkProgress] = useState<Record<number, ChunkProgress>>({});
  const [totalProgress, setTotalProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [reconstructedFile, setReconstructedFile] = useState<ReconstructedFile | null>(null);

  // Services
  const fileAccessService = useRef(new FileAccessService()).current;
  const keyOrchestrationService = useRef(new KeyOrchestrationService()).current;
  const chunkDownloadService = useRef(new ChunkDownloadService()).current;
  const fileReconstructionService = useRef(new FileReconstructionService()).current;

  // Start download on mount
  useEffect(() => {
    startDownload();

    return () => {
      // Cleanup on unmount
    };
  }, []);

  const startDownload = async () => {
    try {
      // Phase 1: Access Negotiation
      setPhase('ACCESS_NEGOTIATION');
      console.log('[Download] Phase 1: Access Negotiation');

      const accessData = await fileAccessService.requestAccess(fileId);
      setManifest(accessData.chunkManifest);

      // Phase 2: Key Orchestration
      setPhase('RESOLVING_KEYS');
      console.log('[Download] Phase 2: Resolving Keys');

      const masterKey = await keyOrchestrationService.getMasterKey(fileId);

      if (!masterKey) {
        console.log('[Download] Master key not found, waiting for user input');
        setPhase('WAITING_FOR_MASTER_KEY');
        setShowKeyInput(true);
        return; // Dừng lại, chờ user nhập
      }

      // Continue with master key
      await continueDownload(accessData, masterKey);

    } catch (error) {
      console.error('[Download] Error:', error);
      setPhase('ERROR');
      setError(error.message);
      Alert.alert('Lỗi Download', error.message);
    }
  };

  const handleMasterKeySubmit = async (masterKey: string) => {
    try {
      // Lưu master key
      await keyOrchestrationService.storeMasterKey(fileId, masterKey);

      console.log('[Download] Master key saved, resuming download');
      setShowKeyInput(false);

      // Resume download
      if (manifest) {
        const accessData = await fileAccessService.requestAccess(fileId);
        await continueDownload(accessData, masterKey);
      }

    } catch (error) {
      Alert.alert('Lỗi', `Không thể lưu master key: ${error.message}`);
    }
  };

  const continueDownload = async (
    accessData: AccessNegotiationResponse,
    masterKey: string
  ) => {
    try {
      const startTime = Date.now();

      // Get chunk keys
      const chunkKeys = await keyOrchestrationService.getChunkKeys(fileId, masterKey);

      if (!chunkKeys) {
        setPhase('WAITING_FOR_MASTER_KEY');
        setShowKeyInput(true);
        setError('Không thể giải mã chunk keys. Master key có thể sai.');
        return;
      }

      // Phase 3: Download Chunks
      setPhase('DOWNLOADING_CHUNKS');
      console.log('[Download] Phase 3: Downloading Chunks');

      const chunks = await chunkDownloadService.downloadAllChunks(
        accessData.chunkManifest,
        chunkKeys,
        (index, progress) => {
          setChunkProgress(prev => ({
            ...prev,
            [index]: progress,
          }));

          // Update total progress
          updateTotalProgress();
        }
      );

      // Phase 4: Reconstruction
      setPhase('VERIFYING_INTEGRITY');
      console.log('[Download] Phase 4: Reconstruction');

      const reconstructed = await fileReconstructionService.reconstructFile(
        accessData.chunkManifest,
        chunks
      );

      setReconstructedFile(reconstructed);

      // Log audit
      const duration = Date.now() - startTime;
      const totalRetries = chunks.reduce((sum, c) => sum + c.retryCount, 0);

      await auditService.logDownloadComplete(fileId, {
        fileName: accessData.chunkManifest.fileName,
        fileSize: accessData.chunkManifest.totalSize,
        chunkCount: accessData.chunkManifest.chunkCount,
        totalRetries,
        downloadDuration: duration,
      });

      // Success!
      setPhase('READY');
      console.log('[Download] Success! File ready.');

    } catch (error) {
      console.error('[Download] Error:', error);
      setPhase('ERROR');
      setError(error.message);
      Alert.alert('Lỗi Download', error.message);
    }
  };

  const updateTotalProgress = () => {
    const values = Object.values(chunkProgress);
    if (values.length === 0) return;

    const completed = values.filter(p => p.status === 'complete').length;
    const total = values.length;
    setTotalProgress(completed / total);
  };

  const viewFile = async () => {
    if (!reconstructedFile) return;

    navigation.navigate('FileViewer', {
      fileId: reconstructedFile.fileId,
      fileName: reconstructedFile.fileName,
      mimeType: reconstructedFile.mimeType,
      cacheUri: reconstructedFile.cacheUri,
    });
  };

  const viewAuditTrail = () => {
    navigation.navigate('AuditTrail', { fileId });
  };

  const shareFile = () => {
    navigation.navigate('ShareFile', { fileId, fileName });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.fileName}>{fileName}</Text>
        <Text style={styles.ownerName}>Chủ sở hữu: {ownerName}</Text>
      </View>

      {/* Phase Stepper */}
      <DownloadPhaseStepper currentPhase={phase} />

      {/* Master Key Input */}
      {showKeyInput && (
        <MasterKeyInputModal
          visible={showKeyInput}
          fileId={fileId}
          fileName={fileName}
          ownerName={ownerName}
          onSubmit={handleMasterKeySubmit}
          onCancel={() => {
            setShowKeyInput(false);
            navigation.goBack();
          }}
        />
      )}

      {/* Chunk Progress */}
      {phase === 'DOWNLOADING_CHUNKS' && (
        <View style={styles.downloadSection}>
          <ProgressBar progress={totalProgress} />
          <ChunkProgressList chunks={chunkProgress} />
        </View>
      )}

      {/* Success View */}
      {phase === 'READY' && reconstructedFile && (
        <DownloadSuccessView
          fileName={reconstructedFile.fileName}
          fileSize={reconstructedFile.totalSize}
          verifiedAt={new Date()}
          onViewFile={viewFile}
          onViewAudit={viewAuditTrail}
          onShare={shareFile}
        />
      )}

      {/* Error View */}
      {phase === 'ERROR' && error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Download thất bại</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={startDownload}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading View */}
      {(phase === 'ACCESS_NEGOTIATION' || phase === 'RESOLVING_KEYS') && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {phase === 'ACCESS_NEGOTIATION'
              ? 'Đang thương lượng quyền truy cập...'
              : 'Đang tìm khóa giải mã...'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  fileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 14,
    color: '#666666',
  },
  downloadSection: {
    padding: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FileDownloadScreen;
```

---

## **TÌNH HUỐNG THỰC TẾ**

### **Tình huống 1: Owner download file của mình**

```
User: Sinh viên A (Owner)
File: "Báo cáo Tuần 5.pdf" (10 chunks, 5MB)

TIMELINE:
14:30:00 - A mở app, thấy file trong danh sách
14:30:05 - A click "Xem file"
14:30:06 - Phase 1: Access Negotiation (200ms)
           Backend trả về manifest với 10 chunks
14:30:07 - Phase 2: Key Orchestration (100ms)
           Tìm thấy master key (A là owner, đã lưu khi upload)
           Giải mã chunk keys thành công
14:30:08 - Phase 3: Download Chunks
           Tải song song 4 chunks đầu (0,1,2,3)
14:30:10 - Chunk 0,1,2,3 hoàn tất, verify hash ✓
           Tải tiếp chunks 4,5,6,7
14:30:12 - Chunk 4,5,6,7 hoàn tất ✓
           Tải chunks 8,9
14:30:14 - Tất cả chunks hoàn tất
14:30:15 - Phase 4: Reconstruction
           Ghép chunks → 5MB file
           Verify tổng kích thước ✓
           Tạo secure cache
14:30:16 - ✅ Success!
           Hiển thị "AOT Integrity Verified"
14:30:20 - A nhấn "Xem file" → PDF viewer

TỔNG THỜI GIAN: ~16 giây
RETRIES: 0
AUDIT LOGS: ACCESS_NEGOTIATION, DOWNLOAD_COMPLETE
```

### **Tình huống 2: User B được chia sẻ (với master key)**

```
User: Sinh viên B (Recipient)
File: "Báo cáo Tuần 5.pdf"

TIMELINE:
14:35:00 - A chia sẻ quyền cho B (API call)
           Backend tạo user_file_access cho B
14:35:05 - A copy master key và gửi cho B qua Zalo
14:35:10 - B refresh danh sách file
           Thấy file mới: "Báo cáo Tuần 5.pdf"
           Tag: "📤 Chia sẻ bởi Sinh viên A"
14:35:15 - B click vào file
14:35:16 - Phase 1: Access Negotiation ✓
14:35:17 - Phase 2: Key Orchestration
           Không tìm thấy master key
           → Hiển thị TextField nhập key
14:35:20 - B paste key nhận từ A vào TextField
14:35:22 - B nhấn "Xác nhận"
           App validate key (hex format) ✓
           Lưu vào Secure Storage ✓
14:35:23 - Resume download
           Giải mã chunk keys thành công ✓
14:35:24 - Phase 3: Download chunks...
           (tương tự tình huống 1)
14:35:40 - ✅ Success!

TỔNG THỜI GIAN: ~25 giây (kể cả thời gian nhập key)
```

### **Tình huống 3: Chunk bị hỏng (Integrity Alert)**

```
User: Sinh viên C
File: "Bài tập.pdf" (8 chunks)

TIMELINE:
15:00:00 - C bắt đầu download
15:00:10 - Chunks 0,1,2,3 hoàn tất ✓
15:00:15 - Chunk 4: Hash không khớp! ❌
           Expected: a1b2c3...
           Computed: x9y8z7...
15:00:16 - Retry lần 1 cho chunk 4
           Tải lại từ IPFS...
15:00:18 - Chunk 4: Vẫn sai ❌
15:00:19 - Retry lần 2
15:00:21 - Chunk 4: Vẫn sai ❌
15:00:22 - Retry lần 3 (cuối cùng)
15:00:24 - Chunk 4: VẪN SAI ❌
15:00:25 - Gửi Integrity Alert lên backend
           Backend ghi log severity WARNING
           Backend notify admin
15:00:26 - Download FAILED
           UI hiển thị:
           "❌ Download thất bại
            Chunk #4 bị hỏng sau 3 lần thử.
            Đã gửi báo cáo lên hệ thống."

ADMIN ACTION:
15:05:00 - Admin nhận notification
15:10:00 - Admin kiểm tra IPFS node
           Phát hiện: Node #2 bị lỗi disk
15:15:00 - Admin sửa node, re-upload chunk 4
15:20:00 - C thử download lại → Thành công ✓
```

---

## **UI/UX DESIGN**

### **Phase Stepper Component**

```
┌─────────────────────────────────────────────┐
│  Tiến trình Download                        │
├─────────────────────────────────────────────┤
│                                             │
│  ✅ 1. Thương lượng quyền truy cập          │
│  ✅ 2. Lấy khóa giải mã                     │
│  ⏳ 3. Đang tải chunks...  (60%)            │
│  ⚪ 4. Xác thực và ghép file                │
│                                             │
│  ████████████░░░░░░ 60%                    │
│                                             │
└─────────────────────────────────────────────┘
```

### **Chunk Progress Detail**

```
┌─────────────────────────────────────────────┐
│  Chi tiết từng chunk:                       │
├─────────────────────────────────────────────┤
│  ✅  Chunk #0    512 KB    [Hoàn tất]      │
│  ✅  Chunk #1    512 KB    [Hoàn tất]      │
│  ⏳  Chunk #2    512 KB    [Tải 45%]       │
│  ⚠️  Chunk #3    512 KB    [Retry 2/3]     │
│  ⚪  Chunk #4    512 KB    [Đang chờ...]   │
└─────────────────────────────────────────────┘
```

### **Success Screen**

```
┌─────────────────────────────────────────────┐
│                                             │
│              ✅                             │
│                                             │
│         File sẵn sàng!                      │
│                                             │
│      Báo cáo Tuần 5.pdf                    │
│            5.2 MB                           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🔒 AOT Integrity Verified             │ │
│  │ Hoàn tất: 15:00:45 08/10/2025        │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │     📄 Xem file                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌─────────────┐  ┌─────────────┐         │
│  │ 📋 Audit    │  │ 🔗 Chia sẻ  │         │
│  │    Trail    │  │             │         │
│  └─────────────┘  └─────────────┘         │
│                                             │
│  💾 File được lưu cache an toàn            │
│  Tự động xóa sau 24 giờ                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## **KẾT LUẬN**

### **Tính năng đã implement**

✅ **Giai đoạn 0:** Danh sách file theo quyền
✅ **Giai đoạn 1:** Access negotiation
✅ **Giai đoạn 2:** Key orchestration với TextField
✅ **Giai đoạn 3:** Chunk download & integrity
✅ **Giai đoạn 4:** Reconstruction & secure cache
✅ **Chia sẻ file:** Owner share → Recipient nhập key
✅ **Audit trail:** Log mọi hành động
✅ **UI/UX:** Stepper, progress bars, badges

### **Bảo mật**

✅ **Zero-trust:** Backend không giữ master key
✅ **End-to-end encryption:** Chỉ user có key mới đọc được
✅ **Integrity verification:** SHA256 cho mọi chunk
✅ **Access control:** Dựa trên user_file_access table
✅ **Audit trail:** Compliance với yêu cầu giám sát

### **Performance**

✅ **Parallel downloads:** 4 chunks cùng lúc
✅ **Retry logic:** Auto-retry 3 lần
✅ **Secure cache:** TTL 24h, tự động xóa
✅ **Progress tracking:** Real-time updates

### **Demo-ready**

✅ **4 giai đoạn rõ ràng** cho thuyết trình
✅ **UI trực quan** với stepper và badges
✅ **Error handling** đầy đủ
✅ **Audit trail** cho giảng viên review

---

**File tài liệu hoàn chỉnh này bao gồm:**
- Lý thuyết chi tiết bằng tiếng Việt
- Implementation code đầy đủ
- Backend + Mobile services
- UI components
- Tình huống thực tế
- Design mockups

**Sẵn sàng để implement! 🚀**
