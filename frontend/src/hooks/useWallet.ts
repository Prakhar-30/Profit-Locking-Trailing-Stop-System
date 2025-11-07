import { useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';
import { useStore } from '../store/useStore';
import { SEPOLIA_CHAIN_ID, NETWORKS } from '../lib/config';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWalletConnection = () => {
  const { wallet, setWallet, resetWallet } = useStore();

  // Check if MetaMask is installed
  const isMetaMaskInstalled = (): boolean => {
    return typeof window.ethereum !== 'undefined';
  };

  // Connect wallet
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('Please install MetaMask to continue');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setWallet({ isConnecting: true });

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      if (accounts.length > 0) {
        setWallet({
          address: accounts[0],
          chainId: Number(network.chainId),
          isConnected: true,
          isConnecting: false,
        });

        toast.success('Wallet connected successfully');

        // Check if on correct network
        if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
          toast('Please switch to Sepolia network', { icon: '⚠️' });
        }
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
      setWallet({ isConnecting: false });
    }
  }, [setWallet]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    resetWallet();
    toast.success('Wallet disconnected');
  }, [resetWallet]);

  // Switch network
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask not found');
      return;
    }

    try {
      const network = NETWORKS[chainId];
      if (!network) {
        toast.error('Unsupported network');
        return;
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      toast.success(`Switched to ${network.name}`);
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          const network = NETWORKS[chainId];
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: [network.rpc],
                blockExplorerUrls: network.explorer ? [network.explorer] : undefined,
              },
            ],
          });
          toast.success(`Added ${network.name} to MetaMask`);
        } catch (addError) {
          console.error('Failed to add network:', addError);
          toast.error('Failed to add network');
        }
      } else {
        console.error('Failed to switch network:', error);
        toast.error('Failed to switch network');
      }
    }
  }, []);

  // Listen to account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        resetWallet();
        toast('Wallet disconnected', { icon: 'ℹ️' });
      } else if (accounts[0] !== wallet.address) {
        setWallet({ address: accounts[0] });
        toast('Account changed', { icon: 'ℹ️' });
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      setWallet({ chainId });
      toast(`Network changed`, { icon: 'ℹ️' });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [wallet.address, setWallet, resetWallet]);

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);

        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          setWallet({
            address: accounts[0],
            chainId: Number(network.chainId),
            isConnected: true,
          });
        }
      } catch (error) {
        console.error('Auto-connect failed:', error);
      }
    };

    autoConnect();
  }, [setWallet]);

  return {
    ...wallet,
    connect,
    disconnect,
    switchNetwork,
    isMetaMaskInstalled,
  };
};
