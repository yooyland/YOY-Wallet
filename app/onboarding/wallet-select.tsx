import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function WalletSelect() {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#000000' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#FFD700', textAlign: 'center' }}>
        YooY Wallet
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 32, color: '#FFFFFF', textAlign: 'center' }}>
        새로운 황금시대를 당신과 함께 시작합니다
      </Text>
      
      <Link href="/wallet/create" asChild>
        <Pressable style={{ 
          padding: 16, 
          backgroundColor: '#FFD700', 
          borderRadius: 8, 
          marginBottom: 16 
        }}>
          <Text style={{ 
            color: '#000000', 
            textAlign: 'center', 
            fontWeight: 'bold',
            fontSize: 16
          }}>
            새 지갑 생성
          </Text>
        </Pressable>
      </Link>
      
      <Link href="/wallet/import" asChild>
        <Pressable style={{ 
          padding: 16, 
          borderWidth: 1, 
          borderColor: '#FFD700', 
          borderRadius: 8 
        }}>
          <Text style={{ 
            color: '#FFD700', 
            textAlign: 'center', 
            fontWeight: 'bold',
            fontSize: 16
          }}>
            기존 지갑 가져오기
          </Text>
        </Pressable>
      </Link>
      
      <View style={{ 
        backgroundColor: '#111', 
        padding: 16, 
        borderRadius: 8, 
        marginTop: 32 
      }}>
        <Text style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 8 }}>
          💡 지갑 선택 안내
        </Text>
        <Text style={{ color: '#CCC', fontSize: 12, lineHeight: 16 }}>
          • <Text style={{ color: '#FFD700' }}>새 지갑 생성</Text>: 처음 사용하시는 경우{'\n'}
          • <Text style={{ color: '#FFD700' }}>기존 지갑 가져오기</Text>: 이전에 생성한 지갑이 있는 경우{'\n'}
          • 니모닉 문구나 프라이빗 키로 복구 가능합니다
        </Text>
      </View>
    </View>
  );
}
