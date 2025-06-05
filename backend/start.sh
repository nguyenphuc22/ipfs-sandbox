#!/bin/sh

# Initialize IPFS if not exists
if [ ! -f "/data/ipfs/config" ]; then
    echo "Initializing IPFS..."
    export IPFS_PATH=/data/ipfs
    ipfs init

    # Copy swarm key for private network
    if [ -f "/data/ipfs/swarm.key" ]; then
        echo "Swarm key already exists"
    else
        echo "Swarm key not found, this might cause connectivity issues"
    fi

    # Configure for private network
    ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
    ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
    ipfs config --json Discovery.MDNS.Enabled true
    ipfs config --json Swarm.RelayClient.Enabled true

    # Remove default bootstrap nodes
    ipfs bootstrap rm --all
fi

# Start IPFS daemon
export IPFS_PATH=/data/ipfs
ipfs daemon --enable-pubsub-experiment &

# Wait for IPFS to be ready
echo "Waiting for IPFS to start..."
until ipfs id > /dev/null 2>&1; do
    sleep 1
done
echo "IPFS started successfully"

# Initialize database if needed
if [ ! -f "/app/data/database.db" ]; then
    echo "Initializing database..."
    npx prisma db push --skip-generate
fi

# Start Node.js application
npm start