import React, { useState } from 'react';
import { Globe, Star, History, Bookmark, ExternalLink } from 'lucide-react';

const DAppBrowser = () => {
  const [url, setUrl] = useState('');

  const popularDApps = [
    {
      name: 'Uniswap',
      url: 'https://app.uniswap.org',
      description: '去中心化交易所',
      icon: '🦄',
      category: 'DeFi',
    },
    {
      name: 'OpenSea',
      url: 'https://opensea.io',
      description: 'NFT 交易市场',
      icon: '🌊',
      category: 'NFT',
    },
    {
      name: 'Aave',
      url: 'https://app.aave.com',
      description: '借贷协议',
      icon: '👻',
      category: 'DeFi',
    },
    {
      name: 'Compound',
      url: 'https://app.compound.finance',
      description: '自动化做市商',
      icon: '🏦',
      category: 'DeFi',
    },
    {
      name: 'PancakeSwap',
      url: 'https://pancakeswap.finance',
      description: 'BSC 交易所',
      icon: '🥞',
      category: 'DeFi',
    },
    {
      name: 'Rarible',
      url: 'https://rarible.com',
      description: 'NFT 创作平台',
      icon: '🎨',
      category: 'NFT',
    },
  ];

  const handleNavigate = (dappUrl) => {
    window.open(dappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (url) {
      handleNavigate(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">DApp 浏览器</h1>
        <p className="text-gray-600 mt-1">探索去中心化应用</p>
      </div>

      {/* 地址栏 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleUrlSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入 DApp URL (例如: https://app.uniswap.org)"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            访问
          </button>
        </form>

        <div className="flex items-center space-x-4 mt-4">
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
            <Star className="w-4 h-4" />
            <span>收藏</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
            <History className="w-4 h-4" />
            <span>历史</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
            <Bookmark className="w-4 h-4" />
            <span>书签</span>
          </button>
        </div>
      </div>

      {/* 热门 DApps */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">热门 DApps</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularDApps.map((dapp, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleNavigate(dapp.url)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{dapp.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {dapp.name}
                    </h3>
                    <p className="text-xs text-gray-500">{dapp.category}</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <p className="text-sm text-gray-600 mb-3">{dapp.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono truncate">{dapp.url}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">💡 使用提示</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• DApp 将在新标签页中打开</li>
          <li>• 请确保您的钱包已连接到相应的网络</li>
          <li>• 访问 DApp 前请验证 URL 的安全性</li>
          <li>• 某些 DApp 需要连接 MetaMask 或其他钱包插件</li>
        </ul>
      </div>

      {/* Web3 连接状态（占位） */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Web3 连接</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">连接状态</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              未连接
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">钱包地址</span>
            <span className="text-sm text-gray-500">-</span>
          </div>

          <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            连接钱包
          </button>

          <p className="text-xs text-gray-500 text-center">
            注意：此功能需要浏览器钱包插件（如 MetaMask）
          </p>
        </div>
      </div>
    </div>
  );
};

export default DAppBrowser;
