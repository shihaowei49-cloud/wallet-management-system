import React, { useState, useEffect } from 'react';
import { Wallet, Send, Download, Copy, RefreshCw, Eye, EyeOff, QrCode, History } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import walletService from '../services/walletService';

const MyWallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(walletService.getCurrentNetwork());

  // 发送交易表单
  const [sendForm, setSendForm] = useState({
    to: '',
    amount: '',
  });
  const [sendLoading, setSendLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = () => {
    // 从 localStorage 加载钱包
    const savedWallet = localStorage.getItem('currentWallet');
    if (savedWallet) {
      const wallet = JSON.parse(savedWallet);
      setWalletData(wallet);
      fetchBalance(wallet.address);
    }
  };

  const fetchBalance = async (address) => {
    setLoading(true);
    try {
      const bal = await walletService.getBalance(address);
      setBalance(bal);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (walletData) {
      fetchBalance(walletData.address);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`${type} 已复制到剪贴板`);
  };

  const handleSendTransaction = async (e) => {
    e.preventDefault();

    if (!walletData || !walletData.privateKey) {
      alert('请先连接钱包');
      return;
    }

    if (!walletService.isValidAddress(sendForm.to)) {
      alert('接收地址格式不正确');
      return;
    }

    if (parseFloat(sendForm.amount) <= 0) {
      alert('金额必须大于 0');
      return;
    }

    setSendLoading(true);
    setTxHash('');

    try {
      const result = await walletService.sendTransaction({
        to: sendForm.to,
        amount: sendForm.amount,
        privateKey: walletData.privateKey,
        network: currentNetwork.name.toLowerCase().includes('sepolia') ? 'sepolia' : 'ethereum',
      });

      setTxHash(result.hash);
      alert('交易发送成功！');

      // 刷新余额
      setTimeout(() => {
        fetchBalance(walletData.address);
      }, 2000);

      // 清空表单
      setSendForm({ to: '', amount: '' });
    } catch (error) {
      alert('交易失败: ' + error.message);
    } finally {
      setSendLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!walletData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">没有钱包</h3>
          <p className="text-gray-500 mb-4">请先创建或导入钱包</p>
          <a
            href="/wallet/create"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            创建钱包
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">我的钱包</h1>
        <p className="text-gray-600 mt-1">管理您的数字资产</p>
      </div>

      {/* 余额卡片 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-blue-100">总余额</p>
              <p className="text-xs text-blue-200">{currentNetwork.name}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-4xl font-bold mb-2">
            {loading ? '...' : balance} {currentNetwork.symbol}
          </h2>
          <p className="text-blue-100">≈ ${(parseFloat(balance) * 2000).toFixed(2)} USD</p>
        </div>

        <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm">{formatAddress(walletData.address)}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(walletData.address, '地址')}
              className="p-2 hover:bg-white/10 rounded transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 二维码显示 */}
      {showQR && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">接收地址二维码</h3>
          <div className="flex justify-center">
            <QRCodeSVG value={walletData.address} size={200} />
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">{walletData.address}</p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center space-x-2 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <Download className="w-6 h-6 text-green-600" />
          <span className="font-medium text-gray-800">接收</span>
        </button>
        <button
          onClick={() => {
            const sendSection = document.getElementById('send-section');
            sendSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center justify-center space-x-2 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Send className="w-6 h-6 text-blue-600" />
          <span className="font-medium text-gray-800">发送</span>
        </button>
      </div>

      {/* 发送交易表单 */}
      <div id="send-section" className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">发送 {currentNetwork.symbol}</h3>

        <form onSubmit={handleSendTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">接收地址</label>
            <input
              type="text"
              value={sendForm.to}
              onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">金额</label>
            <div className="relative">
              <input
                type="number"
                step="0.000001"
                value={sendForm.amount}
                onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.0"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">{currentNetwork.symbol}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">可用余额: {balance} {currentNetwork.symbol}</p>
          </div>

          <button
            type="submit"
            disabled={sendLoading}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sendLoading ? '发送中...' : '发送交易'}
          </button>
        </form>

        {txHash && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-1">交易已发送！</p>
            <p className="text-xs text-green-600 break-all">交易哈希: {txHash}</p>
            <a
              href={`${currentNetwork.explorer}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline mt-2 inline-block"
            >
              在区块浏览器中查看 →
            </a>
          </div>
        )}
      </div>

      {/* 私钥信息（危险区域） */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4">🔐 私钥（危险）</h3>
        <p className="text-sm text-red-600 mb-4">⚠️ 永远不要将私钥分享给任何人！</p>

        <div className="flex items-center space-x-2">
          <input
            type={showPrivateKey ? 'text' : 'password'}
            value={walletData.privateKey || ''}
            readOnly
            className="flex-1 px-4 py-2 bg-white border border-red-300 rounded-lg font-mono text-sm"
          />
          <button
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="p-2 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            {showPrivateKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <button
            onClick={() => copyToClipboard(walletData.privateKey, '私钥')}
            className="p-2 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {walletData.mnemonic && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-red-700 mb-2">助记词</label>
            <div className="grid grid-cols-3 gap-2">
              {walletData.mnemonic.split(' ').map((word, index) => (
                <div key={index} className="bg-white border border-red-200 rounded px-3 py-2 text-sm">
                  <span className="text-gray-400 mr-2">{index + 1}.</span>
                  {word}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWallet;
