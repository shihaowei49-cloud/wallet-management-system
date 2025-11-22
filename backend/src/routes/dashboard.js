import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 获取仪表盘统计数据
router.get('/stats', authMiddleware, (req, res) => {
  try {
    const stats = {
      totalUsers: 1234,
      totalBalance: 123456,
      totalNFTs: 5678,
      totalTransactions: 789012,
      userGrowth: 12.5,
      balanceGrowth: 8.2,
      nftGrowth: -3.1,
      transactionGrowth: 15.3,
      recentActivities: [
        {
          id: 1,
          type: 'user_register',
          message: '新用户注册',
          user: 'user_1@example.com',
          timestamp: '2 分钟前',
        },
        {
          id: 2,
          type: 'nft_transfer',
          message: 'NFT 转账',
          user: 'user_2@example.com',
          timestamp: '5 分钟前',
        },
        {
          id: 3,
          type: 'balance_update',
          message: '余额更新',
          user: 'user_3@example.com',
          timestamp: '10 分钟前',
        },
        {
          id: 4,
          type: 'user_login',
          message: '用户登录',
          user: 'user_4@example.com',
          timestamp: '15 分钟前',
        },
        {
          id: 5,
          type: 'nft_purchase',
          message: 'NFT 购买',
          user: 'user_5@example.com',
          timestamp: '20 分钟前',
        },
      ],
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

export default router;
