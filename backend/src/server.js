import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import balanceRoutes from './routes/balance.js';
import nftRoutes from './routes/nft.js';
import dashboardRoutes from './routes/dashboard.js';
import walletRoutes from './routes/wallet.js';
import transactionRoutes from './routes/transaction.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transaction', transactionRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Wallet Management System Backend`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log('  POST   /api/auth/login          - 用户登录');
  console.log('  GET    /api/user/list           - 获取用户列表');
  console.log('  GET    /api/balance/list        - 获取余额列表');
  console.log('  GET    /api/nft/list            - 获取NFT列表');
  console.log('  GET    /api/dashboard/stats     - 获取仪表盘数据');
  console.log('  POST   /api/wallet/save         - 保存钱包');
  console.log('  GET    /api/wallet/list         - 获取钱包列表');
  console.log('  GET    /api/transaction/list    - 获取交易列表');
  console.log('  POST   /api/transaction/save    - 保存交易记录');
  console.log('  GET    /health                  - 健康检查');
  console.log('');
  console.log('✅ Server is ready!');
  console.log('='.repeat(50));
});
