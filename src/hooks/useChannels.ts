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
        throw new Error(`Maximum ${CHANNEL.MAX_CHANNELS} channels allowed`);
      }

      // URL解析
      const parsed = parseChannelUrl(url);
      if (!parsed) {
        throw new Error('Invalid URL');
      }

      // 重複チェック
      if (channels.some((c) => c.id === parsed.id)) {
        throw new Error('Channel already exists');
      }

      // チャンネル追加
      const newChannel: Channel = {
        ...parsed,
        addedAt: new Date(),
      };

      const updatedChannels = [...channels, newChannel];
      setChannels(updatedChannels);

      // localStorage に保存
      saveToLocalStorage(STORAGE_KEYS.CHANNELS, updatedChannels);
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
