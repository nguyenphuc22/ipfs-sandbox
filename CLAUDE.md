# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## System Architecture

This is a fully functional IPFS ID-RS (Identity-based Ring Signatures) system consisting of:
- **Express.js Backend**: API gateway with Prisma ORM and SQLite database (`backend/`)
- **Private IPFS Network**: 3-node network with shared swarm key for secure file storage
- **React Native Mobile**: Cross-platform app with file management capabilities
- **Containerized Infrastructure**: Docker Compose orchestration with health checks

### Key Components
- **Gateway Container**: Backend API + IPFS node (ports 3000, 5001, 8080) - **FULLY FUNCTIONAL**
- **Storage Nodes**: 3 dedicated IPFS nodes (internal network only, no external ports)
- **Database**: Prisma with SQLite for users, files, and signatures
- **Cryptography**: Ring signatures using node-forge library
- **Mobile App**: React Native with TypeScript, document picker, and IPFS integration

### Security Architecture
- **Gateway Exclusivity**: Only gateway container has IPFS API access (port 5001)
- **Network Isolation**: Storage nodes accessible only via internal Docker network
- **Private Network**: Swarm key fingerprint `c1df9ee7cb3c82fb83c6935ec7009ad7`
- **API Protection**: CORS enabled, secure file upload/download

## Essential Commands

### System Management
```bash
# Start entire system (preferred method)
./start-system.sh

# Check system status and health
./check-status.sh

# Stop system
docker compose down

# Clean all Docker resources
./clean-docker.sh
```

### Backend Development
```bash
cd backend/

# Development with auto-reload
npm run dev

# Production start
npm start

# Database operations
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open database GUI
```

### Docker Operations
```bash
# View logs
docker compose logs -f
docker logs ipfs-sandbox-gateway-1

# Rebuild containers
docker compose build --no-cache

# Container status
docker compose ps
```

## API Endpoints

All endpoints are accessible at `http://localhost:3000`:
- `GET /health` - System health check ✅ WORKING
- `GET /api/users` - User management ✅ WORKING
- `POST /api/files/upload` - Upload files to IPFS ✅ WORKING
- `GET /api/files/:hash` - Download files from IPFS ✅ WORKING
- `GET /api/files/test-ipfs` - Test IPFS connectivity ✅ WORKING
- `GET /api/signatures` - Ring signature operations ✅ WORKING
- `/api/auth` - Authentication routes (placeholder)

### IPFS Services
- **IPFS API**: `http://localhost:5001` ✅ WORKING (Gateway exclusive)
- **IPFS Gateway**: `http://localhost:8080` ✅ WORKING
- **IPFS Version**: Kubo v0.24.0 ✅ RUNNING

## Database Schema

Located in `backend/prisma/schema.prisma`:
- **User**: Authentication, keys, roles
- **File**: IPFS hashes, metadata, encryption keys
- **Signature**: Ring signatures with user rings and opening proofs

## IPFS Configuration

- **Private Network**: Uses shared swarm key (`./swarm.key`) ✅ ACTIVE
- **Gateway Node**: Full IPFS API + storage ✅ RUNNING
- **Storage Nodes**: DHT routing, internal communication only ✅ HEALTHY
- **Network**: Docker bridge network `ipfs-private` ✅ ISOLATED
- **Swarm Key Fingerprint**: `c1df9ee7cb3c82fb83c6935ec7009ad7`

### CRUD Operations Status
- **CREATE**: File upload via multipart form ✅ WORKING
- **READ**: File download by IPFS hash ✅ WORKING
- **UPDATE**: N/A (IPFS immutable by design)
- **DELETE**: Content-addressed, no deletion ✅ BY DESIGN

## Development Notes

- Database file persists in `backend/data/database.db`
- IPFS data persists in Docker volumes: `gateway_data`, `node1_data`, `node2_data`, `node3_data`
- Environment variables in docker-compose.yml include `IPFS_PATH=/data/ipfs`
- Platform: linux/arm64 for Apple Silicon compatibility
- All route handlers are in `backend/src/routes/`
- IPFS daemon logs available at `/tmp/ipfs-daemon.log` inside gateway container
- Mobile app in `mobile/` directory with React Native + TypeScript

## Testing & Verification

### Test File Upload/Download
```bash
# Create test file
echo "Hello IPFS Private Network!" > test.txt

# Upload file
curl -X POST -F "file=@test.txt" http://localhost:3000/api/files/upload

# Download file (replace HASH with returned hash)
curl http://localhost:3000/api/files/HASH
```

### Verify IPFS Network
```bash
# Check IPFS daemon status
docker exec ipfs-sandbox-gateway-1 ipfs id

# Check swarm peers
docker exec ipfs-sandbox-gateway-1 ipfs swarm peers

# Test API connectivity
curl -X POST http://localhost:5001/api/v0/version
```