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