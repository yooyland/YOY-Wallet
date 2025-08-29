import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

const KEY_SEED = 'yoy.seed';
const KEY_PIN = 'yoy.pin';

export async function isBiometricAvailable(): Promise<boolean> {
  const res = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return res && enrolled;
}

const webStore = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value, { keychainService: 'yoy.wallet' });
  },
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key, { keychainService: 'yoy.wallet' });
  },
  async deleteItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key, { keychainService: 'yoy.wallet' });
  },
};

export async function saveSeed(encryptedSeed: string): Promise<void> {
  await webStore.setItem(KEY_SEED, encryptedSeed);
}

export async function loadSeed(): Promise<string | null> {
  return webStore.getItem(KEY_SEED);
}

export async function savePin(pinHash: string): Promise<void> {
  await webStore.setItem(KEY_PIN, pinHash);
}

export async function loadPin(): Promise<string | null> {
  return webStore.getItem(KEY_PIN);
}

export async function clearAll(): Promise<void> {
  await webStore.deleteItem(KEY_SEED);
  await webStore.deleteItem(KEY_PIN);
}


