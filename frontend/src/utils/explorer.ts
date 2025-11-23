import { ExplorerConfig } from '../types';

// 区块浏览器配置
export const EXPLORER_CONFIG: ExplorerConfig = {
  Ethereum: {
    name: 'Etherscan',
    txUrl: 'https://etherscan.io/tx/{hash}',
    addressUrl: 'https://etherscan.io/address/{address}',
  },
  BSC: {
    name: 'BscScan',
    txUrl: 'https://bscscan.com/tx/{hash}',
    addressUrl: 'https://bscscan.com/address/{address}',
  },
  Polygon: {
    name: 'PolygonScan',
    txUrl: 'https://polygonscan.com/tx/{hash}',
    addressUrl: 'https://polygonscan.com/address/{address}',
  },
  Arbitrum: {
    name: 'Arbiscan',
    txUrl: 'https://arbiscan.io/tx/{hash}',
    addressUrl: 'https://arbiscan.io/address/{address}',
  },
  Optimism: {
    name: 'Optimistic Etherscan',
    txUrl: 'https://optimistic.etherscan.io/tx/{hash}',
    addressUrl: 'https://optimistic.etherscan.io/address/{address}',
  },
};

/**
 * 获取交易哈希的区块浏览器链接
 */
export const getExplorerTxUrl = (chain: string, hash: string): string => {
  const config = EXPLORER_CONFIG[chain];
  if (!config) return '#';
  return config.txUrl.replace('{hash}', hash);
};

/**
 * 获取地址的区块浏览器链接
 */
export const getExplorerAddressUrl = (chain: string, address: string): string => {
  const config = EXPLORER_CONFIG[chain];
  if (!config) return '#';
  return config.addressUrl.replace('{address}', address);
};

/**
 * 获取 DeBank 地址链接
 */
export const getDebankUrl = (address: string): string => {
  return `https://debank.com/profile/${address}`;
};
