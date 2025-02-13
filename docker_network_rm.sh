docker stop realtime_client 2>/dev/null || true
docker stop realtime_server 2>/dev/null || true
docker stop mongodb 2>/dev/null || true
docker rm -f mongodb realtime_server realtime_client 2>/dev/null || true
docker network rm chat-network 2>/dev/null || true