import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { ethers } from 'ethers';
import { validateMnemonic } from '../services/mnemonic';
import { encryptSeed } from '../crypto/crypto';
import { saveSeed, savePin } from '../services/secureStore';

export default function WalletImport() {
  const [importType, setImportType] = useState<'mnemonic' | 'privateKey'>('mnemonic');
  const [inputValue, setInputValue] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'pin'>('input');

  const handleImport = async () => {
    if (!inputValue.trim()) {
      Alert.alert('오류', '니모닉 문구 또는 프라이빗 키를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      let wallet: ethers.Wallet;

      if (importType === 'mnemonic') {
        // 니모닉 문구로 지갑 복구
        if (!validateMnemonic(inputValue.trim())) {
          Alert.alert('오류', '유효하지 않은 니모닉 문구입니다.');
          return;
        }
        wallet = ethers.HDNodeWallet.fromMnemonic(inputValue.trim());
      } else {
        // 프라이빗 키로 지갑 복구
        try {
          wallet = new ethers.Wallet(inputValue.trim());
        } catch (error) {
          Alert.alert('오류', '유효하지 않은 프라이빗 키입니다.');
          return;
        }
      }

      // 지갑 주소 확인
      Alert.alert(
        '지갑 확인',
        `복구할 지갑 주소:\n${wallet.address}\n\n이 지갑을 가져오시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          { text: '확인', onPress: () => setStep('pin') }
        ]
      );

    } catch (error) {
      Alert.alert('오류', '지갑 가져오기에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSetup = async () => {
    if (pin.length < 4) {
      Alert.alert('오류', 'PIN은 최소 4자리 이상이어야 합니다.');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('오류', 'PIN 확인이 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);

      // PIN 해시 저장
      const salt = new Uint8Array(16);
      crypto.getRandomValues(salt);
      const { hashPin } = await import('../crypto/crypto');
      const pinHash = await hashPin(pin, salt);
      await savePin(pinHash);

      // 시드 문구 암호화 저장
      const encryptedSeed = await encryptSeed(inputValue.trim(), pin);
      await saveSeed(encryptedSeed);

      Alert.alert('성공', '지갑이 성공적으로 가져와졌습니다!', [
        { text: '확인', onPress: () => router.replace('/(tabs)/home') }
      ]);

    } catch (error) {
      Alert.alert('오류', '지갑 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'pin') {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
        <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFD700', textAlign: 'center' }}>
            PIN 설정
          </Text>
          <Text style={{ color: '#FFFFFF', marginBottom: 20, textAlign: 'center' }}>
            지갑 보안을 위해 PIN을 설정해주세요
          </Text>
          
          <TextInput
            secureTextEntry
            value={pin}
            onChangeText={setPin}
            placeholder="PIN 입력 (4자리 이상)"
            placeholderTextColor="#666"
            keyboardType="number-pad"
            style={{
              borderWidth: 1,
              borderColor: '#333',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              backgroundColor: '#111',
              color: '#FFFFFF'
            }}
          />
          
          <TextInput
            secureTextEntry
            value={confirmPin}
            onChangeText={setConfirmPin}
            placeholder="PIN 확인"
            placeholderTextColor="#666"
            keyboardType="number-pad"
            style={{
              borderWidth: 1,
              borderColor: '#333',
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
              backgroundColor: '#111',
              color: '#FFFFFF'
            }}
          />
          
          <Pressable
            onPress={handlePinSetup}
            disabled={isLoading}
            style={{
              padding: 16,
              backgroundColor: '#FFD700',
              borderRadius: 8,
              opacity: isLoading ? 0.6 : 1
            }}
          >
            <Text style={{
              color: '#000000',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16
            }}>
              {isLoading ? '처리 중...' : 'PIN 설정 완료'}
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => setStep('input')}
            style={{
              padding: 12,
              marginTop: 12
            }}
          >
            <Text style={{
              color: '#666',
              textAlign: 'center',
              fontSize: 14
            }}>
              뒤로 가기
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFD700', textAlign: 'center' }}>
          기존 지갑 가져오기
        </Text>
        
        {/* 가져오기 방법 선택 */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          <Pressable
            onPress={() => setImportType('mnemonic')}
            style={{
              flex: 1,
              padding: 12,
              borderWidth: 1,
              borderColor: importType === 'mnemonic' ? '#FFD700' : '#333',
              borderRadius: 8,
              backgroundColor: importType === 'mnemonic' ? '#FFD700' : 'transparent'
            }}
          >
            <Text style={{
              textAlign: 'center',
              color: importType === 'mnemonic' ? '#000000' : '#FFFFFF',
              fontWeight: 'bold'
            }}>
              니모닉 문구
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => setImportType('privateKey')}
            style={{
              flex: 1,
              padding: 12,
              borderWidth: 1,
              borderColor: importType === 'privateKey' ? '#FFD700' : '#333',
              borderRadius: 8,
              backgroundColor: importType === 'privateKey' ? '#FFD700' : 'transparent'
            }}
          >
            <Text style={{
              textAlign: 'center',
              color: importType === 'privateKey' ? '#000000' : '#FFFFFF',
              fontWeight: 'bold'
            }}>
              프라이빗 키
            </Text>
          </Pressable>
        </View>
        
        {/* 입력 필드 */}
        <Text style={{ color: '#FFFFFF', marginBottom: 8 }}>
          {importType === 'mnemonic' ? '니모닉 문구 (12, 15, 18, 21, 24개 단어)' : '프라이빗 키 (0x로 시작)'}
        </Text>
        
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={importType === 'mnemonic' ? 'word1 word2 word3...' : '0x...'}
          placeholderTextColor="#666"
          multiline={importType === 'mnemonic'}
          numberOfLines={importType === 'mnemonic' ? 3 : 1}
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: '#333',
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
            backgroundColor: '#111',
            color: '#FFFFFF',
            minHeight: importType === 'mnemonic' ? 80 : 48
          }}
        />
        
        {/* 안내 메시지 */}
        <View style={{
          backgroundColor: '#111',
          padding: 12,
          borderRadius: 8,
          marginBottom: 20
        }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 4 }}>
            ⚠️ 주의사항
          </Text>
          <Text style={{ color: '#CCC', fontSize: 12, lineHeight: 16 }}>
            {importType === 'mnemonic' 
              ? '• 니모닉 문구는 공백으로 구분된 단어들입니다\n• 대소문자를 정확히 입력해주세요\n• 이 정보는 안전하게 암호화되어 저장됩니다'
              : '• 프라이빗 키는 절대 다른 사람과 공유하지 마세요\n• 0x로 시작하는 64자리 16진수입니다\n• 이 정보는 안전하게 암호화되어 저장됩니다'
            }
          </Text>
        </View>
        
        {/* 가져오기 버튼 */}
        <Pressable
          onPress={handleImport}
          disabled={isLoading}
          style={{
            padding: 16,
            backgroundColor: '#FFD700',
            borderRadius: 8,
            opacity: isLoading ? 0.6 : 1
          }}
        >
          <Text style={{
            color: '#000000',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16
          }}>
            {isLoading ? '처리 중...' : '지갑 가져오기'}
          </Text>
        </Pressable>
        
        {/* 뒤로 가기 */}
        <Pressable
          onPress={() => router.back()}
          style={{
            padding: 12,
            marginTop: 12
          }}
        >
          <Text style={{
            color: '#666',
            textAlign: 'center',
            fontSize: 14
          }}>
            뒤로 가기
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}


