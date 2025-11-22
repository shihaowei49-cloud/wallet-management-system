import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Mock NFT 数据
const mockNFTs = [
  {
    id: 1,
    name: 'Bored Ape #1234',
    collection: 'Bored Ape Yacht Club',
    tokenId: '1234',
    ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    estimatedValue: 45000,
    acquiredAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'CryptoPunk #5678',
    collection: 'CryptoPunks',
    tokenId: '5678',
    ownerAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    estimatedValue: 98000,
    acquiredAt: '2024-01-20',
  },
  {
    id: 3,
    name: 'Azuki #9012',
    collection: 'Azuki',
    tokenId: '9012',
    ownerAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    estimatedValue: 12000,
    acquiredAt: '2024-02-01',
  },
  {
    id: 4,
    name: 'Doodle #3456',
    collection: 'Doodles',
    tokenId: '3456',
    ownerAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    estimatedValue: 8500,
    acquiredAt: '2024-02-10',
  },
  {
    id: 5,
    name: 'CloneX #7890',
    collection: 'CloneX',
    tokenId: '7890',
    ownerAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    estimatedValue: 15000,
    acquiredAt: '2024-02-15',
  },
  {
    id: 6,
    name: 'Moonbird #2345',
    collection: 'Moonbirds',
    tokenId: '2345',
    ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    estimatedValue: 11000,
    acquiredAt: '2024-02-20',
  },
  {
    id: 7,
    name: 'MAYC #6789',
    collection: 'Mutant Ape Yacht Club',
    tokenId: '6789',
    ownerAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    estimatedValue: 18000,
    acquiredAt: '2024-03-01',
  },
  {
    id: 8,
    name: 'Pudgy Penguin #4321',
    collection: 'Pudgy Penguins',
    tokenId: '4321',
    ownerAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    estimatedValue: 7500,
    acquiredAt: '2024-03-05',
  },
];

// 获取 NFT 列表
router.get('/list', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNFTs = mockNFTs.slice(startIndex, endIndex);

    res.json(paginatedNFTs);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

export default router;
