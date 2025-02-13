#!/bin/bash

# Install dependencies for server
cd /app/server
npm install

# Start service
cd /app/server
node server.js & 

# Keep container running
tail -f /dev/null