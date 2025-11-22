# 🚀 Zeabur 部署完整步骤（手把手教程）

## 📋 准备工作

**GitHub 仓库**: https://github.com/shihaowei49-cloud/wallet-management-system
**已完成**: ✅ 代码已推送

---

## 🎯 第一步：登录 Zeabur

1. 打开浏览器访问: **https://zeabur.com**
2. 点击右上角 **"Sign in with GitHub"**
3. 授权 Zeabur 访问您的 GitHub 账户
4. 登录成功后会看到 Dashboard

---

## 🎯 第二步：创建新项目

1. 在 Zeabur Dashboard 点击 **"Create Project"** 按钮
2. 输入项目名称: `wallet-management`（可以自定义）
3. 点击 **"Create"** 创建项目
4. 进入项目页面

---

## 🎯 第三步：部署后端服务

### 3.1 添加后端服务

1. 在项目页面点击 **"Add Service"**
2. 选择 **"Git"**
3. 找到并选择仓库: **`shihaowei49-cloud/wallet-management-system`**
4. **重要**：在 "Root Directory" 字段输入: `backend`
5. 服务会自动命名为 `backend`，也可以自定义
6. 点击 **"Deploy"**

### 3.2 等待后端部署

- Zeabur 会自动检测到 Node.js 项目
- 会读取 `zbpack.json` 和 `Dockerfile`
- 部署大约需要 **2-3 分钟**
- 等待状态从 "Building" 变成 "Running"

### 3.3 配置后端环境变量

1. 点击 **backend** 服务卡片
2. 点击 **"Variables"** 标签
3. 添加以下环境变量（点击 "Add Variable"）:

```
PORT=5001
```

```
JWT_SECRET=请改成您自己的超级安全密钥
```

```
NODE_ENV=production
```

💡 **生成强 JWT Secret**:
```bash
# 在本地终端运行
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. 添加完成后，点击 **"Redeploy"** 重新部署后端

### 3.4 获取后端域名

1. 点击 backend 服务
2. 点击 **"Networking"** 标签
3. 点击 **"Generate Domain"**
4. Zeabur 会自动生成一个域名，例如: `backend-abc123.zeabur.app`
5. **复制这个域名**，待会儿要用

---

## 🎯 第四步：部署前端服务

### 4.1 添加前端服务

1. 回到项目主页，再次点击 **"Add Service"**
2. 选择 **"Git"**
3. 选择同一个仓库: **`shihaowei49-cloud/wallet-management-system`**
4. **重要**：在 "Root Directory" 字段输入: `frontend`
5. 点击 **"Deploy"**

### 4.2 配置前端环境变量

**在部署之前**配置环境变量很重要：

1. 点击 **frontend** 服务卡片
2. 点击 **"Variables"** 标签
3. 添加环境变量（使用上一步复制的后端域名）:

```
VITE_API_URL=https://后端域名/api
```

**例如**（替换成您实际的后端域名）:
```
VITE_API_URL=https://backend-abc123.zeabur.app/api
```

4. 保存后，前端会自动重新部署

### 4.3 等待前端部署

- 前端构建时间较长，大约 **3-5 分钟**
- Zeabur 会运行 `npm install && npm run build`
- 等待状态变成 "Running"

### 4.4 获取前端访问地址

1. 点击 frontend 服务
2. 点击 **"Networking"** 标签
3. 点击 **"Generate Domain"**
4. 复制生成的域名，例如: `frontend-xyz789.zeabur.app`
5. **这就是您的访问地址！**

---

## 🎯 第五步：访问系统

### 5.1 打开前端地址

在浏览器中访问前端域名:
```
https://frontend-xyz789.zeabur.app
```

### 5.2 登录系统

使用测试账号:
- **用户名**: `admin`
- **密码**: `admin123`

---

## 🔍 故障排查

### ❌ 问题1: 前端显示 "无法连接"

**原因**: 前端环境变量配置错误

**解决**:
1. 检查前端的 `VITE_API_URL` 是否正确
2. 确保包含 `/api` 后缀
3. 确保使用 `https://` 协议
4. 确保后端域名正确（不要有多余的斜杠）

**正确格式**:
```
VITE_API_URL=https://backend-abc123.zeabur.app/api
```

**错误格式**:
```
❌ VITE_API_URL=https://backend-abc123.zeabur.app/api/
❌ VITE_API_URL=http://backend-abc123.zeabur.app/api
❌ VITE_API_URL=https://backend-abc123.zeabur.app
```

### ❌ 问题2: 后端 502 错误

**原因**: 后端没有正常启动

**解决**:
1. 进入 backend 服务
2. 查看 **"Logs"** 标签
3. 检查是否有错误信息
4. 确认环境变量都配置正确
5. 尝试 **"Redeploy"**

### ❌ 问题3: 登录失败

**解决**:
1. 打开浏览器开发者工具（F12）
2. 查看 Network 标签
3. 找到登录请求（`/api/auth/login`）
4. 查看请求的 URL 是否正确
5. 查看响应内容

### ❌ 问题4: 页面白屏

**解决**:
1. 清除浏览器缓存
2. 硬刷新页面（Cmd+Shift+R）
3. 检查前端的部署日志
4. 确认构建成功

---

## 📊 验证部署成功

### ✅ 检查清单

访问后端健康检查:
```
https://你的后端域名/health
```

应该看到:
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T..."
}
```

### ✅ 测试登录

1. 访问前端地址
2. 输入 `admin` / `admin123`
3. 应该能成功登录
4. 看到数据看板

---

## 🎨 进阶配置（可选）

### 自定义域名

1. 在 Zeabur 服务页面点击 **"Domains"**
2. 点击 **"Add Domain"**
3. 输入您的域名
4. 按照提示配置 DNS CNAME 记录

### 查看服务状态

1. **Logs**: 实时日志
2. **Metrics**: CPU、内存使用情况
3. **Environment**: 环境变量管理
4. **Settings**: 服务设置

---

## 💰 费用说明

### 免费额度
- Zeabur 提供每月 **$5** 免费额度
- 足够运行这个钱包系统
- 包含自动 HTTPS
- 包含全球 CDN

### 如何节省费用
- 开发环境可以临时暂停服务
- 不使用时可以删除服务
- 只在需要时重新部署

---

## 📞 需要帮助？

### Zeabur 官方资源
- 文档: https://zeabur.com/docs
- Discord: https://discord.gg/zeabur
- GitHub: https://github.com/zeabur/zeabur

### 常见问题
- 构建失败？查看构建日志
- 部署慢？等待 3-5 分钟是正常的
- 域名访问慢？DNS 生效需要时间（几分钟到几小时）

---

## 🎉 完成！

如果一切顺利，您现在应该有：

✅ 后端运行在: `https://backend-xxx.zeabur.app`
✅ 前端运行在: `https://frontend-yyy.zeabur.app`
✅ 可以用 admin/admin123 登录
✅ 所有功能正常工作

**恭喜！您的钱包管理系统已成功部署到云端！** 🚀

---

## 📸 截图参考

**预期看到的界面**:
1. 登录页 - 暗色渐变背景 + 发光节点动画
2. 数据看板 - 统计卡片 + 图表
3. 我的钱包 - 余额显示 + 发送/接收功能
4. 钱包管理 - 创建/导入钱包

如果看不到这些，请按照故障排查步骤检查。
