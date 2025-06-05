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
services=(
    "Backend API:3000:/health"
    "IPFS API:5001:/api/v0/version"  
    "IPFS Gateway:8080:/ipfs/QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn"
)

for service in "${services[@]}"; do
    IFS=':' read -r name port path <<< "$service"
    if [[ -z "$path" ]]; then
        path="/"
    fi
    
    # Use different timeout and method for different services
    if [[ "$name" == "IPFS API" ]]; then
        response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 -X POST "http://localhost:${port}${path}" 2>/dev/null || echo "000")
    elif [[ "$name" == "IPFS Gateway" ]]; then
        response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "http://localhost:${port}" 2>/dev/null || echo "000")
    else
        response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "http://localhost:${port}${path}" 2>/dev/null || echo "000")
    fi
    if [[ "$response_code" =~ ^(200|404|405)$ ]]; then
        echo -e "  ${name}: ${GREEN}✓ Active${NC} (port ${port})"
    else
        echo -e "  ${name}: ${RED}✗ Inactive${NC} (port ${port}) [${response_code}]"
    fi
done

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