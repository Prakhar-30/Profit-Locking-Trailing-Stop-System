import { useWalletConnection } from '../hooks/useWallet';
import { formatAddress } from '../utils/format';
import { SEPOLIA_CHAIN_ID, NETWORKS } from '../lib/config';
import { Wallet, Power, AlertTriangle } from 'lucide-react';

export const Header = () => {
  const { address, chainId, isConnected, isConnecting, connect, disconnect, switchNetwork } =
    useWalletConnection();

  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  return (
    <header className="glass-panel border-b border-cyber-800/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold text-cyber-100">
                Profit-Locking System
              </h1>
              <p className="text-xs text-cyber-600 font-mono">
                Lock Profits. Ride Trends. Protect Capital.
              </p>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected && !isCorrectNetwork && (
              <button
                onClick={() => switchNetwork(SEPOLIA_CHAIN_ID)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg hover:border-red-500/50 transition-all duration-200"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-mono text-red-400">
                  Switch to Sepolia
                </span>
              </button>
            )}

            {isConnected && isCorrectNetwork && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-cyber-800/30 border border-cyber-700/50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-xs font-mono text-cyber-400">
                  {NETWORKS[chainId]?.name || 'Unknown'}
                </span>
              </div>
            )}

            {isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="px-4 py-2 bg-cyber-800/40 border border-cyber-700/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-cyber-400" />
                    <span className="font-mono text-sm text-cyber-300">
                      {formatAddress(address!)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={disconnect}
                  className="p-2 bg-transparent border border-red-600/50 text-red-400 rounded-lg hover:border-neon-pink hover:text-neon-pink hover:shadow-neon-pink transition-all duration-200"
                  title="Disconnect"
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
