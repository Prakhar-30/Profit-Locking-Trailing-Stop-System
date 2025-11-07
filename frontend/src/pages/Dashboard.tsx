import { useState, useEffect } from 'react';
import { Plus, Activity, Pause, XCircle, Filter } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PositionStatus } from '../types';
import { PositionCard } from '../components/PositionCard';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { positions, deployment, setShowPositionModal } = useStore();
  const [activeTab, setActiveTab] = useState<'active' | 'paused' | 'past'>('active');

  const activePositions = positions.filter((p) => p.status === PositionStatus.Active);
  const pausedPositions = positions.filter((p) => p.status === PositionStatus.Paused);
  const pastPositions = positions.filter(
    (p) =>
      p.status === PositionStatus.Cancelled ||
      p.status === PositionStatus.Closed ||
      p.status === PositionStatus.Failed
  );

  useEffect(() => {
    // TODO: Load positions from contracts
    // This is a placeholder
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-mono font-bold text-cyber-100 mb-2">Dashboard</h1>
          <p className="text-cyber-500 font-mono">
            Manage your profit-locking positions
          </p>
        </div>
        <button
          onClick={() => setShowPositionModal(true)}
          className="btn-success flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Profit-Protection</span>
        </button>
      </div>

      {/* Contract Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass-panel p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-neon-green" />
            <h3 className="text-sm font-mono text-cyber-400 uppercase">Callback Contract</h3>
          </div>
          <p className="text-xs font-mono text-cyber-300 break-all">
            {deployment.callbackAddress}
          </p>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-neon-purple" />
            <h3 className="text-sm font-mono text-cyber-400 uppercase">Reactive Contract</h3>
          </div>
          <p className="text-xs font-mono text-cyber-300 break-all">
            {deployment.reactiveAddress}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card-stat">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-mono text-cyber-500 uppercase">Total Positions</h3>
            <Activity className="w-4 h-4 text-cyber-600" />
          </div>
          <p className="text-3xl font-mono font-bold text-cyber-100">{positions.length}</p>
        </div>

        <div className="card-stat">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-mono text-cyber-500 uppercase">Active</h3>
            <Activity className="w-4 h-4 text-neon-green" />
          </div>
          <p className="text-3xl font-mono font-bold text-neon-green">{activePositions.length}</p>
        </div>

        <div className="card-stat">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-mono text-cyber-500 uppercase">Paused</h3>
            <Pause className="w-4 h-4 text-neon-yellow" />
          </div>
          <p className="text-3xl font-mono font-bold text-neon-yellow">{pausedPositions.length}</p>
        </div>

        <div className="card-stat">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-mono text-cyber-500 uppercase">Completed</h3>
            <XCircle className="w-4 h-4 text-cyber-600" />
          </div>
          <p className="text-3xl font-mono font-bold text-cyber-400">{pastPositions.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 rounded-lg font-mono font-semibold transition-all duration-200 ${
            activeTab === 'active'
              ? 'bg-neon-green/20 border border-neon-green text-neon-green'
              : 'bg-dark-700/50 border border-cyber-800/50 text-cyber-400 hover:border-cyber-600'
          }`}
        >
          Active ({activePositions.length})
        </button>
        <button
          onClick={() => setActiveTab('paused')}
          className={`px-6 py-3 rounded-lg font-mono font-semibold transition-all duration-200 ${
            activeTab === 'paused'
              ? 'bg-neon-yellow/20 border border-neon-yellow text-neon-yellow'
              : 'bg-dark-700/50 border border-cyber-800/50 text-cyber-400 hover:border-cyber-600'
          }`}
        >
          Paused ({pausedPositions.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 rounded-lg font-mono font-semibold transition-all duration-200 ${
            activeTab === 'past'
              ? 'bg-cyber-600/20 border border-cyber-600 text-cyber-300'
              : 'bg-dark-700/50 border border-cyber-800/50 text-cyber-400 hover:border-cyber-600'
          }`}
        >
          Past ({pastPositions.length})
        </button>
      </div>

      {/* Positions List */}
      <div className="space-y-4">
        {activeTab === 'active' && (
          <>
            {activePositions.length === 0 ? (
              <div className="glass-panel p-12 text-center">
                <Activity className="w-16 h-16 text-cyber-700 mx-auto mb-4" />
                <h3 className="text-xl font-mono font-bold text-cyber-400 mb-2">
                  No Active Positions
                </h3>
                <p className="text-cyber-600 mb-6">
                  Create your first profit-locking position to get started
                </p>
                <button
                  onClick={() => setShowPositionModal(true)}
                  className="btn-success"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Add Profit-Protection
                </button>
              </div>
            ) : (
              activePositions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))
            )}
          </>
        )}

        {activeTab === 'paused' && (
          <>
            {pausedPositions.length === 0 ? (
              <div className="glass-panel p-12 text-center">
                <Pause className="w-16 h-16 text-cyber-700 mx-auto mb-4" />
                <h3 className="text-xl font-mono font-bold text-cyber-400 mb-2">
                  No Paused Positions
                </h3>
                <p className="text-cyber-600">
                  Positions you pause will appear here
                </p>
              </div>
            ) : (
              pausedPositions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))
            )}
          </>
        )}

        {activeTab === 'past' && (
          <>
            {pastPositions.length === 0 ? (
              <div className="glass-panel p-12 text-center">
                <XCircle className="w-16 h-16 text-cyber-700 mx-auto mb-4" />
                <h3 className="text-xl font-mono font-bold text-cyber-400 mb-2">
                  No Past Positions
                </h3>
                <p className="text-cyber-600">
                  Completed positions will appear here
                </p>
              </div>
            ) : (
              pastPositions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
