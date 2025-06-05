.PHONY: start stop clean status logs help

# Default target
help:
	@echo "IPFS ID-RS System Management"
	@echo "============================"
	@echo "make start   - Start the system"
	@echo "make stop    - Stop the system"
	@echo "make clean   - Clean all Docker resources"
	@echo "make status  - Check system status"
	@echo "make logs    - View logs"
	@echo "make shell   - Enter gateway container"

start:
	@./start-system.sh

stop:
	@docker compose down

clean:
	@./clean-docker.sh

status:
	@./check-status.sh

logs:
	@docker compose logs -f

shell:
	@docker exec -it backend-gateway-1 /bin/sh

# Development helpers
build:
	@docker compose build --no-cache

restart: stop start

gateway-logs:
	@docker compose logs -f gateway

ipfs-peers:
	@docker exec backend-gateway-1 ipfs swarm peers