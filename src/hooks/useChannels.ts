import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { channelsAtom } from '@/store';
import { parseChannelUrl } from '@/utils';
import type { Channel } from '@/types';
import { CHANNEL, STORAGE_KEYS } from '@/constants';
import { saveToLocalStorage } from '@/services/localStorage';

export const useChannels = () => {
  const [channels, setChannels] = useAtom(channelsAtom);

  const addChannel = useCallback(
    async (url: string) => {
      // チャンネル数制限チェック
      if (channels.length >= CHANNEL.MAX_CHANNELS) {
        throw new Error(`チャンネル数の上限（${CHANNEL.MAX_CHANNELS}個）に達しています`);
      }

      // URL解析
      const parsed = parseChannelUrl(url);
      if (!parsed) {
        throw new Error('無効なURLです。YouTubeまたはTwitchのURLを入力してください');
      }

      // 重複チェック
      if (channels.some((c) => c.id === parsed.id)) {
        throw new Error('このチャンネルは既に登録されています');
      }

      // チャンネル追加
      const newChannel: Channel = {
        ...parsed,
        addedAt: new Date(),
      };

      const updatedChannels = [...channels, newChannel];
      setChannels(updatedChannels);

      // localStorage に保存
      try {
        saveToLocalStorage(STORAGE_KEYS.CHANNELS, updatedChannels);
      } catch (storageError) {
        // localStorage保存失敗時は状態を元に戻す
        setChannels(channels);
        throw storageError;
      }
    },
    [channels, setChannels]
  );

  const removeChannel = useCallback(
    (index: number) => {
      const updatedChannels = channels.filter((_, i) => i !== index);
      setChannels(updatedChannels);
      saveToLocalStorage(STORAGE_KEYS.CHANNELS, updatedChannels);
    },
    [channels, setChannels]
  );

  const reorderChannels = useCallback(
    (oldIndex: number, newIndex: number) => {
      const updatedChannels = [...channels];
      const [removed] = updatedChannels.splice(oldIndex, 1);
      updatedChannels.splice(newIndex, 0, removed);
      setChannels(updatedChannels);
      saveToLocalStorage(STORAGE_KEYS.CHANNELS, updatedChannels);
    },
    [channels, setChannels]
  );

  return {
    channels,
    addChannel,
    removeChannel,
    reorderChannels,
  };
};
