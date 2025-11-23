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
// 新增页面
import WalletManager from './pages/WalletManager';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AirdropRecords from './pages/AirdropRecords';
import ApprovalManager from './pages/ApprovalManager';

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

          {/* 钱包管理 */}
          <Route path="wallet-manager" element={<WalletManager />} />

          {/* 钱包功能 */}
          <Route path="wallet/my" element={<MyWallet />} />
          <Route path="wallet/create" element={<CreateWallet />} />
          <Route path="wallet/transactions" element={<TransactionHistory />} />

          {/* 资产监控 */}
          <Route path="balance" element={<BalanceMonitor />} />
          <Route path="nft" element={<NFTMonitor />} />

          {/* 项目与任务 */}
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />

          {/* 空投记录 */}
          <Route path="airdrops" element={<AirdropRecords />} />

          {/* 授权管理 */}
          <Route path="approvals" element={<ApprovalManager />} />

          {/* 用户管理 */}
          <Route path="users" element={<UserManagement />} />

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
