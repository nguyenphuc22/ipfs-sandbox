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