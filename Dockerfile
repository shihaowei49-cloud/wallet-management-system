# 使用 Node.js 18
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 文件
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# 安装后端依赖
WORKDIR /app/backend
RUN npm install

# 安装前端依赖
WORKDIR /app/frontend
RUN npm install

# 复制所有源代码
WORKDIR /app
COPY . .

# 构建前端
WORKDIR /app/frontend
RUN npm run build

# 设置最终工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=5001

# 暴露端口
EXPOSE 5001

# 启动命令
CMD ["node", "backend/src/server.js"]
