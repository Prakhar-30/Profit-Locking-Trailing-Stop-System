export const CallbackABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_owner", "type": "address" },
      { "internalType": "address", "name": "_callbackSender", "type": "address" },
      { "internalType": "address", "name": "_router", "type": "address" }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "pair", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "positionId", "type": "uint256" },
      { "indexed": false, "internalType": "bool", "name": "sellToken0", "type": "bool" },
      { "indexed": false, "internalType": "address", "name": "tokenSell", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "tokenBuy", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "baseAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "entryPrice", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "hardStopPercent", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "profitTakePercent", "type": "uint256" }
    ],
    "name": "ProfitLockingPositionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "positionId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "profitAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "profitValue", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "newMilestone", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "totalProfitsSold", "type": "uint256" }
    ],
    "name": "ProfitLocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "positionId", "type": "uint256" }
    ],
    "name": "PositionCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "positionId", "type": "uint256" }
    ],
    "name": "PositionPaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "positionId", "type": "uint256" }
    ],
    "name": "PositionResumed",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "pair", "type": "address" },
      { "internalType": "bool", "name": "sellToken0", "type": "bool" },
      { "internalType": "uint256", "name": "baseAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "coefficient", "type": "uint256" },
      { "internalType": "uint256", "name": "hardStopPercent", "type": "uint256" },
      { "internalType": "uint256", "name": "profitTakePercent", "type": "uint256" }
    ],
    "name": "createProfitLockingPosition",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPositions",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActivePositions",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "positions",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "address", "name": "pair", "type": "address" },
      { "internalType": "address", "name": "tokenSell", "type": "address" },
      { "internalType": "address", "name": "tokenBuy", "type": "address" },
      { "internalType": "bool", "name": "sellToken0", "type": "bool" },
      { "internalType": "uint256", "name": "coefficient", "type": "uint256" },
      { "internalType": "uint256", "name": "baseAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "remainingBase", "type": "uint256" },
      { "internalType": "uint256", "name": "totalProfitsSold", "type": "uint256" },
      { "internalType": "uint256", "name": "entryPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "hardStopPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "hardStopPercent", "type": "uint256" },
      { "internalType": "uint256", "name": "profitTakePercent", "type": "uint256" },
      { "internalType": "uint256", "name": "nextProfitMilestone", "type": "uint256" },
      { "internalType": "uint256", "name": "lastMilestonePrice", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
      { "internalType": "uint256", "name": "closedAt", "type": "uint256" },
      { "internalType": "uint8", "name": "retryCount", "type": "uint8" },
      { "internalType": "uint256", "name": "lastExecutionAttempt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "positionId", "type": "uint256" }
    ],
    "name": "pausePosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "positionId", "type": "uint256" }
    ],
    "name": "resumePosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "positionId", "type": "uint256" }
    ],
    "name": "cancelPosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "positionId", "type": "uint256" }
    ],
    "name": "manualClosePosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "pair", "type": "address" },
      { "internalType": "bool", "name": "sellToken0", "type": "bool" }
    ],
    "name": "getCurrentPrice",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
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
    "name": "withdrawAllETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
