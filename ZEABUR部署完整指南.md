# 🚀 Zeabur 一键部署完整指南

## 📋 前置要求

- ✅ GitHub账号
- ✅ 代码已推送到GitHub（完成）
- ✅ Zeabur账号（免费注册）

---

## 🎯 部署步骤（5分钟完成）

### 第1步：注册/登录 Zeabur

1. 访问：https://zeabur.com
2. 点击右上角 **"Sign in"** 或 **"Get Started"**
3. 选择 **"Continue with GitHub"**（使用GitHub账号登录）
4. 授权Zeabur访问您的GitHub仓库

---

### 第2步：创建新项目

1. 登录后，点击 **"Create New Project"** 或 **"New Project"**
2. 输入项目名称（例如：`wallet-system`）
3. 选择地区（推荐：**Hong Kong** 或 **Singapore** - 速度快）
4. 点击 **"Create"**

---

### 第3步：部署后端服务

#### 3.1 添加服务

1. 在项目页面，点击 **"Add Service"**
2. 选择 **"Git"**
3. 选择您的仓库：`shihaowei49-cloud/wallet-management-system`
4. 点击 **"Import"**

#### 3.2 配置后端

Zeabur会自动检测到monorepo结构，需要配置：

1. **Service Name**: `backend`
2. **Root Directory**: `backend`（重要！）
3. **Branch**: `main`

#### 3.3 设置环境变量

点击服务 → **"Variables"** → 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `PORT` | `5001` | 后端端口 |
| `NODE_ENV` | `production` | 生产环境 |
| `JWT_SECRET` | `your-super-secret-key-change-this-in-production` | JWT密钥（必须修改） |

**生成安全的JWT_SECRET**（推荐）：
```bash
# 在本地终端运行，复制输出结果
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 3.4 部署

1. 配置完成后，点击 **"Deploy"**
2. 等待构建和部署（约2-3分钟）
3. 部署成功后，会得到一个后端URL，例如：
   ```
   https://wallet-backend-xxx.zeabur.app
   ```

---

### 第4步：部署前端服务

#### 4.1 添加第二个服务

1. 返回项目页面，再次点击 **"Add Service"**
2. 选择 **"Git"**
3. 选择同一个仓库：`shihaowei49-cloud/wallet-management-system`

#### 4.2 配置前端

1. **Service Name**: `frontend`
2. **Root Directory**: `frontend`（重要！）
3. **Branch**: `main`

#### 4.3 设置环境变量

点击服务 → **"Variables"** → 添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_API_URL` | `/api` | API相对路径 |
| `NODE_ENV` | `production` | 生产环境 |

#### 4.4 部署前端

1. 点击 **"Deploy"**
2. 等待构建（约3-5分钟，需要npm install和build）
3. 部署成功后得到前端URL：
   ```
   https://wallet-frontend-xxx.zeabur.app
   ```

---

### 第5步：配置域名和反向代理（可选但推荐）

#### 选项A：使用Zeabur免费域名

1. 在前端服务页面，点击 **"Networking"**
2. 点击 **"Generate Domain"**
3. 会得到一个域名，如：`wallet.zeabur.app`

#### 选项B：配置Nginx（推荐 - 统一访问）

为了让前端和后端在同一个域名下，需要配置代理：

1. 添加一个 **"Prebuilt"** 服务
2. 搜索并选择 **"Nginx"**
3. 创建nginx配置文件（见下方配置）

**Nginx配置**（创建为 `nginx.conf`）：

```nginx
server {
    listen 80;
    server_name _;

    # 前端
    location / {
        proxy_pass https://wallet-frontend-xxx.zeabur.app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端API
    location /api {
        proxy_pass https://wallet-backend-xxx.zeabur.app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

### 第6步：绑定自定义域名（可选）

如果您有自己的域名：

1. 在服务设置中，点击 **"Domains"**
2. 点击 **"Add Domain"**
3. 输入您的域名，例如：`wallet.yourdomain.com`
4. 在域名DNS设置中添加CNAME记录：
   ```
   Type: CNAME
   Name: wallet
   Value: xxx.zeabur.app
   ```
5. 等待DNS生效（5-10分钟）

---

## ✅ 验证部署

### 测试后端API

访问：`https://您的后端域名/health`

应该看到健康检查响应。

### 测试前端

访问：`https://您的前端域名`

应该看到登录页面。

### 登录测试

- **用户名**：`admin`
- **密码**：`admin123`

---

## 🔧 常见问题

### 1. 构建失败

**可能原因**：
- Root Directory没有正确设置
- 环境变量缺失

**解决方法**：
- 检查 Root Directory 是否设置为 `backend` 或 `frontend`
- 确认所有环境变量都已设置

### 2. API请求404

**可能原因**：
- `VITE_API_URL` 配置错误
- 后端服务未启动

**解决方法**：
- 确认 `VITE_API_URL=/api`
- 检查后端服务日志

### 3. CORS错误

**解决方法**：
后端代码已包含CORS配置，但确保：
```javascript
// backend/src/server.js
app.use(cors({
  origin: '*', // 生产环境应该设置为具体域名
  credentials: true
}));
```

---

## 📊 监控和管理

### 查看日志

1. 在服务页面，点击 **"Logs"**
2. 实时查看应用日志
3. 查找错误和警告

### 重新部署

1. 代码更新并推送到GitHub后
2. Zeabur会**自动触发部署**
3. 或者手动点击 **"Redeploy"**

### 回滚

1. 点击服务的 **"Deployments"**
2. 选择之前的部署版本
3. 点击 **"Redeploy"**

---

## 💰 费用说明

### 免费额度（Hobby Plan）

Zeabur提供免费额度：
- ✅ 无限服务数量
- ✅ 自动HTTPS
- ✅ 自动构建和部署
- ⚠️ 有一定的流量和计算限制

### 升级Pro（可选）

如果流量大，可以升级Pro计划：
- 💵 按使用量付费
- 📈 更多资源配额
- 🚀 更快的构建速度

---

## 🎯 快速部署链接（一键部署）

Zeabur支持一键部署按钮，添加到README：

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates)

---

## 📚 相关文档

- Zeabur官方文档：https://zeabur.com/docs
- GitHub仓库：https://github.com/shihaowei49-cloud/wallet-management-system
- 本地部署指南：`README.md`

---

## 🆘 需要帮助？

如果遇到问题：

1. 查看Zeabur服务日志
2. 查看本项目的 `DEPLOYMENT_SUMMARY.md`
3. 检查GitHub Issues
4. 联系Zeabur支持：https://discord.gg/zeabur

---

## 🎉 部署完成后

访问您的应用：
- 前端：`https://您的域名`
- 后端：`https://您的域名/api`

**默认登录**：
- 用户名：`admin`
- 密码：`admin123`

⚠️ **重要提示**：
1. 修改默认的JWT_SECRET
2. 生产环境请修改默认密码
3. 配置正确的CORS域名

---

祝您部署顺利！🚀
