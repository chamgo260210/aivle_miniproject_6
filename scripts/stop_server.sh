#!/bin/bash
set -e

echo "[BeforeInstall] Stop existing Spring Boot application"

if pgrep -f "app.jar" > /dev/null; then
  pkill -f "app.jar"
  echo "Existing app.jar process stopped"
else
  echo "No existing app.jar process"
fi

exit 0