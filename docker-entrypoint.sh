#!/bin/bash
set -e

# Initialize the sandbox if it doesn't exist yet
if [ ! -d "/ipfs-sandbox/node1" ]; then
    echo "Initializing IPFS sandbox environment..."
    /ipfs-sandbox/scripts/setup-ipfs-sandbox.sh
fi

# Start all nodes if not running with a specific command
if [ "$1" = "start" ]; then
    echo "Starting all IPFS nodes..."
    /ipfs-sandbox/scripts/manage-ipfs-sandbox.sh start
    # Keep container running
    tail -f /dev/null
elif [ "$1" = "bash" ] || [ "$1" = "/bin/bash" ]; then
    exec "$@"
else
    echo "Running command: $@"
    exec "$@"
fi