import React, { useState, useEffect } from 'react';
import { Download, Filter } from 'lucide-react';
import { formatAddress, formatUSD, formatDateTime } from '../utils/format';
import { exportToCSV } from '../utils/export';

const AirdropRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedWallet, setSelectedWallet] = useState('all');

  // TODO: 替换为真实 API 调用
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    // Mock数据
    const mockRecords = [
      {
        id: '1',
        projectId: '1',
        projectName: 'zkSync Era',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        walletLabel: '主号1',
        chain: 'zkSync',
        tokenSymbol: 'ZK',
        amount: 850,
        usdValueAtClaim: 680,
        claimedAt: '2024-06-15T10:30:00Z',
      },
      {
        id: '2',
        projectId: '1',
        projectName: 'zkSync Era',
        walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
        walletLabel: '工人-A',
        chain: 'zkSync',
        tokenSymbol: 'ZK',
        amount: 650,
        usdValueAtClaim: 520,
        claimedAt: '2024-06-15T11:00:00Z',
      },
      {
        id: '3',
        projectId: '5',
        projectName: 'MEME Season 2',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        walletLabel: '主号1',
        chain: 'Ethereum',
        tokenSymbol: 'MEME',
        amount: 12000,
        usdValueAtClaim: 2400,
        claimedAt: '2024-03-20T14:00:00Z',
      },
    ];

    setTimeout(() => {
      setRecords(mockRecords);
      setLoading(false);
    }, 300);
  };

  const getProjects = () => {
    const projects = new Set();
    records.forEach((r) => projects.add(r.projectName));
    return Array.from(projects);
  };

  const getWallets = () => {
    const wallets = new Set();
    records.forEach((r) => wallets.add(r.walletLabel));
    return Array.from(wallets);
  };

  const filteredRecords = records.filter((record) => {
    const matchesProject =
      selectedProject === 'all' || record.projectName === selectedProject;
    const matchesWallet = selectedWallet === 'all' || record.walletLabel === selectedWallet;
    return matchesProject && matchesWallet;
  });

  const getTotalStats = () => {
    const totalValue = filteredRecords.reduce(
      (sum, r) => sum + (r.usdValueAtClaim || 0),
      0
    );
    const totalRecords = filteredRecords.length;
    return { totalValue, totalRecords };
  };

  const handleExport = () => {
    const exportData = filteredRecords.map((record) => ({
      项目: record.projectName,
      钱包: record.walletLabel,
      链: record.chain,
      代币: record.tokenSymbol,
      数量: record.amount,
      USD价值: record.usdValueAtClaim || 0,
      领取时间: formatDateTime(record.claimedAt),
    }));

    exportToCSV(exportData, {
      filename: `空投记录-${new Date().toISOString().split('T')[0]}.csv`,
      includeHeaders: true,
    });
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">空投记录</h1>
          <p className="text-gray-600 mt-1">查看已领取的空投记录</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-5 h-5" />
          <span>导出CSV</span>
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">总领取记录</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">总价值（领取时）</p>
          <p className="text-2xl font-bold text-green-600">{formatUSD(stats.totalValue)}</p>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部项目</option>
            {getProjects().map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部钱包</option>
            {getWallets().map((wallet) => (
              <option key={wallet} value={wallet}>
                {wallet}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 记录列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                项目
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                钱包
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                链
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                代币
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                数量
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                USD价值
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                领取时间
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
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  暂无空投记录
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {record.projectName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.walletLabel}</div>
                    <div className="text-xs text-gray-500 font-mono">
                      {formatAddress(record.walletAddress)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{record.chain}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {record.tokenSymbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {record.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-green-600">
                      {formatUSD(record.usdValueAtClaim || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(record.claimedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AirdropRecords;
