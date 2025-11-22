import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, ExternalLink, RefreshCw, Filter } from 'lucide-react';
import walletService from '../services/walletService';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, sent, received
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = () => {
    const savedWallet = localStorage.getItem('currentWallet');
    if (savedWallet) {
      const wallet = JSON.parse(savedWallet);
      setWalletAddress(wallet.address);
      fetchTransactions(wallet.address);
    }
  };

  const fetchTransactions = async (address) => {
    setLoading(true);
    try {
      // Mock 数据 - 实际应该调用 Etherscan API 或后端接口
      const mockTxs = [
        {
          hash: '0x1234...5678',
          from: '0xabcd...efgh',
          to: address,
          value: '0.5',
          timestamp: Date.now() - 3600000,
          status: 'success',
          type: 'received',
        },
        {
          hash: '0x5678...1234',
          from: address,
          to: '0xijkl...mnop',
          value: '0.3',
          timestamp: Date.now() - 7200000,
          status: 'success',
          type: 'sent',
        },
        {
          hash: '0x9abc...def0',
          from: address,
          to: '0xqrst...uvwx',
          value: '1.2',
          timestamp: Date.now() - 86400000,
          status: 'pending',
          type: 'sent',
        },
        {
          hash: '0xdef0...9abc',
          from: '0xyzab...cdef',
          to: address,
          value: '2.5',
          timestamp: Date.now() - 172800000,
          status: 'success',
          type: 'received',
        },
        {
          hash: '0x1111...2222',
          from: address,
          to: '0x3333...4444',
          value: '0.1',
          timestamp: Date.now() - 259200000,
          status: 'failed',
          type: 'sent',
        },
      ];

      setTransactions(mockTxs);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (walletAddress) {
      fetchTransactions(walletAddress);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;

    return date.toLocaleDateString('zh-CN');
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return '成功';
      case 'pending':
        return '待确认';
      case 'failed':
        return '失败';
      default:
        return '未知';
    }
  };

  const currentNetwork = walletService.getCurrentNetwork();

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">交易历史</h1>
          <p className="text-gray-600 mt-1">查看所有交易记录</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>刷新</span>
        </button>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('received')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'received'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              接收
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'sent'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              发送
            </button>
          </div>
        </div>
      </div>

      {/* 交易列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 mb-2">暂无交易记录</div>
            <p className="text-sm text-gray-500">您的交易记录将在这里显示</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.hash}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  {/* 左侧：图标和信息 */}
                  <div className="flex items-center space-x-4">
                    {/* 类型图标 */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === 'received'
                          ? 'bg-green-100'
                          : tx.type === 'sent'
                          ? 'bg-orange-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {tx.type === 'received' ? (
                        <ArrowDownLeft className="w-6 h-6 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-orange-600" />
                      )}
                    </div>

                    {/* 交易信息 */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800">
                          {tx.type === 'received' ? '接收' : '发送'}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(tx.status)}`}>
                          {getStatusText(tx.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {tx.type === 'received' ? '从' : '到'}{' '}
                          <span className="font-mono">{formatAddress(tx.type === 'received' ? tx.from : tx.to)}</span>
                        </span>
                        <a
                          href={`${currentNetwork.explorer}/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>

                  {/* 右侧：金额 */}
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        tx.type === 'received' ? 'text-green-600' : 'text-gray-800'
                      }`}
                    >
                      {tx.type === 'received' ? '+' : '-'}{tx.value} {currentNetwork.symbol}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      ≈ ${(parseFloat(tx.value) * 2000).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* 交易哈希 */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    交易哈希: <span className="font-mono">{tx.hash}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 分页（占位） */}
      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm">
          <div className="text-sm text-gray-700">
            显示 1-{filteredTransactions.length} 共 {filteredTransactions.length} 条
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" disabled>
              上一页
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" disabled>
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
