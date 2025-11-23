import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import { formatAddress } from '../utils/format';
import { getExplorerAddressUrl } from '../utils/explorer';

const ApprovalManager = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedWallet, setSelectedWallet] = useState('all');

  // TODO: 替换为真实 API 调用
  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    // Mock数据
    const mockApprovals = [
      {
        id: '1',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        walletLabel: '主号1',
        chain: 'Ethereum',
        contractAddress: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
        contractName: '1inch Router',
        tokenSymbol: 'USDT',
        tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        isUnlimited: true,
        riskLevel: 'low',
        lastChecked: '2024-11-20T10:00:00Z',
      },
      {
        id: '2',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        chain: 'Ethereum',
        contractAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        contractName: 'Uniswap Router',
        tokenSymbol: 'USDC',
        tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        isUnlimited: true,
        riskLevel: 'low',
        lastChecked: '2024-11-20T10:00:00Z',
      },
      {
        id: '3',
        walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
        walletLabel: '工人-A',
        chain: 'BSC',
        contractAddress: '0x8888888888888888888888888888888888888888',
        contractName: 'Unknown Contract',
        tokenSymbol: 'USDT',
        tokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        isUnlimited: true,
        riskLevel: 'high',
        lastChecked: '2024-11-19T15:30:00Z',
      },
      {
        id: '4',
        walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        walletLabel: '工人-B',
        chain: 'Polygon',
        contractAddress: '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae',
        contractName: 'LiFi Diamond',
        tokenSymbol: 'USDC',
        tokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        isUnlimited: false,
        riskLevel: 'medium',
        lastChecked: '2024-11-20T09:00:00Z',
      },
    ];

    setTimeout(() => {
      setApprovals(mockApprovals);
      setLoading(false);
    }, 300);
  };

  const getWallets = () => {
    const wallets = new Map();
    approvals.forEach((a) => {
      if (!wallets.has(a.walletAddress)) {
        wallets.set(a.walletAddress, a.walletLabel || formatAddress(a.walletAddress));
      }
    });
    return wallets;
  };

  const filteredApprovals = approvals.filter((approval) => {
    const matchesRisk =
      selectedRisk === 'all' || approval.riskLevel === selectedRisk;
    const matchesWallet =
      selectedWallet === 'all' || approval.walletAddress === selectedWallet;
    return matchesRisk && matchesWallet;
  });

  const getRiskStats = () => {
    const high = approvals.filter((a) => a.riskLevel === 'high').length;
    const medium = approvals.filter((a) => a.riskLevel === 'medium').length;
    const low = approvals.filter((a) => a.riskLevel === 'low').length;
    return { high, medium, low };
  };

  const getRiskBadge = (level) => {
    const config = {
      low: { label: '低风险', color: 'bg-green-100 text-green-800' },
      medium: { label: '中风险', color: 'bg-yellow-100 text-yellow-800' },
      high: { label: '高风险', color: 'bg-red-100 text-red-800' },
    };
    const { label, color } = config[level] || config.low;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const stats = getRiskStats();

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">授权管理</h1>
          <p className="text-gray-600 mt-1">监控钱包的代币授权和安全风险</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">高风险授权</p>
              <p className="text-2xl font-bold text-red-600">{stats.high}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">中风险授权</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">低风险授权</p>
              <p className="text-2xl font-bold text-green-600">{stats.low}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部风险级别</option>
            <option value="high">高风险</option>
            <option value="medium">中风险</option>
            <option value="low">低风险</option>
          </select>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部钱包</option>
            {Array.from(getWallets().entries()).map(([address, label]) => (
              <option key={address} value={address}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 授权列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                钱包
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                链
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                授权合约
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                代币
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                授权类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                风险等级
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  加载中...
                </td>
              </tr>
            ) : filteredApprovals.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  暂无授权记录
                </td>
              </tr>
            ) : (
              filteredApprovals.map((approval) => (
                <tr key={approval.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {approval.walletLabel || formatAddress(approval.walletAddress)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {approval.chain}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {approval.contractName || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {formatAddress(approval.contractAddress)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {approval.tokenSymbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {approval.isUnlimited ? (
                      <span className="text-sm text-red-600 font-medium">无限授权</span>
                    ) : (
                      <span className="text-sm text-gray-600">限额授权</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRiskBadge(approval.riskLevel)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <a
                      href={getExplorerAddressUrl(approval.chain, approval.contractAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                      title="在区块浏览器查看"
                    >
                      <ExternalLink className="w-4 h-4 inline" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 提示信息 */}
      {stats.high > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">高风险授权警告</h4>
              <p className="text-sm text-red-700">
                检测到 {stats.high} 个高风险授权，建议立即检查并撤销不必要的授权。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalManager;
