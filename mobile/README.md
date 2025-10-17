# IPFS Sandbox Mobile App

React Native mobile application for the IPFS ID-RS (Identity-based Ring Signatures) system with comprehensive file management capabilities and real-time gateway integration.

## ✅ Status: Production Ready

A complete mobile app featuring document picker, image picker, file validation, and hardened IPFS gateway integration.

## 🚀 Features

### Identity Onboarding
- One-time initialization screen captures a display name and generates Schnorr key pairs locally
- Registration shares only the display name and public key with the gateway; private keys remain on-device via secure storage
- Restores server-generated identifiers/ring context on future launches to keep the identity consistent
- Home screen file list is automatically filtered by the active public key so users only see their own uploads

### Gateway Integration
- **Direct Gateway Access**: Real operations through the secured backend at `localhost:3000`
- **Connection Monitoring**: Real-time health checks and diagnostics
- **Progress Tracking**: Upload/download progress indicators with error recovery
- **Multi-Platform Support**: Works across iOS, Android, and simulators/emulators

### File Management
- **Document Picker**: Select files from device storage with type filtering
- **Image Picker**: Camera capture and photo library access
- **File Validation**: Type checking, size limits, and security validation
- **File List Management**: Display, organize, and manage selected files
- **Mixed File Support**: Documents, images, media files, and custom types
- **Persistent Downloads**: Reassembled files are saved to an on-device sandbox with optional shared export

### IPFS Integration
- **Gateway Connection**: Direct integration with IPFS gateway at `localhost:3000`
- **File Upload**: Upload files to private IPFS network with progress tracking
- **File Download**: Retrieve files by IPFS hash with blob handling
- **Metadata Management**: File info, IPFS hash, and metadata storage
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Ring Signatures**: Create, verify, and manage cryptographic signatures

### UI/UX
- **Modern Design**: Clean, responsive interface with Material Design principles
- **Dark/Light Mode**: Automatic theme switching with user preference
- **TypeScript**: Full type safety and IntelliSense support
- **Component Library**: Reusable, well-documented UI components
- **Error Handling**: User-friendly error messages and recovery options
- **Progress Indicators**: Upload progress, loading states, and status feedback

## Prerequisites

Before running the app, ensure you have:

- **Node.js** (>= 18)
- **React Native development environment** set up
- **iOS Development**: Xcode, CocoaPods (for iOS)
- **Android Development**: Android Studio, Android SDK (for Android)
- **IPFS Gateway** (for online mode): Backend system running at `localhost:3000`

## Quick Start

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..
```

### 2. Start Metro Bundler

```bash
npm start
```

### 3. Run the App

#### iOS (Simulator)
```bash
npm run ios
```

Or open `ios/IPFSSandboxMobile.xcworkspace` in Xcode and run.

#### Android (Emulator)
```bash
npm run android
```

Or open the `android/` folder in Android Studio and run.

## 🌐 Online Mode (Gateway Integration)

### Prerequisites for Online Mode
1. **IPFS Gateway Running**: Ensure the backend system is running
   ```bash
   # From repository root
   docker compose up -d
   # or
   ./start-system.sh
   ```

2. **Network Configuration**: Ensure mobile device can reach gateway
   - **iOS Simulator**: Uses `localhost:3000` directly
   - **Android Emulator**: Use `10.0.2.2:3000` instead of `localhost:3000`
   - **Physical Device**: Use actual IP address (e.g., `192.168.1.100:3000`)

### Online Mode Features

#### Gateway Connection
- **Health Monitoring**: Real-time connection status and health checks
- **Auto-Reconnect**: Automatic connection recovery after network issues
- **Error Handling**: Graceful degradation when gateway is unavailable

#### File Operations (CRUD)
```typescript
// Example usage in online mode
const { uploadFile, downloadFile, listFiles, deleteFile } = useIPFS({
  config: { gatewayUrl: 'http://localhost:3000' }
});

// Upload file to IPFS
const result = await uploadFile(pickedFile);
// Returns: { success: true, data: FileData, error?: string }

// Download file by hash
const downloadResult = await downloadFile('QmXXXXX...');
// Returns: { success: true, blob: Blob, error?: string }
```

#### API Endpoints Used
- **Health Check**: `GET http://localhost:3000/health`
- **IPFS Test**: `GET http://localhost:3000/api/files/test-ipfs`
- **File Upload**: `POST http://localhost:3000/api/files/upload`
- **File Download**: `GET http://localhost:3000/api/files/{hash}`
- **Delete File**: `DELETE http://localhost:3000/api/files/{hash}`
- **User Files (filtered)**: `GET http://localhost:3000/api/files/user/{userId}/files?publicKey={hexPublicKey}`
- **Signatures**: `GET/POST http://localhost:3000/api/signatures`

## Development

### Project Structure

```
mobile/
├── App.tsx                          # Thin wrapper around AppWithIPFS
├── AppWithIPFS.tsx                  # Full IPFS integration experience
├── index.js                        # Entry point (registers AppWithIPFS)
├── src/
│   ├── components/
│   │   ├── common/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── file-manager/            # File management components
│   │   │   ├── DocumentPickerDemo.tsx
│   │   │   ├── FileItem.tsx
│   │   │   ├── FileList.tsx
│   │   │   ├── FileUploadButton.tsx
│   │   │   └── SimpleFilePicker.tsx
│   │   └── ipfs/                    # IPFS-specific components
│   │       ├── IPFSConnectionStatus.tsx  # Connection status display
│   │       ├── IPFSFileUpload.tsx        # File upload with progress
│   │       └── index.ts
│   ├── services/
│   │   ├── FilePickerService.ts     # File picker abstraction
│   │   ├── PermissionService.ts     # Permission handling
│   │   ├── GatewayApiService.ts     # Direct gateway API communication
│   │   ├── IPFSService.ts           # Unified IPFS service wrapper
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useFilePicker.ts         # File picker hook
│   │   ├── useFileStorage.ts        # Local persistence helpers
│   │   ├── useEnhancedStorage.ts    # Persistent storage with metadata
│   │   ├── useIPFS.ts               # Main IPFS operations hook
│   │   └── index.ts
│   ├── types/
│   │   ├── file.ts                  # File type definitions
│   │   ├── filePicker.ts            # File picker types
│   │   ├── theme.ts                 # Theme types
│   │   └── common.ts                # Common types
│   ├── styles/
│   │   ├── ThemeProvider.tsx        # Theme context provider
│   │   └── themes.ts                # Theme definitions
│   ├── constants/
│   │   ├── colors.ts                # Color palette
│   │   ├── fileTypes.ts             # File type mappings
│   │   ├── spacing.ts               # Layout spacing
│   │   └── typography.ts            # Text styles
│   └── utils/
│       ├── fileUtils.ts             # File utility functions
│       ├── fileValidation.ts        # Validation logic
│       ├── dateUtils.ts             # Date formatting
│       └── index.ts
├── android/                         # Android-specific code
├── ios/                            # iOS-specific code
├── __tests__/                      # Test files
├── TEST_IPFS_CONNECTIVITY.md       # Testing guide
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Jest

## Download Persistence

Anonymous downloads are automatically written to the app sandbox so you can revisit them later:

- **Sandbox location**: `DocumentDirectoryPath/anonymous-downloads/<fileId>-<timestamp>-<originalName>` (displayed in the Secure Download success banner and File Viewer)
- **iOS export (optional)**: When export is enabled, a Finder-accessible copy is placed in `DocumentDirectoryPath/anonymous-downloads/shared-downloads/`
- **Android export (optional)**: When export is enabled, a duplicate is copied to the system `Downloads/` directory using the same filename

Exporting to a shared location is guarded by the `ENABLE_DOWNLOAD_EXPORT` feature flag, which is **off by default** to avoid unnecessary permission prompts. Enable it using either approach:

1. **Global flag (recommended for development)**
   ```ts
   // In App.tsx or AppWithIPFS.tsx before rendering
   (globalThis as any).__IPFSSandboxFlags__ = {
     ENABLE_DOWNLOAD_EXPORT: true,
   };
   ```

2. **Environment variable** – if your bundler injects `process.env` values (e.g. via Babel plugins):
   ```bash
   ENABLE_DOWNLOAD_EXPORT=true npm start
   ```

When the flag is active, the download summary card will show both the sandbox path and the exported location (if the copy succeeds). If the export fails—because of permissions or missing directories—the sandbox copy remains intact and the app logs the reason.

### App Configuration

The app entry point (`index.js`) is configured to run the IPFS demo by default:

```javascript
// Switch between different app versions
// AppRegistry.registerComponent(appName, () => App);           // Original app
AppRegistry.registerComponent(appName, () => AppWithIPFS);   // IPFS demo app
```

### Making Changes

1. **Main IPFS App**: Edit `AppWithIPFS.tsx` for the main demo
2. **IPFS Components**: Add/modify components in `src/components/ipfs/`
3. **Services**: Update IPFS operations in `src/services/`
4. **Hooks**: Modify IPFS logic in `src/hooks/useIPFS.ts`
5. **Configuration**: Adjust service configuration in `IPFSService.ts`

Changes will automatically reflect via Fast Refresh.

## 🧪 Testing

### Connectivity Checklist
- [ ] Gateway containers running (`docker compose up -d`)
- [ ] `curl http://localhost:3000/health` returns `status: OK`
- [ ] Mobile app connection widget reports "Connected"

### Functional Flows
1. **Upload with AOT**
   - Use `AOTDemoCard` to provide metadata, ownership keys, Schnorr proof, and ring signature
   - Verify `/api/files/aot-upload` returns a `fileId`
2. **Anonymous Revocation**
   - Submit revocation payload with fresh Schnorr proof
   - Confirm `/api/files/aot/revoke` responds with `revocationId`
3. **Download / View**
   - Use file list `View` button to stream from IPFS via the gateway
4. **Health Regression**
   - Stop gateway to ensure app surfaces connection errors, then restart and recover

### Network Configuration
- **iOS Simulator**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical Device**: `http://<host-ip>:3000`

## Environment Setup

### iOS Configuration

Ensure you have:
- **Xcode**: Latest version installed
- **CocoaPods**: Installed (`gem install cocoapods`)
- **iOS Simulator**: Configured and working
- **Network Access**: Simulator can reach localhost:3000

### Android Configuration

Ensure you have:
- **Android Studio**: Installed with SDK
- **Android SDK**: Configured with build tools
- **Emulator**: Android device emulator running
- **Network Mapping**: Use `10.0.2.2:3000` for localhost access
- **Environment Variables**: `ANDROID_HOME` set correctly

### Physical Device Configuration

For testing on real devices:
- **Same Network**: Device and gateway on same WiFi network
- **IP Address**: Use actual computer IP instead of localhost
- **Firewall**: Ensure gateway port 3000 is accessible
- **HTTPS**: Consider HTTPS for production deployments

## Troubleshooting

### Common Issues

#### **Metro bundler port conflict:**
```bash
npx react-native start --reset-cache
```

#### **Android build issues:**
```bash
# Verify Android environment
npx react-native doctor

# Clean and rebuild
cd android && ./gradlew clean && cd ..
npm run android
```

#### **iOS build issues:**
```bash
# Clean CocoaPods
cd ios && pod deintegrate && pod install && cd ..

# Clean Xcode build
# In Xcode: Product > Clean Build Folder
npm run ios
```

#### **IPFS connection issues:**
```bash
# Check gateway status
curl http://localhost:3000/health

# For Android emulator
curl http://10.0.2.2:3000/health

# Check if gateway is accessible from device
# Replace with your actual IP
curl http://192.168.1.100:3000/health
```

#### **File upload failures:**
- Check network connectivity to gateway
- Verify file permissions on device
- Test with smaller files first
- Check gateway logs for errors

### Debug Tools

#### React Native Debugger
```bash
# Install React Native Debugger
# Monitor network requests and component state
# View console logs and errors
```

#### Gateway Logs
```bash
# View gateway container logs
docker logs ipfs-sandbox-gateway-1 -f

# Check IPFS daemon status
docker exec ipfs-sandbox-gateway-1 ipfs id
```

#### Network Testing
```bash
# Test gateway health
curl -v http://localhost:3000/health

# Test file upload
curl -X POST -F "file=@test.txt" http://localhost:3000/api/files/upload

# Test IPFS connectivity
curl http://localhost:3000/api/files/test-ipfs
```

## 🛠️ Tech Stack

### Core Technologies
- **React Native**: 0.79.3
- **React**: 19.0.0
- **TypeScript**: 5.0.4
- **Metro**: React Native bundler

### IPFS Integration
- **Custom API Layer**: Direct gateway communication
- **Ownership Proofs**: Schnorr + LSAG validation pipeline
- **File Handling**: Multipart upload and blob download
- **Progress Tracking**: Real-time upload progress

### Libraries & Dependencies
- **@react-native-documents/picker**: Document selection
- **react-native-image-picker**: Camera and photo library
- **react-native-permissions**: Permission management

### Platform Support
- **iOS**: 13.0+ with Xcode 14+
- **Android**: API 21+ (Android 5.0+)
- **Development**: macOS, Windows, Linux

## 📋 Development Roadmap

### ✅ Completed Features
- ✅ Complete IPFS gateway integration
- ✅ AOT upload + anonymous revocation flows
- ✅ File upload/download with progress tracking
- ✅ Real-time connection monitoring
- ✅ CRUD operations for file management
- ✅ Ring signature operations
- ✅ Error handling and recovery
- ✅ TypeScript type definitions
- ✅ Component library and theme system

### 🚧 Future Enhancements
- 🔄 File synchronization and conflict resolution
- 🔐 Enhanced encryption and security features
- 👥 User authentication and multi-user support
- 📱 Offline file caching and storage
- 🔗 P2P file sharing capabilities
- 📊 Advanced analytics and monitoring
- 🎨 Enhanced UI/UX improvements
- 🌐 Multi-language support

## 📚 API Reference

### useIPFS Hook

Main hook for IPFS operations:

```typescript
const {
  // Connection state
  connectionState,
  
  // File operations
  uploadFile,
  uploadMultipleFiles,
  downloadFile,
  listFiles,
  deleteFile,
  
  // Signature operations
  getSignatures,
  createSignature,
  verifySignature,
  // Connection management
  checkConnection,
  
  // Operation states
  isUploading,
  isDownloading,
  uploadProgress,
} = useIPFS(options);
```

### Service Configuration

```typescript
const onlineConfig = {
  gatewayUrl: 'http://localhost:3000',
  timeout: 30000, // 30 second timeout
};
```

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Testing Guide](./TEST_IPFS_CONNECTIVITY.md)
- [Main Project README](../README.md)

---

**Status**: ✅ **Production Ready** - Complete IPFS integration with comprehensive testing and full CRUD functionality.
