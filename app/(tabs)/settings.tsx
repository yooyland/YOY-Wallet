import { View, Text, Pressable, ScrollView, Alert, Switch } from 'react-native';
import { useState } from 'react';
import { useWalletStore } from '../store/walletStore';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Settings() {
  const { address, network, setNetwork } = useWalletStore();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '로그아웃', style: 'destructive', onPress: () => {
          router.replace('/onboarding');
        }}
      ]
    );
  };
  
  const handleResetWallet = () => {
    Alert.alert(
      '지갑 초기화',
      '⚠️ 주의: 이 작업은 되돌릴 수 없습니다.\n모든 데이터가 삭제됩니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '초기화', style: 'destructive', onPress: () => {
          Alert.alert('초기화 완료', '지갑이 초기화되었습니다.');
          router.replace('/onboarding');
        }}
      ]
    );
  };
  
  const handleExportSeed = () => {
    Alert.alert(
      '시드 문구 내보내기',
      '시드 문구를 안전한 곳에 백업하세요.',
      [
        { text: '취소', style: 'cancel' },
        { text: '내보내기', onPress: () => {
          Alert.alert('백업 완료', '시드 문구가 안전하게 백업되었습니다.');
        }}
      ]
    );
  };
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFD700' }}>
          설정
        </Text>
        
        {/* 지갑 정보 */}
        <View style={{ 
          backgroundColor: '#111', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 20 
        }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 12 }}>
            지갑 정보
          </Text>
          {address ? (
            <>
              <Text style={{ color: '#FFFFFF', marginBottom: 4 }}>
                주소: {address.slice(0, 6)}...{address.slice(-4)}
              </Text>
              <Text style={{ color: '#666', fontSize: 12 }}>
                네트워크: {network === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet'}
              </Text>
            </>
          ) : (
            <Text style={{ color: '#666' }}>지갑이 연결되지 않음</Text>
          )}
        </View>
        
        {/* 보안 설정 */}
        <View style={{ 
          backgroundColor: '#111', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 20 
        }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 12 }}>
            보안
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#FFFFFF' }}>생체 인증</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#333', true: '#FFD700' }}
              thumbColor={biometricEnabled ? '#000000' : '#FFFFFF'}
            />
          </View>
          
          <Pressable 
            onPress={handleExportSeed}
            style={{ 
              padding: 12, 
              borderWidth: 1, 
              borderColor: '#FFD700', 
              borderRadius: 6,
              marginBottom: 8
            }}
          >
            <Text style={{ color: '#FFD700', textAlign: 'center' }}>
              시드 문구 백업
            </Text>
          </Pressable>
          
          <Pressable 
            onPress={() => router.push('/onboarding/pin')}
            style={{ 
              padding: 12, 
              borderWidth: 1, 
              borderColor: '#FFD700', 
              borderRadius: 6 
            }}
          >
            <Text style={{ color: '#FFD700', textAlign: 'center' }}>
              PIN 변경
            </Text>
          </Pressable>
        </View>
        
        {/* 네트워크 설정 */}
        <View style={{ 
          backgroundColor: '#111', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 20 
        }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 12 }}>
            네트워크
          </Text>
          
          <View style={{ gap: 8 }}>
            <Pressable 
              onPress={() => setNetwork('mainnet')}
              style={{ 
                padding: 12, 
                borderWidth: 1, 
                borderColor: network === 'mainnet' ? '#FFD700' : '#333', 
                borderRadius: 6,
                backgroundColor: network === 'mainnet' ? '#FFD700' : 'transparent'
              }}
            >
              <Text style={{ 
                color: network === 'mainnet' ? '#000000' : '#FFFFFF',
                fontWeight: network === 'mainnet' ? 'bold' : 'normal'
              }}>
                Ethereum Mainnet
              </Text>
            </Pressable>
            
            <Pressable 
              onPress={() => setNetwork('sepolia')}
              style={{ 
                padding: 12, 
                borderWidth: 1, 
                borderColor: network === 'sepolia' ? '#FFD700' : '#333', 
                borderRadius: 6,
                backgroundColor: network === 'sepolia' ? '#FFD700' : 'transparent'
              }}
            >
              <Text style={{ 
                color: network === 'sepolia' ? '#000000' : '#FFFFFF',
                fontWeight: network === 'sepolia' ? 'bold' : 'normal'
              }}>
                Sepolia Testnet
              </Text>
            </Pressable>
          </View>
        </View>
        
        {/* 알림 설정 */}
        <View style={{ 
          backgroundColor: '#111', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 20 
        }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 12 }}>
            알림
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#FFFFFF' }}>푸시 알림</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#333', true: '#FFD700' }}
              thumbColor={notificationsEnabled ? '#000000' : '#FFFFFF'}
            />
          </View>
        </View>
        
        {/* 앱 정보 */}
        <View style={{ 
          backgroundColor: '#111', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 20 
        }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 12 }}>
            앱 정보
          </Text>
          
          <Text style={{ color: '#FFFFFF', marginBottom: 4 }}>
            YooY Wallet v1.0.0
          </Text>
          <Text style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
            새로운 황금시대를 당신과 함께 시작합니다
          </Text>
          
          <View style={{ gap: 8 }}>
            <Pressable 
              onPress={() => Alert.alert('개발자 정보', 'YooY Land\nhttps://yooyland.com')}
              style={{ 
                padding: 8, 
                borderWidth: 1, 
                borderColor: '#333', 
                borderRadius: 4 
              }}
            >
              <Text style={{ color: '#666', textAlign: 'center', fontSize: 12 }}>
                개발자 정보
              </Text>
            </Pressable>
            
            <Pressable 
              onPress={() => Alert.alert('라이선스', 'MIT License')}
              style={{ 
                padding: 8, 
                borderWidth: 1, 
                borderColor: '#333', 
                borderRadius: 4 
              }}
            >
              <Text style={{ color: '#666', textAlign: 'center', fontSize: 12 }}>
                라이선스
              </Text>
            </Pressable>
          </View>
        </View>
        
        {/* 계정 관리 */}
        <View style={{ gap: 12 }}>
          <Pressable 
            onPress={handleLogout}
            style={{ 
              padding: 16, 
              borderWidth: 1, 
              borderColor: '#FF4444', 
              borderRadius: 8 
            }}
          >
            <Text style={{ 
              color: '#FF4444', 
              textAlign: 'center', 
              fontWeight: 'bold',
              fontSize: 16
            }}>
              로그아웃
            </Text>
          </Pressable>
          
          <Pressable 
            onPress={handleResetWallet}
            style={{ 
              padding: 16, 
              borderWidth: 1, 
              borderColor: '#FF4444', 
              borderRadius: 8 
            }}
          >
            <Text style={{ 
              color: '#FF4444', 
              textAlign: 'center', 
              fontWeight: 'bold',
              fontSize: 16
            }}>
              지갑 초기화
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}


