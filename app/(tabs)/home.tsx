import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';
import { useWalletStore } from '../store/walletStore';

export default function Home() {
  const { address, balanceEth, tokenBalances, connectReadOnly, refreshBalance, refreshTokenBalances, network, setNetwork } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const totalAssets = 2460.89;
  const btcBalance = 0.23415600;
  
  const actions = [
    { name: 'Deposit', icon: '↓' },
    { name: 'Buy Crypto', icon: '💰' },
    { name: 'Withdraw', icon: '↑' },
    { name: 'Exchange', icon: '↔' },
    { name: 'Staking', icon: '📈' },
    { name: 'NFT', icon: '🖼' },
    { name: 'AML', icon: '🛡' },
    { name: 'Leaders', icon: '🏆' },
    { name: 'Invite', icon: '👥' },
    { name: 'Support', icon: '🎧' }
  ];
  
  const cryptocurrencies = [
    { name: 'Bitcoin', symbol: 'BTC', price: 19953.10, change: 1.76, isPositive: true, logo: '🟠' },
    { name: 'Ethereum', symbol: 'ETH', price: 1613.86, change: 1.39, isPositive: false, logo: '🔷' },
    { name: 'Cardano', symbol: 'ADA', price: 0.469800, change: 1.76, isPositive: true, logo: '🔵' },
    { name: 'Chainlink', symbol: 'LINK', price: 7.36, change: 5.76, isPositive: false, logo: '🔶' }
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* Status Bar */}
      <View style={{ 
        height: 44, 
        backgroundColor: '#000000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>9:41</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <View style={{ width: 20, height: 12, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
          <View style={{ width: 16, height: 12, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
          <View style={{ width: 24, height: 12, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
        </View>
      </View>

      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 16,
        gap: 12
      }}>
        <Pressable style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 20, 
          backgroundColor: '#FFD700',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 20 }}>👤</Text>
        </Pressable>
        
        <View style={{ flex: 1 }}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by Collection, NFT"
            placeholderTextColor="#666"
            style={{
              backgroundColor: '#111',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              color: '#FFFFFF',
              fontSize: 14
            }}
          />
        </View>
        
        <Pressable style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 20, 
          backgroundColor: '#FFD700',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </Pressable>
      </View>

      {/* Total Assets Card */}
      <View style={{ 
        marginHorizontal: 20, 
        marginBottom: 24,
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333'
      }}>
        <Text style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>Total Assets</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 'bold' }}>
            {totalAssets.toLocaleString()}
          </Text>
          <Pressable style={{ 
            marginLeft: 8, 
            paddingHorizontal: 8, 
            paddingVertical: 4,
            backgroundColor: '#333',
            borderRadius: 4
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>USD▾</Text>
          </Pressable>
        </View>
        <Text style={{ color: '#FFD700', fontSize: 16 }}>
          {btcBalance.toFixed(8)} BTC
        </Text>
      </View>

      {/* Actions Grid */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
          Actions
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          gap: 12,
          justifyContent: 'space-between'
        }}>
          {actions.map((action, index) => (
            <Pressable
              key={index}
              style={{
                width: '30%',
                aspectRatio: 1,
                backgroundColor: '#111',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#333'
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>{action.icon}</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 12, textAlign: 'center' }}>
                {action.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Promotion Banner */}
      <View style={{ 
        marginHorizontal: 20, 
        marginBottom: 24,
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333'
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
          Get rewarded up to 4030 USDT for signing up!
        </Text>
        <Pressable style={{
          backgroundColor: '#FFD700',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          alignSelf: 'flex-start'
        }}>
          <Text style={{ color: '#000000', fontWeight: 'bold' }}>Sign up</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 4, marginTop: 12 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFD700' }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' }} />
        </View>
      </View>

      {/* Top Cryptocurrency */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
            Top Cryptocurrency
          </Text>
          <Pressable>
            <Text style={{ color: '#FFD700', fontSize: 14 }}>See all</Text>
          </Pressable>
        </View>
        
        {cryptocurrencies.map((crypto, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: index < cryptocurrencies.length - 1 ? 1 : 0,
            borderBottomColor: '#333'
          }}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>{crypto.logo}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                {crypto.name}
              </Text>
              <Text style={{ color: '#666', fontSize: 14 }}>{crypto.symbol}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                ${crypto.price.toLocaleString()}
              </Text>
              <Text style={{ 
                color: crypto.isPositive ? '#00FF00' : '#FF4444', 
                fontSize: 14 
              }}>
                {crypto.isPositive ? '+' : ''}{crypto.change}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Navigation Placeholder */}
      <View style={{ 
        height: 80, 
        backgroundColor: '#111',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20
      }}>
        {['Home', 'Markets', 'Trade', 'Wallet', 'NFT'].map((tab, index) => (
          <Pressable key={index} style={{ alignItems: 'center' }}>
            <Text style={{ 
              fontSize: 20, 
              color: index === 0 ? '#FFD700' : '#666',
              marginBottom: 4
            }}>
              {index === 0 ? '🏠' : index === 1 ? '📊' : index === 2 ? '↔' : index === 3 ? '💼' : '🖼'}
            </Text>
            <Text style={{ 
              fontSize: 12, 
              color: index === 0 ? '#FFD700' : '#666'
            }}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}


