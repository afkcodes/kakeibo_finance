/**
 * @fileoverview MMKV storage wrapper for Zustand persist
 * @module @kakeibo/native/store/storage
 *
 * Provides fast, synchronous key-value storage using MMKV.
 * Better performance than AsyncStorage for React Native apps.
 */

import { createMMKV } from 'react-native-mmkv';
import type { PersistStorage } from 'zustand/middleware';

/**
 * MMKV instance for app state persistence
 */
export const mmkv = createMMKV({
  id: 'kakeibo-app-storage',
  encryptionKey: undefined, // TODO: Add encryption key for sensitive data
});

/**
 * Zustand-compatible storage adapter for MMKV
 * Implements PersistStorage interface for persist middleware
 */
export const createMMKVStorage = <T>(): PersistStorage<T> => ({
  getItem: (name: string) => {
    const value = mmkv.getString(name);
    return (value ?? null) as any;
  },
  setItem: (name: string, value: any) => {
    return mmkv.set(name, value);
  },
  removeItem: (name: string) => {
    return mmkv.remove(name);
  },
});
