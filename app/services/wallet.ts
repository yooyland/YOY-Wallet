import { ethers } from 'ethers';
import { getRpcConfig } from './config';

export function createProvider(network?: 'sepolia' | 'mainnet') {
  const { rpc } = getRpcConfig(network);
  return new ethers.JsonRpcProvider(rpc);
}

export function getErc20Contract(address: string, provider: ethers.Provider) {
  const abi = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
  ];
  return new ethers.Contract(address, abi, provider);
}


