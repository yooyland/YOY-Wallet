import { Link } from 'expo-router';
import { View, Text, Pressable, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WalletSelect() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* Status Bar */}
      <View style={{ 
        height: 44, 
        backgroundColor: '#000000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>9:41</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <View style={{ width: 20, height: 12, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
          <View style={{ width: 16, height: 12, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
          <View style={{ width: 24, height: 12, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
        </View>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ 
            width: 120, 
            height: 120, 
            borderRadius: 60,
            backgroundColor: '#FFD700',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Text style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: '#000000'
            }}>
              yo
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{ 
          fontSize: 28, 
          fontWeight: 'bold', 
          marginBottom: 16, 
          color: '#FFD700', 
          textAlign: 'center' 
        }}>
          YooY Wallet
        </Text>
        
        <Text style={{ 
          fontSize: 16, 
          marginBottom: 32, 
          color: '#FFFFFF', 
          textAlign: 'center' 
        }}>
          새로운 황금시대를 당신과 함께 시작합니다
        </Text>
        
        {/* Wallet Options */}
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
        
        {/* Info Box */}
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
    </View>
  );
}
