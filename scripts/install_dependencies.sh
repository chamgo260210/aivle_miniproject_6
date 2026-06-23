#!/bin/bash
set -e

APP_DIR="/opt/aivle-app"
DEPLOY_DIR="/home/ubuntu/aivle-app"
WEB_DIR="/var/www/aivle"

echo "[AfterInstall] Install dependencies and configure application"

apt-get update -y

if ! command -v java > /dev/null 2>&1; then
  apt-get install -y openjdk-17-jre
fi

if ! command -v nginx > /dev/null 2>&1; then
  apt-get install -y nginx
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
cat > /etc/nginx/sites-available/aivle-app <<'EOF'
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

ln -sf /etc/nginx/sites-available/aivle-app /etc/nginx/sites-enabled/aivle-app
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl restart nginx

echo "[AfterInstall] Complete"