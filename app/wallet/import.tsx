import { router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function WalletImport() {
  const handleImport = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>니모닉/프라이빗키로 지갑 가져오기</Text>
      <Pressable onPress={handleImport} style={{ padding: 14, borderWidth: 1, borderColor: '#111', borderRadius: 8 }}>
        <Text style={{ color: '#111', textAlign: 'center' }}>가져오기</Text>
      </Pressable>
    </View>
  );
}


