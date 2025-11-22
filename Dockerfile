# 使用 Node.js 18
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制所有文件
COPY . .

# 安装后端依赖
RUN cd backend && npm install

# 安装前端依赖并构建
RUN cd frontend && npm install && npm run build

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=5001

# 暴露端口
EXPOSE 5001

# 启动命令
CMD ["node", "backend/src/server.js"]
