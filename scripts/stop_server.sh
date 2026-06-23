#!/bin/bash
set -e

echo "[BeforeInstall] Stop existing Spring Boot application"

# app.jar를 실행 중인 프로세스가 있는지 확인
if pgrep -f "app.jar" > /dev/null; then
  echo "Existing app.jar process found. Sending termination signal..."
  
  # 안전한 종료(SIGTERM) 요청
  pkill -f "app.jar"
  
  # 프로세스가 완전히 종료될 때까지 최대 10초간 대기하는 루프 추가
  for i in {1..10}; do
    if ! pgrep -f "app.jar" > /dev/null; then
      echo "Existing app.jar process stopped successfully."
      break
    fi
    echo "Waiting for process to exit... (${i}/10)"
    sleep 1
  done

  # 10초 후에도 안 꺼졌다면 강제 종료(SIGKILL) 처리
  if pgrep -f "app.jar" > /dev/null; then
    echo "Process did not exit in time. Forcing termination..."
    pkill -9 -f "app.jar"
  fi
else
  echo "No existing app.jar process running."
fi

exit 0