import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import BalanceMonitor from './pages/BalanceMonitor';
import NFTMonitor from './pages/NFTMonitorEnhanced';
import MyWallet from './pages/MyWallet';
import CreateWallet from './pages/CreateWallet';
import TransactionHistory from './pages/TransactionHistory';
import DAppBrowser from './pages/DAppBrowser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录和注册页 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 主系统 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* 钱包功能 */}
          <Route path="wallet/my" element={<MyWallet />} />
          <Route path="wallet/create" element={<CreateWallet />} />
          <Route path="wallet/transactions" element={<TransactionHistory />} />

          {/* 管理功能 */}
          <Route path="users" element={<UserManagement />} />
          <Route path="balance" element={<BalanceMonitor />} />
          <Route path="nft" element={<NFTMonitor />} />

          {/* DApp 浏览器 */}
          <Route path="dapp" element={<DAppBrowser />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
