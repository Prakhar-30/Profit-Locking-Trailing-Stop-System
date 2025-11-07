import { formatUnits, parseUnits } from 'ethers';

/**
 * Format address to shortened version
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format token amount with decimals
 */
export const formatTokenAmount = (
  amount: bigint,
  decimals: number = 18,
  displayDecimals: number = 4
): string => {
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  });
};

/**
 * Parse token amount to bigint
 */
export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  try {
    return parseUnits(amount, decimals);
  } catch {
    return 0n;
  }
};

/**
 * Format USD value
 */
export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format basis points to percentage
 */
export const formatBasisPoints = (bps: number): string => {
  const percentage = bps / 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Format timestamp to date string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format timestamp to date and time string
 */
export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time ago
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(timestamp);
};

/**
 * Format number with K/M/B suffix
 */
export const formatCompact = (value: number): string => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Format price with appropriate decimals
 */
export const formatPrice = (price: bigint, coefficient: bigint = 1000000000000000000n): string => {
  const priceNum = Number(price) / Number(coefficient);
  if (priceNum < 0.01) return priceNum.toExponential(4);
  if (priceNum < 1) return priceNum.toFixed(6);
  if (priceNum < 100) return priceNum.toFixed(4);
  return priceNum.toFixed(2);
};

/**
 * Check if string is valid Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Check if string is valid number
 */
export const isValidNumber = (value: string): boolean => {
  return /^\d+(\.\d+)?$/.test(value) && !isNaN(parseFloat(value));
};
