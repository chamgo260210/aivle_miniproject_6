#!/bin/bash
set -e

echo "[ValidateService] Validate backend and nginx"

# 1. 백엔드(스프링 부트) 헬스 체크 루프
for i in {1..12}
do
  # curl -f 옵션은 HTTP 상태 코드가 400, 500대 에러일 때도 실패로 잡아주어 안전합니다.
  if curl -f http://127.0.0.1:8080/books > /dev/null 2>&1; then
    echo "Backend health check success"
    break
  fi

  echo "Waiting for backend... attempt ${i}/12"
  sleep 5

  if [ "$i" -eq 12 ]; then
    echo "Backend health check failed"
    echo "========= LAST 100 LINES OF APP LOG ========="
    tail -n 100 /opt/aivle-app/logs/app.log || true
    echo "============================================="
    exit 1
  fi
done

# 2. Nginx 웹 서버 및 프록시 헬스 체크
# (Amazon Linux 환경에서 Nginx 자체 장애 여부를 더 정확히 알 수 있도록 로그 진단 추가)
if curl -f http://127.0.0.1/ > /dev/null 2>&1; then
  echo "Nginx frontend check success"
else
  echo "Nginx frontend check failed"
  echo "========= SYSTEMD NGINX STATUS ========="
  systemctl status nginx || true
  echo "========= NGINX ERROR LOG ========="
  tail -n 50 /var/log/nginx/error.log || true
  echo "===================================="
  exit 1
fi

echo "[ValidateService] Complete"