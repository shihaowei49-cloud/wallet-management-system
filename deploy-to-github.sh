#!/bin/bash

echo "🚀 开始部署钱包管理系统到 GitHub..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否已初始化 git
if [ ! -d ".git" ]; then
    echo -e "${BLUE}📁 初始化 Git 仓库...${NC}"
    git init
    echo -e "${GREEN}✅ Git 仓库初始化完成${NC}"
else
    echo -e "${GREEN}✅ Git 仓库已存在${NC}"
fi

# 添加所有文件
echo -e "${BLUE}📦 添加文件到 Git...${NC}"
git add .

# 检查是否有更改
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  没有检测到新的更改${NC}"
else
    # 提交更改
    echo -e "${BLUE}💾 提交更改...${NC}"
    git commit -m "部署到 Zeabur - $(date '+%Y年%m月%d日 %H:%M:%S')"
    echo -e "${GREEN}✅ 提交完成${NC}"
fi

# 检查是否已添加远程仓库
if ! git remote | grep -q "^origin$"; then
    echo ""
    echo -e "${YELLOW}⚠️  还未配置 GitHub 仓库${NC}"
    echo ""
    echo "请按以下步骤操作："
    echo "1. 访问 https://github.com/new 创建新仓库"
    echo "2. 仓库名称建议: wallet-management-system"
    echo "3. 创建后，复制仓库 URL"
    echo "4. 运行以下命令："
    echo ""
    echo -e "${BLUE}   git remote add origin https://github.com/你的用户名/wallet-management-system.git${NC}"
    echo -e "${BLUE}   git branch -M main${NC}"
    echo -e "${BLUE}   git push -u origin main${NC}"
    echo ""
    exit 0
fi

# 推送到 GitHub
echo -e "${BLUE}☁️  推送到 GitHub...${NC}"
git push

# 检查推送是否成功
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ 成功推送到 GitHub！${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}🎉 下一步：部署到 Zeabur${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. 访问: https://zeabur.com"
    echo "2. 使用 GitHub 登录"
    echo "3. 创建新项目: Create Project"
    echo "4. 添加后端服务:"
    echo "   - Add Service → Git → 选择仓库 → 选择 backend 目录"
    echo "5. 添加前端服务:"
    echo "   - Add Service → Git → 选择仓库 → 选择 frontend 目录"
    echo "6. 配置环境变量:"
    echo ""
    echo -e "${BLUE}   后端环境变量:${NC}"
    echo "   PORT=5001"
    echo "   JWT_SECRET=你的超级安全密钥"
    echo "   NODE_ENV=production"
    echo ""
    echo -e "${BLUE}   前端环境变量:${NC}"
    echo "   VITE_API_URL=https://你的后端域名/api"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📖 查看详细文档: QUICK_DEPLOY.md"
    echo ""
else
    echo -e "${YELLOW}⚠️  推送失败，请检查网络连接或远程仓库配置${NC}"
    exit 1
fi
