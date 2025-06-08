#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting IPFS ID-RS System...${NC}\n"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

# Function to wait for service with HTTP validation
wait_for_service() {
    local service=$1
    local port=$2
    local endpoint="$3"
    local method="${4:-GET}"
    local max_attempts=30
    local attempt=0

    echo -e "${YELLOW}⏳ Waiting for $service on port $port...${NC}"

    while [ $attempt -lt $max_attempts ]; do
        # First check if port is open
        local port_open=false
        if command -v nc >/dev/null 2>&1; then
            if nc -z localhost $port 2>/dev/null; then
                port_open=true
            fi
        else
            if timeout 1 bash -c "</dev/tcp/localhost/$port" 2>/dev/null; then
                port_open=true
            fi
        fi
        
        if [ "$port_open" = true ]; then
            # Port is open, now test HTTP endpoint if provided
            if [ -n "$endpoint" ]; then
                local response_code
                if [ "$method" = "POST" ]; then
                    response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 --connect-timeout 2 -X POST "http://localhost:${port}${endpoint}" 2>/dev/null || echo "000")
                else
                    response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 --connect-timeout 2 "http://localhost:${port}${endpoint}" 2>/dev/null || echo "000")
                fi
                
                if [[ "$response_code" =~ ^(200|404|405|302)$ ]]; then
                    echo -e "${GREEN}✅ $service is ready on port $port [HTTP $response_code]${NC}"
                    return 0
                else
                    echo -e "${YELLOW}⏳ $service port open but HTTP not ready [${response_code}]...${NC}"
                fi
            else
                echo -e "${GREEN}✅ $service is ready on port $port${NC}"
                return 0
            fi
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done

    echo -e "${RED}❌ $service failed to start on port $port after ${max_attempts} attempts${NC}"
    return 1
}

# Function to verify IPFS peer connectivity
verify_ipfs_connectivity() {
    echo -e "\n${YELLOW}🔗 Verifying IPFS network connectivity...${NC}"
    
    # Wait a bit for nodes to discover each other
    sleep 10
    
    # Check gateway peers
    if docker ps --format "{{.Names}}" | grep -q "^ipfs-sandbox-gateway-1$"; then
        local gateway_peers
        gateway_peers=$(docker exec ipfs-sandbox-gateway-1 ipfs swarm peers 2>/dev/null | wc -l | tr -d ' ')
        if [ "$gateway_peers" -gt 0 ]; then
            echo -e "${GREEN}✅ Gateway connected to $gateway_peers peers${NC}"
        else
            echo -e "${YELLOW}⚠️  Gateway has no peers yet${NC}"
        fi
    fi
    
    # Check individual nodes
    local total_connections=0
    for i in 1 2 3; do
        local container="ipfs-sandbox-ipfs-node-${i}-1"
        if docker ps --format "{{.Names}}" | grep -q "^${container}$"; then
            local node_peers
            node_peers=$(docker exec "$container" ipfs swarm peers 2>/dev/null | wc -l | tr -d ' ')
            total_connections=$((total_connections + node_peers))
            echo -e "${GREEN}✅ Node $i connected to $node_peers peers${NC}"
        fi
    done
    
    if [ $total_connections -gt 0 ]; then
        echo -e "${GREEN}✅ IPFS network is connected (total: $total_connections connections)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  IPFS nodes not yet connected, may connect shortly${NC}"
        return 1
    fi
}

# Function to check command availability
check_command() {
    if ! command -v $1 >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  $1 is not installed, continuing anyway...${NC}"
    fi
}

# Check Docker
check_docker

# Check required commands
check_command "docker"
check_command "curl"

# Note: nc (netcat) is checked but not required

# Check if swarm.key exists
if [ ! -f "swarm.key" ]; then
    echo -e "${YELLOW}🔑 Generating swarm key...${NC}"
    echo -e "/key/swarm/psk/1.0.0/\n/base16/\n$(openssl rand -hex 32)" > swarm.key
    echo -e "${GREEN}✅ Swarm key generated${NC}"
fi

# Build images
echo -e "\n${YELLOW}🏗️  Building Docker images...${NC}"
docker compose build

# Start containers
echo -e "\n${YELLOW}🐳 Starting containers...${NC}"
docker compose up -d

# Wait for services to be ready
echo -e "\n${YELLOW}⏳ Waiting for services to start...${NC}"

# Wait for IPFS nodes (TCP only)
wait_for_service "IPFS Node 1" 4001
wait_for_service "IPFS Node 2" 4002
wait_for_service "IPFS Node 3" 4003

# Wait for Gateway services with HTTP validation
wait_for_service "Backend API" 3000 "/health" "GET"
wait_for_service "IPFS API" 5001 "/api/v0/version" "POST"
wait_for_service "IPFS Gateway" 8080 "/" "GET"

# Show container status
echo -e "\n${YELLOW}📦 Container Status:${NC}"
docker compose ps

# Verify IPFS connectivity
verify_ipfs_connectivity

# Test Backend API
echo -e "\n${YELLOW}🧪 Testing Backend API...${NC}"
if curl -s http://localhost:3000/health | grep -q "OK"; then
    echo -e "${GREEN}✅ Backend API is healthy${NC}"
    
    # Test API endpoints
    echo -e "\n${YELLOW}🔍 Testing API endpoints...${NC}"
    for endpoint in "users" "auth" "files" "signatures"; do
        if curl -s http://localhost:3000/api/$endpoint | grep -q -E "(working|implemented)"; then
            echo -e "${GREEN}✅ /api/$endpoint is responding${NC}"
        else
            echo -e "${YELLOW}⚠️  /api/$endpoint returned unexpected response${NC}"
        fi
    done
else
    echo -e "${RED}❌ Backend API health check failed${NC}"
fi

# Show useful information
echo -e "\n${BLUE}🌐 System URLs:${NC}"
echo "  Backend API:       http://localhost:3000"
echo "  Health Check:      http://localhost:3000/health"
echo "  IPFS API:          http://localhost:5001"
echo "  IPFS Gateway:      http://localhost:8080"

echo -e "\n${BLUE}📋 Quick Commands:${NC}"
echo "  View logs:         docker compose logs -f"
echo "  View gateway logs: docker compose logs -f gateway"
echo "  Check IPFS peers:  docker exec ipfs-sandbox-gateway-1 ipfs swarm peers"
echo "  Test APIs:         curl http://localhost:3000/api/users"
echo "  Stop system:       docker compose down"
echo "  Clean system:      ./clean-docker.sh"

echo -e "\n${GREEN}🎉 System started successfully!${NC}"

# Optional: Open logs
echo -e "\n${YELLOW}📜 Show logs? (y/N)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker compose logs -f
fi