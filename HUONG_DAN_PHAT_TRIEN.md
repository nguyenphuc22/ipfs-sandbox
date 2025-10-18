# Hướng Dẫn Phát Triển IPFS Sandbox

## Tổng Quan Hệ Thống

IPFS Sandbox là một hệ thống IPFS ID-RS (Identity-based Ring Signatures) hoàn chỉnh bao gồm:
- **Backend Express.js**: API gateway với Prisma ORM và SQLite database
- **Mạng IPFS Private**: 3 nodes với swarm key chung để lưu trữ file bảo mật
- **React Native Mobile**: Ứng dụng đa nền tảng với khả năng quản lý file
- **Container Infrastructure**: Docker Compose với health checks

## Yêu Cầu Hệ Thống

### Cài Đặt Cần Thiết
- **Docker & Docker Compose**: Phiên bản mới nhất
- **Node.js**: >= 18.0
- **Android Studio**: Để phát triển Android (bao gồm Android SDK)
- **Java Development Kit (JDK)**: Phiên bản 17 hoặc 11
- **Watchman**: Cho React Native file watching (macOS)

### Cài Đặt Cho macOS
```bash
# Cài Docker Desktop
# Tải từ https://www.docker.com/products/docker-desktop

# Cài Node.js và npm
brew install node

# Cài Android Studio
# Tải từ https://developer.android.com/studio

# Cài JDK
brew install openjdk@17

# Cài Watchman (cho React Native)
brew install watchman

# Cài React Native CLI
npm install -g @react-native-community/cli
```

### Cài Đặt Cho Linux/Ubuntu
```bash
# Cài Docker
sudo apt update
sudo apt install docker.io docker-compose

# Cài Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài JDK
sudo apt install openjdk-17-jdk

# Thiết lập Android SDK (manual)
# Tải Android Studio từ https://developer.android.com/studio
```

## Hướng Dẫn Khởi Chạy Hệ Thống

### Bước 1: Clone và Chuẩn Bị Project
```bash
# Clone repository
git clone <repository-url>
cd ipfs-sandbox

# Kiểm tra các file cần thiết
ls -la
# Đảm bảo có: start-system.sh, docker-compose.yml, swarm.key
```

### Bước 2: Khởi Chạy Backend và IPFS Network
```bash
# Cấp quyền thực thi cho scripts
chmod +x start-system.sh check-status.sh clean-docker.sh

# Khởi chạy toàn bộ hệ thống backend
./start-system.sh
```

**Script này sẽ:**
- Kiểm tra Docker có đang chạy không
- Tạo swarm key nếu chưa có
- Build Docker images
- Khởi chạy 4 containers:
  - Gateway (Backend API + IPFS node)
  - 3 Storage nodes (IPFS network)
- Kiểm tra health của tất cả services
- Test kết nối IPFS network
- Hiển thị thông tin hệ thống

### Bước 3: Xác Minh Hệ Thống Hoạt Động
```bash
# Kiểm tra trạng thái containers
docker compose ps

# Kiểm tra logs
docker compose logs -f

# Test API endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/users
```

**Các URL quan trọng:**
- Backend API: `http://localhost:3000`
- IPFS API: `http://localhost:5001` (chỉ gateway)
- IPFS Gateway: `http://localhost:8080`
- Health Check: `http://localhost:3000/health`

### Bước 4: Chuẩn Bị Môi Trường React Native

#### 4.1. Cài Đặt Dependencies
```bash
cd mobile/

# Cài các dependencies
npm install

# Cho iOS (chỉ trên macOS)
cd ios/ && pod install && cd ..
```

#### 4.2. Cấu Hình Android Environment

**Thiết lập biến môi trường:**
```bash
# Thêm vào ~/.bashrc hoặc ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# hoặc
export ANDROID_HOME=$HOME/Android/Sdk          # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Reload shell
source ~/.bashrc  # hoặc ~/.zshrc
```

**Kiểm tra cài đặt:**
```bash
# Kiểm tra Android SDK
android --version
adb --version

# Kiểm tra React Native environment
npx react-native doctor
```

### Bước 5: Cấu Hình Kết Nối Mobile App

#### 5.1. Lấy Địa Chỉ IP Máy Host

**Tại sao cần IP máy host?**
Android emulator chạy trong môi trường ảo và không thể truy cập `localhost` của máy host. Vì vậy cần sử dụng IP thực của máy để kết nối.

**Cách lấy IP:**

**macOS/Linux:**
```bash
# Cách 1: Lấy tất cả IP (chọn IP WiFi/Ethernet)
ifconfig | grep "inet " | grep -v "127.0.0.1"
# Output: inet 192.168.1.69 netmask 0xffffff00 broadcast 192.168.1.255

# Cách 2: Chỉ lấy IP (tiện để copy)
ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}'
# Output: 192.168.1.69

# Cách 3: Xem tất cả interfaces
ifconfig
```

**Windows:**
```bash
# Xem tất cả network adapters
ipconfig

# Hoặc chỉ IPv4 addresses
ipconfig | findstr "IPv4"
```

**Ghi chú quan trọng:**
- Chọn IP của adapter đang active (WiFi hoặc Ethernet)
- Thường có format: `192.168.x.x` hoặc `10.x.x.x`
- Bỏ qua `127.0.0.1` (localhost)
- Bỏ qua các IP ảo (VPN, Docker)

#### 5.2. Cập Nhật Cấu Hình Mobile App

**Mở file cấu hình:**
```bash
cd /path/to/ipfs-sandbox/mobile/src/config/
nano api.ts
# Hoặc dùng VS Code: code api.ts
```

**Tìm và sửa dòng 17:**
```typescript
// =============================================================================
// 🔧 CONFIGURATION: Update this IP address for your development setup
// =============================================================================
// 
// TO GET YOUR IP ADDRESS:
// macOS/Linux: Run `ifconfig | grep "inet " | grep -v "127.0.0.1"`
// Windows: Run `ipconfig` and look for IPv4 Address
//
// UPDATE THE IP BELOW TO MATCH YOUR MACHINE'S IP:
const HOST_MACHINE_IP = '192.168.1.69'; // 👈 THAY ĐỔI IP NÀY
// =============================================================================
```

**Ví dụ cụ thể:**
```typescript
// Trước (IP cũ):
const HOST_MACHINE_IP = '192.168.1.69';

// Sau (IP mới của bạn):
const HOST_MACHINE_IP = '192.168.1.100'; // IP bạn vừa lấy được
```

#### 5.3. Kiểm Tra Kết Nối

**Test từ terminal:**
```bash
# Thay YOUR_IP bằng IP bạn vừa cấu hình
curl -s http://YOUR_IP:3000/health

# Ví dụ:
curl -s http://192.168.1.100:3000/health
# Kết quả mong đợi: {"status":"OK","timestamp":"...","service":"IPFS Gateway with ID-RS"}
```

**Nếu lệnh curl không hoạt động:**
1. Kiểm tra backend có đang chạy: `docker compose ps`
2. Kiểm tra firewall không block port 3000
3. Đảm bảo IP đúng và máy cùng mạng WiFi

### Bước 6: Chạy Mobile App trên Android

#### 6.1. Khởi Chạy Android Emulator
```bash
# Liệt kê các emulator có sẵn
emulator -list-avds

# Khởi chạy emulator (thay tên emulator)
emulator -avd <tên-emulator> &

# Hoặc khởi chạy từ Android Studio > AVD Manager
```

#### 6.2. Build và Run App
```bash
cd mobile/

# Start Metro bundler (terminal 1)
npm start
# hoặc
npx react-native start

# Build và chạy app (terminal 2)
npm run android
# hoặc
npx react-native run-android
```

**Lưu ý quan trọng:**
- Đảm bảo backend đang chạy trước khi start mobile app
- Đảm bảo đã cập nhật IP trong `mobile/src/config/api.ts`
- App sẽ kết nối tới `http://YOUR_IP:3000` (gateway API)
- Nếu dùng device thật, cùng cần sử dụng IP thực

### Bước 7: Kiểm Tra Kết Nối

#### 7.1. Test File Upload/Download

**Upload file từ terminal:**
```bash
# Tạo file test
echo "Hello IPFS Private Network!" > test.txt

# Upload file qua API
curl -X POST -F "file=@test.txt" http://localhost:3000/api/files/upload

# Kết quả mong đợi:
# {
#   "success": true,
#   "hash": "QmbRjfwN8nmQErzrx4mKnNq4J3duReiajUc9hhgFe9dMJs",
#   "name": "test.txt",
#   "size": 49,
#   "ipfsUrl": "http://localhost:8080/ipfs/QmbRjfwN8nmQErzrx4mKnNq4J3duReiajUc9hhgFe9dMJs"
# }
```

**Kiểm tra file đã upload:**
```bash
# Download file bằng IPFS hash (thay YOUR_HASH)
curl -s http://localhost:3000/api/files/YOUR_HASH

# Ví dụ với hash cụ thể:
curl -s http://localhost:3000/api/files/QmbRjfwN8nmQErzrx4mKnNq4J3duReiajUc9hhgFe9dMJs
# Output: Hello IPFS Private Network!

# Kiểm tra thông tin file (headers)
curl -I http://localhost:3000/api/files/YOUR_HASH

# Truy cập qua IPFS Gateway trực tiếp
curl -s http://localhost:8080/ipfs/YOUR_HASH
```

**Kiểm tra file từ mobile app:**
```bash
# Lấy IPFS hash từ mobile app logs:
# ReactNativeJS: 'Upload completed:', [ { ipfsHash: 'QmbRjfwN8nmQErzrx4mKnNq4J3duReiajUc9hhgFe9dMJs' } ]

# Test hash đó:
curl -s http://localhost:3000/api/files/QmbRjfwN8nmQErzrx4mKnNq4J3duReiajUc9hhgFe9dMJs
```

#### 7.2. Test trên Mobile App

**Kiểm tra Connection Status:**
1. Mở app trên emulator/device
2. Kiểm tra connection status ở đầu màn hình:
   - ✅ **"IPFS Gateway: Connected"** - Hoạt động tốt
   - ❌ **"IPFS Gateway: Disconnected"** - Cần kiểm tra IP config

**Kiểm tra Console Logs:**
Trong Metro bundler terminal, bạn sẽ thấy:
```
API Configuration: {
  platform: 'Android',
  environment: 'Development',
  selectedConfig: { baseUrl: 'http://192.168.1.100:3000', timeout: 30000 }
}
```

**Test Chức Năng:**
1. Thử upload file từ document picker
2. Xem danh sách files đã upload với IPFS hash
3. Thử download file
4. Kiểm tra error handling khi mất kết nối

**Nếu vẫn hiển thị "Disconnected":**
1. Kiểm tra lại IP trong `mobile/src/config/api.ts`
2. Reload app bằng cách nhấn `R` hai lần trong Metro console
3. Kiểm tra backend: `curl http://YOUR_IP:3000/health`
4. Kiểm tra cùng WiFi network

#### 7.3. Quản lý quyền ẩn danh (Grant / Revoke)

> ⚠️ **Lưu ý:** Các endpoint `anonymous-grants` đang được triển khai theo kế hoạch mới (18/10/2025). Trong thời gian phát triển có thể gọi trực tiếp qua script hỗ trợ hoặc mobile app Access Manager modal.

1. **Liệt kê người nhận hiện tại**
    ```bash
    curl -X GET http://localhost:3000/api/files/<FILE_ID>/anonymous-grants \
       -H 'Content-Type: application/json' \
       -d '{
          "ownershipPublicKey": "04abcd...",
          "schnorr": { "R": "...", "s": "...", "message": "owner-list:<FILE_ID>:<timestamp>:<nonce>" },
          "ringSignature": "0x...",
          "timestamp": 1729257600000,
          "nonce": "abc123..."
       }'
    ```

2. **Cấp quyền cho public key mới**
    ```bash
    curl -X POST http://localhost:3000/api/files/<FILE_ID>/anonymous-grants \
       -H 'Content-Type: application/json' \
       -d '{
          "ownershipPublicKey": "04abcd...",
          "targetPublicKey": "0299ef...",
          "expiresAt": null,
          "keyPackageFingerprint": "fp_123",
          "metadata": { "notes": "Demo day" },
          "schnorr": { "R": "...", "s": "...", "message": "grant:<FILE_ID>:<timestamp>:<nonce>" },
          "ringSignature": "0x...",
          "timestamp": 1729257600000,
          "nonce": "abc123..."
       }'
    ```

3. **Thu hồi quyền**
    ```bash
    curl -X DELETE http://localhost:3000/api/files/<FILE_ID>/anonymous-grants/<GRANT_ID> \
       -H 'Content-Type: application/json' \
       -d '{
          "ownershipPublicKey": "04abcd...",
          "schnorr": { "R": "...", "s": "...", "message": "revoke:<FILE_ID>:<GRANT_ID>:<timestamp>:<nonce>" },
          "ringSignature": "0x...",
          "timestamp": 1729257600000,
          "nonce": "abc123..."
       }'
    ```

4. **Kiểm tra audit log** – Sau mỗi thao tác, mở Prisma Studio:
    ```bash
    cd backend
    npm run prisma:studio
    ```
    Đảm bảo `anonymousAuditLog` ghi nhận `grant_issued` / `grant_revoked` và `AnonymousFileAccess.status` được cập nhật.

5. **Đồng bộ trên mobile** – Access Manager modal sẽ gọi lại `GET anonymous-grants` sau mỗi thao tác. Nếu cần reset dữ liệu demo, hãy xoá record liên quan trong SQLite (`backend/prisma/database.db`) hoặc dùng script `scripts/reset-anonymous-grants.js` (sẽ bổ sung cùng lúc triển khai backend).

## Quy Trình Phát Triển

### 1. Development Workflow

#### Backend Development
```bash
cd backend/

# Development mode với auto-reload
npm run dev

# Xem logs realtime
docker compose logs -f gateway

# Truy cập database
npm run prisma:studio
```

#### Mobile Development
```bash
cd mobile/

# Start Metro bundler
npm start

# Enable hot reload
# Nhấn 'r' trong Metro console để reload
# Nhấn 'd' để mở dev menu

# Run trên Android
npm run android

# Run trên iOS (chỉ macOS)
npm run ios
```

### 2. Debugging

#### Backend Debugging
```bash
# Xem logs chi tiết
docker compose logs -f gateway

# Kiểm tra IPFS daemon
docker exec ipfs-sandbox-gateway-1 ipfs id
docker exec ipfs-sandbox-gateway-1 ipfs swarm peers

# Test API trực tiếp
curl -X POST http://localhost:5001/api/v0/version
```

#### Mobile Debugging
```bash
# Enable debug mode
adb shell input keyevent 82  # Mở dev menu
# Chọn "Debug JS Remotely"

# Xem logs
npx react-native log-android  # Android logs
npx react-native log-ios      # iOS logs

# Kiểm tra network requests
# Sử dụng React Native Debugger hoặc Flipper
```

### 3. Testing

#### Backend Testing
```bash
cd backend/

# Test tất cả API endpoints
./test-ipfs-functionality.sh

# Test specific endpoints
curl http://localhost:3000/api/users
curl http://localhost:3000/api/files/test-ipfs
```

#### Mobile Testing
```bash
cd mobile/

# Run unit tests
npm test

# Run specific test file
npm test -- FilePickerService.test.ts
```

### 4. Database Management

```bash
cd backend/

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# View/edit database
npm run prisma:studio
# Truy cập: http://localhost:5555
```

## Cấu Trúc Project

### Backend (`backend/`)
```
backend/
├── src/
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── models/          # Data models
│   └── server.js        # Main server
├── prisma/
│   └── schema.prisma    # Database schema
└── data/
    └── database.db      # SQLite database
```

### Mobile (`mobile/`)
```
mobile/
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   ├── hooks/           # React hooks
│   ├── types/           # TypeScript types
│   └── utils/           # Utilities
├── android/             # Android specific files
└── ios/                 # iOS specific files
```

## Commands Cheat Sheet

### System Management
```bash
./start-system.sh       # Khởi chạy toàn bộ hệ thống
./check-status.sh       # Kiểm tra trạng thái
docker compose down     # Dừng hệ thống
./clean-docker.sh       # Dọn dẹp Docker resources

# Lấy IP cho mobile config
ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}'  # macOS/Linux
ipconfig | findstr "IPv4"                                          # Windows

# Kiểm tra IPFS hash
curl -s http://localhost:3000/api/files/YOUR_IPFS_HASH            # Download file
curl -I http://localhost:3000/api/files/YOUR_IPFS_HASH            # Check headers
curl -s http://localhost:8080/ipfs/YOUR_IPFS_HASH                 # IPFS Gateway direct
```

### Development
```bash
# Backend
cd backend && npm run dev

# Mobile
cd mobile && npm start
cd mobile && npm run android

# Database
cd backend && npm run prisma:studio
```

### Debugging
```bash
docker compose logs -f                    # All logs
docker logs ipfs-sandbox-gateway-1       # Gateway logs
npx react-native log-android             # Mobile logs
adb logcat                                # Android system logs
```

## Troubleshooting

### Common Issues

#### 1. Docker Issues
```bash
# Docker không chạy
# → Khởi động Docker Desktop

# Port đã được sử dụng
docker compose down
sudo lsof -i :3000  # Kiểm tra process đang dùng port
```

#### 2. IPFS Issues
```bash
# IPFS nodes không kết nối
docker exec ipfs-sandbox-gateway-1 ipfs swarm peers
# → Nếu không có peers, restart system

# API không phản hồi
curl -X POST http://localhost:5001/api/v0/version
# → Kiểm tra gateway container logs
```

#### 3. Mobile Issues

**"IPFS Gateway: Disconnected" Error:**
```bash
# 1. Lấy IP máy
ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}'

# 2. Cập nhật mobile/src/config/api.ts
# Sửa dòng: const HOST_MACHINE_IP = 'YOUR_NEW_IP';

# 3. Test IP hoạt động
curl http://YOUR_IP:3000/health

# 4. Reload mobile app
# Nhấn R hai lần trong Metro console
```

**Kiểm tra file đã upload:**
```bash
# Lấy IPFS hash từ mobile app logs hoặc response
# ReactNativeJS: 'Upload completed:', [ { ipfsHash: 'QmbRjfwN8...' } ]

# Kiểm tra file tồn tại
curl -s http://localhost:3000/api/files/QmbRjfwN8nmQErzrx4mKnNq4J3duReiajUc9hhgFe9dMJs

# Nếu trả về content = file tồn tại ✅
# Nếu lỗi 404 = file không tồn tại hoặc hash sai ❌

# Kiểm tra qua IPFS Gateway trực tiếp
curl -s http://localhost:8080/ipfs/YOUR_IPFS_HASH
```

**Metro bundler không start:**
```bash
npx react-native start --reset-cache
```

**Build fails:**
```bash
cd mobile/android && ./gradlew clean
cd .. && npm run android
```

#### 4. Development Issues
```bash
# Database connection errors
cd backend && npm run prisma:generate

# Dependencies issues
cd mobile && npm install
cd ios && pod install  # macOS only
```

### Network Configuration

**Cấu hình IP cho Mobile App:**

1. **Lấy IP máy host:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}'
   
   # Windows
   ipconfig | findstr "IPv4"
   ```

2. **Cập nhật config:**
   ```bash
   # Edit file: mobile/src/config/api.ts
   # Dòng 17: const HOST_MACHINE_IP = 'YOUR_IP_HERE';
   ```

3. **Reload app:**
   - Nhấn `R` hai lần trong Metro console
   - Hoặc `Ctrl+M` -> Reload

**Cho tất cả loại device:**
- ✅ **Android Emulator**: Sử dụng IP máy host
- ✅ **iOS Simulator**: Có thể dùng localhost hoặc IP máy host  
- ✅ **Physical Device**: Sử dụng IP máy host (cùng WiFi)

**Lưu ý:**
- Đảm bảo máy và device cùng WiFi network
- Kiểm tra firewall không block port 3000
- IP có thể thay đổi khi switch WiFi network

## Best Practices

### 1. Development Workflow
- Luôn start backend trước khi chạy mobile app
- Sử dụng `npm run dev` cho backend development
- Enable hot reload cho mobile development
- Commit thường xuyên với clear messages

### 2. Debugging
- Kiểm tra logs khi có lỗi
- Sử dụng React Native Debugger cho mobile
- Test API endpoints với curl/Postman
- Kiểm tra network connectivity

### 3. Code Organization
- Follow existing code conventions
- Sử dụng TypeScript cho mobile
- Keep components small và reusable
- Document complex logic

## 📋 Tóm Tắt Quy Trình

### Quy Trình Đầy Đủ

**1. Khởi chạy Backend:**
```bash
./start-system.sh
```

**2. Lấy IP máy:**
```bash
ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}'
```

**3. Cập nhật Mobile Config:**
```bash
# Edit mobile/src/config/api.ts line 17:
const HOST_MACHINE_IP = 'YOUR_IP'; // 👈 Thay IP
```

**4. Chạy Mobile App:**
```bash
cd mobile && npm start
cd mobile && npm run android
```

**5. Kiểm tra kết nối:**
- App hiển thị "IPFS Gateway: Connected" ✅
- Console logs hiển thị IP config đúng

### Khi IP Thay Đổi

**Chỉ cần 3 bước:**
1. `ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}'`
2. Sửa `mobile/src/config/api.ts` dòng 17
3. Nhấn `R` hai lần trong Metro console để reload

### Troubleshooting Nhanh

**"Disconnected" Error:**
1. Kiểm tra IP config: `mobile/src/config/api.ts`
2. Test backend: `curl http://YOUR_IP:3000/health`
3. Reload app: Press `R` twice in Metro

**Backend không chạy:**
1. `./start-system.sh`
2. `docker compose ps` để check status

**Kiểm tra file upload:**
1. Lấy IPFS hash từ mobile logs
2. Test: `curl -s http://localhost:3000/api/files/YOUR_HASH`
3. Nếu có content = upload thành công ✅

---

Hướng dẫn này cung cấp toàn bộ quy trình từ khởi tạo đến phát triển. Theo từng bước một cách tuần tự để đảm bảo hệ thống hoạt động ổn định.