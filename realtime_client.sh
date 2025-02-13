#!/bin/bash

# Install dependencies for client
cd /app/client
npm install

# Start service
cd /app/client
npm run dev -- --host 0.0.0.0 &

# Keep container running
tail -f /dev/null