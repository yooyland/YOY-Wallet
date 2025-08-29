import 'react-native-get-random-values';
import { scrypt as scryptJs } from 'scrypt-js';

function base64FromBytes(bytes: Uint8Array): string {
  if (typeof btoa !== 'undefined') {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  // Native/Node fallback
  // @ts-ignore
  return Buffer.from(bytes).toString('base64');
}

function bytesFromBase64(b64: string): Uint8Array {
  if (typeof atob !== 'undefined') {
    const binary = atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  }
  // @ts-ignore
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

export async function deriveKeyFromPin(pin: string, salt: Uint8Array): Promise<Uint8Array> {
  const N = 2 ** 15; // CPU/메모리 비용
  const r = 8;
  const p = 1;
  const key = await scryptJs(new TextEncoder().encode(pin), salt, N, r, p, 32);
  return new Uint8Array(key);
}

export async function hashPin(pin: string, salt: Uint8Array): Promise<string> {
  const key = await deriveKeyFromPin(pin, salt);
  const data = new Uint8Array([...salt, ...key]);
  const digestBuf = await crypto.subtle.digest('SHA-256', data);
  const digest = new Uint8Array(digestBuf);
  return base64FromBytes(new Uint8Array([...salt, ...digest]));
}

export function extractSaltFromHash(hash: string): Uint8Array {
  const raw = bytesFromBase64(hash);
  return new Uint8Array(raw.slice(0, 16));
}

export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  try {
    const salt = extractSaltFromHash(storedHash);
    const key = await deriveKeyFromPin(pin, salt);
    const data = new Uint8Array([...salt, ...key]);
    const digestBuf = await crypto.subtle.digest('SHA-256', data);
    const digest = new Uint8Array(digestBuf);
    const expect = base64FromBytes(new Uint8Array([...salt, ...digest]));
    return expect === storedHash;
  } catch {
    return false;
  }
}

export async function encryptSeed(seedPlain: string, pin: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const keyRaw = await deriveKeyFromPin(pin, salt);
  const key = await crypto.subtle.importKey('raw', keyRaw, 'AES-GCM', false, ['encrypt']);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(seedPlain));
  const payload = base64FromBytes(new Uint8Array([...salt, ...iv, ...new Uint8Array(enc)]));
  return payload;
}

export async function decryptSeed(payloadB64: string, pin: string): Promise<string> {
  const raw = bytesFromBase64(payloadB64);
  const salt = new Uint8Array(raw.slice(0, 16));
  const iv = new Uint8Array(raw.slice(16, 28));
  const data = new Uint8Array(raw.slice(28));
  const keyRaw = await deriveKeyFromPin(pin, salt);
  const key = await crypto.subtle.importKey('raw', keyRaw, 'AES-GCM', false, ['decrypt']);
  const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return new TextDecoder().decode(dec);
}


