import { Link, router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);

  const onboardingData = [
    {
      step: 1,
      title: "Exchange, Buy & Sell YooY Land World!",
      description: "Easily buy Bitcoin and other cryptocurrencies using a wide range of payment options",
      logo: "YooY Land"
    },
    {
      step: 2,
      title: "Track Value Change Each Digital Currency",
      description: "For each digital currency, there is information about its current market cap, price, 24-hour trading volume",
      logo: "YooY Coin"
    },
    {
      step: 3,
      title: "Collect, Sell & Buy Digital Arts",
      description: "Discover exclusive digital collectibles and their non-fungible tokens using InCrypto today",
      logo: "YooY NFT"
    }
  ];

  const currentData = onboardingData[currentStep - 1];

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 단계에서 지갑 선택 화면으로 이동
      router.push('/onboarding/wallet-select');
    }
  };

  const handleSkip = () => {
    // 지갑 선택 화면으로 이동
    router.push('/onboarding/wallet-select');
  };

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
      <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
        {/* Logo Section */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            width: 200, 
            height: 200, 
            borderRadius: 100,
            backgroundColor: currentStep === 1 ? 'transparent' : '#FFD700',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40
          }}>
            {currentStep === 1 ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ 
                  fontSize: 32, 
                  fontWeight: 'bold', 
                  color: '#90EE90',
                  marginBottom: 4
                }}>
                  YooY
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    color: '#FF6B35'
                  }}>
                    La
                  </Text>
                  <View style={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: 10, 
                    borderWidth: 2, 
                    borderColor: '#FF6B35',
                    marginHorizontal: 4
                  }} />
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    color: '#FF6B35'
                  }}>
                    nd
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={{ 
                fontSize: 48, 
                fontWeight: 'bold', 
                color: '#000000'
              }}>
                yo
              </Text>
            )}
          </View>

          {/* Navigation Dots */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 40 }}>
            {[1, 2, 3].map((step) => (
              <View
                key={step}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: step === currentStep ? '#FFD700' : 'transparent',
                  borderWidth: 1,
                  borderColor: step === currentStep ? '#FFD700' : '#666'
                }}
              />
            ))}
          </View>

          {/* Title */}
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 16,
            lineHeight: 32
          }}>
            {currentData.title}
          </Text>

          {/* Description */}
          <Text style={{ 
            fontSize: 16, 
            color: '#CCCCCC',
            textAlign: 'center',
            lineHeight: 24
          }}>
            {currentData.description}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ paddingBottom: 40 }}>
          <Pressable
            onPress={handleContinue}
            style={{
              padding: 16,
              backgroundColor: '#90EE90',
              borderRadius: 8,
              marginBottom: 16
            }}
          >
            <Text style={{
              color: '#000000',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16
            }}>
              {currentStep === 3 ? 'Get Started' : 'Continue'}
            </Text>
          </Pressable>

          <Pressable onPress={handleSkip}>
            <Text style={{
              color: '#FFFFFF',
              textAlign: 'center',
              fontSize: 14,
              textDecorationLine: 'underline'
            }}>
              Skip
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}


