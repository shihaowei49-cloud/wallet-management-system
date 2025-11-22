# 使用 Node.js 18
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 文件
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# 安装后端依赖（生产环境）
WORKDIR /app/backend
RUN npm install --production

# 安装前端依赖（包括devDependencies，因为需要vite构建）
WORKDIR /app/frontend
RUN npm install

# 复制所有源代码
WORKDIR /app
COPY . .

# 构建前端
WORKDIR /app/frontend
RUN npm run build

# 清理前端 node_modules 节省空间（可选）
RUN rm -rf node_modules

# 设置最终工作目录
WORKDIR /app

# 设置环境变量（在构建后设置）
ENV NODE_ENV=production
ENV PORT=5001

# 暴露端口
EXPOSE 5001

# 启动命令
CMD ["node", "backend/src/server.js"]
