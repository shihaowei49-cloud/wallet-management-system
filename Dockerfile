# 超简单的 Dockerfile - 像打卡系统一样
FROM node:18-alpine

WORKDIR /app

# 复制所有文件（包括已经构建好的 frontend/dist）
COPY . .

# 只安装后端依赖
WORKDIR /app/backend
RUN npm install --production

# 设置工作目录
WORKDIR /app

# 环境变量
ENV NODE_ENV=production
ENV PORT=5001

# 暴露端口
EXPOSE 5001

# 启动后端（会自动 serve 前端静态文件）
CMD ["node", "backend/src/server.js"]
