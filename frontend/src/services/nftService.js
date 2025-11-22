import { ethers } from 'ethers';
import walletService from './walletService';

// ERC-721 标准 ABI（简化版）
const ERC721_ABI = [
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function tokenURI(uint256 tokenId) view returns (string)',
];

class NFTService {
  constructor() {
    this.provider = null;
  }

  // 初始化 Provider
  initProvider() {
    if (!walletService.provider) {
      walletService.initProvider();
    }
    this.provider = walletService.provider;
  }

  // 转移 NFT
  async transferNFT({ contractAddress, from, to, tokenId, privateKey, network }) {
    try {
      // 连接钱包
      await walletService.connectWallet(privateKey, network);

      // 创建合约实例
      const contract = new ethers.Contract(contractAddress, ERC721_ABI, walletService.wallet);

      // 发送转账交易
      const tx = await contract.safeTransferFrom(from, to, tokenId);

      // 等待确认
      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        from: from,
        to: to,
        tokenId: tokenId,
        contractAddress: contractAddress,
        receipt: receipt,
      };
    } catch (error) {
      console.error('Failed to transfer NFT:', error);
      throw error;
    }
  }

  // 获取 NFT 所有者
  async getOwner(contractAddress, tokenId) {
    try {
      this.initProvider();

      const contract = new ethers.Contract(contractAddress, ERC721_ABI, this.provider);
      const owner = await contract.ownerOf(tokenId);

      return owner;
    } catch (error) {
      console.error('Failed to get NFT owner:', error);
      throw error;
    }
  }

  // 获取地址的 NFT 数量
  async getBalance(contractAddress, address) {
    try {
      this.initProvider();

      const contract = new ethers.Contract(contractAddress, ERC721_ABI, this.provider);
      const balance = await contract.balanceOf(address);

      return balance.toString();
    } catch (error) {
      console.error('Failed to get NFT balance:', error);
      throw error;
    }
  }

  // 获取 NFT 元数据
  async getTokenURI(contractAddress, tokenId) {
    try {
      this.initProvider();

      const contract = new ethers.Contract(contractAddress, ERC721_ABI, this.provider);
      const tokenURI = await contract.tokenURI(tokenId);

      return tokenURI;
    } catch (error) {
      console.error('Failed to get token URI:', error);
      throw error;
    }
  }

  // 获取合约信息
  async getContractInfo(contractAddress) {
    try {
      this.initProvider();

      const contract = new ethers.Contract(contractAddress, ERC721_ABI, this.provider);

      const [name, symbol] = await Promise.all([contract.name(), contract.symbol()]);

      return {
        name,
        symbol,
        address: contractAddress,
      };
    } catch (error) {
      console.error('Failed to get contract info:', error);
      throw error;
    }
  }

  // 验证合约地址
  isValidContract(address) {
    return ethers.isAddress(address);
  }
}

// 导出单例
export default new NFTService();
