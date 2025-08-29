import { ethers } from 'ethers';
import list from '../tokens/erc20.list.json';
import { getErc20Contract } from './wallet';

type Network = 'sepolia' | 'mainnet';

export interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
}

export function getTokenList(network: Network): TokenInfo[] {
  // @ts-ignore
  return list[network] || [];
}

export async function fetchTokenBalance(
  provider: ethers.Provider,
  token: TokenInfo,
  owner: string
): Promise<string> {
  const c = getErc20Contract(token.address, provider);
  const bal = await c.balanceOf(owner);
  return ethers.formatUnits(bal, token.decimals);
}


