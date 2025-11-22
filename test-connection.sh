#!/bin/bash

echo "🔍 钱包系统连接诊断"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. 检查后端
echo "1️⃣ 检查后端服务..."
if curl -s http://localhost:5001/health > /dev/null; then
    echo -e "${GREEN}✅ 后端运行正常${NC}"
    curl -s http://localhost:5001/health | jq .
else
    echo -e "${RED}❌ 后端无法访问${NC}"
fi
echo ""

# 2. 检查前端
echo "2️⃣ 检查前端服务..."
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ 前端运行正常${NC}"
    echo "标题: $(curl -s http://localhost:3000 | grep -o '<title>.*</title>')"
else
    echo -e "${RED}❌ 前端无法访问${NC}"
fi
echo ""

# 3. 测试代理
echo "3️⃣ 测试 Vite 代理..."
PROXY_RESULT=$(curl -s http://localhost:3000/api/dashboard/stats)
if echo "$PROXY_RESULT" | grep -q "未提供认证令牌\|token"; then
    echo -e "${GREEN}✅ 代理工作正常${NC}"
    echo "响应: $PROXY_RESULT"
else
    echo -e "${RED}❌ 代理可能有问题${NC}"
    echo "响应: $PROXY_RESULT"
fi
echo ""

# 4. 测试登录
echo "4️⃣ 测试登录接口..."
LOGIN_RESULT=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo "$LOGIN_RESULT" | grep -q "token"; then
    echo -e "${GREEN}✅ 登录接口正常${NC}"
    TOKEN=$(echo "$LOGIN_RESULT" | jq -r .token)
    echo "获取到 Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ 登录失败${NC}"
    echo "响应: $LOGIN_RESULT"
fi
echo ""

# 5. 测试带 Token 的请求
if [ ! -z "$TOKEN" ]; then
    echo "5️⃣ 测试认证请求..."
    AUTH_RESULT=$(curl -s http://localhost:3000/api/dashboard/stats \
      -H "Authorization: Bearer $TOKEN")

    if echo "$AUTH_RESULT" | grep -q "totalUsers\|stats"; then
        echo -e "${GREEN}✅ 认证请求成功${NC}"
        echo "$AUTH_RESULT" | jq .
    else
        echo -e "${YELLOW}⚠️ 认证请求返回异常${NC}"
        echo "响应: $AUTH_RESULT"
    fi
fi
echo ""

# 6. 端口检查
echo "6️⃣ 检查端口占用..."
echo "端口 3000:"
lsof -i :3000 | grep LISTEN || echo "未被占用"
echo "端口 5001:"
lsof -i :5001 | grep LISTEN || echo "未被占用"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 诊断完成"
echo ""
echo "💡 如果所有检查都通过，但浏览器还是无法显示："
echo "   1. 打开浏览器开发者工具 (F12)"
echo "   2. 查看 Console 标签是否有错误"
echo "   3. 查看 Network 标签，看哪些请求失败了"
echo "   4. 尝试硬刷新页面 (Cmd+Shift+R 或 Ctrl+Shift+R)"
echo ""
