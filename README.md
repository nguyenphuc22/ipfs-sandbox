# IPFS ID-RS Sandbox

A comprehensive IPFS (InterPlanetary File System) Identity-based Ring Signatures sandbox environment with private network support, featuring a secure gateway architecture and cross-platform mobile application.

## 🏗️ System Architecture

This project implements a complete IPFS private network with the following components:

### Backend Infrastructure
- **Express.js Gateway**: Secure API gateway with exclusive IPFS access
- **Private IPFS Network**: 3-node storage network with shared swarm key
- **Database**: Prisma ORM with SQLite for users, files, and signatures
- **Cryptography**: Ring signatures implementation using node-forge
- **Docker Orchestration**: Containerized infrastructure with health monitoring

### Mobile Application
- **React Native**: Cross-platform mobile app (iOS/Android)
- **File Management**: Document picker, image picker, and file operations
- **IPFS Integration**: Upload/download files to private IPFS network
- **Modern UI**: TypeScript-based with theme support

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Node.js 20+ (for development)
- Git

### 1. Clone and Start System
```bash
git clone <repository-url>
cd ipfs-sandbox

# Start entire IPFS system
./start-system.sh
```

### 2. Verify System Status
```bash
# Check all services
./check-status.sh

# View logs
docker compose logs -f
```

### 3. Test CRUD Operations
```bash
# Test file upload
curl -X POST -F "file=@your-file.txt" http://localhost:3000/api/files/upload

# Test file download (replace HASH with returned hash)
curl http://localhost:3000/api/files/YOUR_HASH
```

## 📊 Services & Endpoints

### Backend API (Port 3000)
- `GET /health` - System health check
- `GET /api/users` - User management endpoint
- `POST /api/files/upload` - Upload files to IPFS
- `GET /api/files/:hash` - Download files from IPFS
- `GET /api/files/test-ipfs` - Test IPFS connectivity
- `GET /api/signatures` - Ring signature operations

### IPFS Services
- **IPFS API**: `http://localhost:5001` (Gateway exclusive access)
- **IPFS Gateway**: `http://localhost:8080` (Public gateway interface)
- **Storage Nodes**: Internal-only (no external ports)

## 🔒 Security Architecture

### Private Network Design
- **Gateway Exclusivity**: Only the gateway container can access IPFS API
- **Storage Node Isolation**: Storage nodes operate without external API exposure
- **Swarm Key Protection**: All nodes use shared private network key
- **Network Segmentation**: Docker internal network for inter-node communication

### Authentication & Authorization
- Ring signature-based identity verification
- Private network access controls
- API endpoint protection
- File encryption at rest

## 🛠️ Development

### Backend Development
```bash
cd backend/

# Install dependencies
npm install

# Development mode with auto-reload
npm run dev

# Database operations
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Database GUI
```

### Mobile Development
```bash
cd mobile/

# Install dependencies
npm install
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Docker Operations
```bash
# Rebuild containers
docker compose build --no-cache

# View container status
docker compose ps

# Clean system
./clean-docker.sh
```

## 🧪 Testing

### CRUD Operations Test
```bash
# Create test file
echo "Hello IPFS!" > test.txt

# Upload to IPFS
curl -X POST -F "file=@test.txt" http://localhost:3000/api/files/upload

# Expected response:
{
  "success": true,
  "hash": "QmXXXXXXXX...",
  "name": "test.txt",
  "size": 12,
  "ipfsUrl": "http://localhost:8080/ipfs/QmXXXXXXXX...",
  "apiUrl": "http://localhost:5001/api/v0/cat?arg=QmXXXXXXXX..."
}

# Download file
curl http://localhost:3000/api/files/QmXXXXXXXX...
```

### System Health Check
```bash
# Full system status
./check-status.sh

# Expected output:
✅ Backend API (port 3000)
✅ IPFS API (port 5001) 
✅ IPFS Gateway (port 8080)
✅ 3 Storage nodes healthy
✅ Private network: X peers connected
```

## 📁 Project Structure

```
ipfs-sandbox/
├── backend/                 # Express.js gateway
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # IPFS service
│   │   └── config/         # Database config
│   ├── prisma/             # Database schema
│   └── start.sh           # IPFS initialization
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # File services
│   │   └── types/         # TypeScript types
│   ├── ios/               # iOS configuration
│   └── android/           # Android configuration
├── docker-compose.yml     # Container orchestration
├── start-system.sh       # System startup script
├── check-status.sh       # Health monitoring
└── swarm.key            # Private network key
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env or docker-compose.yml)
NODE_ENV=development
DATABASE_URL=file:/app/data/database.db
IPFS_PATH=/data/ipfs
LIBP2P_FORCE_PNET=1
```

### IPFS Configuration
- **Private Network**: Enabled with swarm key
- **API Access**: Gateway exclusive (localhost:5001)
- **Storage Nodes**: 3 internal nodes for redundancy
- **Bootstrap**: Disabled (private network only)

## 📱 Mobile Features

### File Management
- Document picker integration
- Image picker with camera support
- File validation and type detection
- Upload progress tracking

### IPFS Integration
- Direct upload to private IPFS network
- File retrieval and caching
- Metadata management
- Error handling and retry logic

## 🚨 Troubleshooting

### Common Issues

**IPFS API not responding:**
```bash
# Check container logs
docker logs ipfs-sandbox-gateway-1

# Restart gateway
docker compose restart gateway
```

**File upload fails:**
```bash
# Verify IPFS connectivity
curl http://localhost:3000/api/files/test-ipfs

# Should return: {"success":true,"ipfsVersion":{"Version":"0.24.0",...}}
```

**Storage nodes disconnected:**
```bash
# Check swarm peers
docker exec ipfs-sandbox-gateway-1 ipfs swarm peers

# Restart entire system
./start-system.sh
```

### Logs and Monitoring
```bash
# All containers
docker compose logs -f

# Specific service
docker logs ipfs-sandbox-gateway-1 -f

# System resource usage
docker stats
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Documentation

- [CLAUDE.md](./CLAUDE.md) - Claude Code development instructions
- [Mobile README](./mobile/README.md) - Mobile app specific documentation
- [IPFS Documentation](https://docs.ipfs.tech/) - Official IPFS docs
- [Docker Compose](https://docs.docker.com/compose/) - Container orchestration

---

**Status**: ✅ Fully Functional - CRUD operations working, private network established, mobile app integrated.