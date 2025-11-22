import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Mock 钱包数据
const mockWallets = {};

// 保存钱包（加密后的）
router.post('/save', authMiddleware, (req, res) => {
  try {
    const { address, encryptedData } = req.body;
    const userId = req.user.id;

    if (!mockWallets[userId]) {
      mockWallets[userId] = [];
    }

    mockWallets[userId].push({
      address,
      encryptedData,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: '钱包保存成功',
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 获取用户的所有钱包
router.get('/list', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const wallets = mockWallets[userId] || [];

    res.json(wallets);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 删除钱包
router.delete('/:address', authMiddleware, (req, res) => {
  try {
    const { address } = req.params;
    const userId = req.user.id;

    if (mockWallets[userId]) {
      mockWallets[userId] = mockWallets[userId].filter((w) => w.address !== address);
    }

    res.json({
      success: true,
      message: '钱包删除成功',
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

export default router;
