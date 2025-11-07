import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { DeploymentScreen } from './pages/DeploymentScreen';
import { Dashboard } from './pages/Dashboard';

function App() {
  const { deployment, wallet } = useStore();

  useEffect(() => {
    // Load deployment state from localStorage
    const savedDeployment = localStorage.getItem('deployment');
    if (savedDeployment) {
      try {
        const parsed = JSON.parse(savedDeployment);
        useStore.setState({ deployment: parsed });
      } catch (error) {
        console.error('Failed to load deployment state:', error);
      }
    }
  }, []);

  // Save deployment state to localStorage whenever it changes
  useEffect(() => {
    if (deployment.isDeployed) {
      localStorage.setItem('deployment', JSON.stringify(deployment));
    }
  }, [deployment]);

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Background effects */}
      <div className="fixed inset-0 grid-background opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-cyber-gradient opacity-10 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {!wallet.isConnected ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="glass-panel p-12 text-center max-w-md">
                <div className="text-6xl mb-6">🔐</div>
                <h2 className="text-2xl font-mono font-bold text-cyber-300 mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-cyber-500 mb-6">
                  Connect your wallet to deploy contracts and start protecting your profits
                </p>
              </div>
            </div>
          ) : deployment.isDeployed ? (
            <Dashboard />
          ) : (
            <DeploymentScreen />
          )}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1c1c26',
            color: '#e0f2fe',
            border: '1px solid #0369a1',
            fontFamily: 'JetBrains Mono, monospace',
          },
          success: {
            iconTheme: {
              primary: '#06ffa5',
              secondary: '#1c1c26',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff006e',
              secondary: '#1c1c26',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
