import { router } from 'expo-router';
import { View, Text, Pressable, Alert, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';
import { generateMnemonic } from '../services/mnemonic';
import { encryptSeed } from '../crypto/crypto';
import { saveSeed, savePin } from '../services/secureStore';

export default function WalletCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'confirm' | 'mnemonic' | 'verify' | 'pin'>('confirm');
  const [mnemonic, setMnemonic] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [verificationWords, setVerificationWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const handleCreateWallet = async () => {
    try {
      setIsLoading(true);
      
      // 새로운 니모닉 생성
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
      
      // 검증용 단어들 생성 (3개 랜덤 선택)
      const words = newMnemonic.split(' ');
      const randomIndices = [3, 7, 11]; // 예시: 4번째, 8번째, 12번째 단어
      const verificationWords = randomIndices.map(i => words[i]);
      setVerificationWords(verificationWords);
      
      setStep('mnemonic');
    } catch (error) {
      Alert.alert('오류', '지갑 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMnemonic = () => {
    setStep('verify');
  };

  const handleVerifyMnemonic = (word: string) => {
    if (selectedWords.length < 3) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleVerifyComplete = () => {
    const words = mnemonic.split(' ');
    const expectedWords = [words[3], words[7], words[11]];
    
    if (JSON.stringify(selectedWords) === JSON.stringify(expectedWords)) {
      setStep('pin');
    } else {
      Alert.alert('오류', '단어 순서가 올바르지 않습니다. 다시 확인해주세요.');
      setSelectedWords([]);
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
      const encryptedSeed = await encryptSeed(mnemonic, pin);
      await saveSeed(encryptedSeed);

      Alert.alert('성공', 'YooY Wallet이 성공적으로 생성되었습니다!', [
        { text: '확인', onPress: () => router.replace('/(tabs)/home') }
      ]);

    } catch (error) {
      Alert.alert('오류', '지갑 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'mnemonic') {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
        <View style={{ flex: 1, padding: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFD700', textAlign: 'center' }}>
            시드 문구 백업
          </Text>
          
          <View style={{
            backgroundColor: '#111',
            padding: 16,
            borderRadius: 8,
            marginBottom: 20
          }}>
            <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
              ⚠️ 중요: 이 단어들을 안전한 곳에 기록하세요
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 16, lineHeight: 24, textAlign: 'center' }}>
              {mnemonic}
            </Text>
          </View>
          
          <View style={{
            backgroundColor: '#111',
            padding: 12,
            borderRadius: 8,
            marginBottom: 20
          }}>
            <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 8 }}>
              💡 백업 안내
            </Text>
            <Text style={{ color: '#CCC', fontSize: 12, lineHeight: 16 }}>
              • 이 12개 단어는 지갑 복구에 필요합니다{'\n'}
              • 종이에 기록하여 안전한 곳에 보관하세요{'\n'}
              • 절대 디지털로 저장하거나 공유하지 마세요{'\n'}
              • 단어 순서가 정확해야 합니다
            </Text>
          </View>
          
          <Pressable
            onPress={handleConfirmMnemonic}
            style={{
              padding: 16,
              backgroundColor: '#FFD700',
              borderRadius: 8
            }}
          >
            <Text style={{
              color: '#000000',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16
            }}>
              시드 문구를 기록했습니다
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (step === 'verify') {
    const words = mnemonic.split(' ');
    const allWords = words.filter((_, index) => ![3, 7, 11].includes(index));
    
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
        <View style={{ flex: 1, padding: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFD700', textAlign: 'center' }}>
            시드 문구 확인
          </Text>
          
          <Text style={{ color: '#FFFFFF', marginBottom: 16, textAlign: 'center' }}>
            다음 단어들을 올바른 순서로 선택하세요:
          </Text>
          
          <View style={{
            backgroundColor: '#111',
            padding: 16,
            borderRadius: 8,
            marginBottom: 20
          }}>
            <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 8 }}>
              선택된 단어들 ({selectedWords.length}/3):
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
              {selectedWords.join(' ')}
            </Text>
          </View>
          
          <View style={{
            backgroundColor: '#111',
            padding: 16,
            borderRadius: 8,
            marginBottom: 20
          }}>
            <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 8 }}>
              단어 선택:
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {allWords.map((word, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleVerifyMnemonic(word)}
                  style={{
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '#333',
                    borderRadius: 4,
                    backgroundColor: '#222'
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
                    {word}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <Pressable
            onPress={handleVerifyComplete}
            disabled={selectedWords.length < 3}
            style={{
              padding: 16,
              backgroundColor: selectedWords.length === 3 ? '#FFD700' : '#333',
              borderRadius: 8,
              opacity: selectedWords.length === 3 ? 1 : 0.6
            }}
          >
            <Text style={{
              color: selectedWords.length === 3 ? '#000000' : '#666',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16
            }}>
              확인 완료
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

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
              {isLoading ? '처리 중...' : '지갑 생성 완료'}
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
          새 지갑 생성
        </Text>
        
        <View style={{
          backgroundColor: '#111',
          padding: 16,
          borderRadius: 8,
          marginBottom: 20
        }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 8 }}>
            🎉 YooY Wallet 생성
          </Text>
          <Text style={{ color: '#CCC', fontSize: 14, lineHeight: 20 }}>
            새로운 YooY Wallet을 생성합니다.{'\n'}
            • 12개 단어의 시드 문구가 생성됩니다{'\n'}
            • PIN을 설정하여 지갑을 보호합니다{'\n'}
            • ETH와 YOY 토큰을 관리할 수 있습니다
          </Text>
        </View>
        
        <Pressable
          onPress={handleCreateWallet}
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
            {isLoading ? '생성 중...' : '지갑 생성 시작'}
          </Text>
        </Pressable>
        
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


