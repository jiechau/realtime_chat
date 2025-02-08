docker stop realtime_chat 2>/dev/null || true
docker stop mongodb 2>/dev/null || true
docker rm -f mongodb realtime_chat 2>/dev/null || true
docker network rm chat-network 2>/dev/null || true