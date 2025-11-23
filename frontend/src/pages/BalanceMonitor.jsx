import React, { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, Wallet, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { balanceAPI } from '../services/api';

const BalanceMonitor = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChains, setExpandedChains] = useState(new Set(['Ethereum']));
  const [selectedChain, setSelectedChain] = useState('all');

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const response = await balanceAPI.getList();
      setBalances(response.data);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    } finally {
      setLoading(false);
    }
  };

  // 按链分组余额
  const groupByChain = () => {
    const grouped = {};
    balances.forEach((balance) => {
      if (!grouped[balance.chain]) {
        grouped[balance.chain] = [];
      }
      grouped[balance.chain].push(balance);
    });
    return grouped;
  };

  // 计算每条链的总价值
  const getChainTotalValue = (chainBalances) => {
    return chainBalances.reduce((sum, b) => sum + (b.usdValue || 0), 0);
  };

  // 获取链的图标颜色
  const getChainColor = (chain) => {
    const colors = {
      'Ethereum': 'bg-blue-500',
      'BSC': 'bg-yellow-500',
      'Polygon': 'bg-purple-500',
      'Arbitrum': 'bg-cyan-500',
      'Optimism': 'bg-red-500',
    };
    return colors[chain] || 'bg-gray-500';
  };

  const toggleChain = (chain) => {
    const newExpanded = new Set(expandedChains);
    if (newExpanded.has(chain)) {
      newExpanded.delete(chain);
    } else {
      newExpanded.add(chain);
    }
    setExpandedChains(newExpanded);
  };

  const chainGroups = groupByChain();
  const totalValue = balances.reduce((sum, b) => sum + (b.usdValue || 0), 0);
  const lowBalanceCount = balances.filter(b => (b.usdValue || 0) < 100).length;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">余额监控</h1>
          <p className="text-gray-600 mt-1">按链和币种监控钱包余额</p>
        </div>
        <button
          onClick={fetchBalances}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>刷新</span>
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">总资产价值</p>
              <h3 className="text-2xl font-bold text-gray-800">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">支持链数</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {Object.keys(chainGroups).length}
              </h3>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">低余额警告</p>
              <h3 className="text-2xl font-bold text-red-600">
                {lowBalanceCount}
              </h3>
            </div>
            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 链筛选 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setSelectedChain('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedChain === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部链
          </button>
          {Object.keys(chainGroups).map((chain) => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedChain === chain
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {chain} ({chainGroups[chain].length})
            </button>
          ))}
        </div>
      </div>

      {/* 按链分组的余额列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            加载中...
          </div>
        ) : (
          Object.entries(chainGroups)
            .filter(([chain]) => selectedChain === 'all' || selectedChain === chain)
            .map(([chain, chainBalances]) => {
              const totalChainValue = getChainTotalValue(chainBalances);
              const isExpanded = expandedChains.has(chain);

              return (
                <div key={chain} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* 链标题栏 */}
                  <div
                    className="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleChain(chain)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${getChainColor(chain)} rounded-lg flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">
                            {chain.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{chain}</h3>
                          <p className="text-sm text-gray-500">{chainBalances.length} 个资产</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">总价值</p>
                          <p className="text-lg font-bold text-gray-800">
                            ${totalChainValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 展开的余额列表 */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              钱包地址
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              币种
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              余额
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              USD价值
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              状态
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              最后更新
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {chainBalances.map((balance) => (
                            <tr key={balance.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-mono text-gray-900">
                                  {balance.address.slice(0, 10)}...{balance.address.slice(-8)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  {balance.currency}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                  {balance.balance.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="text-sm font-semibold text-green-600">
                                  ${(balance.usdValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  balance.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {balance.status === 'active' ? '活跃' : '非活跃'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {balance.lastUpdated}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default BalanceMonitor;
