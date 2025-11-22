#!/bin/bash

# 一键远程部署到腾讯云
# 使用方法: ./一键远程部署.sh

SERVER_IP="43.133.241.218"
SERVER_USER="administrator"
SERVER_PASS="Helen123!@#"

echo "🚀 开始远程部署到腾讯云..."
echo "服务器: ${SERVER_IP}"
echo ""

# 检查 sshpass 是否安装
if ! command -v sshpass &> /dev/null; then
    echo "⚠️  需要安装 sshpass"
    echo ""
    echo "Mac 安装:"
    echo "  brew install hudochenkov/sshpass/sshpass"
    echo ""
    echo "或者手动 SSH 连接服务器并运行:"
    echo "  ssh ${SERVER_USER}@${SERVER_IP}"
    echo "  curl -fsSL https://raw.githubusercontent.com/shihaowei49-cloud/wallet-management-system/main/deploy-tencent.sh | bash"
    exit 1
fi

# 使用 sshpass 自动输入密码并连接
echo "📡 连接服务器..."
sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
echo "✅ 连接成功！开始部署..."
curl -fsSL https://raw.githubusercontent.com/shihaowei49-cloud/wallet-management-system/main/deploy-tencent.sh | bash
ENDSSH

echo ""
echo "🎉 部署完成！"
echo "访问: http://${SERVER_IP}"
echo "用户名: admin"
echo "密码: admin123"
