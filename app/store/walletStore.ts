import { create } from 'zustand';
import { ethers } from 'ethers';
import { createProvider } from '../services/wallet';

interface WalletState {
  network: 'sepolia' | 'mainnet';
  address?: string;
  balanceEth?: string;
  provider?: ethers.Provider;
  setNetwork: (n: 'sepolia' | 'mainnet') => void;
  connectReadOnly: (address: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  network: 'sepolia',
  setNetwork: (n) => set({ network: n, provider: createProvider(n) }),
  connectReadOnly: async (address: string) => {
    const { network } = get();
    const provider = createProvider(network);
    const checksum = ethers.getAddress(address);
    set({ address: checksum, provider });
    const bal = await provider.getBalance(checksum);
    set({ balanceEth: ethers.formatEther(bal) });
  },
  refreshBalance: async () => {
    const { address, provider } = get();
    if (!address || !provider) return;
    const bal = await provider.getBalance(address);
    set({ balanceEth: ethers.formatEther(bal) });
  },
}));


