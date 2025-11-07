export const UniswapV2FactoryABI = [
  {
    "constant": true,
    "inputs": [
      { "name": "tokenA", "type": "address" },
      { "name": "tokenB", "type": "address" }
    ],
    "name": "getPair",
    "outputs": [{ "name": "pair", "type": "address" }],
    "type": "function"
  }
] as const;

// Sepolia Uniswap V2 Factory address
export const UNISWAP_V2_FACTORY_ADDRESS = '0x7E0987E5b3a30e3f2828572Bb659A548460a3003';
