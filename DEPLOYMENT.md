# Deployment Guide

This guide will help you compile your smart contracts and prepare the frontend for deployment.

## Step 1: Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Step 2: Install Dependencies

```bash
# Install smart contract dependencies
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts
forge install Uniswap/v2-core
forge install Uniswap/v2-periphery
forge install reactive-smart-contracts/reactive-lib

# Install frontend dependencies
cd frontend
npm install
```

## Step 3: Compile Smart Contracts

```bash
# Compile contracts
forge build

# Generate ABIs and bytecode
forge inspect PersonalProfitLockingTrailingStopCallback abi > frontend/src/lib/abis/generated/CallbackABI.json
forge inspect PersonalProfitLockingTrailingStopReactive abi > frontend/src/lib/abis/generated/ReactiveABI.json

# Get bytecode
forge inspect PersonalProfitLockingTrailingStopCallback bytecode --format json > frontend/src/lib/bytecode/CallbackBytecode.json
forge inspect PersonalProfitLockingTrailingStopReactive bytecode --format json > frontend/src/lib/bytecode/ReactiveBytecode.json
```

## Step 4: Configure Environment

Create `frontend/.env` file:

```bash
VITE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
VITE_REACTIVE_RPC=https://lasna-rpc.rnk.dev/
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_REACTIVE_CHAIN_ID=5318007
VITE_SEPOLIA_ROUTER=0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008
VITE_SEPOLIA_CALLBACK_SENDER=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
```

## Step 5: Run Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## Frontend Flow

### First-Time User Flow

1. **Connect Wallet**
   - User clicks "Connect Wallet"
   - MetaMask prompts for connection
   - User approves connection

2. **Deploy Contracts** (One-time)
   - User enters sell token address
   - User enters buy token address
   - User enters amount
   - System checks if pair exists
   - If pair exists, shows 120-minute price chart
   - User selects hard stop percentage (e.g., 10%)
   - User selects profit percentage (e.g., 20%)
   - User clicks "Deploy Contracts"

   **Deployment Steps:**
   - Deploy Callback Contract on Sepolia (0.01 ETH)
   - Approve tokens for Callback Contract
   - Switch to Reactive Lasna Network
   - Deploy Reactive Contract (0.1 REACT)
   - Contracts are now deployed!

3. **Dashboard View**
   - After deployment, user is automatically taken to Dashboard
   - Dashboard shows:
     - Active Orders section
     - Paused Orders section
     - Past Orders section (cancelled/executed)
     - "Add Profit-Protection" button

### Adding New Positions

1. Click "Add Profit-Protection" button in Dashboard
2. Same interface as initial deployment appears
3. Enter token addresses, amount, percentages
4. System calls `createProfitLockingPosition` on existing Callback contract
5. No need to deploy contracts again!

### Managing Positions

Each position card shows:
- Pair information (e.g., USDC/WETH)
- Profit percentage milestone
- Stop loss percentage
- Current price
- Entry price
- Hover to see 120-minute chart modal
- Action buttons:
  - Pause (active orders only)
  - Resume (paused orders only)
  - Cancel (active/paused orders)

## Testing on Sepolia

### Get Test Tokens

1. Get Sepolia ETH from faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. Get test tokens:
   - Swap Sepolia ETH for USDC, DAI, or WETH on Uniswap

3. Ensure you have:
   - At least 0.1 ETH for Callback deployment + gas
   - At least 0.15 REACT for Reactive deployment
   - Test tokens for your position

### Sepolia Addresses

- **Uniswap V2 Router**: `0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008`
- **Uniswap V2 Factory**: `0x7E0987E5b3a30e3f2828572Bb659A548460a3003`
- **Callback Sender**: `0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA`

### Common Tokens on Sepolia

- **WETH**: `0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9`
- **DAI**: `0x68194a729C2450ad26072b3D33ADaCbcef39D574`
- **USDC**: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`

## Troubleshooting

### Contract Compilation Issues

If contracts fail to compile:
1. Ensure all dependencies are installed: `forge install`
2. Check Solidity version matches (0.8.20)
3. Run `forge clean` and `forge build` again

### Frontend Build Issues

If frontend fails to build:
1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear npm cache: `npm cache clean --force`
3. Check Node.js version (requires Node 16+)

### MetaMask Issues

If MetaMask doesn't connect:
1. Ensure MetaMask is unlocked
2. Try refreshing the page
3. Clear MetaMask cache in browser
4. Try a different browser

### Deployment Fails

If contract deployment fails:
1. Check you have enough ETH/REACT for deployment
2. Increase gas limit in MetaMask
3. Check you're on the correct network
4. Verify contract bytecode is correctly included

## Production Considerations

### Before Mainnet

- [ ] Audit smart contracts thoroughly
- [ ] Test extensively on testnet with various scenarios
- [ ] Verify all calculations are accurate
- [ ] Test with different token pairs and volatilities
- [ ] Ensure sufficient funds for gas and operations
- [ ] Set up monitoring and alerting
- [ ] Document all parameters and settings
- [ ] Prepare emergency procedures
- [ ] Use multisig for large deployments
- [ ] Consider insurance or additional safeguards

### Security Checklist

- [ ] Private keys stored securely (hardware wallet)
- [ ] Contract ownership verified
- [ ] Emergency functions tested
- [ ] Position limits set appropriately
- [ ] Slippage protection configured
- [ ] Gas estimation accurate
- [ ] Fallback mechanisms in place
- [ ] Access controls verified
- [ ] Event logging complete
- [ ] Error handling robust

## Support

If you encounter issues:

1. Check the README.md for detailed documentation
2. Review the contract comments and documentation
3. Test with small amounts first
4. Join the community Discord (if available)
5. Report bugs on GitHub Issues

## License

GPL-2.0-or-later

---

**Remember**: This is experimental software. Test thoroughly before using with significant capital. Never invest more than you can afford to lose.
