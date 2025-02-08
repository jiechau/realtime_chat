@echo off

:: only for mac/win, for linux, use host network
docker network create --subnet=172.30.0.0/16 chat-network 2>nul || true
:: Stop and remove existing containers if they exist
docker rm -f mongodb realtime_chat 2>nul || true

:: Create directories for MongoDB
mkdir "mdb\config" "mdb\data\db" 2>nul

:: Create MongoDB configuration file
(
echo storage:
echo   dbPath: /data/db
echo net:
echo   bindIp: 0.0.0.0
echo   port: 27017
echo security:
echo   authorization: disabled
) > "mdb\config\mongod.conf"

:: Run MongoDB container
docker run -d ^
  --name mongodb ^
  --network chat-network ^
  -p 27017:27017 ^
  -v "%cd%\mdb\data:/data/db" ^
  -v "%cd%\mdb\config\mongod.conf:/etc/mongod.conf" ^
  mongo:latest ^
  mongod --config /etc/mongod.conf

:: Make start_chat.sh executable (not needed in Windows but keeping for reference)
:: chmod +x start_chat.sh

:: Run Node.js container
docker run -d ^
  --name realtime_chat ^
  -p 5173:5173 ^
  -p 3000:3000 ^
  -v "%cd%:/app" ^
  -w /app ^
  --network chat-network ^
  node:18-bullseye ^
  sh start_chat.sh