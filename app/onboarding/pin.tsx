import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { savePin } from '../services/secureStore';
import { hashPin } from '../crypto/crypto';

export default function PinSetup() {
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [error, setError] = useState('');

  const onSave = async () => {
    if (pin1.length < 4 || pin1 !== pin2) {
      setError('PIN 확인이 일치하지 않습니다');
      return;
    }
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);
    const pinHash = await hashPin(pin1, salt);
    await savePin(pinHash);
    router.replace('/onboarding/seed');
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 16 }}>PIN 설정</Text>
      <TextInput secureTextEntry value={pin1} onChangeText={setPin1} placeholder="PIN 입력" keyboardType="number-pad" inputMode="numeric" textContentType="oneTimeCode" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 8 }} />
      <TextInput secureTextEntry value={pin2} onChangeText={setPin2} placeholder="PIN 확인" keyboardType="number-pad" inputMode="numeric" textContentType="oneTimeCode" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 8 }} />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <Pressable onPress={onSave} style={{ padding: 14, backgroundColor: '#111', borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>다음</Text>
      </Pressable>
    </View>
  );
}


