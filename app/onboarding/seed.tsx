import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { encryptSeed } from '../crypto/crypto';
import { saveSeed, loadPin } from '../services/secureStore';
import { generateMnemonic, validateMnemonic } from '../services/mnemonic';

export default function SeedBackup() {
  const [seed, setSeed] = useState<string>('');

  const onGenerate = async () => {
    setSeed(generateMnemonic());
  };

  const onSave = async () => {
    const pinHash = await loadPin();
    if (!pinHash) {
      Alert.alert('오류', 'PIN이 설정되지 않았습니다');
      return;
    }
    // PIN 해시는 복호화 키 유도가 불가하므로, 여기서는 사용자 입력으로 암호화 절차를 진행해야 함
    // 간이 UX: 임시로 동일 PIN 재입력 절차는 추후 별도 화면에서 처리
    const pin = prompt('PIN을 다시 입력하세요') || '';
    if (!validateMnemonic(seed)) {
      Alert.alert('오류', '유효한 니모닉이 아닙니다');
      return;
    }
    const encrypted = await encryptSeed(seed, pin);
    await saveSeed(encrypted);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 16 }}>시드 백업</Text>
      <Pressable onPress={onGenerate} style={{ padding: 12, borderWidth: 1, borderColor: '#111', borderRadius: 8, marginBottom: 12 }}>
        <Text style={{ textAlign: 'center' }}>시드 생성</Text>
      </Pressable>
      <TextInput value={seed} onChangeText={setSeed} placeholder="시드" multiline style={{ minHeight: 80, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }} />
      <Pressable onPress={onSave} style={{ padding: 14, backgroundColor: '#111', borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>암호화 저장</Text>
      </Pressable>
    </View>
  );
}


