# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## System Architecture

This is an IPFS ID-RS (Identity-based Ring Signatures) system consisting of:
- **Express.js Backend**: API gateway with Prisma ORM and SQLite database (`backend/`)
- **Private IPFS Network**: 3-node network with shared swarm key for file storage
- **Containerized Infrastructure**: Docker Compose orchestration with health checks

### Key Components
- **Gateway Container**: Backend API + IPFS node (ports 3000, 5001, 8080)
- **Storage Nodes**: 3 dedicated IPFS nodes (ports 4001-4003)
- **Database**: Prisma with SQLite for users, files, and signatures
- **Cryptography**: Ring signatures using node-forge library

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
- `GET /health` - System health check
- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/files` - File upload/download via IPFS
- `/api/signatures` - Ring signature operations

## Database Schema

Located in `backend/prisma/schema.prisma`:
- **User**: Authentication, keys, roles
- **File**: IPFS hashes, metadata, encryption keys
- **Signature**: Ring signatures with user rings and opening proofs

## IPFS Configuration

- **Private Network**: Uses shared swarm key (`./swarm.key`)
- **Gateway Node**: Full IPFS API + storage
- **Storage Nodes**: DHT routing, no bootstrap peers
- **Ports**: API (5001), Gateway (8080), Swarm (4001-4003)

## Development Notes

- Database file persists in `backend/data/database.db`
- IPFS data persists in Docker volumes
- Environment variables in docker-compose.yml
- Platform: linux/arm64 for Apple Silicon compatibility
- All route handlers are in `backend/src/routes/`