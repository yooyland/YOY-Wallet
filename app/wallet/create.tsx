import { router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { randomBytes } from 'crypto';

export default function WalletCreate() {
  const handleCreate = () => {
    // Placeholder: 실제 시드 생성/보관은 추후 구현
    const seed = randomBytes(16).toString('hex');
    console.log('seed', seed);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>새 지갑을 생성합니다.</Text>
      <Pressable onPress={handleCreate} style={{ padding: 14, backgroundColor: '#111', borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>생성</Text>
      </Pressable>
    </View>
  );
}


