import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import walletService, { NETWORKS } from '../services/walletService';

const NetworkSwitcher = () => {
  const [currentNetwork, setCurrentNetwork] = useState(walletService.getCurrentNetwork());
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNetworkSwitch = async (networkKey) => {
    try {
      const network = await walletService.switchNetwork(networkKey);
      setCurrentNetwork(network);
      setShowDropdown(false);

      // 刷新页面数据
      window.location.reload();
    } catch (error) {
      alert('切换网络失败: ' + error.message);
    }
  };

  const getNetworkColor = (chainId) => {
    switch (chainId) {
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 11155111:
        return 'bg-purple-100 text-purple-800';
      case 56:
        return 'bg-yellow-100 text-yellow-800';
      case 97:
        return 'bg-orange-100 text-orange-800';
      case 137:
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{currentNetwork.name}</span>
      </button>

      {showDropdown && (
        <>
          {/* 遮罩 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700">选择网络</p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {Object.entries(NETWORKS).map(([key, network]) => (
                <button
                  key={key}
                  onClick={() => handleNetworkSwitch(key)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getNetworkColor(network.chainId)}`} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">{network.name}</p>
                      <p className="text-xs text-gray-500">{network.symbol}</p>
                    </div>
                  </div>

                  {currentNetwork.chainId === network.chainId && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600">
                当前链ID: {currentNetwork.chainId}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NetworkSwitcher;
