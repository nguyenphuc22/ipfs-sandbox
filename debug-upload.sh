#!/bin/bash

# Debug script for monitoring upload attempts
# Usage: ./debug-upload.sh

echo "=========================================="
echo "Upload Debug Monitor"
echo "=========================================="
echo ""
echo "This script will monitor:"
echo "  1. Gateway logs (HTTP requests)"
echo "  2. React Native logs (client errors)"
echo ""
echo "Press Ctrl+C to stop monitoring"
echo ""
echo "Now try uploading a file from the mobile app..."
echo ""
echo "=========================================="
echo ""

# Create temporary files for logs
GATEWAY_LOG=$(mktemp)
RN_LOG=$(mktemp)

# Cleanup on exit
cleanup() {
    echo ""
    echo "Cleaning up..."
    kill $GATEWAY_PID $RN_PID 2>/dev/null
    rm -f "$GATEWAY_LOG" "$RN_LOG"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Start monitoring gateway logs
echo "[Gateway Logs]"
docker compose logs -f gateway 2>&1 | grep -i -E "(POST|GET|error|fail|network|upload|anonymous)" | while IFS= read -r line; do
    echo "[GATEWAY] $line"
done > "$GATEWAY_LOG" &
GATEWAY_PID=$!

# Wait a moment
sleep 1

# Start monitoring React Native logs
echo "[React Native Logs]"
adb logcat -c 2>/dev/null  # Clear old logs
timeout 300 adb logcat 2>&1 | grep -i -E "(Network request failed|fetch|upload|error|exception|fatal|ReactNativeJS)" | while IFS= read -r line; do
    echo "[RN] $line"
done > "$RN_LOG" &
RN_PID=$!

# Tail both log files
tail -f "$GATEWAY_LOG" "$RN_LOG" 2>/dev/null
