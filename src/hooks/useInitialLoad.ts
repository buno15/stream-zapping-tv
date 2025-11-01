import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { channelsAtom, currentIndexAtom } from '@/store/channelAtoms';
import { loadFromLocalStorage } from '@/services/localStorage';
import { STORAGE_KEYS } from '@/constants';
import type { Channel } from '@/types';

/**
 * 初期データロード Hook
 *
 * アプリケーション起動時にlocalStorageからデータを読み込む
 */
export const useInitialLoad = () => {
  const setChannels = useSetAtom(channelsAtom);
  const setCurrentIndex = useSetAtom(currentIndexAtom);

  useEffect(() => {
    // チャンネルリストを読み込み
    const savedChannels = loadFromLocalStorage<Channel[]>(
      STORAGE_KEYS.CHANNELS
    );
    if (savedChannels && Array.isArray(savedChannels)) {
      setChannels(savedChannels);
    }

    // 現在のインデックスを読み込み
    const savedIndex = loadFromLocalStorage<number>(
      STORAGE_KEYS.CURRENT_INDEX
    );
    if (
      typeof savedIndex === 'number' &&
      savedChannels &&
      savedIndex >= 0 &&
      savedIndex < savedChannels.length
    ) {
      setCurrentIndex(savedIndex);
    } else if (savedChannels && savedChannels.length > 0) {
      // インデックスが無効な場合は0にリセット
      setCurrentIndex(0);
    }
  }, [setChannels, setCurrentIndex]);
};
