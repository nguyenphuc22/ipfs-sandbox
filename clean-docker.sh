#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧹 Starting Docker Cleanup for IPFS ID-RS Project...${NC}\n"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

# Check Docker status
check_docker

# Stop all containers from this project
echo -e "${YELLOW}📦 Stopping project containers...${NC}"
docker compose -f docker-compose.yml down -v --remove-orphans 2>/dev/null || true

# Remove project-specific containers
echo -e "${YELLOW}🗑️  Removing project containers...${NC}"
container_ids=$(docker ps -a --filter "name=ipfs-sandbox-" --format "{{.ID}}" 2>/dev/null)
if [ -n "$container_ids" ]; then
    echo "$container_ids" | xargs docker rm -f 2>/dev/null || true
    echo -e "${GREEN}✅ Containers removed${NC}"
else
    echo -e "${BLUE}ℹ️  No project containers found${NC}"
fi

# Remove project volumes
echo -e "${YELLOW}💾 Removing project volumes...${NC}"
volume_names=$(docker volume ls --format "{{.Name}}" | grep -E "ipfs-sandbox[_-]" 2>/dev/null)
if [ -n "$volume_names" ]; then
    echo "$volume_names" | xargs docker volume rm 2>/dev/null || true
    echo -e "${GREEN}✅ Volumes removed${NC}"
else
    echo -e "${BLUE}ℹ️  No project volumes found${NC}"
fi

# Remove project images
echo -e "${YELLOW}🖼️  Removing project images...${NC}"
image_ids=$(docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | grep -E "ipfs-sandbox" | awk '{print $2}' 2>/dev/null)
if [ -n "$image_ids" ]; then
    echo "$image_ids" | xargs docker rmi -f 2>/dev/null || true
    echo -e "${GREEN}✅ Images removed${NC}"
else
    echo -e "${BLUE}ℹ️  No project images found${NC}"
fi

# Optional: Clean all unused Docker resources
echo -e "${YELLOW}🧽 Cleaning unused Docker resources...${NC}"
docker container prune -f
docker image prune -f
docker volume prune -f
docker network prune -f

# Clean build cache (optional - saves significant space)
echo -e "${YELLOW}🏗️  Clean Docker build cache? (y/N)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker builder prune -f
fi

# Show disk usage
echo -e "\n${GREEN}✅ Cleanup completed!${NC}"
echo -e "${YELLOW}📊 Current Docker disk usage:${NC}"
docker system df

# Optional: Full system prune (be careful!)
echo -e "\n${YELLOW}⚠️  Run full system prune? This will remove ALL unused Docker data (y/N)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker system prune -a --volumes -f
fi

echo -e "\n${GREEN}🎉 Docker cleanup finished!${NC}"
echo -e "${BLUE}💡 To restart the system, run: ./start-system.sh${NC}"