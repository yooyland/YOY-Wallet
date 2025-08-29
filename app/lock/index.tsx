import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { isBiometricAvailable, loadPin } from '../services/secureStore';
import { verifyPin } from '../crypto/crypto';

export default function AppLock() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      if (await isBiometricAvailable()) {
        const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'YOY 잠금 해제' });
        if (res.success) router.replace('/(tabs)/home');
      }
    })();
  }, []);

  let attempts = 0;
  const onUnlock = async () => {
    const saved = await loadPin();
    if (!saved) return setError('PIN이 설정되지 않았습니다');
    const ok = await verifyPin(pin, saved);
    if (ok) return router.replace('/(tabs)/home');
    attempts += 1;
    setError('PIN이 일치하지 않습니다');
    const delay = Math.min(30000, attempts * 1000);
    await new Promise((r) => setTimeout(r, delay));
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 16 }}>앱 잠금</Text>
      <TextInput secureTextEntry value={pin} onChangeText={setPin} placeholder="PIN 입력" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }} />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <Pressable onPress={onUnlock} style={{ padding: 14, backgroundColor: '#111', borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>해제</Text>
      </Pressable>
    </View>
  );
}


