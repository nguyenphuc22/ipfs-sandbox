# Android App Testing Guide - Offline Mode

## ✅ Current Status
- **✅ Build Status**: Android APK built successfully
- **✅ Installation**: App installed on emulator (Pixel_6_API_33)
- **✅ Launch**: App launched successfully 
- **✅ Process**: Running as PID 5195 with com.ipfssandboxmobile

## 📱 Testing Steps for Offline Mode

### 1. App Launch Verification
```bash
# Check if app is running
adb shell "ps | grep ipfssandbox"

# Check app package info
adb shell pm list packages | grep ipfssandbox

# Launch app manually
adb shell am start -n com.ipfssandboxmobile/com.ipfssandboxmobile.MainActivity
```

### 2. Manual Testing on Emulator

**What to Look For:**
1. **IPFS Connection Status Panel**
   - Should show "Mock Mode" indicator
   - Connection status should be "Connected" (green)
   - "Switch to Online" button should be visible

2. **File Upload Section**
   - "Select Files to Upload" button should be enabled
   - Should allow picking files from emulator
   - Upload progress should work with mock delays

3. **CRUD Operations Section** 
   - "List All Files" button should work
   - "Get User Files" button should function
   - "Get Signatures" should show mock data
   - "Clear Mock Data" should reset file list

### 3. Testing Offline Mode Features

**Test Scenario 1: Mock File Upload**
1. Tap "Select Files to Upload"
2. Choose any file from emulator storage
3. Should see upload progress
4. Should get success message with mock IPFS hash
5. File should appear in list below

**Test Scenario 2: List Files**
1. Tap "List All Files" 
2. Should see previously uploaded files
3. Each file should show:
   - File name
   - File size
   - Upload timestamp
   - Mock IPFS hash (starting with 'Qm')
   - Delete button

**Test Scenario 3: Delete Files**
1. Tap "Delete" on any file
2. Should show confirmation dialog
3. After confirmation, file should disappear from list

**Test Scenario 4: Clear Mock Data**
1. Upload a few files
2. Tap "Clear Mock Data"
3. Should show success message
4. File list should become empty

**Test Scenario 5: Mode Indicator**
1. Connection status should show "Mock Mode"
2. Should see blue/info colored status indicator
3. "Switch to Online" button should be present
4. Last checked timestamp should update

### 4. Expected Behaviors (Offline Mode)

**✅ Should Work:**
- All UI interactions are responsive
- File picker opens and allows selection
- Upload shows progress (simulated)
- Mock IPFS hashes are generated (Qm... format)
- File operations (list, delete) work immediately
- No network calls are made
- All operations complete within 1-2 seconds (mock delay)

**✅ Mock Data Characteristics:**
- IPFS hashes start with "Qm" followed by random characters
- File sizes are realistic (in KB/MB)
- Timestamps show current upload time
- Status is always "completed" for uploaded files
- Signature operations return mock cryptographic data

**❌ Should Not Happen:**
- Network connection errors
- Long loading times (>5 seconds)
- App crashes or freezes
- Empty or undefined responses
- Real network requests to localhost:3000

### 5. Logs Verification

**Check React Native Logs:**
```bash
# Filter for React Native JavaScript logs
adb logcat -s ReactNativeJS:V

# Look for IPFS-related console logs
adb logcat | grep -i "mock\|ipfs\|upload"

# Check for any error logs
adb logcat *:E | grep ipfssandbox
```

**Expected Log Messages:**
- No network error messages
- Mock service initialization logs
- File upload completion logs
- Mock IPFS hash generation logs

### 6. Performance Expectations

**Response Times (Mock Mode):**
- File picker: < 1 second
- Upload simulation: 1-2 seconds
- List files: < 1 second  
- Delete files: < 1 second
- Clear data: Immediate

**Memory Usage:**
- App should use < 100MB RAM
- No memory leaks during operations
- Smooth scrolling in file lists

### 7. UI/UX Verification

**Connection Status Panel:**
- Clear visual indicator of mock mode
- Color-coded status (blue for mock, green for connected)
- Responsive buttons
- Readable timestamps

**File Upload Interface:**
- Progress bar shows during uploads
- Success/error messages are clear
- File metadata displays correctly
- Delete confirmations work

**File List:**
- Files display in reverse chronological order
- File icons match file types
- IPFS hashes are properly formatted
- Responsive delete buttons

## 🎯 Success Criteria

### Core Functionality Tests
- [ ] App launches without crashes
- [ ] Shows "Mock Mode" status
- [ ] File picker opens successfully  
- [ ] Files upload with mock progress
- [ ] Mock IPFS hashes generated
- [ ] File list updates correctly
- [ ] Delete operations work
- [ ] Clear data functionality works

### Performance Tests  
- [ ] All operations complete within expected time
- [ ] No UI freezing or lag
- [ ] Memory usage stays reasonable
- [ ] No error logs in console

### Mock Mode Validation
- [ ] No real network requests
- [ ] Mock delays simulate real behavior
- [ ] Generated data looks realistic
- [ ] Error handling works for simulated failures

## 🚀 Next Steps

After offline mode verification:
1. Test online mode (requires gateway running)
2. Test mode switching functionality
3. Test error scenarios and recovery
4. Performance testing with large files
5. UI/UX refinements

## 📊 Test Results Template

```
Date: [DATE]
Tester: [NAME]
Device: Pixel_6_API_33 (Android 13)
App Version: [VERSION]

✅ PASSED Tests:
- [ ] App launch
- [ ] Mock mode indicator
- [ ] File upload
- [ ] File listing
- [ ] File deletion
- [ ] Mock data clearing
- [ ] UI responsiveness
- [ ] Performance

❌ FAILED Tests:
- [ ] [List any failures]

🐛 Issues Found:
- [List any bugs or issues]

📝 Notes:
- [Additional observations]
```