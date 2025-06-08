#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📊 IPFS ID-RS System Status${NC}\n"

# Check if containers are running
echo -e "${YELLOW}📦 Container Status:${NC}"
if ! command -v docker >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    exit 1
fi

docker compose ps

# Check IPFS network
echo -e "\n${YELLOW}🔗 IPFS Network Status:${NC}"

# Check gateway
if docker ps --format "{{.Names}}" | grep -q "^ipfs-sandbox-gateway-1$"; then
    peers=$(docker exec ipfs-sandbox-gateway-1 ipfs swarm peers 2>/dev/null | wc -l | tr -d ' ')
    echo -e "  gateway: ${GREEN}Running${NC} (${peers} peers)"
else
    echo -e "  gateway: ${RED}Not running${NC}"
fi

# Check IPFS nodes
for i in 1 2 3; do
    container="ipfs-sandbox-ipfs-node-${i}-1"
    if docker ps --format "{{.Names}}" | grep -q "^${container}$"; then
        peers=$(docker exec $container ipfs swarm peers 2>/dev/null | wc -l | tr -d ' ')
        echo -e "  ipfs-node-${i}: ${GREEN}Running${NC} (${peers} peers)"
    else
        echo -e "  ipfs-node-${i}: ${RED}Not running${NC}"
    fi
done

# Check services
echo -e "\n${YELLOW}🌐 Service Status:${NC}"

# Function to test service with retries and better error handling
test_service() {
    local name="$1"
    local port="$2"
    local path="$3"
    local method="$4"
    local max_retries=3
    local retry=0
    
    while [ $retry -lt $max_retries ]; do
        if [[ "$method" == "POST" ]]; then
            response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 --connect-timeout 3 -X POST "http://localhost:${port}${path}" 2>/dev/null || echo "000")
        else
            response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 --connect-timeout 3 "http://localhost:${port}${path}" 2>/dev/null || echo "000")
        fi
        
        # Check if we got a valid response
        if [[ "$response_code" =~ ^(200|404|405|302)$ ]]; then
            echo -e "  ${name}: ${GREEN}✓ Active${NC} (port ${port}) [${response_code}]"
            return 0
        elif [[ "$response_code" == "000" ]]; then
            # Connection failed, check if port is open
            if command -v nc >/dev/null 2>&1; then
                if nc -z localhost $port 2>/dev/null; then
                    echo -e "  ${name}: ${YELLOW}⚠ Port open but HTTP not responding${NC} (port ${port})"
                    return 1
                fi
            fi
        fi
        
        retry=$((retry + 1))
        if [ $retry -lt $max_retries ]; then
            sleep 1
        fi
    done
    
    echo -e "  ${name}: ${RED}✗ Inactive${NC} (port ${port}) [${response_code}]"
    return 1
}

# Test Backend API
test_service "Backend API" "3000" "/health" "GET"

# Test IPFS API with proper endpoint
test_service "IPFS API" "5001" "/api/v0/version" "POST"

# Test IPFS Gateway
test_service "IPFS Gateway" "8080" "/" "GET"

# Check API endpoints
echo -e "\n${YELLOW}🔌 API Endpoints:${NC}"
api_endpoints=("users" "auth" "files" "signatures")
for endpoint in "${api_endpoints[@]}"; do
    response=$(curl -s --max-time 5 "http://localhost:3000/api/${endpoint}" 2>/dev/null)
    if [[ "$response" =~ (working|implemented) ]]; then
        echo -e "  /api/${endpoint}: ${GREEN}✓ Responding${NC}"
    elif [[ -n "$response" ]]; then
        echo -e "  /api/${endpoint}: ${YELLOW}⚠ Placeholder${NC}"
    else
        echo -e "  /api/${endpoint}: ${RED}✗ Not responding${NC}"
    fi
done

# Show resource usage
echo -e "\n${YELLOW}💾 Resource Usage:${NC}"
if docker ps --format "{{.Names}}" | grep -q "ipfs-sandbox"; then
    echo -e "${BLUE}CONTAINER              CPU %     MEM USAGE${NC}"
    docker stats --no-stream --format "{{.Container}}   {{.CPUPerc}}   {{.MemUsage}}" | grep "ipfs-sandbox" | head -4
else
    echo -e "${RED}  No containers running${NC}"
fi

# Show disk usage
echo -e "\n${YELLOW}💿 Disk Usage:${NC}"
if docker system df >/dev/null 2>&1; then
    docker system df | grep -E "(TYPE|Images|Containers|Volumes)" 2>/dev/null
else
    echo -e "${RED}  Cannot get disk usage - Docker not available${NC}"
fi

# Show quick commands
echo -e "\n${BLUE}📋 Quick Commands:${NC}"
echo "  Restart system:    ./start-system.sh"
echo "  View logs:         docker compose logs -f"
echo "  Stop system:       docker compose down"
echo "  Clean system:      ./clean-docker.sh"
echo "  Test health:       curl http://localhost:3000/health"