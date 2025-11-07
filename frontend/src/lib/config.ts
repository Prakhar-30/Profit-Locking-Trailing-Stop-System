import { NetworkConfig, ContractAddresses } from '../types';

// Get environment variables
const SEPOLIA_RPC = import.meta.env.VITE_SEPOLIA_RPC || 'https://ethereum-sepolia-rpc.publicnode.com';
const REACTIVE_RPC = import.meta.env.VITE_REACTIVE_RPC || 'https://lasna-rpc.rnk.dev/';
const SEPOLIA_CHAIN_ID = Number(import.meta.env.VITE_SEPOLIA_CHAIN_ID) || 11155111;
const REACTIVE_CHAIN_ID = Number(import.meta.env.VITE_REACTIVE_CHAIN_ID) || 5318007;
const SEPOLIA_ROUTER = import.meta.env.VITE_SEPOLIA_ROUTER || '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008';
const SEPOLIA_CALLBACK_SENDER = import.meta.env.VITE_SEPOLIA_CALLBACK_SENDER || '0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA';

// Network configurations
export const NETWORKS: Record<number, NetworkConfig> = {
  [SEPOLIA_CHAIN_ID]: {
    chainId: SEPOLIA_CHAIN_ID,
    name: 'Sepolia Testnet',
    rpc: SEPOLIA_RPC,
    explorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [REACTIVE_CHAIN_ID]: {
    chainId: REACTIVE_CHAIN_ID,
    name: 'Reactive Lasna Testnet',
    rpc: REACTIVE_RPC,
    nativeCurrency: {
      name: 'REACT',
      symbol: 'REACT',
      decimals: 18,
    },
  },
};

// Contract addresses
export const CONTRACT_ADDRESSES: ContractAddresses = {
  sepolia: {
    router: SEPOLIA_ROUTER,
    callbackSender: SEPOLIA_CALLBACK_SENDER,
  },
  reactive: {
    rpc: REACTIVE_RPC,
  },
};

// Deployment values
export const DEPLOYMENT_VALUES = {
  callback: '0.01', // ETH
  reactive: '0.1',   // REACT (changed from 1 to 0.1 for testing)
};

// Common token addresses on Sepolia
export const COMMON_TOKENS = {
  WETH: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
  DAI: '0x68194a729C2450ad26072b3D33ADaCbcef39D574',
  USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  USDT: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
};

export { SEPOLIA_CHAIN_ID, REACTIVE_CHAIN_ID, SEPOLIA_RPC, REACTIVE_RPC };
