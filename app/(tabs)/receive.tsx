import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useWalletStore } from '../store/walletStore';
import * as Clipboard from 'expo-clipboard';

export default function Receive() {
  const { address, network } = useWalletStore();
  const [copied, setCopied] = useState(false);
  
  const handleCopyAddress = async () => {
    if (!address) {
      Alert.alert('오류', '지갑이 연결되지 않았습니다.');
      return;
    }
    
    try {
      await Clipboard.setStringAsync(address);
      setCopied(true);
      Alert.alert('복사 완료', '주소가 클립보드에 복사되었습니다.');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Alert.alert('오류', '주소 복사에 실패했습니다.');
    }
  };
  
  const handleShareAddress = () => {
    if (!address) {
      Alert.alert('오류', '지갑이 연결되지 않았습니다.');
      return;
    }
    
    // 실제 앱에서는 expo-sharing을 사용하여 공유 기능 구현
    Alert.alert(
      '주소 공유',
      `지갑 주소를 공유하시겠습니까?\n\n${address}`,
      [
        { text: '취소', style: 'cancel' },
        { text: '공유', onPress: () => {
          Alert.alert('공유 완료', '주소가 공유되었습니다.');
        }}
      ]
    );
  };
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFD700' }}>
          수신
        </Text>
        
        {!address ? (
          <View style={{ backgroundColor: '#111', padding: 16, borderRadius: 8 }}>
            <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
              지갑을 먼저 연결해주세요
            </Text>
          </View>
        ) : (
          <>
            {/* QR 코드 영역 */}
            <View style={{ 
              backgroundColor: '#111', 
              padding: 24, 
              borderRadius: 12, 
              marginBottom: 20,
              alignItems: 'center'
            }}>
              <View style={{ 
                width: 200, 
                height: 200, 
                backgroundColor: '#FFFFFF', 
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <Text style={{ color: '#000000', fontSize: 12, textAlign: 'center' }}>
                  QR 코드 영역{'\n'}
                  (실제 구현 시 QR 라이브러리 사용)
                </Text>
              </View>
              
              <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 8 }}>
                YooY Wallet 주소
              </Text>
              <Text style={{ color: '#FFFFFF', fontSize: 12, textAlign: 'center' }}>
                {address}
              </Text>
            </View>
            
            {/* 네트워크 정보 */}
            <View style={{ 
              backgroundColor: '#111', 
              padding: 16, 
              borderRadius: 8, 
              marginBottom: 20 
            }}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: 8 }}>
                네트워크 정보
              </Text>
              <Text style={{ color: '#666', fontSize: 14 }}>
                네트워크: {network === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet'}
              </Text>
              <Text style={{ color: '#666', fontSize: 14 }}>
                지원 토큰: ETH, YOY
              </Text>
            </View>
            
            {/* 액션 버튼들 */}
            <View style={{ gap: 12 }}>
              <Pressable 
                onPress={handleCopyAddress}
                style={{ 
                  padding: 16, 
                  backgroundColor: '#FFD700', 
                  borderRadius: 8 
                }}
              >
                <Text style={{ 
                  color: '#000000', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: 16
                }}>
                  {copied ? '복사됨!' : '주소 복사'}
                </Text>
              </Pressable>
              
              <Pressable 
                onPress={handleShareAddress}
                style={{ 
                  padding: 16, 
                  borderWidth: 1, 
                  borderColor: '#FFD700', 
                  borderRadius: 8 
                }}
              >
                <Text style={{ 
                  color: '#FFD700', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: 16
                }}>
                  주소 공유
                </Text>
              </Pressable>
            </View>
            
            {/* 안내 메시지 */}
            <View style={{ 
              backgroundColor: '#111', 
              padding: 16, 
              borderRadius: 8, 
              marginTop: 20 
            }}>
              <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 8 }}>
                💡 안내사항
              </Text>
              <Text style={{ color: '#CCC', fontSize: 12, lineHeight: 18 }}>
                • 이 주소로 ETH와 YOY 토큰을 받을 수 있습니다.{'\n'}
                • 올바른 네트워크에서 전송되었는지 확인하세요.{'\n'}
                • 전송 후 잠시 기다려주세요 (블록 확인 필요).{'\n'}
                • 보안을 위해 주소를 안전하게 공유하세요.
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}


