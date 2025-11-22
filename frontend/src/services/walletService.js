import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';

// 支持的网络配置
export const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.org',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io',
  },
  bsc: {
    chainId: 56,
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
  },
  bscTestnet: {
    chainId: 97,
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    symbol: 'BNB',
    explorer: 'https://testnet.bscscan.com',
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
  },
};

class WalletService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.currentNetwork = 'sepolia'; // 默认使用测试网
  }

  // 初始化 Provider
  initProvider(network = 'sepolia') {
    const networkConfig = NETWORKS[network];
    if (!networkConfig) {
      throw new Error('Unsupported network');
    }
    this.currentNetwork = network;
    this.provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    return this.provider;
  }

  // 创建新钱包
  async createWallet() {
    try {
      // 生成助记词
      const mnemonic = bip39.generateMnemonic(128); // 12个单词

      // 从助记词创建钱包
      const wallet = ethers.Wallet.fromPhrase(mnemonic);

      return {
        address: wallet.address,
        mnemonic: mnemonic,
        privateKey: wallet.privateKey,
      };
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw error;
    }
  }

  // 从助记词导入钱包
  async importFromMnemonic(mnemonic) {
    try {
      // 验证助记词
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
      }

      const wallet = ethers.Wallet.fromPhrase(mnemonic);

      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
    } catch (error) {
      console.error('Failed to import wallet from mnemonic:', error);
      throw error;
    }
  }

  // 从私钥导入钱包
  async importFromPrivateKey(privateKey) {
    try {
      // 确保私钥格式正确
      if (!privateKey.startsWith('0x')) {
        privateKey = '0x' + privateKey;
      }

      const wallet = new ethers.Wallet(privateKey);

      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
    } catch (error) {
      console.error('Failed to import wallet from private key:', error);
      throw error;
    }
  }

  // 加密私钥（用于本地存储）
  encryptPrivateKey(privateKey, password) {
    return CryptoJS.AES.encrypt(privateKey, password).toString();
  }

  // 解密私钥
  decryptPrivateKey(encryptedKey, password) {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // 连接钱包
  async connectWallet(privateKey, network = 'sepolia') {
    try {
      this.initProvider(network);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      return this.wallet;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  // 获取余额
  async getBalance(address) {
    try {
      if (!this.provider) {
        this.initProvider();
      }

      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  // 发送交易
  async sendTransaction({ to, amount, privateKey, network }) {
    try {
      // 连接钱包
      if (!this.wallet || this.wallet.privateKey !== privateKey) {
        await this.connectWallet(privateKey, network);
      }

      // 获取当前 gas 价格
      const feeData = await this.provider.getFeeData();

      // 构建交易
      const tx = {
        to: to,
        value: ethers.parseEther(amount.toString()),
        gasLimit: 21000,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      };

      // 发送交易
      const transaction = await this.wallet.sendTransaction(tx);

      // 等待确认
      const receipt = await transaction.wait();

      return {
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: ethers.formatEther(transaction.value),
        receipt: receipt,
      };
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  // 获取交易历史（简化版，实际需要调用区块链浏览器 API）
  async getTransactionHistory(address, limit = 10) {
    try {
      // 这里是模拟数据，实际应该调用 Etherscan API
      // 或使用 The Graph 等服务
      return [];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      throw error;
    }
  }

  // 估算 Gas 费用
  async estimateGas({ to, amount }) {
    try {
      if (!this.provider) {
        this.initProvider();
      }

      const feeData = await this.provider.getFeeData();
      const gasLimit = 21000; // 标准转账

      const estimatedGas = {
        gasLimit: gasLimit,
        maxFeePerGas: ethers.formatUnits(feeData.maxFeePerGas, 'gwei'),
        maxPriorityFeePerGas: ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'),
        estimatedCost: ethers.formatEther(feeData.maxFeePerGas * BigInt(gasLimit)),
      };

      return estimatedGas;
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  // 验证地址格式
  isValidAddress(address) {
    return ethers.isAddress(address);
  }

  // 获取当前网络信息
  getCurrentNetwork() {
    return NETWORKS[this.currentNetwork];
  }

  // 切换网络
  async switchNetwork(network) {
    if (!NETWORKS[network]) {
      throw new Error('Unsupported network');
    }
    this.initProvider(network);

    // 如果有已连接的钱包，重新连接到新网络
    if (this.wallet) {
      const privateKey = this.wallet.privateKey;
      this.wallet = new ethers.Wallet(privateKey, this.provider);
    }

    return this.getCurrentNetwork();
  }
}

// 导出单例
export default new WalletService();
