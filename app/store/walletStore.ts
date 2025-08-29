import { create } from 'zustand';
import { ethers } from 'ethers';
import { createProvider } from '../services/wallet';

interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
}

interface WalletState {
  network: 'sepolia' | 'mainnet';
  address?: string;
  balanceEth?: string;
  tokenBalances: TokenBalance[];
  provider?: ethers.Provider;
  setNetwork: (n: 'sepolia' | 'mainnet') => void;
  connectReadOnly: (address: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshTokenBalances: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  network: 'mainnet',
  tokenBalances: [],
  setNetwork: (n) => set({ network: n, provider: createProvider(n) }),
  connectReadOnly: async (address: string) => {
    const { network } = get();
    const provider = createProvider(network);
    const checksum = ethers.getAddress(address);
    set({ address: checksum, provider });
    const bal = await provider.getBalance(checksum);
    set({ balanceEth: ethers.formatEther(bal) });
    // YOY 토큰 잔액도 함께 조회
    await get().refreshTokenBalances();
  },
  refreshBalance: async () => {
    const { address, provider } = get();
    if (!address || !provider) return;
    const bal = await provider.getBalance(address);
    set({ balanceEth: ethers.formatEther(bal) });
  },
  refreshTokenBalances: async () => {
    const { address, provider, network } = get();
    if (!address || !provider) return;
    
    // YOY 토큰 잔액 조회 (Mainnet에서만)
    if (network === 'mainnet') {
      const yoyAddress = '0xf999DA2B5132eA62A158dA8A82f2265A1b1d9701';
      const yoyContract = new ethers.Contract(
        yoyAddress,
        ['function balanceOf(address) view returns (uint256)', 'function name() view returns (string)', 'function symbol() view returns (string)', 'function decimals() view returns (uint8)'],
        provider
      );
      
      try {
        const balance = await yoyContract.balanceOf(address);
        const name = await yoyContract.name();
        const symbol = await yoyContract.symbol();
        const decimals = await yoyContract.decimals();
        
        const yoyBalance: TokenBalance = {
          symbol,
          name,
          address: yoyAddress,
          balance: ethers.formatUnits(balance, decimals),
          decimals
        };
        
        set({ tokenBalances: [yoyBalance] });
      } catch (error) {
        console.error('YOY 토큰 잔액 조회 실패:', error);
      }
    }
  },
}));


