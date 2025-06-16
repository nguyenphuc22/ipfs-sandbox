# IPFS Sandbox Mobile App

React Native mobile application for the IPFS ID-RS (Identity-based Ring Signatures) system with full file management capabilities.

## ✅ Status: Production Ready

A comprehensive mobile app featuring document picker, image picker, file validation, and IPFS integration capabilities.

## 🚀 Features

### File Management
- **Document Picker**: Select files from device storage
- **Image Picker**: Camera capture and photo library access
- **File Validation**: Type checking and size limits
- **File List Management**: Display and organize selected files
- **Mixed File Support**: Documents, images, and media files

### IPFS Integration
- **Backend Connection**: Direct integration with IPFS gateway
- **File Upload**: Upload files to private IPFS network
- **File Download**: Retrieve files by IPFS hash
- **Metadata Handling**: File info and IPFS hash management

### UI/UX
- **Modern Design**: Clean, responsive interface
- **Dark/Light Mode**: Automatic theme switching
- **TypeScript**: Full type safety
- **Component Library**: Reusable UI components
- **Error Handling**: User-friendly error messages

## Prerequisites

Before running the app, ensure you have:

- **Node.js** (>= 18)
- **React Native development environment** set up
- **iOS Development**: Xcode, CocoaPods
- **Android Development**: Android Studio, Android SDK

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. iOS Setup

Install CocoaPods dependencies:

```bash
cd ios && pod install && cd ..
```

### 3. Start Metro Bundler

```bash
npm start
```

### 4. Run the App

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

## Development

### Project Structure

```
mobile/
├── App.tsx                          # Main app component with demos
├── AppWithDemo.tsx                  # Full-featured demo app
├── src/
│   ├── components/
│   │   ├── common/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   └── file-manager/            # File management components
│   │       ├── DocumentPickerDemo.tsx
│   │       ├── FileItem.tsx
│   │       ├── FileList.tsx
│   │       ├── FileUploadButton.tsx
│   │       ├── SimpleFilePicker.tsx
│   │       └── SimpleFilePickerDemo.tsx
│   ├── services/
│   │   ├── FilePickerService.ts     # File picker abstraction
│   │   ├── FileService.ts           # File operations
│   │   ├── PermissionService.ts     # Permission handling
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useFilePicker.ts         # File picker hook
│   │   ├── useFiles.ts              # File management hook
│   │   ├── useSimpleFiles.ts        # Simple file operations
│   │   └── index.ts
│   ├── types/
│   │   ├── file.ts                  # File type definitions
│   │   ├── filePicker.ts            # File picker types
│   │   ├── theme.ts                 # Theme types
│   │   └── common.ts                # Common types
│   ├── styles/
│   │   ├── ThemeProvider.tsx        # Theme context
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
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Jest

### Demo Apps

#### AppWithDemo.tsx (Full-Featured)
Complete demo showcasing all file management features:
- Document picker with multiple file types
- Image picker with camera and gallery
- File validation and error handling
- File list with metadata display
- Upload progress and status

#### Simple Demos
- `SimpleFilePickerDemo.tsx` - Basic file selection
- `DocumentPickerDemo.tsx` - Document-specific picker

### Making Changes

1. **Main App**: Edit `App.tsx` or `AppWithDemo.tsx`
2. **Components**: Add/modify components in `src/components/`
3. **Services**: Update file operations in `src/services/`
4. **Types**: Define interfaces in `src/types/`
5. **Themes**: Customize appearance in `src/styles/`

Changes will automatically reflect via Fast Refresh.

## Environment Setup

### Android Configuration

Ensure you have:
- Android Studio installed
- Android SDK configured
- `ANDROID_HOME` environment variable set
- `local.properties` file created (automatically generated)

### iOS Configuration

Ensure you have:
- Xcode installed
- CocoaPods installed (`gem install cocoapods`)
- iOS Simulator or physical device

## Troubleshooting

### Common Issues

**Metro bundler port conflict:**
```bash
npx react-native start --reset-cache
```

**Android build issues:**
- Verify `ANDROID_HOME` is set correctly
- Clean and rebuild: `cd android && ./gradlew clean`

**iOS build issues:**
- Clean CocoaPods: `cd ios && pod deintegrate && pod install`
- Clean Xcode build: Product > Clean Build Folder

**Environment verification:**
```bash
npx react-native doctor
```

## 🔌 IPFS Backend Integration

### Connection Configuration
- **Backend API**: `http://localhost:3000` (when backend is running)
- **IPFS Gateway**: `http://localhost:8080`
- **File Upload Endpoint**: `POST /api/files/upload`
- **File Download Endpoint**: `GET /api/files/:hash`

### File Operations
```typescript
// Upload file to IPFS
const uploadFile = async (file: FileType) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any);

  const response = await fetch('http://localhost:3000/api/files/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.json();
};
```

### Network Requirements
- Backend system must be running: `./start-system.sh`
- Mobile device/emulator on same network as backend
- CORS configured for mobile app access

## 🛠️ Tech Stack

### Core Technologies
- **React Native**: 0.79.3
- **React**: 19.0.0
- **TypeScript**: 5.0.4
- **Metro**: 0.82.4

### Libraries & Dependencies
- **react-native-document-picker**: Document selection
- **react-native-image-picker**: Camera and photo library
- **react-native-permissions**: Permission management
- **@react-native-async-storage**: Local data persistence

### Platform Support
- **iOS**: 13.0+ with Xcode 14+
- **Android**: API 21+ (Android 5.0+)
- **Development**: macOS, Windows, Linux

## 📋 Development Roadmap

### ✅ Completed Features
- Document picker implementation
- Image picker with camera support
- File validation and type checking
- UI components and theme system
- TypeScript type definitions
- Error handling and user feedback

### 🚧 In Progress
- IPFS backend integration testing
- File upload progress indicators
- Offline file caching
- Enhanced error recovery

### 📅 Future Enhancements
- Ring signature implementation
- User authentication system
- File encryption/decryption
- P2P file sharing
- Advanced file management
- Biometric authentication

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [IPFS Documentation](https://docs.ipfs.io/)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)