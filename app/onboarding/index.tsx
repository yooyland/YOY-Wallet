import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { loadPin } from '../services/secureStore';
import { useEffect } from 'react';

export default function Onboarding() {
  useEffect(() => {
    const go = async () => {
      const pin = await loadPin();
      if (pin) router.replace('/lock');
    };
    go();
  }, []);
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 16 }}>지갑 시작하기</Text>
      <Link href="/onboarding/pin" asChild>
        <Pressable style={{ padding: 14, backgroundColor: '#111', borderRadius: 8, marginBottom: 12 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>PIN 설정 → 시드 생성</Text>
        </Pressable>
      </Link>
      <Link href="/wallet/import" asChild>
        <Pressable style={{ padding: 14, borderWidth: 1, borderColor: '#111', borderRadius: 8 }}>
          <Text style={{ color: '#111', textAlign: 'center' }}>기존 지갑 가져오기</Text>
        </Pressable>
      </Link>
    </View>
  );
}


