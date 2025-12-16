#!/bin/bash

# Build and Run Script for Flex Living Frontend
# Usage: ./build-and-run.sh <CLIENT_ID> <CLIENT_SECRET>

if [ $# -lt 2 ]; then
    echo "Usage: ./build-and-run.sh <CLIENT_ID> <CLIENT_SECRET> [PORT]"
    echo "Example: ./build-and-run.sh 61148 abc123xyz789secretkey 3000"
    exit 1
fi

CLIENT_ID=$1
CLIENT_SECRET=$2
PORT=${3:-3000}

echo "Building Docker image with provided credentials..."
docker build \
  --build-arg VITE_HOSTAWAY_CLIENT_ID=$CLIENT_ID \
  --build-arg VITE_HOSTAWAY_CLIENT_SECRET=$CLIENT_SECRET \
  -t flex-living-frontend:latest .

if [ $? -eq 0 ]; then
    echo "Build successful! Starting container..."
    docker run -d -p $PORT:80 --name flex-living-app flex-living-frontend:latest
    echo "Container started! Application available at http://localhost:$PORT"
else
    echo "Build failed!"
    exit 1
fi
