import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, Image, LogOut, Globe, History } from 'lucide-react';
import { authAPI } from '../../services/api';

const Sidebar = () => {
  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: '数据看板',
      color: 'text-orange-500',
    },
    {
      path: '/wallet/my',
      icon: Wallet,
      label: '我的钱包',
      color: 'text-blue-500',
    },
    {
      path: '/wallet/transactions',
      icon: Users,
      label: '交易记录',
      color: 'text-green-500',
    },
    {
      path: '/users',
      icon: Users,
      label: '用户管理',
      color: 'text-gray-500',
    },
    {
      path: '/balance',
      icon: Wallet,
      label: '余额监控',
      color: 'text-green-500',
    },
    {
      path: '/nft',
      icon: Image,
      label: 'NFT 监控',
      color: 'text-purple-500',
    },
    {
      path: '/dapp',
      icon: Globe,
      label: 'DApp 浏览器',
      color: 'text-indigo-500',
    },
  ];

  const handleLogout = () => {
    authAPI.logout();
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">W</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">Wallet System</h1>
            <p className="text-xs text-slate-400">管理平台</p>
          </div>
        </div>
      </div>

      {/* 菜单 */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`}
                />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 退出登录 */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">退出登录</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
