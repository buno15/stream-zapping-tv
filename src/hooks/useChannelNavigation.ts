import { useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { channelsAtom, currentIndexAtom } from '@/store';
import { STORAGE_KEYS } from '@/constants';
import { saveToLocalStorage } from '@/services/localStorage';

export const useChannelNavigation = () => {
  const channels = useAtomValue(channelsAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);

  const switchChannel = useCallback(
    (direction: 'next' | 'prev' | number) => {
      if (channels.length === 0) return;

      let newIndex: number;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % channels.length;
      } else if (direction === 'prev') {
        newIndex = (currentIndex - 1 + channels.length) % channels.length;
      } else {
        newIndex = direction;
      }

      // インデックス範囲外の自動補正
      if (newIndex < 0) {
        console.warn(`Index ${newIndex} is out of range, correcting to 0`);
        newIndex = 0;
      } else if (newIndex >= channels.length) {
        console.warn(
          `Index ${newIndex} is out of range, correcting to ${channels.length - 1}`
        );
        newIndex = channels.length - 1;
      }

      setCurrentIndex(newIndex);
      try {
        saveToLocalStorage(STORAGE_KEYS.CURRENT_INDEX, newIndex);
      } catch (error) {
        // localStorage保存失敗時はログのみ（状態は更新済み）
        console.error('Failed to save current index to localStorage:', error);
      }
    },
    [channels, currentIndex, setCurrentIndex]
  );

  const currentChannel = channels[currentIndex] ?? null;

  return {
    currentChannel,
    currentIndex,
    switchChannel,
  };
};
