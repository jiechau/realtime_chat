#!/bin/bash

# Install dependencies for server
cd /app/server
npm install

# Install dependencies for client
cd /app/client
npm install

# Start both services
cd /app/server
node server.js & 

cd /app/client
npm run dev -- --host 0.0.0.0 &

# Keep container running
tail -f /dev/null