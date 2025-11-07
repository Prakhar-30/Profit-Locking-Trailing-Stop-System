import { useState } from 'react';
import { Rocket, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PRESET_PERCENTAGES } from '../types';
import toast from 'react-hot-toast';

export const DeploymentScreen = () => {
  const { setDeployment, wallet } = useStore();

  const [formData, setFormData] = useState({
    sellToken: '',
    buyToken: '',
    amount: '',
    hardStopPercent: 1000, // 10%
    profitTakePercent: 2000, // 20%
  });

  const [step, setStep] = useState<'form' | 'deploying' | 'success'>('form');
  const [currentDeployStep, setCurrentDeployStep] = useState('');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeploy = async () => {
    // Validation
    if (!formData.sellToken || !formData.buyToken || !formData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setStep('deploying');
      setCurrentDeployStep('Deploying Callback Contract on Sepolia...');

      // TODO: Implement actual deployment logic
      // This is a placeholder for the deployment flow

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentDeployStep('Approving tokens...');

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentDeployStep('Switching to Reactive Network...');

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentDeployStep('Deploying Reactive Contract...');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock addresses - replace with actual deployed addresses
      setDeployment({
        callbackAddress: '0x1234...5678',
        reactiveAddress: '0xabcd...efgh',
        isDeployed: true,
      });

      setStep('success');
      toast.success('Contracts deployed successfully!');

      setTimeout(() => {
        // This will trigger the app to show the dashboard
      }, 2000);

    } catch (error: any) {
      console.error('Deployment failed:', error);
      toast.error(error.message || 'Deployment failed');
      setStep('form');
    }
  };

  if (step === 'deploying') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-12 text-center max-w-md">
          <Loader className="w-16 h-16 text-neon-cyan mx-auto mb-6 animate-spin" />
          <h2 className="text-2xl font-mono font-bold text-cyber-300 mb-4">
            Deploying Contracts
          </h2>
          <p className="text-cyber-500 mb-6">{currentDeployStep}</p>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div className="bg-neon-cyan h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-12 text-center max-w-md">
          <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto mb-6" />
          <h2 className="text-2xl font-mono font-bold text-cyber-300 mb-4">
            Deployment Successful!
          </h2>
          <p className="text-cyber-500 mb-6">
            Your contracts have been deployed. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Rocket className="w-16 h-16 text-neon-cyan mx-auto mb-4" />
        <h1 className="text-4xl font-mono font-bold text-cyber-100 mb-2">
          Deploy Your Contracts
        </h1>
        <p className="text-cyber-500 font-mono">
          Deploy your personal profit-locking system contracts (one-time setup)
        </p>
      </div>

      <div className="glass-panel p-8">
        <div className="space-y-6">
          {/* Token Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-cyber">Sell Token Address</label>
              <input
                type="text"
                value={formData.sellToken}
                onChange={(e) => handleInputChange('sellToken', e.target.value)}
                placeholder="0x..."
                className="input-cyber"
              />
            </div>
            <div>
              <label className="label-cyber">Buy Token Address</label>
              <input
                type="text"
                value={formData.buyToken}
                onChange={(e) => handleInputChange('buyToken', e.target.value)}
                placeholder="0x..."
                className="input-cyber"
              />
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="label-cyber">Amount (Sell Token)</label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0.0"
              className="input-cyber"
            />
          </div>

          {/* Hard Stop Percentage */}
          <div>
            <label className="label-cyber">Hard Stop Loss (%)</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PRESET_PERCENTAGES.hardStop.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleInputChange('hardStopPercent', preset.value)}
                  className={`px-4 py-2 rounded-lg font-mono transition-all duration-200 ${
                    formData.hardStopPercent === preset.value
                      ? 'bg-neon-pink/20 border border-neon-pink text-neon-pink'
                      : 'bg-dark-700/50 border border-cyber-800/50 text-cyber-400 hover:border-cyber-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profit Take Percentage */}
          <div>
            <label className="label-cyber">Profit Milestone (%)</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PRESET_PERCENTAGES.profitTake.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleInputChange('profitTakePercent', preset.value)}
                  className={`px-4 py-2 rounded-lg font-mono transition-all duration-200 ${
                    formData.profitTakePercent === preset.value
                      ? 'bg-neon-green/20 border border-neon-green text-neon-green'
                      : 'bg-dark-700/50 border border-cyber-800/50 text-cyber-400 hover:border-cyber-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-cyber-900/30 border border-cyber-800/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
              <div className="text-sm text-cyber-400 font-mono space-y-2">
                <p><strong className="text-cyber-300">Deployment Cost:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Callback Contract: 0.01 ETH (Sepolia)</li>
                  <li>Reactive Contract: 0.1 REACT (Reactive Network)</li>
                  <li>+ Gas fees for both deployments</li>
                </ul>
                <p className="mt-3">
                  <strong className="text-cyber-300">Note:</strong> This is a one-time deployment.
                  After deployment, you can create unlimited positions without redeploying.
                </p>
              </div>
            </div>
          </div>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={!wallet.isConnected}
            className="w-full btn-primary py-4 text-lg font-bold"
          >
            🚀 Deploy Contracts
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-8 glass-panel p-6">
        <h3 className="text-xl font-mono font-bold text-cyber-300 mb-4">
          What Happens Next?
        </h3>
        <div className="space-y-3 text-sm font-mono text-cyber-500">
          <div className="flex items-start space-x-3">
            <span className="text-neon-cyan font-bold">1.</span>
            <p>Deploy Callback Contract on Sepolia (0.01 ETH)</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-neon-cyan font-bold">2.</span>
            <p>Approve tokens for the Callback Contract</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-neon-cyan font-bold">3.</span>
            <p>Switch to Reactive Lasna Network</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-neon-cyan font-bold">4.</span>
            <p>Deploy Reactive Contract (0.1 REACT)</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-neon-green font-bold">✓</span>
            <p>Done! Your personal profit-locking system is ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};
