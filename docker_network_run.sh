#!/bin/bash

# only for mac/win, for linux, use host network
docker network create --subnet=172.30.0.0/16 chat-network 2>/dev/null || true
# Stop and remove existing containers if they exist
docker rm -f mongodb realtime_server realtime_client 2>/dev/null || true

# Create directories for MongoDB
mkdir -p mdb/config mdb/data/db
# Create MongoDB configuration file, save to mdb/config/mongod.conf
cat << 'EOF' > mdb/config/mongod.conf
storage:
  dbPath: /data/db
net:
  bindIp: 0.0.0.0
  port: 27017
security:
  authorization: disabled
EOF
# Run Docker container
docker run -d \
  --name mongodb \
  --network chat-network \
  -p 27017:27017 \
  -v $(pwd)/mdb/data:/data/db \
  -v $(pwd)/mdb/config/mongod.conf:/etc/mongod.conf \
  mongo:latest \
  mongod --config /etc/mongod.conf


# Make start_chat.sh executable
chmod +x start_chat.sh
# Run Docker container
docker run -d \
  --name realtime_server \
  -p 3000:3000 \
  -v $(pwd):/app \
  -w /app \
  --network chat-network \
  node:18-bullseye \
  sh realtime_server.sh

# Make sh executable
chmod +x realtime_client.sh
# Run Docker container
docker run -d \
  --name realtime_client \
  -p 5173:5173 \
  -v $(pwd):/app \
  -w /app \
  node:18-bullseye \
  sh realtime_client.sh

echo "http://localhost:5173/"