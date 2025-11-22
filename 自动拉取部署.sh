#!/bin/bash

# 自动从GitHub拉取并部署
# 在服务器上运行此脚本即可自动部署

echo "🚀 钱包管理系统 - 自动部署脚本"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# GitHub仓库
REPO_URL="https://github.com/shihaowei49-cloud/wallet-management-system.git"
DEPLOY_DIR="/var/www/wallet-management-system"

# 检查是否为root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 sudo 运行此脚本${NC}"
    echo "sudo bash $0"
    exit 1
fi

# 1. 安装必要软件
echo -e "${BLUE}[1/7] 检查并安装必要软件...${NC}"

# Node.js
if ! command -v node &> /dev/null; then
    echo "安装 Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
echo -e "${GREEN}✓ Node.js: $(node -v)${NC}"

# Git
if ! command -v git &> /dev/null; then
    echo "安装 Git..."
    apt install -y git
fi
echo -e "${GREEN}✓ Git: $(git --version | head -1)${NC}"

# PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi
echo -e "${GREEN}✓ PM2: $(pm2 -v)${NC}"

# Nginx
if ! command -v nginx &> /dev/null; then
    echo "安装 Nginx..."
    apt install -y nginx
fi
echo -e "${GREEN}✓ Nginx: $(nginx -v 2>&1)${NC}"

echo ""

# 2. 克隆或更新代码
echo -e "${BLUE}[2/7] 获取最新代码...${NC}"
if [ -d "$DEPLOY_DIR" ]; then
    echo "项目已存在，拉取最新代码..."
    cd "$DEPLOY_DIR"
    git pull
else
    echo "克隆项目..."
    mkdir -p /var/www
    cd /var/www
    git clone "$REPO_URL"
    cd "$DEPLOY_DIR"
fi
echo -e "${GREEN}✓ 代码已更新${NC}"
echo ""

# 3. 部署后端
echo -e "${BLUE}[3/7] 部署后端...${NC}"
cd "$DEPLOY_DIR/backend"

# 安装依赖
npm install --production

# 创建环境变量（如果不存在）
if [ ! -f .env ]; then
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    cat > .env << EOF
PORT=5000
JWT_SECRET=${JWT_SECRET}
NODE_ENV=production
EOF
    echo -e "${GREEN}✓ 已创建环境配置${NC}"
fi

# 启动后端
pm2 delete wallet-backend 2>/dev/null || true
pm2 start src/server.js --name wallet-backend
pm2 save

echo -e "${GREEN}✓ 后端已启动${NC}"
echo ""

# 4. 部署前端
echo -e "${BLUE}[4/7] 部署前端...${NC}"
cd "$DEPLOY_DIR/frontend"

# 安装依赖
npm install

# 创建生产环境配置
cat > .env.production << EOF
VITE_API_URL=/api
EOF

# 构建
npm run build

# 复制到 Nginx 目录
rm -rf /var/www/wallet-frontend
cp -r dist /var/www/wallet-frontend

echo -e "${GREEN}✓ 前端已构建${NC}"
echo ""

# 5. 配置 Nginx
echo -e "${BLUE}[5/7] 配置 Nginx...${NC}"

if [ ! -f /etc/nginx/sites-available/wallet ]; then
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

    echo -e "${GREEN}✓ Nginx配置已创建${NC}"
else
    echo -e "${YELLOW}Nginx配置已存在，跳过${NC}"
fi

# 重启 Nginx
nginx -t && systemctl restart nginx
systemctl enable nginx

echo ""

# 6. 设置开机自启
echo -e "${BLUE}[6/7] 配置开机自启...${NC}"
pm2 startup | tail -1 | bash
pm2 save
echo -e "${GREEN}✓ 已设置开机自启${NC}"
echo ""

# 7. 检查状态
echo -e "${BLUE}[7/7] 检查服务状态...${NC}"
echo ""

# 后端状态
echo "📊 后端服务:"
pm2 list | grep wallet-backend

echo ""

# Nginx状态
echo "🌐 Nginx 状态:"
systemctl is-active nginx && echo -e "${GREEN}✓ 运行中${NC}" || echo -e "${RED}✗ 未运行${NC}"

echo ""

# 测试接口
echo "🧪 测试接口:"
if curl -s http://localhost:5000/api/dashboard/stats | grep -q "未提供\|token"; then
    echo -e "${GREEN}✓ 后端接口正常${NC}"
else
    echo -e "${YELLOW}⚠ 后端接口可能有问题${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ip.sb 2>/dev/null || echo "43.133.241.218")

echo -e "${GREEN}📍 访问地址:${NC}"
echo "   http://${SERVER_IP}"
echo ""
echo -e "${GREEN}🔐 登录账号:${NC}"
echo "   用户名: admin"
echo "   密码: admin123"
echo ""
echo -e "${BLUE}📋 常用命令:${NC}"
echo "   查看后端日志: pm2 logs wallet-backend"
echo "   重启后端: pm2 restart wallet-backend"
echo "   查看进程: pm2 status"
echo "   重启Nginx: nginx -s reload"
echo ""
echo -e "${BLUE}🔄 更新代码:${NC}"
echo "   再次运行此脚本即可: sudo bash $0"
echo ""
