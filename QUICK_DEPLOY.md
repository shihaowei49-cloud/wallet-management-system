# ⚡ 5分钟快速部署到 Zeabur

## 🎯 超简单 3 步部署

### 第 1 步：推送代码到 GitHub (1 分钟)

```bash
cd wallet-management-system

# 如果还没有 git 仓库
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库后
git remote add origin https://github.com/你的用户名/wallet-management.git
git push -u origin main
```

### 第 2 步：部署到 Zeabur (2 分钟)

1. 访问 https://zeabur.com
2. 使用 GitHub 登录
3. 点击 **"Create Project"**
4. 点击 **"Add Service"** → 选择 **Git**
5. 选择你的仓库

#### 部署后端
- 选择 `backend` 目录
- Zeabur 会自动检测并部署
- 等待部署完成（约 30 秒）

#### 部署前端
- 点击 **"Add Service"** → **Git**
- 选择 `frontend` 目录
- Zeabur 会自动检测并部署
- 等待部署完成（约 1 分钟）

### 第 3 步：配置环境变量 (2 分钟)

#### 后端环境变量
点击后端服务 → **Environment Variables** → 添加：

```
JWT_SECRET=改成你的超级安全密钥
```

#### 前端环境变量
1. 先获取后端域名：点击后端服务 → **Networking** → **Generate Domain**
2. 复制域名（如 `backend-xxx.zeabur.app`）
3. 点击前端服务 → **Environment Variables** → 添加：

```
VITE_API_URL=https://后端域名/api
```

例如：
```
VITE_API_URL=https://backend-abc123.zeabur.app/api
```

### 第 4 步：获取访问地址

点击前端服务 → **Networking** → **Generate Domain**

完成！🎉

---

## 🔗 访问你的应用

前端地址: `https://你的域名.zeabur.app`

登录账号:
- 用户名: `admin`
- 密码: `admin123`

---

## 🎬 视频教程

如果觉得文字不够清楚，可以参考：
1. [Zeabur 部署 Node.js 项目](https://zeabur.com/docs/deploy/nodejs)
2. [Zeabur 部署 React 项目](https://zeabur.com/docs/deploy/react)

---

## ❓ 遇到问题？

### 前端无法访问？
检查前端的 `VITE_API_URL` 环境变量是否配置正确

### 登录失败？
1. 访问 `https://后端域名/health` 检查后端是否正常
2. 查看浏览器控制台的错误信息

### 需要更多帮助？
查看完整文档: [DEPLOY_ZEABUR.md](DEPLOY_ZEABUR.md)

---

**就是这么简单！5 分钟搞定部署！** 🚀
