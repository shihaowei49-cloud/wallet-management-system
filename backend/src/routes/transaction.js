import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Mock 交易数据
const mockTransactions = [
  {
    id: 1,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    to: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    value: '0.5',
    gasUsed: '21000',
    gasPrice: '20',
    timestamp: Date.now() - 3600000,
    status: 'success',
    network: 'ethereum',
  },
  {
    id: 2,
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    to: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    value: '1.2',
    gasUsed: '21000',
    gasPrice: '25',
    timestamp: Date.now() - 7200000,
    status: 'success',
    network: 'ethereum',
  },
];

// 获取交易列表
router.get('/list', authMiddleware, (req, res) => {
  try {
    const { address, page = 1, limit = 10, status } = req.query;

    let filteredTxs = mockTransactions;

    // 按地址过滤
    if (address) {
      filteredTxs = filteredTxs.filter(
        (tx) => tx.from.toLowerCase() === address.toLowerCase() ||
          tx.to.toLowerCase() === address.toLowerCase()
      );
    }

    // 按状态过滤
    if (status) {
      filteredTxs = filteredTxs.filter((tx) => tx.status === status);
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTxs = filteredTxs.slice(startIndex, endIndex);

    res.json({
      transactions: paginatedTxs,
      total: filteredTxs.length,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 获取单个交易详情
router.get('/:hash', authMiddleware, (req, res) => {
  try {
    const { hash } = req.params;

    const transaction = mockTransactions.find((tx) => tx.hash === hash);

    if (!transaction) {
      return res.status(404).json({ message: '交易未找到' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 保存交易记录
router.post('/save', authMiddleware, (req, res) => {
  try {
    const transactionData = req.body;

    const newTx = {
      id: mockTransactions.length + 1,
      ...transactionData,
      timestamp: Date.now(),
    };

    mockTransactions.push(newTx);

    res.json({
      success: true,
      transaction: newTx,
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

export default router;
