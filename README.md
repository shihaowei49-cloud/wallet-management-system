# 🔐 Wallet Management System - 完整 Web3 钱包系统

一个功能完整的 Web3 钱包管理系统，集成了**真正的区块链钱包功能** + **企业级管理后台**。

## ✨ 核心特性

### 💳 真正的 Web3 钱包功能
- ✅ **创建钱包** - 生成助记词和私钥
- ✅ **导入钱包** - 支持助记词和私钥导入
- ✅ **发送交易** - 真实的链上交易
- ✅ **查看余额** - 实时读取链上余额
- ✅ **交易历史** - 查看所有交易记录
- ✅ **NFT 管理** - 查看和转移 NFT
- ✅ **多网络支持** - Ethereum、BSC、Polygon 等
- ✅ **网络切换** - 一键切换区块链网络
- ✅ **私钥加密存储** - AES 加密保护
- ✅ **DApp 浏览器** - 访问去中心化应用

### 🏢 企业级管理功能
- ✅ 用户管理
- ✅ 余额监控
- ✅ NFT 资产追踪
- ✅ 数据看板统计
- ✅ 风险预警系统

## 📸 系统截图

### 登录页面
- 🌌 暗色渐变背景 + 星空效果
- ✨ 四个发光节点动画（USER、BALANCE、NFT、DASHBOARD）
- 📱 响应式登录表单
- 🔐 JWT 认证

### 主系统
- 💼 专业的后台管理界面
- 💰 实时余额显示
- 📊 数据可视化图表
- 🎨 现代化 UI 设计

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + Vite
- **样式**: TailwindCSS
- **路由**: React Router v6
- **Web3**: ethers.js v6
- **图表**: Recharts
- **图标**: Lucide React
- **HTTP**: Axios
- **二维码**: qrcode.react
- **加密**: crypto-js
- **助记词**: bip39

### 后端
- **框架**: Express.js
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **跨域**: CORS
- **环境变量**: dotenv

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. 克隆项目

```bash
cd wallet-management-system
```

### 2. 一键启动（推荐）

```bash
chmod +x start.sh
./start.sh
```

启动脚本会自动：
- 检查 Node.js 环境
- 安装所有依赖
- 启动前后端服务器

### 3. 手动启动

**后端:**
```bash
cd backend
npm install
npm run dev
```

**前端:**
```bash
cd frontend
npm install
npm run dev
```

### 4. 访问系统

- **前端**: http://localhost:3000
- **后端**: http://localhost:5000
- **测试账号**: admin / admin123

## 🌐 支持的区块链网络

| 网络 | Chain ID | RPC | 区块浏览器 |
|------|----------|-----|-----------|
| Ethereum Mainnet | 1 | https://eth.llamarpc.com | https://etherscan.io |
| Sepolia Testnet | 11155111 | https://rpc.sepolia.org | https://sepolia.etherscan.io |
| BSC Mainnet | 56 | https://bsc-dataseed.binance.org | https://bscscan.com |
| BSC Testnet | 97 | https://data-seed-prebsc-1-s1.binance.org:8545 | https://testnet.bscscan.com |
| Polygon Mainnet | 137 | https://polygon-rpc.com | https://polygonscan.com |

## 📦 项目结构

```
wallet-management-system/
├── frontend/                          # 前端项目
│   ├── src/
│   │   ├── components/               # 组件
│   │   │   ├── Layout/
│   │   │   │   ├── Sidebar.jsx       # 侧边栏
│   │   │   │   ├── Header.jsx        # 顶部导航
│   │   │   │   └── MainLayout.jsx    # 主布局
│   │   │   ├── Login/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── FloatingNode.jsx  # 发光节点
│   │   │   └── NetworkSwitcher.jsx   # 网络切换器
│   │   ├── pages/                    # 页面
│   │   │   ├── Login.jsx             # 登录页
│   │   │   ├── Dashboard.jsx         # 数据看板
│   │   │   ├── MyWallet.jsx          # 💰 我的钱包
│   │   │   ├── CreateWallet.jsx      # 🆕 创建/导入钱包
│   │   │   ├── TransactionHistory.jsx # 📜 交易历史
│   │   │   ├── NFTMonitorEnhanced.jsx # 🖼️ NFT 管理
│   │   │   ├── DAppBrowser.jsx       # 🌐 DApp 浏览器
│   │   │   ├── UserManagement.jsx    # 用户管理
│   │   │   └── BalanceMonitor.jsx    # 余额监控
│   │   ├── services/                 # 服务
│   │   │   ├── api.js                # API 调用
│   │   │   ├── walletService.js      # 💳 钱包服务
│   │   │   └── nftService.js         # 🎨 NFT 服务
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── backend/                           # 后端项目
    ├── src/
    │   ├── routes/
    │   │   ├── auth.js               # 认证路由
    │   │   ├── user.js               # 用户管理
    │   │   ├── balance.js            # 余额监控
    │   │   ├── nft.js                # NFT 管理
    │   │   ├── dashboard.js          # 数据看板
    │   │   ├── wallet.js             # 💰 钱包管理
    │   │   └── transaction.js        # 📊 交易记录
    │   ├── middleware/
    │   │   └── auth.js               # JWT 认证
    │   └── server.js
    └── package.json
```

## 💡 核心功能详解

### 1. 创建钱包

```javascript
// 生成 12 个单词的助记词
const wallet = await walletService.createWallet();
// 返回: { address, mnemonic, privateKey }
```

**功能**:
- 生成 BIP39 标准助记词
- 自动派生钱包地址和私钥
- 安全备份提示

### 2. 导入钱包

**支持两种方式**:
- 📝 助记词导入（12 个单词）
- 🔑 私钥导入（0x...）

```javascript
// 从助记词导入
await walletService.importFromMnemonic(mnemonic);

// 从私钥导入
await walletService.importFromPrivateKey(privateKey);
```

### 3. 发送交易

```javascript
const result = await walletService.sendTransaction({
  to: '0x...',
  amount: '0.1',
  privateKey: wallet.privateKey,
  network: 'sepolia'
});
```

**特性**:
- ⛽ 自动估算 Gas 费用
- ✅ 交易状态追踪
- 🔍 区块浏览器链接

### 4. NFT 转账

```javascript
const result = await nftService.transferNFT({
  contractAddress: '0x...',
  from: wallet.address,
  to: '0x...',
  tokenId: '123',
  privateKey: wallet.privateKey
});
```

**支持**:
- ERC-721 标准 NFT
- 安全转账确认
- 交易历史记录

### 5. 网络切换

**一键切换到**:
- Ethereum Mainnet
- Sepolia Testnet
- BSC Mainnet/Testnet
- Polygon Mainnet

```javascript
await walletService.switchNetwork('sepolia');
```

### 6. DApp 浏览器

访问流行的去中心化应用:
- 🦄 Uniswap - DEX 交易
- 🌊 OpenSea - NFT 市场
- 👻 Aave - 借贷协议
- 🥞 PancakeSwap - BSC DEX

## 📡 API 接口文档

### 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 用户登录 | ❌ |

### 钱包接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/wallet/save` | 保存钱包 | ✅ |
| GET | `/api/wallet/list` | 获取钱包列表 | ✅ |
| DELETE | `/api/wallet/:address` | 删除钱包 | ✅ |

### 交易接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/transaction/list` | 获取交易列表 | ✅ |
| GET | `/api/transaction/:hash` | 获取交易详情 | ✅ |
| POST | `/api/transaction/save` | 保存交易记录 | ✅ |

### 管理接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/user/list` | 获取用户列表 | ✅ |
| GET | `/api/balance/list` | 获取余额列表 | ✅ |
| GET | `/api/nft/list` | 获取NFT列表 | ✅ |
| GET | `/api/dashboard/stats` | 获取统计数据 | ✅ |

## 🔒 安全特性

### 私钥加密存储

```javascript
// 使用 AES 加密
const encrypted = walletService.encryptPrivateKey(privateKey, password);

// 解密
const decrypted = walletService.decryptPrivateKey(encrypted, password);
```

### 安全建议

- ✅ 私钥使用 AES-256 加密
- ✅ 助记词建议离线备份
- ✅ 生产环境必须更换 JWT_SECRET
- ✅ 启用 HTTPS 传输
- ⚠️ 不要将私钥提交到代码库
- ⚠️ 定期备份钱包数据

## 🎨 UI/UX 特色

### 登录页发光节点

使用 CSS 动画实现炫酷的发光效果:

```css
.glow-effect {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  0% { box-shadow: 0 0 5px currentColor, 0 0 10px currentColor; }
  100% { box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor; }
}
```

### 响应式设计

- 📱 移动端优先
- 💻 桌面端优化
- 🎨 TailwindCSS 定制主题

## 🐛 常见问题

### 1. 交易失败

**可能原因**:
- ❌ 余额不足
- ❌ Gas 费用过低
- ❌ 网络拥堵

**解决方案**:
- ✅ 检查钱包余额
- ✅ 增加 Gas 费用
- ✅ 等待网络恢复

### 2. 无法连接网络

**解决方案**:
```bash
# 检查 RPC 节点状态
curl https://rpc.sepolia.org

# 切换到其他网络试试
```

### 3. 私钥丢失

**重要提示**:
- ⚠️ 私钥一旦丢失无法找回
- ⚠️ 务必备份助记词
- ⚠️ 建议多处安全保存

## 🚧 开发计划

### 已完成 ✅
- [x] 钱包创建/导入
- [x] 发送/接收交易
- [x] 交易历史查询
- [x] NFT 管理和转账
- [x] 多网络支持
- [x] 网络切换
- [x] DApp 浏览器
- [x] 私钥加密存储

### 进行中 🚧
- [ ] MetaMask 集成
- [ ] WalletConnect 支持
- [ ] 硬件钱包支持
- [ ] 多签钱包

### 计划中 📋
- [ ] Swap 功能集成
- [ ] Staking 质押
- [ ] DeFi 协议集成
- [ ] 移动端 App
- [ ] 浏览器插件
- [ ] 冷钱包支持

## 📚 学习资源

- [ethers.js 文档](https://docs.ethers.org/)
- [BIP39 标准](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [ERC-721 规范](https://eips.ethereum.org/EIPS/eip-721)
- [Ethereum 开发文档](https://ethereum.org/developers)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

```bash
# Fork 项目
# 创建功能分支
git checkout -b feature/AmazingFeature

# 提交更改
git commit -m 'Add some AmazingFeature'

# 推送到分支
git push origin feature/AmazingFeature

# 创建 Pull Request
```

## 🌍 部署到 Zeabur

### ⚡ 快速部署（5分钟）

```bash
# 1. 推送代码到 GitHub
git init
git add .
git commit -m "Deploy to Zeabur"
git remote add origin https://github.com/你的用户名/wallet-management.git
git push -u origin main

# 2. 访问 Zeabur
# https://zeabur.com

# 3. 创建项目并部署
# - 选择 GitHub 仓库
# - 分别部署 backend 和 frontend 目录
# - 配置环境变量
```

**详细教程**:
- 📖 [完整部署指南](DEPLOY_ZEABUR.md)
- ⚡ [5分钟快速部署](QUICK_DEPLOY.md)

### 环境变量配置

**后端**:
```env
JWT_SECRET=你的超级安全密钥
NODE_ENV=production
```

**前端**:
```env
VITE_API_URL=https://你的后端域名/api
```

### 部署后访问

- 前端: `https://你的域名.zeabur.app`
- 后端: `https://后端域名.zeabur.app`
- 登录: admin / admin123

---

## 📄 许可证

MIT License

## ⚠️ 免责声明

本项目仅供学习和研究使用。使用本钱包系统进行真实资金操作前，请：
- ✅ 充分理解区块链和智能合约的风险
- ✅ 在测试网络上进行充分测试
- ✅ 做好安全防护和备份措施
- ✅ 自行承担所有风险

## 💬 联系方式

如有问题或建议，欢迎提交 Issue！

---

**🎉 享受去中心化的乐趣！**

Made with ❤️ by Web3 Developers
