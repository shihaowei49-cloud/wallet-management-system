import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Mock 余额数据 - 多链多币种
const mockBalances = [
  // Ethereum 链
  {
    id: 1,
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    chain: 'Ethereum',
    chainId: 1,
    balance: 12.34,
    currency: 'ETH',
    usdValue: 24680.00,
    status: 'active',
    lastUpdated: '2024-03-15 10:30:00',
  },
  {
    id: 2,
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    chain: 'Ethereum',
    chainId: 1,
    balance: 5000,
    currency: 'USDT',
    usdValue: 5000.00,
    status: 'active',
    lastUpdated: '2024-03-15 10:30:00',
  },
  {
    id: 3,
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    chain: 'Ethereum',
    chainId: 1,
    balance: 3.45,
    currency: 'ETH',
    usdValue: 6900.00,
    status: 'active',
    lastUpdated: '2024-03-15 09:15:00',
  },
  {
    id: 4,
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    chain: 'Ethereum',
    chainId: 1,
    balance: 2000,
    currency: 'USDC',
    usdValue: 2000.00,
    status: 'active',
    lastUpdated: '2024-03-15 09:15:00',
  },

  // BSC 链
  {
    id: 5,
    address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    chain: 'BSC',
    chainId: 56,
    balance: 8.90,
    currency: 'BNB',
    usdValue: 4450.00,
    status: 'active',
    lastUpdated: '2024-03-15 08:45:00',
  },
  {
    id: 6,
    address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    chain: 'BSC',
    chainId: 56,
    balance: 3000,
    currency: 'USDT',
    usdValue: 3000.00,
    status: 'active',
    lastUpdated: '2024-03-15 08:45:00',
  },

  // Polygon 链
  {
    id: 7,
    address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    chain: 'Polygon',
    chainId: 137,
    balance: 1500,
    currency: 'MATIC',
    usdValue: 1350.00,
    status: 'active',
    lastUpdated: '2024-03-14 22:30:00',
  },
  {
    id: 8,
    address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    chain: 'Polygon',
    chainId: 137,
    balance: 1000,
    currency: 'USDC',
    usdValue: 1000.00,
    status: 'active',
    lastUpdated: '2024-03-14 22:30:00',
  },

  // Arbitrum 链
  {
    id: 9,
    address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    chain: 'Arbitrum',
    chainId: 42161,
    balance: 5.67,
    currency: 'ETH',
    usdValue: 11340.00,
    status: 'active',
    lastUpdated: '2024-03-14 20:15:00',
  },
  {
    id: 10,
    address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    chain: 'Arbitrum',
    chainId: 42161,
    balance: 800,
    currency: 'USDT',
    usdValue: 800.00,
    status: 'active',
    lastUpdated: '2024-03-14 20:15:00',
  },

  // Optimism 链
  {
    id: 11,
    address: '0x1234567890123456789012345678901234567890',
    chain: 'Optimism',
    chainId: 10,
    balance: 2.34,
    currency: 'ETH',
    usdValue: 4680.00,
    status: 'active',
    lastUpdated: '2024-03-14 18:00:00',
  },
  {
    id: 12,
    address: '0x1234567890123456789012345678901234567890',
    chain: 'Optimism',
    chainId: 10,
    balance: 1200,
    currency: 'USDC',
    usdValue: 1200.00,
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
