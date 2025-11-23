import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Upload,
  Edit,
  Trash2,
  Star,
  Filter,
  Copy,
  ExternalLink,
  X,
} from 'lucide-react';
import { formatAddress, formatUSD } from '../utils/format';
import { getExplorerAddressUrl, getDebankUrl } from '../utils/explorer';
import { copyToClipboard } from '../utils/export';

const WalletManager = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedImportance, setSelectedImportance] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [editForm, setEditForm] = useState({
    address: '',
    label: '',
    groups: [],
    importance: 'normal',
  });

  // TODO: 替换为真实 API 调用
  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    // Mock数据
    const mockWallets = [
      {
        id: '1',
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        label: '主号1',
        groups: ['主号', '高价值'],
        importance: 'star',
        totalValue: 29680.0,
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
        label: '工人-A',
        groups: ['工人', '撸毛'],
        importance: 'normal',
        totalValue: 8900.0,
        createdAt: '2024-02-01T10:00:00Z',
      },
      {
        id: '3',
        address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        label: '工人-B',
        groups: ['工人', '撸毛'],
        importance: 'normal',
        totalValue: 7450.0,
        createdAt: '2024-02-01T10:00:00Z',
      },
      {
        id: '4',
        address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
        label: '备用钱包',
        groups: ['备用'],
        importance: 'trash',
        totalValue: 2350.0,
        createdAt: '2024-03-10T10:00:00Z',
      },
    ];

    setTimeout(() => {
      setWallets(mockWallets);
      setLoading(false);
    }, 300);
  };

  // 获取所有分组
  const getAllGroups = () => {
    const groupsSet = new Set();
    wallets.forEach((wallet) => {
      wallet.groups.forEach((group) => groupsSet.add(group));
    });
    return Array.from(groupsSet);
  };

  // 筛选钱包
  const filteredWallets = wallets.filter((wallet) => {
    const matchesSearch =
      wallet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.label.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup =
      selectedGroup === 'all' || wallet.groups.includes(selectedGroup);

    const matchesImportance =
      selectedImportance === 'all' || wallet.importance === selectedImportance;

    return matchesSearch && matchesGroup && matchesImportance;
  });

  // 处理编辑
  const handleEdit = (wallet) => {
    setEditingWallet(wallet);
    setEditForm({
      address: wallet.address,
      label: wallet.label,
      groups: wallet.groups,
      importance: wallet.importance,
    });
    setShowEditModal(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    // TODO: 调用 API 更新钱包
    const updatedWallets = wallets.map((w) =>
      w.id === editingWallet.id
        ? {
            ...w,
            label: editForm.label,
            groups: editForm.groups,
            importance: editForm.importance,
            updatedAt: new Date().toISOString(),
          }
        : w
    );
    setWallets(updatedWallets);
    setShowEditModal(false);
    setEditingWallet(null);
  };

  // 删除钱包
  const handleDelete = async (wallet) => {
    if (!window.confirm(`确定要删除钱包 "${wallet.label}" 吗？`)) {
      return;
    }

    // TODO: 调用 API 删除钱包
    setWallets(wallets.filter((w) => w.id !== wallet.id));
  };

  // 复制地址
  const handleCopy = async (address) => {
    const success = await copyToClipboard(address);
    if (success) {
      alert('地址已复制到剪贴板');
    }
  };

  // 获取重要性标记图标
  const getImportanceIcon = (importance) => {
    if (importance === 'star') {
      return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">钱包管理</h1>
          <p className="text-gray-600 mt-1">管理和组织您的钱包地址</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>批量导入</span>
          </button>
          <button
            onClick={() => {
              setEditingWallet(null);
              setEditForm({
                address: '',
                label: '',
                groups: [],
                importance: 'normal',
              });
              setShowEditModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>添加钱包</span>
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 搜索 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="搜索地址或标签..."
            />
          </div>

          {/* 分组筛选 */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部分组</option>
            {getAllGroups().map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          {/* 重要性筛选 */}
          <select
            value={selectedImportance}
            onChange={(e) => setSelectedImportance(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部等级</option>
            <option value="star">⭐ 重点钱包</option>
            <option value="normal">普通钱包</option>
            <option value="trash">低价值钱包</option>
          </select>
        </div>
      </div>

      {/* 钱包列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                钱包信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                地址
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分组
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                总价值
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  加载中...
                </td>
              </tr>
            ) : filteredWallets.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  暂无钱包数据
                </td>
              </tr>
            ) : (
              filteredWallets.map((wallet) => (
                <tr key={wallet.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getImportanceIcon(wallet.importance)}
                      <span className="text-sm font-medium text-gray-900">
                        {wallet.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-gray-700">
                        {formatAddress(wallet.address)}
                      </span>
                      <button
                        onClick={() => handleCopy(wallet.address)}
                        className="text-gray-400 hover:text-gray-600"
                        title="复制地址"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={getDebankUrl(wallet.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600"
                        title="在 DeBank 查看"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {wallet.groups.map((group) => (
                        <span
                          key={group}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatUSD(wallet.totalValue)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(wallet)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(wallet)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 编辑/添加钱包模态框 */}
      {showEditModal && (
        <EditWalletModal
          wallet={editingWallet}
          formData={editForm}
          onFormChange={setEditForm}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* 批量导入模态框 */}
      {showImportModal && (
        <ImportWalletsModal
          onImport={(newWallets) => {
            setWallets([...wallets, ...newWallets]);
            setShowImportModal(false);
          }}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

// 编辑钱包模态框组件
const EditWalletModal = ({ wallet, formData, onFormChange, onSave, onClose }) => {
  const [groupInput, setGroupInput] = useState('');

  const handleAddGroup = () => {
    if (groupInput && !formData.groups.includes(groupInput)) {
      onFormChange({
        ...formData,
        groups: [...formData.groups, groupInput],
      });
      setGroupInput('');
    }
  };

  const handleRemoveGroup = (group) => {
    onFormChange({
      ...formData,
      groups: formData.groups.filter((g) => g !== group),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {wallet ? '编辑钱包' : '添加钱包'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              钱包地址 *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onFormChange({ ...formData, address: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="0x..."
              disabled={!!wallet}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签 *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => onFormChange({ ...formData, label: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：主号1、工人-A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分组</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={groupInput}
                onChange={(e) => setGroupInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGroup()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入分组名称"
              />
              <button
                onClick={handleAddGroup}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.groups.map((group) => (
                <span
                  key={group}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{group}</span>
                  <button
                    onClick={() => handleRemoveGroup(group)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              重要性
            </label>
            <select
              value={formData.importance}
              onChange={(e) => onFormChange({ ...formData, importance: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="star">⭐ 重点钱包</option>
              <option value="normal">普通钱包</option>
              <option value="trash">低价值钱包</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            取消
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            disabled={!formData.address || !formData.label}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

// 批量导入模态框组件
const ImportWalletsModal = ({ onImport, onClose }) => {
  const [addresses, setAddresses] = useState('');
  const [defaultLabel, setDefaultLabel] = useState('工人');
  const [defaultGroups, setDefaultGroups] = useState(['撸毛']);

  const handleImport = () => {
    const lines = addresses.split('\n').filter((line) => line.trim());
    const newWallets = lines.map((address, index) => ({
      id: `import-${Date.now()}-${index}`,
      address: address.trim(),
      label: `${defaultLabel}-${index + 1}`,
      groups: defaultGroups,
      importance: 'normal',
      totalValue: 0,
      createdAt: new Date().toISOString(),
    }));

    onImport(newWallets);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">批量导入钱包</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              钱包地址（每行一个）
            </label>
            <textarea
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows="10"
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb&#10;0x8ba1f109551bD432803012645Ac136ddd64DBA72&#10;..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签前缀
              </label>
              <input
                type="text"
                value={defaultLabel}
                onChange={(e) => setDefaultLabel(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：工人"
              />
              <p className="mt-1 text-xs text-gray-500">
                将自动命名为：{defaultLabel}-1, {defaultLabel}-2...
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            将导入 {addresses.split('\n').filter((l) => l.trim()).length} 个地址
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              disabled={!addresses.trim()}
            >
              开始导入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletManager;
