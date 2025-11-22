import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Mock 余额数据
const mockBalances = [
  {
    id: 1,
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    balance: 1234.56,
    currency: 'ETH',
    status: 'active',
    lastUpdated: '2024-03-15 10:30:00',
  },
  {
    id: 2,
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    balance: 45.23,
    currency: 'ETH',
    status: 'active',
    lastUpdated: '2024-03-15 09:15:00',
  },
  {
    id: 3,
    address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    balance: 890.12,
    currency: 'ETH',
    status: 'active',
    lastUpdated: '2024-03-15 08:45:00',
  },
  {
    id: 4,
    address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    balance: 2345.67,
    currency: 'ETH',
    status: 'active',
    lastUpdated: '2024-03-14 22:30:00',
  },
  {
    id: 5,
    address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    balance: 67.89,
    currency: 'ETH',
    status: 'active',
    lastUpdated: '2024-03-14 20:15:00',
  },
  {
    id: 6,
    address: '0x1234567890123456789012345678901234567890',
    balance: 23.45,
    currency: 'ETH',
    status: 'active',
    lastUpdated: '2024-03-14 18:00:00',
  },
];

// 获取余额列表
router.get('/list', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBalances = mockBalances.slice(startIndex, endIndex);

    res.json(paginatedBalances);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

export default router;
