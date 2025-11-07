// Chain IDs
export const SEPOLIA_CHAIN_ID = 11155111;
export const REACTIVE_CHAIN_ID = 5318007;

// Position status enum
export enum PositionStatus {
  Active = 0,
  Paused = 1,
  Cancelled = 2,
  Closed = 3,
  Failed = 4,
}

// Token interface
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

// Position interface
export interface Position {
  id: number;
  pair: string;
  tokenSell: Token;
  tokenBuy: Token;
  sellToken0: boolean;
  coefficient: bigint;
  baseAmount: bigint;
  remainingBase: bigint;
  totalProfitsSold: bigint;
  entryPrice: bigint;
  hardStopPrice: bigint;
  hardStopPercent: number;
  profitTakePercent: number;
  nextProfitMilestone: bigint;
  lastMilestonePrice: bigint;
  status: PositionStatus;
  createdAt: number;
  closedAt: number;
  retryCount: number;
  lastExecutionAttempt: number;
  currentPrice?: bigint;
}

// Deployment state
export interface DeploymentState {
  callbackAddress?: string;
  reactiveAddress?: string;
  isDeployed: boolean;
}

// Price data for charts
export interface PriceData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Transaction status
export enum TransactionStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

// Transaction state
export interface TransactionState {
  status: TransactionStatus;
  hash?: string;
  error?: string;
}

// Form data for creating position
export interface CreatePositionForm {
  sellToken: string;
  buyToken: string;
  amount: string;
  hardStopPercent: number;
  profitTakePercent: number;
}

// Wallet state
export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

// Contract addresses configuration
export interface ContractAddresses {
  sepolia: {
    router: string;
    callbackSender: string;
  };
  reactive: {
    rpc: string;
  };
}

// Network configuration
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpc: string;
  explorer?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Event log from smart contract
export interface EventLog {
  eventName: string;
  args: any[];
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}

// Uniswap pair info
export interface PairInfo {
  address: string;
  token0: Token;
  token1: Token;
  reserve0: bigint;
  reserve1: bigint;
  exists: boolean;
}

// Dashboard filters
export interface DashboardFilters {
  searchQuery: string;
  statusFilter: 'all' | 'active' | 'paused' | 'past';
  sortBy: 'createdAt' | 'entryPrice' | 'profitPercent';
  sortOrder: 'asc' | 'desc';
}

// Constants
export const BASIS_POINTS = 10000;
export const MIN_AMOUNT = 1000;
export const DEADLINE_OFFSET = 300; // 5 minutes

// Predefined loss/profit percentages
export const PRESET_PERCENTAGES = {
  hardStop: [
    { value: 500, label: '5%' },
    { value: 1000, label: '10%' },
    { value: 1500, label: '15%' },
    { value: 2000, label: '20%' },
  ],
  profitTake: [
    { value: 1000, label: '10%' },
    { value: 2000, label: '20%' },
    { value: 3000, label: '30%' },
    { value: 5000, label: '50%' },
  ],
};
