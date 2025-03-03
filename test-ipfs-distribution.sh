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