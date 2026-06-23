#!/bin/bash
set -e

APP_DIR="/opt/aivle-app"
# 계정 경로를 ubuntu에서 ec2-user로 변경
DEPLOY_DIR="/home/ec2-user/aivle-app"
WEB_DIR="/var/www/aivle"

echo "[AfterInstall] Install dependencies and configure application"

# apt-get update 대신 dnf 사용 (dnf는 패키지 설치 시 자동 업데이트되므로 생략 가능하나 명시)
sudo dnf check-update || true

# Java 17 패키지명을 Amazon Corretto로 변경
if ! command -v java > /dev/null 2>&1; then
  sudo dnf install -y java-17-amazon-corretto
fi

# Nginx 설치 명령어 변환
if ! command -v nginx > /dev/null 2>&1; then
  sudo dnf install -y nginx
fi

mkdir -p ${APP_DIR}
mkdir -p ${APP_DIR}/logs
mkdir -p ${WEB_DIR}

echo "Copy backend jar"
cp ${DEPLOY_DIR}/app.jar ${APP_DIR}/app.jar

echo "Copy frontend dist"
rm -rf ${WEB_DIR}/*
cp -r ${DEPLOY_DIR}/frontend-dist/* ${WEB_DIR}/

echo "Configure nginx"
# Amazon Linux는 sites-available 대신 conf.d 디렉터리를 기본 기본으로 사용합니다.
cat > /etc/nginx/conf.d/aivle-app.conf <<'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/aivle;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Amazon Linux의 기본 서버 설정을 비활성화하기 위해 백업 처리
if [ -f /etc/nginx/nginx.conf ]; then
  # nginx.conf 내부에 기본으로 잡혀있는 80포트 기본 server 블록과 충돌을 방지하기 위함입니다.
  # (만약 기본 nginx.conf에 server 블록이 살아있다면 default_server 충돌이 날 수 있습니다)
  sudo sed -i 's/listen       80 default_server;/listen       80;/g' /etc/nginx/nginx.conf 2>/dev/null || true
fi

nginx -t
systemctl enable nginx
systemctl restart nginx

echo "[AfterInstall] Complete"