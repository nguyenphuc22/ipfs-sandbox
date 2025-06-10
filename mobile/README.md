# IPFS Sandbox Mobile App

React Native mobile application for the IPFS ID-RS (Identity-based Ring Signatures) system.

## Overview

This is a simple "Hello World" React Native app that demonstrates the mobile component of the IPFS Sandbox project. The app features:

- Clean, responsive Hello World interface
- Automatic dark/light mode support
- Cross-platform compatibility (iOS & Android)
- Integration-ready architecture for IPFS functionality

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
├── App.tsx                 # Main app component (Hello World)
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Making Changes

1. Edit `App.tsx` to modify the UI
2. Changes will automatically reflect via Fast Refresh
3. Force reload: Press `R` twice (Android) or `R` once (iOS)

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

## Integration with IPFS Backend

This mobile app is designed to integrate with the IPFS ID-RS backend system:

- **Backend API**: http://localhost:3000
- **IPFS Gateway**: http://localhost:8080
- **Future features**: File upload, ring signatures, user authentication

## Tech Stack

- **React Native**: 0.79.3
- **React**: 19.0.0
- **TypeScript**: 5.0.4
- **Metro**: 0.82.4
- **Platform**: iOS 13+ / Android API 21+

## Next Steps

- Implement IPFS file operations
- Add user authentication
- Integrate ring signature functionality
- Connect to backend API endpoints

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [IPFS Documentation](https://docs.ipfs.io/)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)