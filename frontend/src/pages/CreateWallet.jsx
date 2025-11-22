import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Key, FileText, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import walletService from '../services/walletService';

const CreateWallet = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 选择方式, 2: 创建/导入, 3: 备份确认
  const [mode, setMode] = useState(''); // 'create', 'import-mnemonic', 'import-key'
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 导入表单
  const [importForm, setImportForm] = useState({
    mnemonic: '',
    privateKey: '',
    password: '',
    confirmPassword: '',
  });

  // 确认助记词
  const [mnemonicConfirm, setMnemonicConfirm] = useState(false);

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const wallet = await walletService.createWallet();
      setWalletData(wallet);
      setStep(3); // 进入备份确认步骤
    } catch (error) {
      alert('创建钱包失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromMnemonic = async () => {
    if (!importForm.mnemonic.trim()) {
      alert('请输入助记词');
      return;
    }

    setLoading(true);
    try {
      const wallet = await walletService.importFromMnemonic(importForm.mnemonic.trim());
      setWalletData({
        ...wallet,
        mnemonic: importForm.mnemonic.trim(),
      });
      saveWallet({
        ...wallet,
        mnemonic: importForm.mnemonic.trim(),
      });
    } catch (error) {
      alert('导入失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromPrivateKey = async () => {
    if (!importForm.privateKey.trim()) {
      alert('请输入私钥');
      return;
    }

    setLoading(true);
    try {
      const wallet = await walletService.importFromPrivateKey(importForm.privateKey.trim());
      setWalletData(wallet);
      saveWallet(wallet);
    } catch (error) {
      alert('导入失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveWallet = (wallet) => {
    // 保存到 localStorage（实际应用中应该使用更安全的方式）
    localStorage.setItem('currentWallet', JSON.stringify(wallet));
    alert('钱包导入成功！');
    navigate('/wallet/my');
  };

  const handleConfirmBackup = () => {
    if (!mnemonicConfirm) {
      alert('请确认您已安全备份助记词');
      return;
    }

    saveWallet(walletData);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 进度指示器 */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            1
          </div>
          <span className="ml-2 text-sm font-medium">选择方式</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300" />
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">创建/导入</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300" />
        <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            3
          </div>
          <span className="ml-2 text-sm font-medium">完成</span>
        </div>
      </div>

      {/* 步骤 1: 选择方式 */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">创建或导入钱包</h2>
            <p className="text-gray-600">选择一种方式开始</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 创建新钱包 */}
            <button
              onClick={() => {
                setMode('create');
                setStep(2);
                handleCreateWallet();
              }}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
                <Wallet className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">创建新钱包</h3>
              <p className="text-sm text-gray-600">生成全新的钱包地址</p>
            </button>

            {/* 导入助记词 */}
            <button
              onClick={() => {
                setMode('import-mnemonic');
                setStep(2);
              }}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                <FileText className="w-6 h-6 text-green-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">导入助记词</h3>
              <p className="text-sm text-gray-600">使用 12 个单词恢复</p>
            </button>

            {/* 导入私钥 */}
            <button
              onClick={() => {
                setMode('import-key');
                setStep(2);
              }}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 transition-colors">
                <Key className="w-6 h-6 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">导入私钥</h3>
              <p className="text-sm text-gray-600">使用私钥恢复钱包</p>
            </button>
          </div>
        </div>
      )}

      {/* 步骤 2: 导入表单 */}
      {step === 2 && mode.startsWith('import') && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {mode === 'import-mnemonic' ? '导入助记词' : '导入私钥'}
          </h2>

          {mode === 'import-mnemonic' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  助记词 (12 个单词，用空格分隔)
                </label>
                <textarea
                  value={importForm.mnemonic}
                  onChange={(e) => setImportForm({ ...importForm, mnemonic: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="word1 word2 word3 ..."
                />
              </div>

              <button
                onClick={handleImportFromMnemonic}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '导入中...' : '导入钱包'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">私钥</label>
                <input
                  type="password"
                  value={importForm.privateKey}
                  onChange={(e) => setImportForm({ ...importForm, privateKey: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="0x..."
                />
              </div>

              <button
                onClick={handleImportFromPrivateKey}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '导入中...' : '导入钱包'}
              </button>
            </div>
          )}

          <button
            onClick={() => setStep(1)}
            className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800"
          >
            返回
          </button>
        </div>
      )}

      {/* 步骤 3: 备份确认（仅创建钱包时） */}
      {step === 3 && mode === 'create' && walletData && (
        <div className="space-y-6">
          {/* 警告 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">重要提示</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 请妥善备份助记词和私钥</li>
                  <li>• 丢失助记词将无法恢复钱包</li>
                  <li>• 不要将助记词分享给任何人</li>
                  <li>• 建议离线保存在安全的地方</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 钱包信息 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">钱包信息</h3>

            <div className="space-y-4">
              {/* 地址 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">钱包地址</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={walletData.address}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(walletData.address)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 助记词 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">助记词</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {walletData.mnemonic.split(' ').map((word, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-medium">
                      <span className="text-gray-400 mr-2">{index + 1}.</span>
                      {word}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(walletData.mnemonic)}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-4 h-4" />
                  <span>复制助记词</span>
                </button>
              </div>

              {/* 私钥 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">私钥</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value={walletData.privateKey}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(walletData.privateKey)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 确认备份 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mnemonicConfirm}
                onChange={(e) => setMnemonicConfirm(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">
                我已安全备份助记词和私钥，并理解丢失它们将无法恢复钱包
              </span>
            </label>

            <button
              onClick={handleConfirmBackup}
              disabled={!mnemonicConfirm}
              className="w-full mt-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认并完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWallet;
