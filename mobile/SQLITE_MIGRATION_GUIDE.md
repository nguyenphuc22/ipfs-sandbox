# SQLite Migration Implementation Guide

## 🎯 Overview
This implementation replaces AsyncStorage with SQLite for persistent file storage in the mobile app. Files uploaded to IPFS are now stored in a structured SQLite database with automatic migration from AsyncStorage.

## 🏗️ Architecture

### Database Schema
```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,                -- Unique file identifier  
  name TEXT NOT NULL,                 -- Original filename
  size INTEGER DEFAULT 0,            -- File size in bytes
  ipfs_hash TEXT UNIQUE,              -- IPFS hash (QmXXX...)
  upload_time DATETIME NOT NULL,     -- When file was uploaded
  status TEXT DEFAULT 'uploading',   -- uploading, completed, failed
  local_path TEXT,                    -- Local file path (if cached)
  synced_with_server INTEGER DEFAULT 0, -- 1 if synced, 0 if not
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Key Components

#### 1. SQLiteService (`src/services/SQLiteService.ts`)
- Database initialization and connection management
- CRUD operations for files
- Metadata management
- Error handling and logging

#### 2. MigrationService (`src/services/MigrationService.ts`) 
- Automatic migration from AsyncStorage to SQLite
- Data validation and backup
- Migration status tracking
- Rollback capability

#### 3. useSQLiteStorage Hook (`src/hooks/useSQLiteStorage.ts`)
- React hook for database operations
- Real-time state updates
- Migration status monitoring
- Error handling

## 🔄 Migration Process

### Automatic Migration
1. **App Start** → Initialize SQLite
2. **Check Migration Status** → From app_metadata table
3. **If Not Migrated** → Run migration from AsyncStorage
4. **Validate Data** → Ensure data integrity
5. **Backup & Clear** → Backup AsyncStorage, then clear
6. **Mark Complete** → Update migration status

### Migration Features
- ✅ **Automatic** - Runs on first launch after update
- ✅ **Safe** - Backs up AsyncStorage data before clearing
- ✅ **Validated** - Checks data integrity during migration
- ✅ **Resumable** - Can handle interrupted migrations
- ✅ **Logged** - Full logging for debugging

## 📱 Usage

### Basic File Operations
```typescript
import { useSQLiteStorage } from '../hooks';

const MyComponent = () => {
  const { 
    storedFiles,        // Current files from SQLite
    saveFile,          // Save file to SQLite  
    removeFile,        // Delete file from SQLite
    clearAllFiles,     // Clear all files
    isLoading,         // Loading state
    migrationStatus    // Migration info
  } = useSQLiteStorage();

  // Save file after upload
  const handleUpload = async (fileData) => {
    await saveFile(fileData);
  };

  return (
    <div>
      {migrationStatus.isRunning && <p>Migrating data...</p>}
      {storedFiles.map(file => <FileItem key={file.id} file={file} />)}
    </div>
  );
};
```

### Advanced Operations
```typescript
import { sqliteService } from '../services';

// Get files by status
const result = await sqliteService.getFilesByStatus('completed');

// Get unsynced files
const unsynced = await sqliteService.getUnsyncedFiles();

// Update file status
await sqliteService.updateFile(fileId, { 
  status: 'completed',
  ipfs_hash: 'QmXXX...',
  synced_with_server: 1 
});
```

## 🔧 Development

### Database Location
- **iOS**: `Documents/IPFSApp.db`
- **Android**: `/data/data/[package]/databases/IPFSApp.db`

### Debugging
```typescript
// Enable SQLite debugging (development only)
SQLite.DEBUG(__DEV__);

// Check migration status
const migrationService = new MigrationService();
const isCompleted = await migrationService.checkMigrationStatus();

// Force migration (for testing)
const result = await migrationService.forceMigration();
```

### Error Handling
All database operations return `DatabaseResult<T>`:
```typescript
interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## 🚀 Performance Benefits

### Before (AsyncStorage)
- ❌ Key-value storage only
- ❌ No structured queries
- ❌ JSON parse/stringify overhead
- ❌ No relationships
- ❌ Limited to simple data

### After (SQLite)
- ✅ Structured data with schema
- ✅ SQL queries and indexing
- ✅ Relationships and joins
- ✅ Better performance for large datasets
- ✅ ACID transactions

## 🔒 Data Persistence

### File Lifecycle
1. **Upload** → File saved to server + SQLite
2. **App Close** → Data persists in SQLite
3. **App Open** → Files loaded from SQLite instantly
4. **Sync Check** → Compare with server, update differences

### Offline Support
- Files remain visible when offline
- Upload queue managed in SQLite
- Sync status tracking per file
- Automatic retry mechanisms

## 🧪 Testing

### Manual Testing
1. Upload files to IPFS
2. Close and reopen app
3. Verify files persist
4. Test migration from old AsyncStorage data

### Automated Testing
```bash
cd mobile
npm test -- --testPathPattern=SQLite
```

## 📝 Migration Checklist

- [x] Install react-native-sqlite-storage
- [x] Create database schema
- [x] Implement SQLiteService
- [x] Create MigrationService
- [x] Build useSQLiteStorage hook
- [x] Update components to use SQLite
- [x] Add migration status UI
- [x] Test data persistence
- [x] Verify migration works

## 🔧 Troubleshooting

### Common Issues

#### Migration Fails
```typescript
// Check migration status
const migrationService = new MigrationService();
const asyncCount = await migrationService.getAsyncStorageDataCount();
const sqliteCount = await migrationService.getSQLiteDataCount();
console.log('AsyncStorage files:', asyncCount);
console.log('SQLite files:', sqliteCount);
```

#### Database Connection Issues
```typescript
// Reinitialize database
await sqliteService.close();
const result = await sqliteService.initialize();
if (!result.success) {
  console.error('Database init failed:', result.error);
}
```

#### Performance Issues
- Check indexes are created
- Use SQL EXPLAIN for query optimization  
- Consider pagination for large datasets

### Support
For issues or questions, check:
1. Console logs for SQLite operations
2. Migration status in app_metadata table
3. File system permissions
4. React Native linking configuration

## 🎉 Result

✅ **Files persist after app restart**
✅ **Automatic migration from AsyncStorage**  
✅ **Better performance with structured data**
✅ **Offline support and sync tracking**
✅ **Error handling and recovery**

The mobile app now has robust persistent storage with SQLite, ensuring uploaded files are never lost when the app is closed and reopened.