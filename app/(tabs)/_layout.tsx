import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: '홈' }} />
      <Tabs.Screen name="send" options={{ title: '송금' }} />
      <Tabs.Screen name="receive" options={{ title: '수신' }} />
      <Tabs.Screen name="settings" options={{ title: '설정' }} />
    </Tabs>
  );
}


