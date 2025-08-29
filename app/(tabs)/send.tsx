import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useWalletStore } from '../store/walletStore';
import { ethers } from 'ethers';

export default function Send() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState<'ETH' | 'YOY'>('ETH');
  const [isLoading, setIsLoading] = useState(false);
  
  const { address, balanceEth, tokenBalances, provider, network } = useWalletStore();
  
  const yoyBalance = tokenBalances.find(t => t.symbol === 'YOY')?.balance || '0';
  
  const handleSend = async () => {
    if (!address || !provider) {
      Alert.alert('오류', '지갑이 연결되지 않았습니다.');
      return;
    }
    
    if (!recipient || !amount) {
      Alert.alert('오류', '수신자 주소와 금액을 입력해주세요.');
      return;
    }
    
    try {
      // 주소 유효성 검사
      const recipientAddress = ethers.getAddress(recipient);
      
      setIsLoading(true);
      
      if (tokenType === 'ETH') {
        // ETH 전송
        const tx = {
          to: recipientAddress,
          value: ethers.parseEther(amount)
        };
        
        Alert.alert(
          '전송 확인',
          `${amount} ETH를 ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}로 전송하시겠습니까?`,
          [
            { text: '취소', style: 'cancel' },
            { text: '전송', onPress: () => {
              // 실제 전송은 서명된 트랜잭션이 필요하므로 여기서는 시뮬레이션
              Alert.alert('전송 완료', 'ETH 전송이 완료되었습니다.');
              setRecipient('');
              setAmount('');
            }}
          ]
        );
      } else {
        // YOY 토큰 전송
        const yoyAddress = '0xf999DA2B5132eA62A158dA8A82f2265A1b1d9701';
        const yoyContract = new ethers.Contract(
          yoyAddress,
          ['function transfer(address to, uint256 amount) returns (bool)'],
          provider
        );
        
        const amountWei = ethers.parseUnits(amount, 18);
        
        Alert.alert(
          '전송 확인',
          `${amount} YOY를 ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}로 전송하시겠습니까?`,
          [
            { text: '취소', style: 'cancel' },
            { text: '전송', onPress: () => {
              // 실제 전송은 서명된 트랜잭션이 필요하므로 여기서는 시뮬레이션
              Alert.alert('전송 완료', 'YOY 토큰 전송이 완료되었습니다.');
              setRecipient('');
              setAmount('');
            }}
          ]
        );
      }
    } catch (error) {
      Alert.alert('오류', '유효하지 않은 주소입니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFD700' }}>
          송금
        </Text>
        
        {!address ? (
          <View style={{ backgroundColor: '#111', padding: 16, borderRadius: 8 }}>
            <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
              지갑을 먼저 연결해주세요
            </Text>
          </View>
        ) : (
          <>
            {/* 토큰 선택 */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <Pressable 
                onPress={() => setTokenType('ETH')} 
                style={{ 
                  flex: 1,
                  padding: 12, 
                  borderWidth: 1, 
                  borderColor: tokenType === 'ETH' ? '#FFD700' : '#333', 
                  borderRadius: 8,
                  backgroundColor: tokenType === 'ETH' ? '#FFD700' : 'transparent'
                }}
              >
                <Text style={{ 
                  textAlign: 'center', 
                  color: tokenType === 'ETH' ? '#000000' : '#FFFFFF',
                  fontWeight: 'bold'
                }}>
                  ETH
                </Text>
                <Text style={{ 
                  textAlign: 'center', 
                  color: tokenType === 'ETH' ? '#000000' : '#666',
                  fontSize: 12
                }}>
                  {balanceEth || '0'} ETH
                </Text>
              </Pressable>
              
              <Pressable 
                onPress={() => setTokenType('YOY')} 
                style={{ 
                  flex: 1,
                  padding: 12, 
                  borderWidth: 1, 
                  borderColor: tokenType === 'YOY' ? '#FFD700' : '#333', 
                  borderRadius: 8,
                  backgroundColor: tokenType === 'YOY' ? '#FFD700' : 'transparent'
                }}
              >
                <Text style={{ 
                  textAlign: 'center', 
                  color: tokenType === 'YOY' ? '#000000' : '#FFFFFF',
                  fontWeight: 'bold'
                }}>
                  YOY
                </Text>
                <Text style={{ 
                  textAlign: 'center', 
                  color: tokenType === 'YOY' ? '#000000' : '#666',
                  fontSize: 12
                }}>
                  {parseFloat(yoyBalance).toLocaleString()} YOY
                </Text>
              </Pressable>
            </View>
            
            {/* 수신자 주소 */}
            <Text style={{ color: '#FFFFFF', marginBottom: 8 }}>수신자 주소</Text>
            <TextInput 
              value={recipient} 
              onChangeText={setRecipient} 
              placeholder="0x..." 
              placeholderTextColor="#666"
              autoCapitalize="none" 
              style={{ 
                borderWidth: 1, 
                borderColor: '#333', 
                borderRadius: 8, 
                padding: 12, 
                marginBottom: 16,
                backgroundColor: '#111',
                color: '#FFFFFF'
              }} 
            />
            
            {/* 전송 금액 */}
            <Text style={{ color: '#FFFFFF', marginBottom: 8 }}>전송 금액</Text>
            <TextInput 
              value={amount} 
              onChangeText={setAmount} 
              placeholder="0.0" 
              placeholderTextColor="#666"
              keyboardType="numeric"
              style={{ 
                borderWidth: 1, 
                borderColor: '#333', 
                borderRadius: 8, 
                padding: 12, 
                marginBottom: 20,
                backgroundColor: '#111',
                color: '#FFFFFF'
              }} 
            />
            
            {/* 전송 버튼 */}
            <Pressable 
              onPress={handleSend}
              disabled={isLoading}
              style={{ 
                padding: 16, 
                backgroundColor: '#FFD700', 
                borderRadius: 8,
                opacity: isLoading ? 0.6 : 1
              }}
            >
              <Text style={{ 
                color: '#000000', 
                textAlign: 'center', 
                fontWeight: 'bold',
                fontSize: 16
              }}>
                {isLoading ? '전송 중...' : `${tokenType} 전송`}
              </Text>
            </Pressable>
            
            {/* 네트워크 정보 */}
            <View style={{ 
              backgroundColor: '#111', 
              padding: 12, 
              borderRadius: 8, 
              marginTop: 16 
            }}>
              <Text style={{ color: '#666', fontSize: 12 }}>
                네트워크: {network}
              </Text>
              <Text style={{ color: '#666', fontSize: 12 }}>
                내 주소: {address.slice(0, 6)}...{address.slice(-4)}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}


