#!/bin/bash
set -e

APP_DIR="/opt/aivle-app"
DEPLOY_DIR="/home/ec2-user/aivle-app"
WEB_DIR="/var/www/aivle"
CW_CONFIG="/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json"

echo "[AfterInstall] Install dependencies and configure application"

echo "Check package updates"
dnf check-update || true

echo "Install Java 17"
if ! command -v java > /dev/null 2>&1; then
  dnf install -y java-17-amazon-corretto
fi

echo "Install Nginx"
if ! command -v nginx > /dev/null 2>&1; then
  dnf install -y nginx
fi

echo "Install CloudWatch Agent"
if [ ! -x /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl ]; then
  dnf install -y amazon-cloudwatch-agent
fi

echo "Create application directories"
mkdir -p ${APP_DIR}
mkdir -p ${APP_DIR}/logs
mkdir -p ${WEB_DIR}

# CloudWatch Agent가 app.log를 바로 수집할 수 있도록 파일을 미리 생성
touch ${APP_DIR}/logs/app.log

echo "Copy backend jar"
cp ${DEPLOY_DIR}/app.jar ${APP_DIR}/app.jar

echo "Copy frontend dist"
rm -rf ${WEB_DIR}/*
cp -r ${DEPLOY_DIR}/frontend-dist/* ${WEB_DIR}/

echo "Configure nginx"
cat > /etc/nginx/conf.d/aivle-app.conf <<'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/aivle;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

echo "Adjust default nginx config if needed"
if [ -f /etc/nginx/nginx.conf ]; then
  sed -i 's/listen       80 default_server;/listen       80;/g' /etc/nginx/nginx.conf 2>/dev/null || true
fi

echo "Validate and restart nginx"
nginx -t
systemctl enable nginx
systemctl restart nginx

echo "Configure CloudWatch Agent"
mkdir -p /opt/aws/amazon-cloudwatch-agent/etc

cat > ${CW_CONFIG} <<'EOF'
{
  "agent": {
    "region": "us-east-1"
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/opt/aivle-app/logs/app.log",
            "log_group_name": "/test99-mip/application",
            "log_stream_name": "{instance_id}",
            "timezone": "Local"
          },
          {
            "file_path": "/var/log/nginx/access.log",
            "log_group_name": "/test99-mip/nginx-access",
            "log_stream_name": "{instance_id}",
            "timezone": "Local"
          },
          {
            "file_path": "/var/log/nginx/error.log",
            "log_group_name": "/test99-mip/nginx-error",
            "log_stream_name": "{instance_id}",
            "timezone": "Local"
          }
        ]
      }
    }
  }
}
EOF

echo "Start CloudWatch Agent"
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:${CW_CONFIG} \
  -s

echo "CloudWatch Agent status"
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -m ec2 \
  -a status

echo "[AfterInstall] Complete"