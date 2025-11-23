import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Mock 用户列表数据
let mockUsers = [
  {
    id: 1,
    username: 'alice',
    email: 'alice@example.com',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    balance: 1234.56,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    username: 'bob',
    email: 'bob@example.com',
    walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    balance: 567.89,
    status: 'active',
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    username: 'charlie',
    email: 'charlie@example.com',
    walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    balance: 890.12,
    status: 'inactive',
    createdAt: '2024-02-01',
  },
  {
    id: 4,
    username: 'david',
    email: 'david@example.com',
    walletAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    balance: 2345.67,
    status: 'active',
    createdAt: '2024-02-10',
  },
  {
    id: 5,
    username: 'eve',
    email: 'eve@example.com',
    walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    balance: 456.78,
    status: 'active',
    createdAt: '2024-02-15',
  },
];

// 获取用户列表
router.get('/list', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    let filteredUsers = mockUsers;

    // 搜索过滤
    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json(paginatedUsers);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 更新用户
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, walletAddress, status } = req.body;

    const userIndex = mockUsers.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 更新用户信息
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      username: username || mockUsers[userIndex].username,
      email: email || mockUsers[userIndex].email,
      walletAddress: walletAddress || mockUsers[userIndex].walletAddress,
      status: status || mockUsers[userIndex].status,
    };

    res.json({
      message: '更新成功',
      user: mockUsers[userIndex],
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 删除用户
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const userIndex = mockUsers.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const deletedUser = mockUsers[userIndex];
    mockUsers = mockUsers.filter((u) => u.id !== parseInt(id));

    res.json({
      message: '删除成功',
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

export default router;
