#!/bin/bash

# IPFS Sandbox End-to-End Test Script
echo "🚀 Starting IPFS Sandbox End-to-End Test"
echo "=========================================="

# Test 1: Health Check
echo -e "\n📋 Test 1: Health Check"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)
echo "Health Response: $HEALTH_RESPONSE"

# Test 2: File Upload
echo -e "\n📤 Test 2: File Upload"
echo "Creating test file..."
echo "Hello from IPFS sandbox! Test timestamp: $(date)" > /tmp/ipfs-test.txt

echo "Uploading file to IPFS..."
UPLOAD_RESPONSE=$(curl -s -X POST -F "file=@/tmp/ipfs-test.txt" http://localhost:3000/api/files/upload)
echo "Upload Response: $UPLOAD_RESPONSE"

# Extract hash from response
HASH=$(echo $UPLOAD_RESPONSE | jq -r '.hash // empty')
echo "Extracted Hash: $HASH"

if [ -z "$HASH" ]; then
    echo "❌ Upload failed - no hash returned"
    exit 1
fi

# Test 3: Direct IPFS cat (to verify file is in IPFS)
echo -e "\n🔍 Test 3: Direct IPFS Verification"
echo "Testing direct IPFS cat command..."
DIRECT_CAT=$(docker exec ipfs-sandbox-gateway-1 sh -c "IPFS_PATH=/data/ipfs ipfs cat $HASH" 2>/dev/null)
echo "Direct IPFS cat result: $DIRECT_CAT"

# Test 4: HTTP API cat (test our gateway)
echo -e "\n🌐 Test 4: Gateway API Retrieval"
echo "Testing file retrieval through gateway API..."
API_CAT_RESPONSE=$(curl -s "http://localhost:3000/api/files/$HASH")
echo "Gateway API retrieval: $API_CAT_RESPONSE"

# Test 5: Node connectivity
echo -e "\n🔗 Test 5: Node Connectivity"
echo "Checking IPFS node connections..."
NODE1_PEERS=$(docker exec ipfs-sandbox-ipfs-node-1-1 ipfs swarm peers | wc -l)
NODE2_PEERS=$(docker exec ipfs-sandbox-ipfs-node-2-1 ipfs swarm peers | wc -l) 
NODE3_PEERS=$(docker exec ipfs-sandbox-ipfs-node-3-1 ipfs swarm peers | wc -l)

echo "Node 1 connections: $NODE1_PEERS"
echo "Node 2 connections: $NODE2_PEERS"  
echo "Node 3 connections: $NODE3_PEERS"

# Test 6: Cross-node file accessibility
echo -e "\n🔄 Test 6: Cross-Node File Access"
echo "Testing if file is accessible from other nodes..."
NODE1_CAT=$(docker exec ipfs-sandbox-ipfs-node-1-1 ipfs cat $HASH 2>/dev/null || echo "Not found")
NODE2_CAT=$(docker exec ipfs-sandbox-ipfs-node-2-1 ipfs cat $HASH 2>/dev/null || echo "Not found") 
NODE3_CAT=$(docker exec ipfs-sandbox-ipfs-node-3-1 ipfs cat $HASH 2>/dev/null || echo "Not found")

echo "Node 1 access: $NODE1_CAT"
echo "Node 2 access: $NODE2_CAT"
echo "Node 3 access: $NODE3_CAT"

echo -e "\n✅ Test Complete!"
echo "=========================================="

# Clean up
rm -f /tmp/ipfs-test.txt
