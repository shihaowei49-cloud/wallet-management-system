import axios from 'axios';

// 开发环境使用代理，生产环境使用环境变量
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API 方法
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

export const userAPI = {
  getList: (params) => api.get('/user/list', { params }),
};

export const balanceAPI = {
  getList: (params) => api.get('/balance/list', { params }),
};

export const nftAPI = {
  getList: (params) => api.get('/nft/list', { params }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
