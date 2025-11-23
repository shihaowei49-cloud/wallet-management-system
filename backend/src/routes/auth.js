import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 用户数据文件路径
const USERS_FILE = path.join(__dirname, '../../data/users.json');

// 确保数据目录存在
const dataDir = path.dirname(USERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 读取用户数据
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取用户数据失败:', error);
  }

  // 默认管理员用户
  return [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('admin123', 10),
      email: 'admin@wallet.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ];
}

// 保存用户数据
function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('保存用户数据失败:', error);
    throw error;
  }
}

// 初始化用户数据
let users = loadUsers();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 验证输入
    if (!username || !password || !email) {
      return res.status(400).json({ message: '请填写所有必填字段' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: '用户名至少3个字符' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '密码至少6个字符' });
    }

    // 检查用户是否已存在
    const existingUser = users.find((u) => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: '用户名或邮箱已被使用' });
    }

    // 创建新用户
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username,
      password: await bcrypt.hash(password, 10),
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // 生成 token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 重新加载用户数据（确保获取最新数据）
    users = loadUsers();

    // 查找用户
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

export default router;
