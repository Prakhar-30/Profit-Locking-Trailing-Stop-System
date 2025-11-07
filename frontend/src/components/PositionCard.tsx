import { useState } from 'react';
import { Play, Pause, XCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Position, PositionStatus } from '../types';
import { formatTokenAmount, formatBasisPoints, formatDateTime, formatPrice } from '../utils/format';
import toast from 'react-hot-toast';

interface PositionCardProps {
  position: Position;
}

export const PositionCard: React.FC<PositionCardProps> = ({ position }) => {
  const [showChart, setShowChart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePause = async () => {
    setIsProcessing(true);
    try {
      // TODO: Call pausePosition on contract
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Position paused');
    } catch (error) {
      toast.error('Failed to pause position');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResume = async () => {
    setIsProcessing(true);
    try {
      // TODO: Call resumePosition on contract
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Position resumed');
    } catch (error) {
      toast.error('Failed to resume position');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this position?')) return;

    setIsProcessing(true);
    try {
      // TODO: Call cancelPosition on contract
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Position cancelled');
    } catch (error) {
      toast.error('Failed to cancel position');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = () => {
    switch (position.status) {
      case PositionStatus.Active:
        return 'text-neon-green border-neon-green/50';
      case PositionStatus.Paused:
        return 'text-neon-yellow border-neon-yellow/50';
      case PositionStatus.Cancelled:
        return 'text-red-400 border-red-400/50';
      case PositionStatus.Closed:
        return 'text-cyber-500 border-cyber-500/50';
      case PositionStatus.Failed:
        return 'text-neon-pink border-neon-pink/50';
      default:
        return 'text-cyber-400 border-cyber-400/50';
    }
  };

  const getStatusLabel = () => {
    switch (position.status) {
      case PositionStatus.Active:
        return 'ACTIVE';
      case PositionStatus.Paused:
        return 'PAUSED';
      case PositionStatus.Cancelled:
        return 'CANCELLED';
      case PositionStatus.Closed:
        return 'CLOSED';
      case PositionStatus.Failed:
        return 'FAILED';
      default:
        return 'UNKNOWN';
    }
  };

  const calculateProfitLoss = () => {
    if (!position.currentPrice) return 0;
    const current = Number(position.currentPrice);
    const entry = Number(position.entryPrice);
    return ((current - entry) / entry) * 100;
  };

  const profitLoss = calculateProfitLoss();
  const isProfit = profitLoss >= 0;

  return (
    <div className="glass-panel-hover p-6 relative">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-1 text-xs font-mono font-bold border rounded-full ${getStatusColor()}`}
        >
          {getStatusLabel()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Pair Info */}
        <div>
          <h3 className="text-2xl font-mono font-bold text-cyber-100 mb-2">
            {position.tokenSell.symbol} → {position.tokenBuy.symbol}
          </h3>
          <p className="text-sm text-cyber-500 font-mono mb-4">
            Position #{position.id}
          </p>

          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-cyber-600">Base Amount:</span>
              <span className="text-cyber-300">
                {formatTokenAmount(position.baseAmount, position.tokenSell.decimals)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-600">Profits Sold:</span>
              <span className="text-cyber-300">
                {formatTokenAmount(position.totalProfitsSold, position.tokenSell.decimals)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-600">Created:</span>
              <span className="text-cyber-400">{formatDateTime(position.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Middle Column - Prices */}
        <div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-cyber-600 uppercase">Entry Price</label>
              <p className="text-xl font-mono font-bold text-cyber-300">
                {formatPrice(position.entryPrice, position.coefficient)}
              </p>
            </div>

            <div>
              <label className="text-xs font-mono text-cyber-600 uppercase">Current Price</label>
              <div className="flex items-center space-x-2">
                <p className="text-xl font-mono font-bold text-cyber-100">
                  {position.currentPrice
                    ? formatPrice(position.currentPrice, position.coefficient)
                    : 'Loading...'}
                </p>
                {isProfit ? (
                  <TrendingUp className="w-5 h-5 text-neon-green" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-neon-pink" />
                )}
              </div>
              <p
                className={`text-sm font-mono font-bold ${
                  isProfit ? 'text-neon-green' : 'text-neon-pink'
                }`}
              >
                {isProfit ? '+' : ''}
                {profitLoss.toFixed(2)}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="text-cyber-600 uppercase">Hard Stop</label>
                <p className="text-neon-pink font-bold">{formatBasisPoints(position.hardStopPercent)}</p>
              </div>
              <div>
                <label className="text-cyber-600 uppercase">Profit Mile</label>
                <p className="text-neon-green font-bold">{formatBasisPoints(position.profitTakePercent)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-4">
            <button
              onMouseEnter={() => setShowChart(true)}
              onMouseLeave={() => setShowChart(false)}
              className="p-2 bg-cyber-800/30 border border-cyber-700/50 rounded-lg hover:border-cyber-600 transition-all duration-200"
              title="View Chart"
            >
              <Info className="w-4 h-4 text-cyber-400" />
            </button>
          </div>

          <div className="space-y-2">
            {position.status === PositionStatus.Active && (
              <>
                <button
                  onClick={handlePause}
                  disabled={isProcessing}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <Pause className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing...' : 'Pause'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="w-full btn-danger flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing...' : 'Cancel'}</span>
                </button>
              </>
            )}

            {position.status === PositionStatus.Paused && (
              <>
                <button
                  onClick={handleResume}
                  disabled={isProcessing}
                  className="w-full btn-success flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing...' : 'Resume'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="w-full btn-danger flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing...' : 'Cancel'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chart Modal (on hover) */}
      {showChart && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50">
          <div className="glass-panel p-4 border border-neon-cyan/30">
            <h4 className="text-sm font-mono font-bold text-cyber-300 mb-2">
              120-Minute Price Chart
            </h4>
            <div className="h-48 bg-dark-900/50 rounded-lg flex items-center justify-center">
              <p className="text-cyber-600 font-mono text-sm">Chart placeholder</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
