#!/bin/bash
set -e

APP_DIR="/opt/aivle-app"

echo "[ApplicationStart] Start Spring Boot application"

cd ${APP_DIR}

nohup java -jar app.jar \
  --server.port=8080 \
  > ${APP_DIR}/logs/app.log 2>&1 &

sleep 10

echo "Application started"