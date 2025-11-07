export const ReactiveABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_owner", "type": "address" },
      { "internalType": "address", "name": "_profitLockingCallback", "type": "address" }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "pair", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "positionId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "entryPrice", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "hardStopPrice", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "firstMilestone", "type": "uint256" }
    ],
    "name": "PositionTracked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "pair", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "positionId", "type": "uint256" }
    ],
    "name": "PositionUntracked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "positionId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "currentPrice", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "milestonePrice", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "nextMilestone", "type": "uint256" }
    ],
    "name": "MilestoneReached",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "positionId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "currentPrice", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "hardStopPrice", "type": "uint256" }
    ],
    "name": "HardStopHit",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "trackedPositions",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "address", "name": "pair", "type": "address" },
      { "internalType": "bool", "name": "sellToken0", "type": "bool" },
      { "internalType": "uint256", "name": "coefficient", "type": "uint256" },
      { "internalType": "uint256", "name": "entryPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "hardStopPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "nextProfitMilestone", "type": "uint256" },
      { "internalType": "uint256", "name": "lastMilestonePrice", "type": "uint256" },
      { "internalType": "uint256", "name": "profitTakePercent", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "lastTriggeredAt", "type": "uint256" },
      { "internalType": "uint8", "name": "triggerCount", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "pair", "type": "address" }
    ],
    "name": "getActivePositionsForPair",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "profitLockingCallback",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawAllETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
