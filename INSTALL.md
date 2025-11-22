# 安装和运行指南

## 📋 系统要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **操作系统**: macOS, Linux, Windows

## 🔧 安装步骤

### 方式一：自动安装（推荐）

```bash
# 1. 进入项目目录
cd wallet-management-system

# 2. 给启动脚本添加执行权限（仅 macOS/Linux）
chmod +x start.sh

# 3. 运行启动脚本
./start.sh
```

启动脚本会自动：
- 检查 Node.js 环境
- 安装前后端依赖（如果尚未安装）
- 同时启动前后端服务器

### 方式二：手动安装

#### 步骤 1: 安装后端依赖

```bash
cd backend
npm install
```

#### 步骤 2: 安装前端依赖

```bash
cd ../frontend
npm install
```

#### 步骤 3: 启动后端服务器

```bash
# 在 backend 目录下
npm run dev
```

后端将运行在: `http://localhost:5000`

#### 步骤 4: 启动前端服务器

新开一个终端：

```bash
# 在 frontend 目录下
npm run dev
```

前端将运行在: `http://localhost:3000`

## 🌐 访问系统

打开浏览器访问: `http://localhost:3000`

## 🔐 登录信息

```
用户名: admin
密码: admin123
```

## ⚙️ 配置说明

### 后端配置 (backend/.env)

```env
PORT=5000                    # 后端端口
JWT_SECRET=your-secret-key   # JWT 密钥（生产环境必须修改！）
NODE_ENV=development         # 环境（development/production）
```

### 前端配置 (frontend/vite.config.js)

```javascript
server: {
  port: 3000,                // 前端端口
  proxy: {
    '/api': {
      target: 'http://localhost:5000',  // 后端地址
      changeOrigin: true
    }
  }
}
```

## 🐛 常见问题

### 1. 端口已被占用

**错误信息:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案:**

查找并终止占用端口的进程：

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

或修改配置文件中的端口号。

### 2. 依赖安装失败

**解决方案:**

```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 3. 无法连接后端 API

**检查清单:**
- ✅ 后端服务器是否已启动
- ✅ 后端端口是否正确（默认 5000）
- ✅ 前端 vite.config.js 中的 proxy 配置是否正确
- ✅ 防火墙是否阻止了连接

### 4. Token 认证失败

**原因:**
- Token 过期（默认 24 小时）
- JWT_SECRET 配置不一致

**解决方案:**
- 重新登录获取新 Token
- 检查 .env 文件中的 JWT_SECRET 配置

## 🛑 停止服务器

### 使用启动脚本时

按 `Ctrl + C` 即可同时停止前后端服务器。

### 手动启动时

在各自的终端窗口按 `Ctrl + C`。

## 📦 生产环境部署

### 1. 构建前端

```bash
cd frontend
npm run build
```

构建产物在 `frontend/dist/` 目录。

### 2. 配置后端

修改 `backend/.env`:

```env
NODE_ENV=production
JWT_SECRET=<your-strong-secret-key>
PORT=5000
```

### 3. 启动生产服务器

```bash
cd backend
npm start
```

### 4. 使用 Nginx 部署前端

配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 代理后端 API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔄 更新项目

```bash
# 拉取最新代码
git pull

# 更新前端依赖
cd frontend
npm install

# 更新后端依赖
cd ../backend
npm install

# 重新启动服务器
```

## 📞 获取帮助

如果遇到问题：

1. 查看 [README.md](README.md) 中的详细文档
2. 检查浏览器控制台和终端的错误信息
3. 提交 Issue 到项目仓库

---

**祝你使用愉快！** 🎉
