# IPFS Sandbox Mobile App

React Native mobile application for the IPFS ID-RS (Identity-based Ring Signatures) system with comprehensive file management capabilities and dual-mode operation (Online/Offline).

## ✅ Status: Production Ready

A complete mobile app featuring document picker, image picker, file validation, IPFS integration, and offline development support with mock data layer.

## 🚀 Features

### Dual-Mode Operation
- **🌐 Online Mode**: Direct integration with IPFS gateway for real file operations
- **📱 Offline Mode**: Full-featured mock layer for UI development and testing
- **🔄 Mode Switching**: Seamless switching between online and offline modes
- **📊 Connection Status**: Real-time connection monitoring and health checks

### File Management
- **Document Picker**: Select files from device storage with type filtering
- **Image Picker**: Camera capture and photo library access
- **File Validation**: Type checking, size limits, and security validation
- **File List Management**: Display, organize, and manage selected files
- **Mixed File Support**: Documents, images, media files, and custom types

### IPFS Integration (Online Mode)
- **Gateway Connection**: Direct integration with IPFS gateway at `localhost:3000`
- **File Upload**: Upload files to private IPFS network with progress tracking
- **File Download**: Retrieve files by IPFS hash with blob handling
- **Metadata Management**: File info, IPFS hash, and metadata storage
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Ring Signatures**: Create, verify, and manage cryptographic signatures

### Mock Layer (Offline Mode)
- **Simulated Operations**: All IPFS operations work offline with mock data
- **Realistic Responses**: Generate mock IPFS hashes and responses
- **Network Simulation**: Configurable delays and error simulation
- **Data Persistence**: In-memory storage for development and testing
- **Error Testing**: Simulate network errors, timeouts, and failures

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
  config: { useMockApi: false, gatewayUrl: 'http://localhost:3000' }
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
- **List Files**: `GET http://localhost:3000/api/files`
- **Delete File**: `DELETE http://localhost:3000/api/files/{hash}`
- **User Files**: `GET http://localhost:3000/api/users/files`
- **Signatures**: `GET/POST http://localhost:3000/api/signatures`

## 📱 Offline Mode (Mock Layer)

### Offline Mode Features

Perfect for UI development and testing without requiring gateway connectivity.

#### Mock Data Layer
- **Realistic Simulation**: Generates authentic-looking IPFS hashes and responses
- **Configurable Delays**: Simulate network latency (default: 1000ms)
- **Error Simulation**: Test error handling with simulated failures
- **Data Persistence**: In-memory storage maintains state during session

#### Mock Operations
```typescript
// Example usage in offline mode
const { uploadFile, switchToMockMode, clearMockData } = useIPFS({
  config: { useMockApi: true, mockDelay: 500 }
});

// All operations work identically to online mode
const result = await uploadFile(pickedFile);
// Returns: { success: true, data: FileData } with mock IPFS hash

// Switch modes dynamically
switchToMockMode(1000); // Enable mock mode with 1s delay
switchToOnlineMode('http://localhost:3000'); // Switch to online
```

#### Mock Data Management
- **Clear Data**: `clearMockData()` - Reset all mock file storage
- **Inspect Data**: `getMockData()` - View current mock file collection
- **Add Test Data**: Programmatically add mock files for testing

### Development Benefits
- **No Dependencies**: Develop UI without running backend services
- **Fast Iteration**: Immediate feedback without network delays
- **Error Testing**: Simulate various error conditions
- **Offline Development**: Work anywhere without network connectivity

## Development

### Project Structure

```
mobile/
├── App.tsx                          # Original demo app
├── AppWithIPFS.tsx                  # Full IPFS integration demo
├── index.js                        # Entry point (configured for IPFS demo)
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
│   │   ├── FileService.ts           # Legacy file operations
│   │   ├── PermissionService.ts     # Permission handling
│   │   ├── GatewayApiService.ts     # Direct gateway API communication
│   │   ├── MockApiService.ts        # Mock layer implementation
│   │   ├── IPFSService.ts           # Unified IPFS service wrapper
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useFilePicker.ts         # File picker hook
│   │   ├── useFiles.ts              # File management hook
│   │   ├── useSimpleFiles.ts        # Simple file operations
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

### Testing Modes

#### 1. Mock Mode Testing (Default)
```typescript
// App starts in mock mode for immediate testing
const ipfsService = useIPFS({
  config: { useMockApi: true, mockDelay: 1000 }
});
```

**Test Steps:**
1. Launch app (starts in mock mode)
2. Upload files → See generated mock IPFS hashes
3. List files → View mock data collection
4. Delete files → Remove from mock storage
5. Test error scenarios → Use mock error simulation

#### 2. Online Mode Testing
```typescript
// Switch to online mode for real gateway testing
const { switchToOnlineMode } = useIPFS();
switchToOnlineMode('http://localhost:3000');
```

**Prerequisites:**
- Gateway system running (`docker compose up -d`)
- Network connectivity to gateway
- Proper IP configuration for device/emulator

**Test Steps:**
1. Ensure gateway is running and accessible
2. Switch app to online mode
3. Upload real files → Get actual IPFS hashes
4. Download files → Retrieve from IPFS network
5. Test connection loss scenarios

### Network Configuration Testing

#### iOS Simulator
```typescript
// Direct localhost access
const config = { gatewayUrl: 'http://localhost:3000' };
```

#### Android Emulator
```typescript
// Use emulator host mapping
const config = { gatewayUrl: 'http://10.0.2.2:3000' };
```

#### Physical Device
```typescript
// Use actual IP address
const config = { gatewayUrl: 'http://192.168.1.100:3000' };
```

### Testing Checklist

- [ ] **Mock Mode**: All operations work offline
- [ ] **Online Mode**: Gateway connectivity established
- [ ] **File Upload**: Single and multiple files upload successfully
- [ ] **File Download**: Files download and display correctly
- [ ] **File Listing**: All uploaded files appear in list
- [ ] **File Deletion**: Files can be removed from storage
- [ ] **Progress Tracking**: Upload progress displays correctly
- [ ] **Error Handling**: Network errors handled gracefully
- [ ] **Mode Switching**: Can switch between mock and online modes
- [ ] **Connection Status**: Status indicator reflects actual state

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

#### **Mock mode not working:**
- Verify app is using `AppWithIPFS` as entry point
- Check `useIPFS` hook configuration
- Ensure mock service is properly initialized

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
- **Mock Layer**: Complete offline simulation
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
- ✅ Dual-mode operation (Online/Offline)
- ✅ Mock layer for offline development
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
  
  // Mode switching
  switchToMockMode,
  switchToOnlineMode,
  
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
// Mock mode configuration
const mockConfig = {
  useMockApi: true,
  mockDelay: 1000, // Simulate 1s network delay
};

// Online mode configuration
const onlineConfig = {
  useMockApi: false,
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

**Status**: ✅ **Production Ready** - Complete IPFS integration with dual-mode operation, comprehensive testing, and full CRUD functionality.