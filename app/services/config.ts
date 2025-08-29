import Constants from 'expo-constants';

type NetworkKey = 'sepolia' | 'mainnet';

export interface RpcConfig {
  chainId: number;
  rpc: string;
}

interface AppConfig {
  network: {
    default: NetworkKey;
    sepolia: RpcConfig;
    mainnet: RpcConfig;
  };
}

const extra = (Constants.expoConfig?.extra || {}) as { network?: AppConfig['network']; INFURA_API_KEY?: string };

export const getRpcConfig = (key?: NetworkKey): RpcConfig => {
  const network = extra.network;
  const selected: NetworkKey = key || network?.default || 'sepolia';
  const cfg = network?.[selected];
  if (!cfg) throw new Error('Network config missing');
  // 환경변수 우선(Expo는 EXPO_PUBLIC_* 를 주입)
  const apiKey = process.env.EXPO_PUBLIC_INFURA_API_KEY || extra.INFURA_API_KEY || '';
  const rpc = cfg.rpc.replace('${INFURA_API_KEY}', apiKey);
  return { ...cfg, rpc };
};


