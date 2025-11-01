import { useState, useEffect } from 'react';

/**
 * localStorage と同期する Custom Hook
 *
 * @param key - localStorage のキー
 * @param initialValue - 初期値（localStorage が空の場合に使用）
 * @returns [value, setValue] のタプル
 *
 * @example
 * ```tsx
 * const [channels, setChannels] = useLocalStorage<Channel[]>('channels', []);
 * ```
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // localStorage から初期値を読み込む
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // 値が変更されたら localStorage に保存
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
};
