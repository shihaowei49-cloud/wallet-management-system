// ============================================
// 钱包管理相关类型
// ============================================

export type WalletImportance = "star" | "normal" | "trash";

export interface Wallet {
  id: string;
  address: string;
  label: string; // 备注名，如"主号1"、"工人-A"
  groups: string[]; // 分组标签，如["主号", "高价值"]
  importance: WalletImportance;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// 资产相关类型
// ============================================

export interface TokenBalance {
  id: string;
  walletAddress: string;
  chain: string;
  chainId: number;
  tokenSymbol: string;
  tokenAddress?: string; // 原生代币为空
  balance: number;
  usdValue: number;
  percentage?: number; // 在当前视图下的占比
  lastUpdated: string;
}

export interface TokenWhitelistItem {
  symbol: string;
  chains: string[]; // 该代币在哪些链上需要显示
}

// ============================================
// 项目与任务相关类型
// ============================================

export type ProjectType = "DeFi" | "NFT" | "L2" | "Meme" | "Pump" | "Other";
export type ProjectStatus = "ongoing" | "ended" | "claimed" | "tge_pending";

export interface Project {
  id: string;
  name: string;
  chain: string;
  type: ProjectType;
  status: ProjectStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type WalletTaskStatus = "not_started" | "in_progress" | "done";

export interface WalletTask {
  id: string;
  projectId: string;
  walletAddress: string;
  status: WalletTaskStatus;
  scoreEstimate?: number; // 积分/交互次数估算
  comment?: string;
  updatedAt?: string;
}

// ============================================
// 空投记录相关类型
// ============================================

export interface AirdropRecord {
  id: string;
  projectId: string;
  walletAddress: string;
  chain: string;
  tokenSymbol: string;
  amount: number;
  usdValueAtClaim?: number;
  claimedAt: string; // ISO 时间
}

// ============================================
// 交易历史相关类型
// ============================================

export type TxType = "transfer" | "swap" | "approve" | "mint" | "claim" | "other";

export interface TransactionItem {
  id: string;
  hash: string;
  chain: string;
  walletAddress: string;
  type: TxType;
  timestamp: string;
  description?: string;
  tokenChanges?: {
    symbol: string;
    amount: number;
    direction: "in" | "out";
  }[];
  gasUsed?: number;
  gasCost?: number;
}

// ============================================
// 收益计算相关类型
// ============================================

export interface WalletPnL {
  walletAddress: string;
  totalDeposit: number; // 总充值（USD）
  totalWithdraw: number; // 总提现（USD）
  currentValue: number; // 当前价值（USD）
  unrealizedPnL: number; // 未实现盈亏
  realizedPnL: number; // 已实现盈亏
  totalPnL: number; // 总盈亏
  roi: number; // 投资回报率 (%)
}

// ============================================
// 授权与风险相关类型
// ============================================

export type RiskLevel = "low" | "medium" | "high";

export interface TokenApproval {
  id: string;
  walletAddress: string;
  chain: string;
  contractAddress: string;
  contractName?: string;
  tokenSymbol: string;
  tokenAddress: string;
  isUnlimited: boolean;
  riskLevel: RiskLevel;
  approvedAt?: string;
  lastChecked: string;
}

// ============================================
// 视图模式相关类型
// ============================================

export type AssetViewMode = "by_chain" | "by_wallet" | "by_group";

// ============================================
// 区块浏览器配置
// ============================================

export interface ExplorerConfig {
  [chain: string]: {
    name: string;
    txUrl: string; // {hash} 会被替换
    addressUrl: string; // {address} 会被替换
  };
}

// ============================================
// 导出功能相关类型
// ============================================

export interface ExportOptions {
  filename: string;
  includeHeaders: boolean;
  dateFormat?: string;
}
