#!/bin/sh

# Set IPFS path
export IPFS_PATH=/data/ipfs

# Function to cleanup IPFS locks
cleanup_ipfs_locks() {
    echo "Cleaning up IPFS locks..."
    rm -f /data/ipfs/repo.lock
    rm -f /data/ipfs/api
    rm -f /data/ipfs/gateway
    rm -f /data/ipfs/datastore/LOCK
}

# Function to wait for IPFS daemon with timeout
wait_for_ipfs() {
    max_attempts=60
    attempt=0
    
    echo "Waiting for IPFS daemon to start..."
    while [ $attempt -lt $max_attempts ]; do
        if ipfs id > /dev/null 2>&1; then
            echo "IPFS daemon is ready!"
            return 0
        fi
        
        # Check if IPFS process is still running
        if ! pgrep -f "ipfs daemon" > /dev/null; then
            echo "ERROR: IPFS daemon process died"
            return 1
        fi
        
        attempt=$((attempt + 1))
        sleep 1
    done
    
    echo "ERROR: IPFS daemon failed to start after ${max_attempts} seconds"
    return 1
}

# Function to validate IPFS HTTP endpoints
validate_ipfs_endpoints() {
    echo "Validating IPFS HTTP endpoints..."
    
    # Test API endpoint
    if ! curl -s --max-time 5 -X POST http://localhost:5001/api/v0/version > /dev/null 2>&1; then
        echo "WARNING: IPFS API endpoint not responding"
        return 1
    fi
    
    # Test Gateway endpoint  
    if ! curl -s --max-time 5 -I http://localhost:8080 > /dev/null 2>&1; then
        echo "WARNING: IPFS Gateway endpoint not responding"
        return 1
    fi
    
    echo "IPFS HTTP endpoints are responding"
    return 0
}

# Function to initialize database with retry
init_database() {
    echo "Initializing database..."
    max_attempts=3
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if npx prisma db push --skip-generate; then
            echo "Database initialized successfully"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo "Database initialization attempt $attempt failed, retrying..."
        sleep 2
    done
    
    echo "ERROR: Database initialization failed after $max_attempts attempts"
    return 1
}

# Cleanup any existing locks
cleanup_ipfs_locks

# Initialize IPFS if not exists
if [ ! -f "/data/ipfs/config" ]; then
    echo "Initializing IPFS..."
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

# Clean locks again before starting daemon
cleanup_ipfs_locks

# Kill any existing IPFS processes
pkill -f "ipfs daemon" 2>/dev/null || true
sleep 2

# Clean locks one more time after killing processes
cleanup_ipfs_locks

# Start IPFS daemon in background
echo "Starting IPFS daemon..."
ipfs daemon --enable-pubsub-experiment &
IPFS_PID=$!

# Wait for IPFS to be ready
if ! wait_for_ipfs; then
    echo "FATAL: IPFS daemon failed to start properly"
    kill $IPFS_PID 2>/dev/null || true
    exit 1
fi

# Validate HTTP endpoints
if ! validate_ipfs_endpoints; then
    echo "WARNING: IPFS HTTP endpoints not fully functional, continuing anyway..."
fi

# Create data directory if it doesn't exist
mkdir -p /app/data

# Initialize database if needed
if [ ! -f "/app/data/database.db" ]; then
    if ! init_database; then
        echo "FATAL: Database initialization failed"
        kill $IPFS_PID 2>/dev/null || true
        exit 1
    fi
fi

# Start Node.js application
echo "Starting Node.js application..."
npm start