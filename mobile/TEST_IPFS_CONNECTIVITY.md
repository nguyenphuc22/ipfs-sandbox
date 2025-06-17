# IPFS Mobile App - Gateway Connectivity Test

## Overview
This document describes how to test the connectivity between the React Native mobile app and the IPFS gateway.

## Prerequisites

1. **Gateway Running**: Ensure the IPFS gateway is running at `http://localhost:3000`
2. **Mobile Dependencies**: All React Native dependencies installed
3. **Device/Simulator**: iOS simulator, Android emulator, or physical device

## Testing Setup

### 1. Start the Gateway System
```bash
# From the root directory
docker compose up -d
# or
./start-system.sh
```

### 2. Verify Gateway is Running
```bash
curl http://localhost:3000/health
```
Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-06-17T...",
  "service": "IPFS Gateway with ID-RS"
}
```

### 3. Start the Mobile App

#### For iOS Simulator:
```bash
cd mobile/
npm run ios
```

#### For Android Emulator:
```bash
cd mobile/
npm run android
```

## Connectivity Testing Scenarios

### Scenario 1: Mock Mode (Offline Development)
- **Purpose**: Test UI and functionality without gateway connection
- **Setup**: App starts in mock mode by default
- **Expected**: All operations work with simulated data

**Test Steps:**
1. Launch app
2. Verify connection status shows "Mock Mode"
3. Upload files (mock upload with generated IPFS hashes)
4. List files (shows mock data)
5. Delete files (removes from mock storage)

### Scenario 2: Online Mode (Real Gateway Connection)
- **Purpose**: Test actual gateway connectivity
- **Setup**: Switch to online mode in app
- **Expected**: Real API calls to gateway

**Test Steps:**
1. In app, tap "Switch to Online" button
2. Verify connection status (may show "Disconnected" if gateway not accessible)
3. If connected, upload real files
4. Verify files appear in gateway storage
5. Test download functionality

### Scenario 3: Network Error Handling
- **Purpose**: Test app behavior with network issues
- **Setup**: Stop gateway while app is running

**Test Steps:**
1. Start in online mode with gateway running
2. Stop the gateway (`docker compose down`)
3. Try to upload files
4. Verify error handling and user feedback
5. Switch back to mock mode to continue testing

## Expected API Endpoints

When in online mode, the app will attempt to connect to:

- **Health Check**: `GET http://localhost:3000/health`
- **IPFS Test**: `GET http://localhost:3000/api/files/test-ipfs`
- **File Upload**: `POST http://localhost:3000/api/files/upload`
- **File Download**: `GET http://localhost:3000/api/files/{hash}`
- **List Files**: `GET http://localhost:3000/api/files`
- **Delete File**: `DELETE http://localhost:3000/api/files/{hash}`
- **Signatures**: `GET http://localhost:3000/api/signatures`

## Mobile Network Configuration

### iOS Simulator
- Can access `localhost:3000` directly
- No additional configuration needed

### Android Emulator  
- `localhost` maps to the emulator, not the host machine
- Use `10.0.2.2:3000` instead of `localhost:3000`
- Update gateway URL in app settings

### Physical Device
- Device must be on same network as gateway server
- Use actual IP address (e.g., `192.168.1.100:3000`)
- Ensure gateway accepts connections from network IPs

## Testing Features

### 1. Connection Status
- Visual indicator of connection health
- Mock/Online mode toggle
- Last checked timestamp
- Error messages for failed connections

### 2. File Upload (CREATE)
- Single file upload
- Multiple file upload  
- Progress indicator
- Success/error notifications
- IPFS hash generation

### 3. File Listing (READ)
- List all files
- Get user-specific files
- File metadata display
- IPFS hash display

### 4. File Download (READ)
- Download files by IPFS hash
- Blob/content retrieval
- File access validation

### 5. File Deletion (DELETE)
- Delete by IPFS hash
- Confirmation dialogs
- Success/error feedback

### 6. Ring Signatures
- List signatures
- Create new signatures
- Verify signatures
- Mock signature data

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if gateway is running
   - Verify correct port (3000)
   - Check network configuration

2. **File Upload Fails**
   - Verify multipart/form-data support
   - Check file permissions
   - Ensure gateway API is accessible

3. **Mock Mode Not Working**
   - Check service initialization
   - Verify mock data generation
   - Check hook implementation

### Debug Tools

1. **React Native Debugger**
   - Monitor network requests
   - Check component state
   - View console logs

2. **Gateway Logs**
   ```bash
   docker logs ipfs-sandbox-gateway-1 -f
   ```

3. **Network Inspection**
   ```bash
   # Check if gateway is accessible
   curl -v http://localhost:3000/health
   
   # Test file upload
   curl -X POST -F "file=@test.txt" http://localhost:3000/api/files/upload
   ```

## Configuration Options

The app supports various configuration options through the `IPFSService`:

```typescript
// Mock mode for offline development
const mockService = createOfflineIPFSService();

// Online mode with custom gateway
const onlineService = createOnlineIPFSService('http://192.168.1.100:3000');

// Custom configuration
const customService = createIPFSService({
  useMockApi: false,
  gatewayUrl: 'http://custom-gateway:3000',
  timeout: 60000
});
```

## Success Criteria

✅ **Connection Status**: App correctly identifies mock/online mode
✅ **File Upload**: Files successfully upload and return IPFS hashes  
✅ **File Download**: Files can be retrieved by IPFS hash
✅ **File Listing**: App displays uploaded files with metadata
✅ **File Deletion**: Files can be removed from storage
✅ **Error Handling**: Network errors handled gracefully
✅ **Mock Mode**: Offline development works without gateway
✅ **Mode Switching**: Can toggle between mock and online modes
✅ **Progress Indicators**: Upload progress and loading states
✅ **User Feedback**: Success/error messages displayed appropriately

## Next Steps

1. **Production Configuration**: Set up proper gateway URLs for production
2. **Authentication**: Implement user authentication for file access
3. **File Encryption**: Add client-side encryption before upload
4. **Offline Sync**: Cache files locally and sync when online
5. **Push Notifications**: Notify users of upload completion
6. **File Sharing**: Implement file sharing via IPFS hashes