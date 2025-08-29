import { View, Text, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';
import { ethers } from 'ethers';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

interface ExchangeRate {
  USD: number;
  KRW: number;
}

export default function Home() {
  const { address, balanceEth, tokenBalances, connectReadOnly, refreshBalance, refreshTokenBalances, network, setNetwork } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({ USD: 1, KRW: 1300 });
  const [totalAssetsUSD, setTotalAssetsUSD] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // 실시간 암호화폐 가격 데이터 가져오기
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      const data = await response.json();
      setCryptoPrices(data);
    } catch (error) {
      console.error('암호화폐 가격 조회 실패:', error);
      // 폴백 데이터
      setCryptoPrices([
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 19953.10, price_change_percentage_24h: 1.76, image: '🟠' },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 1613.86, price_change_percentage_24h: -1.39, image: '🔷' },
        { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.469800, price_change_percentage_24h: 1.76, image: '🔵' },
        { id: 'chainlink', symbol: 'link', name: 'Chainlink', current_price: 7.36, price_change_percentage_24h: -5.76, image: '🔶' }
      ]);
    }
  };

  // 환율 데이터 가져오기
  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setExchangeRate(data.rates);
    } catch (error) {
      console.error('환율 조회 실패:', error);
      // 기본 환율
      setExchangeRate({ USD: 1, KRW: 1300 });
    }
  };

  // 총 자산 계산
  const calculateTotalAssets = () => {
    let total = 0;
    
    // ETH 잔액을 USD로 환산
    if (balanceEth) {
      const ethPrice = cryptoPrices.find(c => c.symbol === 'eth')?.current_price || 1600;
      total += parseFloat(balanceEth) * ethPrice;
    }
    
    // YOY 토큰 잔액을 USD로 환산 (YOY 가격은 임시로 $0.1로 설정)
    tokenBalances.forEach(token => {
      if (token.symbol === 'YOY') {
        total += parseFloat(token.balance) * 0.1; // YOY 가격
      }
    });
    
    setTotalAssetsUSD(total);
  };

  // 액션 버튼 핸들러들
  const handleAction = (action: string) => {
    switch (action) {
      case 'Deposit':
        Alert.alert('입금', '입금 기능은 준비 중입니다.');
        break;
      case 'Buy Crypto':
        Alert.alert('암호화폐 구매', '구매 기능은 준비 중입니다.');
        break;
      case 'Withdraw':
        Alert.alert('출금', '출금 기능은 준비 중입니다.');
        break;
      case 'Exchange':
        Alert.alert('거래소', '거래소 기능은 준비 중입니다.');
        break;
      case 'Staking':
        Alert.alert('스테이킹', '스테이킹 기능은 준비 중입니다.');
        break;
      case 'NFT':
        Alert.alert('NFT', 'NFT 기능은 준비 중입니다.');
        break;
      case 'AML':
        Alert.alert('AML', 'AML 기능은 준비 중입니다.');
        break;
      case 'Leaders':
        Alert.alert('리더보드', '리더보드 기능은 준비 중입니다.');
        break;
      case 'Invite':
        Alert.alert('초대', '초대 기능은 준비 중입니다.');
        break;
      case 'Support':
        Alert.alert('고객지원', '고객지원 기능은 준비 중입니다.');
        break;
    }
  };

  // 검색 기능
  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert('검색', `"${searchQuery}" 검색 결과는 준비 중입니다.`);
    }
  };

  // 프로모션 가입
  const handleSignUp = () => {
    Alert.alert('프로모션 가입', '프로모션 가입 기능은 준비 중입니다.');
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCryptoPrices(),
        fetchExchangeRate()
      ]);
      setIsLoading(false);
    };
    
    initializeData();
    
    // 30초마다 가격 업데이트
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateTotalAssets();
  }, [balanceEth, tokenBalances, cryptoPrices]);

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFD700', fontSize: 18 }}>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
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
            onSubmitEditing={handleSearch}
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
            ${totalAssetsUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
        {balanceEth && (
          <Text style={{ color: '#FFD700', fontSize: 16 }}>
            {parseFloat(balanceEth).toFixed(8)} ETH
          </Text>
        )}
        {tokenBalances.map((token, index) => (
          <Text key={index} style={{ color: '#FFD700', fontSize: 16 }}>
            {parseFloat(token.balance).toLocaleString()} {token.symbol}
          </Text>
        ))}
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
              onPress={() => handleAction(action.name)}
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
        <Pressable 
          onPress={handleSignUp}
          style={{
            backgroundColor: '#FFD700',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignSelf: 'flex-start'
          }}
        >
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
        
        {cryptoPrices.slice(0, 4).map((crypto, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: index < 3 ? 1 : 0,
            borderBottomColor: '#333'
          }}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>{crypto.image}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                {crypto.name}
              </Text>
              <Text style={{ color: '#666', fontSize: 14 }}>{crypto.symbol.toUpperCase()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                ${crypto.current_price.toLocaleString()}
              </Text>
              <Text style={{ 
                color: crypto.price_change_percentage_24h >= 0 ? '#00FF00' : '#FF4444', 
                fontSize: 14 
              }}>
                {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
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


