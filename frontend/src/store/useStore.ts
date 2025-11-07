import { create } from 'zustand';
import { WalletState, DeploymentState, Position, TransactionState, TransactionStatus } from '../types';

interface AppStore {
  // Wallet
  wallet: WalletState;
  setWallet: (wallet: Partial<WalletState>) => void;
  resetWallet: () => void;

  // Deployment
  deployment: DeploymentState;
  setDeployment: (deployment: Partial<DeploymentState>) => void;

  // Positions
  positions: Position[];
  setPositions: (positions: Position[]) => void;
  addPosition: (position: Position) => void;
  updatePosition: (id: number, updates: Partial<Position>) => void;

  // Transaction
  transaction: TransactionState;
  setTransaction: (transaction: Partial<TransactionState>) => void;
  resetTransaction: () => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // Modal state
  showDeployModal: boolean;
  setShowDeployModal: (show: boolean) => void;
  showPositionModal: boolean;
  setShowPositionModal: (show: boolean) => void;
}

const initialWalletState: WalletState = {
  address: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
};

const initialDeploymentState: DeploymentState = {
  callbackAddress: undefined,
  reactiveAddress: undefined,
  isDeployed: false,
};

const initialTransactionState: TransactionState = {
  status: TransactionStatus.Idle,
  hash: undefined,
  error: undefined,
};

export const useStore = create<AppStore>((set) => ({
  // Wallet
  wallet: initialWalletState,
  setWallet: (wallet) =>
    set((state) => ({
      wallet: { ...state.wallet, ...wallet },
    })),
  resetWallet: () => set({ wallet: initialWalletState }),

  // Deployment
  deployment: initialDeploymentState,
  setDeployment: (deployment) =>
    set((state) => ({
      deployment: { ...state.deployment, ...deployment },
    })),

  // Positions
  positions: [],
  setPositions: (positions) => set({ positions }),
  addPosition: (position) =>
    set((state) => ({
      positions: [...state.positions, position],
    })),
  updatePosition: (id, updates) =>
    set((state) => ({
      positions: state.positions.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  // Transaction
  transaction: initialTransactionState,
  setTransaction: (transaction) =>
    set((state) => ({
      transaction: { ...state.transaction, ...transaction },
    })),
  resetTransaction: () => set({ transaction: initialTransactionState }),

  // UI State
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  // Modals
  showDeployModal: false,
  setShowDeployModal: (show) => set({ showDeployModal: show }),
  showPositionModal: false,
  setShowPositionModal: (show) => set({ showPositionModal: show }),
}));

// Selectors for convenience
export const useWallet = () => useStore((state) => state.wallet);
export const useDeployment = () => useStore((state) => state.deployment);
export const usePositions = () => useStore((state) => state.positions);
export const useTransaction = () => useStore((state) => state.transaction);
