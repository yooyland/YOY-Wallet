import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text } from 'react-native';
import { loadPin } from './services/secureStore';

export default function Landing() {
  useEffect(() => {
    const checkWalletStatus = async () => {
      try {
        const pin = await loadPin();
        if (pin) {
          // PIN이 설정되어 있으면 잠금 화면으로
          router.replace('/lock');
        } else {
          // PIN이 없으면 온보딩으로
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Wallet status check failed:', error);
        // 오류 발생 시 온보딩으로
        router.replace('/onboarding');
      }
    };

    checkWalletStatus();
  }, []);

  // 로딩 화면
  return (
    <View style={{ 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#000000'
    }}>
      <Text style={{ 
        fontSize: 32, 
        fontWeight: 'bold', 
        marginBottom: 16,
        color: '#FFD700'
      }}>
        YooY Wallet
      </Text>
      <Text style={{ 
        fontSize: 16, 
        color: '#FFFFFF',
        textAlign: 'center'
      }}>
        새로운 황금시대를 당신과 함께 시작합니다
      </Text>
    </View>
  );
}


