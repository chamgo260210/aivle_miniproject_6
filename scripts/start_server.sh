#!/bin/bash
set -e

APP_DIR="/opt/aivle-app"

echo "[ApplicationStart] Start Spring Boot application"

cd ${APP_DIR}

# CodeDeploy가 백그라운드 프로세스를 강제 종료하지 않도록 환경 변수 차단
# (이 코드가 빠지면 배포 성공 직후 스프링 부트가 꺼지는 현상이 발생할 수 있습니다)
export AWS_DOCUMENT_ROOT_UNDEFINED=1

# 실행하기 전, 혹시 기존에 구동 중이던 8080 포트의 이전 버전 프로세스가 있다면 안전하게 종료
PID=$(lsof -t -i:8080 2>/dev/null || true)
if [ ! -z "$PID" ]; then
  echo "Stopping existing application on port 8080 (PID: $PID)"
  kill -15 $PID
  sleep 5
fi

# 스프링 부트 백그라운드 실행
# stdout 유실 방지를 위해 로그 디렉터리가 생성되어 있는지 재차 보장
mkdir -p ${APP_DIR}/logs

nohup java -jar app.jar \
  --server.port=8080 \
  > ${APP_DIR}/logs/app.log 2>&1 &

# 애플리케이션이 띄워질 때까지 여유 있게 대기하며 헬스체크
sleep 15

# 프로세스가 정상적으로 살아있는지 최종 검증
if ps aux | grep -v grep | grep "app.jar" > /dev/null; then
  echo "Application started successfully"
else
  echo "Application failed to start. Check ${APP_DIR}/logs/app.log"
  exit 1
fi