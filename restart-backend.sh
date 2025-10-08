#!/bin/bash
set -euo pipefail

# Quick helper to restart the backend (gateway) service without touching other containers.
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVICE="gateway"
HEALTH_URL="http://localhost:3000/health"
MAX_ATTEMPTS=20

if ! command -v docker >/dev/null 2>&1; then
    echo -e "${RED}Docker is not installed or not in PATH.${NC}"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}Docker daemon is not running. Please start Docker first.${NC}"
    exit 1
fi

if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}docker-compose.yml not found. Run this script from the project root.${NC}"
    exit 1
fi

container_id=$(docker compose ps -q "$SERVICE" 2>/dev/null || true)

echo -e "${BLUE}Restarting backend service (${SERVICE})...${NC}"
if [ -z "$container_id" ]; then
    echo -e "${YELLOW}Service is not running yet; starting it now...${NC}"
    docker compose up -d "$SERVICE"
else
    docker compose restart "$SERVICE"
fi

echo -e "${YELLOW}Waiting for backend health check at ${HEALTH_URL}...${NC}"
for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$HEALTH_URL" || echo "000")
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}Backend is up (HTTP ${status}).${NC}"
        docker compose ps "$SERVICE"
        exit 0
    fi
    sleep 2
done

echo -e "${RED}Backend did not become healthy after $((MAX_ATTEMPTS * 2)) seconds.${NC}"
echo -e "${YELLOW}Recent logs:${NC}"
docker compose logs "$SERVICE" | tail -n 20 || true
exit 1
