import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function Landing() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 24 }}>YOY Wallet</Text>
      <Link href="/onboarding" asChild>
        <Pressable style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#111', borderRadius: 8 }}>
          <Text style={{ color: 'white' }}>시작하기</Text>
        </Pressable>
      </Link>
    </View>
  );
}


