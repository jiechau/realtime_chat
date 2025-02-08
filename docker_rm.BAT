@echo off
docker stop realtime_chat 2>nul || true
docker stop mongodb 2>nul || true
docker rm -f mongodb realtime_chat 2>nul || true
docker network rm chat-network 2>nul || true