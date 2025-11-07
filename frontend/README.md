# Profit-Locking Trailing Stop System - Frontend

Professional retro-futuristic trading interface for the Profit-Locking Trailing Stop System.

## Features

- 🎨 **Retro-Futuristic Design**: Professional trading platform aesthetic with glassmorphism effects
- 🔗 **Wallet Integration**: Seamless MetaMask connection with multi-chain support
- 📊 **Price Charts**: Real-time candlestick charts for 120-minute price data
- 🚀 **Contract Deployment**: One-click deployment flow for both contracts
- 📈 **Position Management**: Intuitive dashboard for all positions
- ⚡ **Real-time Updates**: Live price monitoring and status updates
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Ethers.js 6** - Blockchain interactions
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Lightweight Charts** - Candlestick charts

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MetaMask browser extension
- Sepolia ETH for testing
- REACT tokens for Reactive Network

### Installation

```bash
# Install dependencies
npm install

# Create .env file (already created)
# Edit if needed

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   └── PositionCard.tsx
│   ├── pages/           # Page components
│   │   ├── DeploymentScreen.tsx
│   │   └── Dashboard.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useWallet.ts
│   ├── lib/             # Libraries and utilities
│   │   ├── abis/        # Contract ABIs
│   │   ├── bytecode/    # Contract bytecode
│   │   └── config.ts    # Configuration
│   ├── store/           # State management
│   │   └── useStore.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   └── format.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind config
└── vite.config.ts       # Vite config
```

## User Flow

### First-Time User (Contract Deployment)

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Ensure on Sepolia network

2. **Deploy Contracts**
   - Enter sell token address
   - Enter buy token address
   - Enter amount
   - Set hard stop percentage (5%, 10%, 15%, or 20%)
   - Set profit milestone percentage (10%, 20%, 30%, or 50%)
   - Click "Deploy Contracts"
   - Follow deployment steps:
     - Deploy Callback Contract (0.01 ETH)
     - Approve tokens
     - Switch to Reactive Network
     - Deploy Reactive Contract (0.1 REACT)

3. **Dashboard View**
   - Automatically redirected to Dashboard
   - View contract addresses
   - See position statistics
   - Manage positions

### Adding New Positions

1. Click "Add Profit-Protection" in Dashboard
2. Enter token addresses and parameters
3. System calls `createProfitLockingPosition` on existing contract
4. Position appears in Active Orders

### Managing Positions

**Active Orders:**
- View current price and P&L
- Hover over Info icon to see 120-minute chart
- Click Pause to temporarily disable monitoring
- Click Cancel to stop monitoring permanently

**Paused Orders:**
- View paused positions
- Click Resume to reactivate
- Click Cancel to stop monitoring

**Past Orders:**
- View completed positions (cancelled/executed)
- See final results and timestamps

## Design System

### Color Palette

- **Primary**: Cyan (#00f5ff) - Main accents
- **Secondary**: Purple (#8338ec) - Secondary accents
- **Success**: Green (#06ffa5) - Profit indicators
- **Danger**: Pink (#ff006e) - Loss indicators
- **Background**: Dark grays (#0a0a0f to #2e2e3e)

### Typography

- **Headings**: JetBrains Mono (monospace)
- **Body**: Inter (sans-serif)
- **Numbers**: JetBrains Mono (monospace)

### Components

- **Glass Panels**: Semi-transparent backgrounds with backdrop blur
- **Buttons**: Transparent with colored borders that glow on hover
- **Inputs**: Dark backgrounds with cyan focus rings
- **Cards**: Glassmorphism effect with hover interactions

### Principles

- ❌ **No gradients on text** - Solid colors only
- ✅ **Transparent buttons** - Colored borders on hover only
- ✅ **Glassmorphism** - Semi-transparent panels
- ✅ **Monospace fonts** - For all numeric and code-like content
- ✅ **Retro-futuristic** - 80s/90s cyberpunk aesthetic

## Configuration

### Environment Variables

Edit `frontend/.env`:

```bash
# RPC endpoints
VITE_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
VITE_REACTIVE_RPC=https://lasna-rpc.rnk.dev/

# Chain IDs
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_REACTIVE_CHAIN_ID=5318007

# Contract addresses
VITE_SEPOLIA_ROUTER=0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008
VITE_SEPOLIA_CALLBACK_SENDER=0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA
```

### Customizing Theme

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens.

## Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Upload dist/ folder to Netlify
```

### Environment Variables

Remember to set environment variables in your hosting platform:
- `VITE_SEPOLIA_RPC`
- `VITE_REACTIVE_RPC`
- `VITE_SEPOLIA_CHAIN_ID`
- `VITE_REACTIVE_CHAIN_ID`
- `VITE_SEPOLIA_ROUTER`
- `VITE_SEPOLIA_CALLBACK_SENDER`

## Performance Optimization

### Current Optimizations

- ⚡ Code splitting with Vite
- ⚡ Lazy loading of components
- ⚡ Optimized bundle with tree-shaking
- ⚡ Memoized expensive computations
- ⚡ Efficient state management with Zustand

### Additional Optimizations

For production:
- Enable gzip/brotli compression
- Use CDN for static assets
- Implement service workers for caching
- Optimize images and icons
- Use React.memo for expensive components

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### MetaMask Issues

- Ensure MetaMask is unlocked
- Check you're on the correct network
- Try refreshing the page
- Clear browser cache

### Type Errors

```bash
# Regenerate types
npx tsc --noEmit
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

GPL-2.0-or-later

## Support

For issues and questions:
- Check the main README.md
- Review DEPLOYMENT.md
- Open an issue on GitHub

---

Built with ❤️ by Abhi
