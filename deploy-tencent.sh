#!/bin/bash

# 腾讯云一键部署脚本
# 使用方法: curl -fsSL https://raw.githubusercontent.com/你的用户名/wallet-management-system/main/deploy-tencent.sh | bash

echo "🚀 开始部署钱包管理系统到腾讯云..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查是否为 root 用户
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}错误：此脚本需要 root 权限运行${NC}"
   echo "请使用: sudo bash $0"
   exit 1
fi

# 1. 更新系统
echo -e "${BLUE}[1/8] 更新系统...${NC}"
apt update -y && apt upgrade -y

# 2. 安装 Node.js
echo -e "${BLUE}[2/8] 安装 Node.js 18...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"

# 3. 安装必要工具
echo -e "${BLUE}[3/8] 安装 Git, PM2, Nginx...${NC}"
apt install -y git nginx
npm install -g pm2

# 4. 克隆项目
echo -e "${BLUE}[4/8] 克隆项目...${NC}"
cd /var/www
if [ -d "wallet-management-system" ]; then
    echo -e "${YELLOW}项目已存在，拉取最新代码...${NC}"
    cd wallet-management-system
    git pull
else
    git clone https://github.com/shihaowei49-cloud/wallet-management-system.git
    cd wallet-management-system
fi

# 5. 部署后端
echo -e "${BLUE}[5/8] 部署后端...${NC}"
cd backend
npm install

# 创建环境变量
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
cat > .env << EOF
PORT=5000
JWT_SECRET=${JWT_SECRET}
NODE_ENV=production
EOF

# 启动后端
pm2 delete wallet-backend 2>/dev/null || true
pm2 start src/server.js --name wallet-backend
pm2 save
pm2 startup | tail -1 | bash

echo -e "${GREEN}✓ 后端已启动${NC}"

# 6. 部署前端
echo -e "${BLUE}[6/8] 部署前端...${NC}"
cd ../frontend

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me)

# 创建环境变量
cat > .env.production << EOF
VITE_API_URL=/api
EOF

npm install
npm run build

# 复制到 Nginx 目录
rm -rf /var/www/wallet-frontend
cp -r dist /var/www/wallet-frontend

echo -e "${GREEN}✓ 前端已构建${NC}"

# 7. 配置 Nginx
echo -e "${BLUE}[7/8] 配置 Nginx...${NC}"
cat > /etc/nginx/sites-available/wallet << 'NGINXCONF'
server {
    listen 80;
    server_name _;

    # 前端
    location / {
        root /var/www/wallet-frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
NGINXCONF

# 启用配置
ln -sf /etc/nginx/sites-available/wallet /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试并重启 Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✓ Nginx 已配置${NC}"

# 8. 配置防火墙
echo -e "${BLUE}[8/8] 配置防火墙...${NC}"
ufw allow 80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}📍 访问地址:${NC}"
echo "   http://${SERVER_IP}"
echo ""
echo -e "${GREEN}🔐 登录账号:${NC}"
echo "   用户名: admin"
echo "   密码: admin123"
echo ""
echo -e "${YELLOW}⚠️  重要提示:${NC}"
echo "   1. 请在腾讯云控制台开放 80、443 端口"
echo "   2. 如果有域名，建议配置 HTTPS"
echo "   3. JWT Secret 已自动生成并保存在 backend/.env"
echo ""
echo -e "${BLUE}📊 常用命令:${NC}"
echo "   查看后端日志: pm2 logs wallet-backend"
echo "   重启后端: pm2 restart wallet-backend"
echo "   查看状态: pm2 status"
echo "   重启 Nginx: nginx -s reload"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
