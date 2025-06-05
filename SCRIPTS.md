# IPFS ID-RS System Scripts

This document describes the utility scripts available for managing the IPFS ID-RS system.

## Available Scripts

### 🚀 start-system.sh
Starts the complete IPFS ID-RS system with all services.

**Usage:**
```bash
./start-system.sh
```

**What it does:**
- Checks if Docker is running
- Generates swarm key if needed
- Builds Docker images
- Starts all containers (3 IPFS nodes + Gateway)
- Waits for services to be ready
- Tests connectivity and API endpoints
- Shows system status and useful URLs

**Example output:**
```
🚀 Starting IPFS ID-RS System...
✅ Backend API is healthy
✅ /api/users is responding
✅ /api/auth is responding
✅ /api/files is responding
✅ /api/signatures is responding

🌐 System URLs:
  Backend API:       http://localhost:3000
  Health Check:      http://localhost:3000/health
  IPFS API:          http://localhost:5001
  IPFS Gateway:      http://localhost:8080
```

### 📊 check-status.sh
Displays the current status of all system components.

**Usage:**
```bash
./check-status.sh
```

**What it shows:**
- Container status and health
- IPFS network connectivity (peer counts)
- Service availability on ports 3000, 5001, 8080
- API endpoint responses
- Resource usage (CPU, memory)
- Docker disk usage
- Quick command reference

### 🧹 clean-docker.sh
Safely cleans up all Docker resources related to the project.

**Usage:**
```bash
./clean-docker.sh
```

**What it does:**
- Stops all project containers
- Removes project containers and volumes
- Removes project images
- Cleans unused Docker resources
- Optionally cleans build cache
- Optionally runs full system prune

**Interactive prompts:**
- Docker build cache cleanup (saves space)
- Full system prune (removes ALL unused Docker data)

## Quick Start

1. **Start the system:**
   ```bash
   ./start-system.sh
   ```

2. **Check system status:**
   ```bash
   ./check-status.sh
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/api/users
   ```

4. **View logs:**
   ```bash
   docker compose logs -f
   ```

5. **Stop the system:**
   ```bash
   docker compose down
   ```

6. **Clean everything:**
   ```bash
   ./clean-docker.sh
   ```

## System URLs

Once started, the system provides these endpoints:

- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **API Endpoints:**
  - http://localhost:3000/api/users
  - http://localhost:3000/api/auth
  - http://localhost:3000/api/files
  - http://localhost:3000/api/signatures
- **IPFS API:** http://localhost:5001
- **IPFS Gateway:** http://localhost:8080
- **IPFS Nodes:** http://localhost:4001, 4002, 4003

## Troubleshooting

### System won't start
1. Check if Docker is running: `docker info`
2. Clean previous state: `./clean-docker.sh`
3. Try starting again: `./start-system.sh`

### Services not responding
1. Check container status: `docker compose ps`
2. View logs: `docker compose logs -f`
3. Check specific service: `docker logs ipfs-sandbox-gateway-1`

### Build issues
1. Clean Docker cache: Answer 'y' to build cache prompt in `./clean-docker.sh`
2. Force rebuild: `docker compose build --no-cache`

### Port conflicts
Make sure ports 3000, 4001-4003, 5001, and 8080 are not used by other applications.

## Development

The system includes:
- ✅ Express.js backend with working API routes
- ✅ Prisma ORM with SQLite database
- ✅ 3-node IPFS network with swarm key
- ✅ Docker containerization
- ✅ Health checks and monitoring
- ✅ Comprehensive logging

All API endpoints return appropriate responses (working endpoints or "not implemented" placeholders for future development).
