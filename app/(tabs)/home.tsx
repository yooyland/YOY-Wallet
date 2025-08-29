import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useWalletStore } from '../store/walletStore';

export default function Home() {
  const [addr, setAddr] = useState('');
  const { address, balanceEth, tokenBalances, connectReadOnly, refreshBalance, refreshTokenBalances, network, setNetwork } = useWalletStore();
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#FFD700' }}>
          YooY Wallet
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#FFFFFF' }}>
          네트워크: {network}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <Pressable 
            onPress={() => setNetwork('sepolia')} 
            style={{ 
              padding: 8, 
              borderWidth: 1, 
              borderColor: network === 'sepolia' ? '#FFD700' : '#333', 
              borderRadius: 6,
              backgroundColor: network === 'sepolia' ? '#FFD700' : 'transparent'
            }}
          >
            <Text style={{ color: network === 'sepolia' ? '#000000' : '#FFFFFF' }}>Sepolia</Text>
          </Pressable>
          <Pressable 
            onPress={() => setNetwork('mainnet')} 
            style={{ 
              padding: 8, 
              borderWidth: 1, 
              borderColor: network === 'mainnet' ? '#FFD700' : '#333', 
              borderRadius: 6,
              backgroundColor: network === 'mainnet' ? '#FFD700' : 'transparent'
            }}
          >
            <Text style={{ color: network === 'mainnet' ? '#000000' : '#FFFFFF' }}>Mainnet</Text>
          </Pressable>
        </View>
        
        <TextInput 
          value={addr} 
          onChangeText={setAddr} 
          placeholder="주소 입력" 
          placeholderTextColor="#666"
          autoCapitalize="none" 
          style={{ 
            borderWidth: 1, 
            borderColor: '#333', 
            borderRadius: 8, 
            padding: 12, 
            marginBottom: 12,
            backgroundColor: '#111',
            color: '#FFFFFF'
          }} 
        />
        
        <Pressable 
          onPress={() => connectReadOnly(addr)} 
          style={{ 
            padding: 12, 
            backgroundColor: '#FFD700', 
            borderRadius: 8, 
            marginBottom: 12 
          }}
        >
          <Text style={{ color: '#000000', textAlign: 'center', fontWeight: 'bold' }}>연결</Text>
        </Pressable>
        
        {address ? (
          <View style={{ backgroundColor: '#111', padding: 16, borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ marginBottom: 4, color: '#FFFFFF' }}>주소: {address}</Text>
            <Text style={{ marginBottom: 12, color: '#FFD700', fontSize: 18, fontWeight: 'bold' }}>
              잔액: {balanceEth ?? '-'} ETH
            </Text>
            
            {/* YOY 토큰 잔액 표시 */}
            {tokenBalances.map((token, index) => (
              <View key={index} style={{ marginBottom: 8, padding: 8, backgroundColor: '#222', borderRadius: 6 }}>
                <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>
                  {token.symbol}: {parseFloat(token.balance).toLocaleString()} {token.symbol}
                </Text>
                <Text style={{ color: '#CCC', fontSize: 12 }}>{token.name}</Text>
              </View>
            ))}
            
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable 
                onPress={refreshBalance} 
                style={{ 
                  flex: 1,
                  padding: 12, 
                  borderWidth: 1, 
                  borderColor: '#FFD700', 
                  borderRadius: 8 
                }}
              >
                <Text style={{ textAlign: 'center', color: '#FFD700' }}>ETH 새로고침</Text>
              </Pressable>
              <Pressable 
                onPress={refreshTokenBalances} 
                style={{ 
                  flex: 1,
                  padding: 12, 
                  borderWidth: 1, 
                  borderColor: '#FFD700', 
                  borderRadius: 8 
                }}
              >
                <Text style={{ textAlign: 'center', color: '#FFD700' }}>YOY 새로고침</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}


