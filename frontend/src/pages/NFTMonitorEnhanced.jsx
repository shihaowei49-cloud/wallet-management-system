import React, { useEffect, useState } from 'react';
import { Image, Grid, List, RefreshCw, Send, X } from 'lucide-react';
import { nftAPI } from '../services/api';
import nftService from '../services/nftService';
import walletService from '../services/walletService';

const NFTMonitor = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // 转账表单
  const [transferForm, setTransferForm] = useState({
    to: '',
  });
  const [transferLoading, setTransferLoading] = useState(false);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const response = await nftAPI.getList();
      setNfts(response.data);
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferNFT = async (e) => {
    e.preventDefault();

    if (!selectedNFT) return;

    if (!walletService.isValidAddress(transferForm.to)) {
      alert('接收地址格式不正确');
      return;
    }

    // 获取当前钱包
    const savedWallet = localStorage.getItem('currentWallet');
    if (!savedWallet) {
      alert('请先连接钱包');
      return;
    }

    const wallet = JSON.parse(savedWallet);

    setTransferLoading(true);

    try {
      const result = await nftService.transferNFT({
        contractAddress: selectedNFT.contractAddress || '0x0000000000000000000000000000000000000000',
        from: wallet.address,
        to: transferForm.to,
        tokenId: selectedNFT.tokenId,
        privateKey: wallet.privateKey,
        network: 'sepolia',
      });

      alert('NFT 转账成功！');
      setShowTransferModal(false);
      setTransferForm({ to: '' });
      fetchNFTs();
    } catch (error) {
      alert('转账失败: ' + error.message);
    } finally {
      setTransferLoading(false);
    }
  };

  const openTransferModal = (nft) => {
    setSelectedNFT(nft);
    setShowTransferModal(true);
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
    setSelectedNFT(null);
    setTransferForm({ to: '' });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">NFT 监控</h1>
          <p className="text-gray-600 mt-1">管理和监控 NFT 资产</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* 视图切换 */}
          <div className="flex items-center bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={fetchNFTs}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">总 NFT 数量</p>
              <h3 className="text-2xl font-bold text-gray-800">{nfts.length}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Image className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">总估值</p>
            <h3 className="text-2xl font-bold text-gray-800">
              ${nfts.reduce((sum, nft) => sum + nft.estimatedValue, 0).toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">收藏系列</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {new Set(nfts.map(nft => nft.collection)).size}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">持有地址</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {new Set(nfts.map(nft => nft.ownerAddress)).size}
            </h3>
          </div>
        </div>
      </div>

      {/* NFT 列表/网格 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <div key={nft.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              {/* NFT 图片 */}
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative">
                <Image className="w-16 h-16 text-purple-300" />

                {/* 转账按钮 */}
                <button
                  onClick={() => openTransferModal(nft)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-blue-50"
                >
                  <Send className="w-4 h-4 text-blue-600" />
                </button>
              </div>

              {/* NFT 信息 */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">{nft.name}</h3>
                <p className="text-sm text-gray-500 truncate">{nft.collection}</p>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">估值</span>
                    <span className="font-semibold text-gray-800">${nft.estimatedValue}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Token ID</span>
                    <span className="font-mono text-xs text-gray-800">#{nft.tokenId}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NFT 信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  收藏系列
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  持有地址
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  估值
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nfts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                nfts.map((nft) => (
                  <tr key={nft.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                          <Image className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{nft.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{nft.collection}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">#{nft.tokenId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{nft.ownerAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">${nft.estimatedValue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openTransferModal(nft)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        转账
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 转账模态框 */}
      {showTransferModal && selectedNFT && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">转移 NFT</h3>
              <button
                onClick={closeTransferModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* NFT 信息 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Image className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedNFT.name}</h4>
                  <p className="text-sm text-gray-600">{selectedNFT.collection}</p>
                  <p className="text-xs text-gray-500 font-mono">Token ID: #{selectedNFT.tokenId}</p>
                </div>
              </div>
            </div>

            {/* 转账表单 */}
            <form onSubmit={handleTransferNFT} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">接收地址</label>
                <input
                  type="text"
                  value={transferForm.to}
                  onChange={(e) => setTransferForm({ to: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ 请确保接收地址正确，NFT 转账后无法撤销
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeTransferModal}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={transferLoading}
                  className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {transferLoading ? '转账中...' : '确认转账'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTMonitor;
