# Personal Profit-Locking Trailing Stop System - A Reactive Smart Contract Innovation

This project demonstrates a revolutionary **profit-locking trailing stop system** for Uniswap V2, built using Reactive Smart Contracts. Unlike traditional trailing stops that force complete exits, this system **locks profits incrementally while keeping your base position alive** to capture unlimited upside.

Each user deploys their own private instance of both contracts, providing complete control, privacy, and the ability to ride trends while systematically taking profits.

The system allows users to create positions that automatically lock profits at milestones and protect capital with hard stops, with monitoring handled by the Reactive Network and execution on the target blockchain.

## Network Support

### Testnet
- **Execution Chain**: Sepolia Ethereum Testnet
- **Reactive Chain**: Reactive Network (Lasna Testnet)

### Mainnet
- **Execution Chain**: Base Mainnet
- **Reactive Chain**: Reactive Network

## The Innovation

### The Problem with Traditional Trailing Stops

**Scenario:**
- Entry at $100 with 10% trailing stop
- Price rallies to $120 → Stop moves to $108
- Price drops to $108 → **YOU'RE OUT**
- Price then moons to $160 → **YOU MISSED IT** 😭

### The Solution: Profit-Locking with Base Protection

This system uses a **three-tier approach**:

1. **Base Amount (Sacred Capital)**
   - Your initial position size
   - Only sold if hard stop is hit
   - Stays alive to ride future moves

2. **Profit Milestones (Incremental Locks)**
   - Set profit intervals (e.g., every 20%)
   - Sell ONLY the profit at each milestone
   - Base position remains untouched

3. **Hard Stop (Catastrophic Protection)**
   - Absolute floor below entry (e.g., -10%)
   - If hit, sell EVERYTHING and exit
   - Final safety net

**Example Flow:**
```
Entry: $100 | Hard Stop: $90 (-10%) | Milestones: Every +20%

$100 → $120 (Milestone 1) → Sell $20 profit, keep $100 base
$120 → $110 (Dip) → No action, base still alive
$110 → $144 (Milestone 2) → Sell $24 profit, keep $100 base
$144 → $173 (Milestone 3) → Sell $29 profit, keep $100 base
$173 → $85 (Crash) → HARD STOP HIT → Sell all $100 base

Result: Locked $73 in profits + $85 base exit = $158 total (58% gain)
Traditional trailing stop: Would've exited at $108 (8% gain)
```

## Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the UI.

### Smart Contract Deployment

See deployment instructions in the [Usage](#usage) section below.

## How It Works

The system operates across two blockchains with personal contract instances:

1. **Personal Contract Deployment**: Each user deploys their own pair of contracts
2. **Position Creation**: Users create profit-locking positions on their callback contract
3. **Automated Monitoring**: Reactive contract monitors Uniswap price changes
4. **Milestone Tracking**: Dynamically calculates and tracks profit milestones
5. **Automatic Execution**:
   - Locks profits when milestones are hit
   - Triggers hard stop if price crashes below floor
6. **Direct Settlement**: All tokens sent directly to user's wallet

## Architecture

### PersonalProfitLockingTrailingStopCallback.sol (Execution Layer)
- Deployed on Sepolia/Base
- Manages profit-locking positions
- Executes profit locks (partial sells) and hard stops (full exits)
- Tracks base amounts and cumulative profits
- Executes swaps through Uniswap V2 router

### PersonalProfitLockingTrailingStopReactive.sol (Monitoring Layer)
- Deployed on Reactive Network
- Monitors Uniswap pair price changes
- Tracks profit milestones dynamically
- Monitors hard stop price
- Triggers appropriate callbacks when conditions are met
- Manages dynamic subscriptions to trading pairs

## Installation

### Prerequisites
```bash
# Install Node.js and npm (if not already installed)
# Visit https://nodejs.org/

# Install Foundry (for smart contracts)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd Profit-Locking-Trailing-Stop-System

# Install smart contract libraries
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts
forge install Uniswap/v2-core
forge install Uniswap/v2-periphery
forge install reactive-smart-contracts/reactive-lib

# Install frontend dependencies
cd frontend
npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```bash
# Private keys (NEVER share or commit these)
export SEPOLIA_PRIVATE_KEY=your_sepolia_private_key
export REACTIVE_PRIVATE_KEY=your_reactive_private_key

# Testnet URLs
export SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
export REACTIVE_RPC=https://lasna-rpc.rnk.dev/

# Mainnet URLs (for production)
export BASE_RPC=https://mainnet.base.org
export REACTIVE_MAINNET_RPC=https://reactive-rpc.rnk.dev/

# Reactive Network callback sender addresses
export SEPOLIA_CALLBACK_SENDER=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
export BASE_CALLBACK_SENDER=0x<base-callback-sender-address>

# Uniswap V2 Router addresses
export SEPOLIA_ROUTER=0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008
export BASE_ROUTER=0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24

# User wallet addresses
export USER_WALLET=$(cast wallet address --private-key $SEPOLIA_PRIVATE_KEY)
```

Create a `.env` file in the `frontend` directory:

```bash
VITE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
VITE_REACTIVE_RPC=https://lasna-rpc.rnk.dev/
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_REACTIVE_CHAIN_ID=5318007
VITE_SEPOLIA_ROUTER=0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008
VITE_SEPOLIA_CALLBACK_SENDER=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
```

## Usage

### Using the Frontend (Recommended)

1. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Connect Your Wallet**
   - Visit `http://localhost:5173`
   - Click "Connect Wallet"
   - Approve the connection in MetaMask

3. **Deploy Your Contracts** (First Time Only)
   - Select sell and buy tokens
   - Enter amount
   - Set loss percentage (e.g., 10% hard stop)
   - Set profit percentage (e.g., 20% milestones)
   - Click "Deploy Contracts"
   - Confirm transactions in MetaMask

4. **Create Positions**
   - After contracts are deployed, use "Add Profit-Protection"
   - Set parameters and approve tokens
   - Monitor positions in the Dashboard

5. **Manage Positions**
   - View active, paused, and past positions
   - Pause/Resume/Cancel positions as needed
   - Monitor current prices and charts

### Using Cast Commands (Advanced)

For detailed cast commands and manual deployment, see the [Command Line Usage](#command-line-usage) section.

## Configuration Parameters

### Basis Points System
All percentages use basis points where **10000 = 100%**

| Basis Points | Percentage | Use Case |
|--------------|------------|----------|
| 500 | 5% | Conservative hard stop |
| 1000 | 10% | Standard hard stop |
| 1500 | 15% | Aggressive hard stop |
| 2000 | 20% | Standard profit milestones |
| 3000 | 30% | Wide profit milestones (high volatility) |
| 5000 | 50% | Very wide milestones (extreme volatility) |

### Example Configurations

**Conservative (Low Volatility Assets):**
```bash
HARD_STOP_PERCENT=500        # 5% hard stop
PROFIT_TAKE_PERCENT=1000     # 10% profit milestones
```

**Standard (Moderate Volatility):**
```bash
HARD_STOP_PERCENT=1000       # 10% hard stop
PROFIT_TAKE_PERCENT=2000     # 20% profit milestones
```

**Aggressive (High Volatility / Meme Coins):**
```bash
HARD_STOP_PERCENT=2000       # 20% hard stop
PROFIT_TAKE_PERCENT=5000     # 50% profit milestones
```

## Key Features

### Innovation
- **Profit Locking**: First-of-its-kind incremental profit taking
- **Base Protection**: Keep position alive while locking gains
- **Dual Triggers**: Separate profit milestones and hard stops
- **Unlimited Upside**: Base stays in for massive runners

### Security
- **Complete Privacy**: Personal contract instances, no shared data
- **Non-Custodial**: Tokens stay in your wallet until execution
- **Multiple Safeguards**: Retry logic, balance checks, emergency controls
- **Transparent**: All actions on-chain and auditable

### Automation
- **24/7 Monitoring**: Reactive network watches prices continuously
- **Automatic Execution**: No manual intervention needed
- **Dynamic Milestones**: Next milestone calculated automatically
- **Efficient**: Dynamic subscription management

### Control
- **Flexible Management**: Pause, resume, or cancel anytime
- **Manual Override**: Close positions manually when needed
- **Emergency Recovery**: Rescue stuck funds if needed
- **Full Ownership**: You control everything

## Frontend Features

- **Retro-Futuristic Design**: Professional trading interface with glassmorphism
- **Wallet Integration**: Seamless MetaMask connection
- **Token Selection**: Search and select any ERC-20 token
- **Price Charts**: Real-time candlestick charts (120-minute data)
- **Contract Deployment**: One-click deployment flow
- **Position Management**: Intuitive dashboard for all positions
- **Real-time Updates**: Live price monitoring and status updates
- **Responsive Design**: Works on desktop and mobile

## License

This project is licensed under GPL-2.0-or-later.

## Disclaimer

This software is experimental and provided "as is". Users are responsible for:
- Understanding the risks of DeFi trading
- Testing thoroughly before using with significant capital
- Monitoring positions actively
- Securing their private keys
- Complying with local regulations

**Never invest more than you can afford to lose.**

## Acknowledgments

Built using:
- [Reactive Network](https://reactive.network)
- [Uniswap V2](https://uniswap.org)
- [OpenZeppelin](https://openzeppelin.com)
- [Foundry](https://getfoundry.sh)
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)

---

**Innovation by:** Abhi
**System:** Profit-Locking Trailing Stop with Base Protection
**Status:** Production Ready 🚀

*"Lock profits systematically. Ride trends indefinitely. Protect against disaster."*
