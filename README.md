# IPFS Sandbox Testing Environment

This repository contains scripts and instructions for setting up a local IPFS sandbox environment with multiple nodes to test content distribution and replication in IPFS.

## Overview

The sandbox creates 5 IPFS nodes on your local machine that form a private network. This allows you to experiment with:
- File chunking and distribution
- Content addressing
- Pinning and unpinning
- Garbage collection
- Content retrieval across nodes

## Requirements

- MacOS (scripts are optimized for MacOS, but can be adapted for Linux)
- IPFS Kubo installed (`brew install ipfs` or download from https://dist.ipfs.tech/)
- Bash/ZSH shell

## Quick Setup

For a quick automated setup, use the following script:

```bash
#!/bin/bash
# setup-ipfs-sandbox.sh

# Create sandbox directory structure
SANDBOX_DIR=~/ipfs-sandbox
mkdir -p $SANDBOX_DIR
cd $SANDBOX_DIR

# Create directories for each node and swarm key
mkdir -p node{1..5} swarm logs pids

# Create swarm key for private network
echo -e "/key/swarm/psk/1.0.0/\n/base16/\n$(openssl rand -hex 32)" > swarm/swarm.key

# Initialize IPFS nodes
for i in {1..5}; do
  export IPFS_PATH=$SANDBOX_DIR/node$i
  
  # Check if node is already initialized
  if [ ! -f "$IPFS_PATH/config" ]; then
    echo "Initializing node$i..."
    ipfs init
  fi
  
  # Copy swarm key
  cp swarm/swarm.key $IPFS_PATH/

  # Configure ports and addresses
  port_offset=$((i-1))
  ipfs config --json Addresses.Swarm '["/ip4/0.0.0.0/tcp/'$((4001 + 100*port_offset))'", "/ip6/::/tcp/'$((4001 + 100*port_offset))'", "/ip4/0.0.0.0/udp/'$((4001 + 100*port_offset))'/quic-v1"]'
  ipfs config --json Addresses.API '"/ip4/127.0.0.1/tcp/'$((5001 + 100*port_offset))'"'
  ipfs config --json Addresses.Gateway '"/ip4/127.0.0.1/tcp/'$((8080 + 100*port_offset))'"'
  
  # Set routing type to DHT for private networks
  ipfs config --json Routing.Type '"dht"'
  
  # Remove default bootstrap nodes
  ipfs bootstrap rm --all
done

# Get node IDs and configure bootstrap
declare -A NODE_IDS
for i in {1..5}; do
  export IPFS_PATH=$SANDBOX_DIR/node$i
  NODE_IDS[$i]=$(ipfs config show | grep -o '"PeerID": "[^"]*' | cut -d'"' -f4)
  echo "Node$i ID: ${NODE_IDS[$i]}"
done

# Add each node as a bootstrap node to the others
for i in {1..5}; do
  export IPFS_PATH=$SANDBOX_DIR/node$i
  for j in {1..5}; do
    if [ $i -ne $j ]; then
      port=$((4001 + 100*(j-1)))
      ipfs bootstrap add "/ip4/127.0.0.1/tcp/$port/p2p/${NODE_IDS[$j]}"
    fi
  done
done

echo "Sandbox setup complete at $SANDBOX_DIR"
```

Save this script as `setup-ipfs-sandbox.sh`, make it executable, and run it:

```bash
chmod +x setup-ipfs-sandbox.sh
./setup-ipfs-sandbox.sh
```

## Starting and Managing Nodes

Create a script to start, stop, and check the status of your nodes:

```bash
#!/bin/bash
# manage-ipfs-sandbox.sh

SANDBOX_DIR=~/ipfs-sandbox
LOG_DIR=$SANDBOX_DIR/logs
PID_DIR=$SANDBOX_DIR/pids

# Ensure directories exist
mkdir -p $LOG_DIR $PID_DIR

# Function to start a node
start_node() {
  local node_num=$1
  local node_dir="node$node_num"
  local pid_file="$PID_DIR/$node_dir.pid"
  
  if [ -f "$pid_file" ] && ps -p $(cat $pid_file) > /dev/null 2>&1; then
    echo "$node_dir is already running."
    return
  fi
  
  echo "Starting $node_dir..."
  export IPFS_PATH=$SANDBOX_DIR/$node_dir
  ipfs daemon > $LOG_DIR/$node_dir.log 2>&1 &
  echo $! > $pid_file
  echo "$node_dir started with PID $(cat $pid_file)"
}

# Function to stop a node
stop_node() {
  local node_num=$1
  local node_dir="node$node_num"
  local pid_file="$PID_DIR/$node_dir.pid"
  
  if [ -f "$pid_file" ]; then
    local pid=$(cat $pid_file)
    if ps -p $pid > /dev/null 2>&1; then
      echo "Stopping $node_dir (PID $pid)..."
      kill $pid
      sleep 2
      if ps -p $pid > /dev/null 2>&1; then
        echo "Force killing $node_dir..."
        kill -9 $pid
      fi
    else
      echo "$node_dir is not running."
    fi
    rm $pid_file
  else
    echo "$node_dir is not running."
  fi
}

# Function to check node status
check_status() {
  echo "IPFS Sandbox Node Status:"
  echo "-------------------------"
  for i in {1..5}; do
    local node_dir="node$i"
    local pid_file="$PID_DIR/$node_dir.pid"
    
    if [ -f "$pid_file" ]; then
      local pid=$(cat $pid_file)
      if ps -p $pid > /dev/null 2>&1; then
        echo "$node_dir: RUNNING (PID $pid)"
      else
        echo "$node_dir: STOPPED (stale PID file)"
        rm $pid_file
      fi
    else
      echo "$node_dir: STOPPED"
    fi
  done
}

# Function to clean up sandbox
clean_sandbox() {
  echo "WARNING: This will stop all nodes and remove their data."
  read -p "Are you sure you want to proceed? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    for i in {1..5}; do
      stop_node $i
    fi
    echo "Removing data..."
    rm -rf $SANDBOX_DIR/node*/blocks/*
    rm -rf $SANDBOX_DIR/node*/datastore/*
    echo "Sandbox cleaned."
  fi
}

# Main command processing
case "$1" in
  start)
    if [ -z "$2" ]; then
      for i in {1..5}; do
        start_node $i
      done
    else
      start_node $2
    fi
    ;;
  stop)
    if [ -z "$2" ]; then
      for i in {1..5}; do
        stop_node $i
      done
    else
      stop_node $2
    fi
    ;;
  restart)
    if [ -z "$2" ]; then
      for i in {1..5}; do
        stop_node $i
        sleep 1
        start_node $i
      done
    else
      stop_node $2
      sleep 1
      start_node $2
    fi
    ;;
  status)
    check_status
    ;;
  clean)
    clean_sandbox
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|clean} [node_number]"
    echo "Examples:"
    echo "  $0 start       # Start all nodes"
    echo "  $0 start 3     # Start node3 only"
    echo "  $0 stop        # Stop all nodes"
    echo "  $0 status      # Show status of all nodes"
    exit 1
    ;;
esac
```

Save this as `manage-ipfs-sandbox.sh` and make it executable:

```bash
chmod +x manage-ipfs-sandbox.sh
```

## Running Tests

Create a script for testing file distribution:

```bash
#!/bin/bash
# test-ipfs-distribution.sh

SANDBOX_DIR=~/ipfs-sandbox

# Check arguments
if [ -z "$1" ]; then
    echo "Usage: $0 <path_to_file> [chunk_size]"
    echo "Example: $0 ~/Documents/test.txt 262144"
    exit 1
fi

FILE_PATH="$1"
CHUNK_SIZE="${2:-262144}"  # Default 256KB

if [ ! -f "$FILE_PATH" ]; then
    echo "File not found: $FILE_PATH"
    exit 1
fi

# Get file info
FILE_NAME=$(basename "$FILE_PATH")
FILE_SIZE=$(stat -f%z "$FILE_PATH" 2>/dev/null || stat -c%s "$FILE_PATH")
echo "File: $FILE_NAME"
echo "Size: $FILE_SIZE bytes"
echo "Chunk size: $CHUNK_SIZE bytes"
echo "Estimated chunks: $(( ($FILE_SIZE + $CHUNK_SIZE - 1) / $CHUNK_SIZE ))"

# Add file to node1
echo -e "\n=== ADDING FILE TO NODE1 ===\n"
export IPFS_PATH=$SANDBOX_DIR/node1
ADD_OUTPUT=$(ipfs add --chunker=size-$CHUNK_SIZE --progress "$FILE_PATH")
echo "$ADD_OUTPUT"

# Get CID
CID=$(echo "$ADD_OUTPUT" | grep -oE 'added [^ ]+ ' | tail -n1 | awk '{print $2}')

if [ -z "$CID" ]; then
    echo "Failed to add file to IPFS"
    exit 1
fi

echo -e "\nFile added with CID: $CID\n"

# Get all blocks
echo -e "=== ANALYZING FILE STRUCTURE ===\n"
echo "Getting all blocks for CID: $CID"
BLOCKS=$(ipfs refs -r $CID)
BLOCK_COUNT=$(echo "$BLOCKS" | wc -l | xargs)
echo "Total blocks: $BLOCK_COUNT"

# Show DAG structure
echo -e "\nDAG structure of file:"
ipfs dag get $CID | head -n 20
echo "..."

# Show block sizes
echo -e "\nBlock sizes:"
for block in $BLOCKS; do
    ipfs block stat $block | grep Size
done | sort -n -k2 | head -n 20
echo "..."

# Wait for data propagation
echo -e "\nWaiting 5 seconds for data propagation..."
sleep 5

# Check distribution across nodes
check_node() {
    local node_num=$1
    local node_dir="node$node_num"
    
    echo -e "\n--- Checking $node_dir ---"
    export IPFS_PATH=$SANDBOX_DIR/$node_dir
    
    # Check peer connections
    local peer_count=$(ipfs swarm peers | wc -l | xargs)
    echo "$node_dir connected to $peer_count peers"
    
    # Check if root CID exists
    if ipfs block stat $CID > /dev/null 2>&1; then
        echo "$node_dir has the root CID"
    else
        echo "$node_dir does not have the root CID yet"
    fi
    
    # Count blocks
    local block_count=0
    local available_blocks=""
    
    for block in $BLOCKS; do
        if ipfs block stat $block > /dev/null 2>&1; then
            block_count=$((block_count + 1))
            available_blocks="$available_blocks $block"
        fi
    done
    
    echo "$node_dir has $block_count out of $BLOCK_COUNT blocks"
    
    # Show sample blocks
    if [ $block_count -gt 0 ]; then
        echo "Sample of blocks on $node_dir:"
        local count=0
        for block in $available_blocks; do
            ipfs block stat $block 2>/dev/null
            count=$((count + 1))
            if [ $count -ge 5 ]; then
                break
            fi
        done
    fi
}

echo -e "\n=== CHECKING INITIAL DISTRIBUTION ===\n"
for i in {1..5}; do
    check_node $i
done

# Test 1: Retrieve from node2
echo -e "\n=== TEST 1: RETRIEVING FILE FROM NODE2 ===\n"
export IPFS_PATH=$SANDBOX_DIR/node2
echo "Forcing node2 to retrieve the file..."
ipfs cat $CID > /dev/null
echo "Done"

# Wait for propagation
echo "Waiting 5 seconds..."
sleep 5

# Check distribution
echo -e "\n=== CHECKING DISTRIBUTION AFTER TEST 1 ===\n"
for i in {1..5}; do
    check_node $i
done

# Test 2: Pin on node3
echo -e "\n=== TEST 2: PINNING FILE ON NODE3 ===\n"
export IPFS_PATH=$SANDBOX_DIR/node3
echo "Pinning file on node3..."
ipfs pin add $CID
echo "Done"

echo "Waiting 5 seconds..."
sleep 5

echo -e "\n=== CHECKING DISTRIBUTION AFTER TEST 2 ===\n"
for i in {1..5}; do
    check_node $i
done

# Test 3: Unpin from node1 and node2
echo -e "\n=== TEST 3: UNPINNING FROM NODE1 AND NODE2 ===\n"
export IPFS_PATH=$SANDBOX_DIR/node1
echo "Unpinning file from node1..."
ipfs pin rm $CID 2>/dev/null || echo "File was not pinned on node1"
echo "Done"

export IPFS_PATH=$SANDBOX_DIR/node2
echo "Unpinning file from node2..."
ipfs pin rm $CID 2>/dev/null || echo "File was not pinned on node2"
echo "Done"

# Run garbage collection
export IPFS_PATH=$SANDBOX_DIR/node1
echo "Running garbage collection on node1..."
ipfs repo gc
echo "Done"

export IPFS_PATH=$SANDBOX_DIR/node2
echo "Running garbage collection on node2..."
ipfs repo gc
echo "Done"

echo "Waiting 5 seconds..."
sleep 5

echo -e "\n=== CHECKING DISTRIBUTION AFTER TEST 3 ===\n"
for i in {1..5}; do
    check_node $i
done

# Test 4: Retrieve file from node4 and node5
echo -e "\n=== TEST 4: RETRIEVING FILE FROM NODE4 AND NODE5 ===\n"
export IPFS_PATH=$SANDBOX_DIR/node4
echo "Retrieving file from node4..."
ipfs get -o /tmp/node4-$FILE_NAME $CID > /dev/null
echo "Done"

export IPFS_PATH=$SANDBOX_DIR/node5
echo "Retrieving file from node5..."
ipfs get -o /tmp/node5-$FILE_NAME $CID > /dev/null
echo "Done"

echo "Waiting 5 seconds..."
sleep 5

# Final distribution check
echo -e "\n=== FINAL DISTRIBUTION ===\n"
for i in {1..5}; do
    check_node $i
done

# Summary
echo -e "\n=== EXPERIMENT SUMMARY ===\n"
echo "File: $FILE_NAME"
echo "Size: $FILE_SIZE bytes"
echo "CID: $CID"
echo "Total blocks: $BLOCK_COUNT"
echo "Experiment workflow:"
echo "1. Added file to node1 with chunk size $CHUNK_SIZE bytes"
echo "2. Retrieved file from node2"
echo "3. Pinned file on node3"
echo "4. Unpinned file from node1 and node2 and ran garbage collection"
echo "5. Retrieved file from node4 and node5"

echo -e "\nTest complete!"
```

Save this as `test-ipfs-distribution.sh` and make it executable:

```bash
chmod +x test-ipfs-distribution.sh
```

## Usage Workflow

### 1. Setup the sandbox (first time only)

```bash
./setup-ipfs-sandbox.sh
```

### 2. Start all nodes

```bash
./manage-ipfs-sandbox.sh start
```

### 3. Check nodes status

```bash
./manage-ipfs-sandbox.sh status
```

### 4. Run a distribution test

```bash
# Create a 5MB test file
dd if=/dev/urandom of=test-file-5mb.bin bs=1M count=5

# Run the test with default chunk size (256KB)
./test-ipfs-distribution.sh test-file-5mb.bin
```

### 5. Advanced testing

For more realistic testing scenarios:

```bash
# Clean nodes 1 and 2 completely
./manage-ipfs-sandbox.sh stop 1
./manage-ipfs-sandbox.sh stop 2
rm -rf ~/ipfs-sandbox/node1/blocks/*
rm -rf ~/ipfs-sandbox/node2/blocks/*
./manage-ipfs-sandbox.sh start 1
./manage-ipfs-sandbox.sh start 2

# Add a new file to node 3 and observe distribution
export IPFS_PATH=~/ipfs-sandbox/node3
dd if=/dev/urandom of=/tmp/test-file-10mb.bin bs=1M count=10
ipfs add --chunker=size-262144 /tmp/test-file-10mb.bin

# Access file from node 4
export IPFS_PATH=~/ipfs-sandbox/node4
ipfs cat <CID> > /dev/null

# Check distribution
for i in {1..5}; do
  echo "===== Node $i ====="
  export IPFS_PATH=~/ipfs-sandbox/node$i
  ipfs block stat <CID> 2>/dev/null || echo "Block not found"
  ipfs refs -r <CID> 2>/dev/null | wc -l
done
```

### 6. Stop all nodes when done

```bash
./manage-ipfs-sandbox.sh stop
```

### 7. Clean up the environment (removes all data)

```bash
./manage-ipfs-sandbox.sh clean
```

## Key Concepts to Observe

When running these tests, observe how:

1. **Content addressing** works through CIDs
2. **Chunking** splits large files into manageable pieces
3. **Merkle DAG** structures link these chunks together
4. **Content discovery** happens through the DHT
5. **Content distribution** occurs on-demand via Bitswap
6. **Pinning** affects persistence of data
7. **Garbage collection** removes unpinned content

## Troubleshooting

### Node won't start

If a node fails to start:

1. Check logs: `cat ~/ipfs-sandbox/logs/nodeX.log`
2. Remove lock files: `rm ~/ipfs-sandbox/nodeX/repo.lock`
3. Restart the node: `./manage-ipfs-sandbox.sh restart X`

### Nodes can't connect to each other

1. Check bootstrap configuration:
   ```bash
   export IPFS_PATH=~/ipfs-sandbox/node1
   ipfs bootstrap list
   ```
2. Verify swarm connections:
   ```bash
   export IPFS_PATH=~/ipfs-sandbox/node1
   ipfs swarm peers
   ```

### Garbage collection doesn't remove content

In a well-connected local network, content may persist due to:
- Bitswap caching
- Other nodes providing the content
- Rapid content replication

To force complete removal:
```bash
export IPFS_PATH=~/ipfs-sandbox/node1
ipfs pin rm --force <CID>
ipfs repo gc
```

## Further Exploration

- Try different chunk sizes and observe distribution patterns
- Experiment with IPNS for mutable content
- Explore MFS (Mutable File System) capabilities
- Test network resilience by stopping nodes during transfers
- Analyze DHT and provider records with `ipfs routing findprovs`

## Resources

- [IPFS Documentation](https://docs.ipfs.tech/)
- [IPFS Kubo Commands](https://docs.ipfs.tech/reference/kubo/cli/)
- [Content Addressing](https://docs.ipfs.tech/concepts/content-addressing/)
- [IPFS Bitswap](https://docs.ipfs.tech/concepts/bitswap/)
- [Pinning in IPFS](https://docs.ipfs.tech/concepts/persistence/)