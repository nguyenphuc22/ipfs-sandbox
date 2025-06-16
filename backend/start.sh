#!/bin/sh

# Set IPFS path - ensure it's exported for all processes
export IPFS_PATH=/data/ipfs
echo "IPFS_PATH set to: $IPFS_PATH"

# Verify IPFS binary is available
which ipfs && ipfs version || echo "IPFS binary not found or not working"

# Function to cleanup IPFS locks
cleanup_ipfs_locks() {
    echo "Cleaning up IPFS locks..."
    rm -f /data/ipfs/repo.lock
    rm -f /data/ipfs/api
    rm -f /data/ipfs/gateway
    rm -f /data/ipfs/datastore/LOCK
}

# Function to wait for IPFS daemon with timeout and better diagnostics
wait_for_ipfs() {
    max_attempts=60
    attempt=0
    
    echo "Waiting for IPFS daemon to start (IPFS_PATH=$IPFS_PATH)..."
    while [ $attempt -lt $max_attempts ]; do
        # Try to get IPFS ID with explicit path
        if IPFS_PATH=/data/ipfs ipfs id > /dev/null 2>&1; then
            echo "✅ IPFS daemon is ready!"
            # Show basic info
            IPFS_PATH=/data/ipfs ipfs id --format="<id>" | head -c 20
            echo "..."
            return 0
        fi
        
        # Check if IPFS process is still running
        if ! pgrep -f "ipfs daemon" > /dev/null; then
            echo "❌ ERROR: IPFS daemon process died"
            # Show any daemon logs
            echo "Last daemon output:"
            tail -n 5 /tmp/ipfs-daemon.log 2>/dev/null || echo "No daemon logs found"
            return 1
        fi
        
        # Show progress every 10 attempts
        if [ $((attempt % 10)) -eq 0 ] && [ $attempt -gt 0 ]; then
            echo "⏳ Still waiting... attempt $attempt/$max_attempts"
        fi
        
        attempt=$((attempt + 1))
        sleep 1
    done
    
    echo "❌ ERROR: IPFS daemon failed to start after ${max_attempts} seconds"
    echo "Process check:"
    pgrep -f "ipfs daemon" || echo "No IPFS daemon process found"
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

    # Configure for private network gateway
    ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
    ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
    ipfs config --json Discovery.MDNS.Enabled true
    ipfs config --json Swarm.RelayClient.Enabled true
    
    # Configure swarm addresses to listen on all interfaces
    ipfs config Addresses.Swarm "[\"/ip4/0.0.0.0/tcp/4001\", \"/ip6/::/tcp/4001\"]"
    
    # Enable CORS for API access
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"

    # Remove default bootstrap nodes (private network)
    ipfs bootstrap rm --all
    
    # Wait a moment to let other nodes start first
    echo "Waiting for storage nodes to initialize..."
    sleep 10
fi

# Clean locks again before starting daemon
cleanup_ipfs_locks

# Kill any existing IPFS processes
pkill -f "ipfs daemon" 2>/dev/null || true
sleep 2

# Clean locks one more time after killing processes
cleanup_ipfs_locks

# Start IPFS daemon in background with explicit IPFS_PATH
echo "Starting IPFS daemon with IPFS_PATH=$IPFS_PATH..."
export IPFS_PATH=/data/ipfs
IPFS_PATH=/data/ipfs ipfs daemon --enable-pubsub-experiment > /tmp/ipfs-daemon.log 2>&1 &
IPFS_PID=$!
echo "IPFS daemon started with PID: $IPFS_PID"
echo "Daemon output will be logged to /tmp/ipfs-daemon.log"

# Give daemon a moment to start
sleep 3

# Wait for IPFS to be ready
if ! wait_for_ipfs; then
    echo "FATAL: IPFS daemon failed to start properly"
    kill $IPFS_PID 2>/dev/null || true
    exit 1
fi

# Connect to storage nodes after daemon is ready
echo "Discovering and connecting to storage nodes..."

# Function to get container IP using getent (more reliable)
get_container_ip() {
    local container_name="$1"
    getent hosts "$container_name" | awk '{print $1}' 2>/dev/null || echo ""
}

# Function to connect to storage node with retries
connect_to_node() {
    local node_name="$1"
    local max_retries=3
    local retry=0
    
    echo "🔍 Discovering $node_name..."
    ip=$(get_container_ip "$node_name")
    
    if [ -z "$ip" ]; then
        echo "❌ Could not resolve IP for $node_name"
        return 1
    fi
    
    echo "📍 Found $node_name at IP: $ip"
    
    while [ $retry -lt $max_retries ]; do
        if IPFS_PATH=/data/ipfs ipfs swarm connect "/ip4/$ip/tcp/4001" 2>/dev/null; then
            echo "✅ Connected to $node_name"
            return 0
        fi
        retry=$((retry + 1))
        if [ $retry -lt $max_retries ]; then
            echo "⚠️  Connection attempt $retry failed, retrying..."
            sleep 2
        fi
    done
    
    echo "❌ Failed to connect to $node_name after $max_retries attempts"
    return 1
}

# Wait for storage nodes and connect with retries
for node in ipfs-node-1 ipfs-node-2 ipfs-node-3; do
    connect_to_node "$node"
done

# Show current swarm peers
echo ""
echo "📊 Current swarm network status:"
peer_count=$(IPFS_PATH=/data/ipfs ipfs swarm peers 2>/dev/null | wc -l)
echo "Connected peers: $peer_count"
if [ "$peer_count" -gt 0 ]; then
    echo "Peer addresses:"
    IPFS_PATH=/data/ipfs ipfs swarm peers | head -3
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