import { ethers } from 'ethers';

export function generateMnemonic(): string {
  return ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(16)); // 12단어
}

export function validateMnemonic(phrase: string): boolean {
  try {
    ethers.Mnemonic.fromPhrase(phrase.trim());
    return true;
  } catch {
    return false;
  }
}

export function deriveAccountFromMnemonic(phrase: string, accountIndex = 0) {
  const mnemonic = ethers.Mnemonic.fromPhrase(phrase.trim());
  const path = `m/44'/60'/0'/0/${accountIndex}`; // BIP-44 Ethereum
  const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, path);
  return wallet;
}


