import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useWalletStore } from '../store/walletStore';

export default function Home() {
  const [addr, setAddr] = useState('');
  const { address, balanceEth, connectReadOnly, refreshBalance, network, setNetwork } = useWalletStore();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>네트워크: {network}</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <Pressable onPress={() => setNetwork('sepolia')} style={{ padding: 8, borderWidth: 1, borderColor: '#111', borderRadius: 6 }}>
          <Text>Sepolia</Text>
        </Pressable>
        <Pressable onPress={() => setNetwork('mainnet')} style={{ padding: 8, borderWidth: 1, borderColor: '#111', borderRadius: 6 }}>
          <Text>Mainnet</Text>
        </Pressable>
      </View>
      <TextInput value={addr} onChangeText={setAddr} placeholder="주소 입력" autoCapitalize="none" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }} />
      <Pressable onPress={() => connectReadOnly(addr)} style={{ padding: 12, backgroundColor: '#111', borderRadius: 8, marginBottom: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>연결</Text>
      </Pressable>
      {address ? (
        <View>
          <Text style={{ marginBottom: 4 }}>주소: {address}</Text>
          <Text style={{ marginBottom: 12 }}>잔액: {balanceEth ?? '-'} ETH</Text>
          <Pressable onPress={refreshBalance} style={{ padding: 12, borderWidth: 1, borderColor: '#111', borderRadius: 8 }}>
            <Text style={{ textAlign: 'center' }}>잔액 새로고침</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}


