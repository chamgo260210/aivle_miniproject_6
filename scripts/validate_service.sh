#!/bin/bash
set -e

echo "[ValidateService] Validate backend and nginx"

for i in {1..12}
do
  if curl -f http://127.0.0.1:8080/books > /dev/null 2>&1; then
    echo "Backend health check success"
    break
  fi

  echo "Waiting for backend... attempt ${i}"
  sleep 5

  if [ "$i" -eq 12 ]; then
    echo "Backend health check failed"
    tail -n 100 /opt/aivle-app/logs/app.log || true
    exit 1
  fi
done

if curl -f http://127.0.0.1/ > /dev/null 2>&1; then
  echo "Nginx frontend check success"
else
  echo "Nginx frontend check failed"
  exit 1
fi

echo "[ValidateService] Complete"