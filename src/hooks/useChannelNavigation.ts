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

      if (newIndex < 0 || newIndex >= channels.length) {
        throw new Error('Index out of range');
      }

      setCurrentIndex(newIndex);
      saveToLocalStorage(STORAGE_KEYS.CURRENT_INDEX, newIndex);
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
