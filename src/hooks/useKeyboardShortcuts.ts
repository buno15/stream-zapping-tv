import { useEffect } from 'react';
import { useChannelNavigation } from './useChannelNavigation';

/**
 * キーボードショートカット Hook
 * 
 * - 上矢印キー: 次のチャンネル
 * - 下矢印キー: 前のチャンネル
 * - 数字キー (1-9): 直接チャンネル指定
 */
export const useKeyboardShortcuts = () => {
  const { switchChannel } = useChannelNavigation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          switchChannel('next');
          break;
        case 'ArrowDown':
          e.preventDefault();
          switchChannel('prev');
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          switchChannel(parseInt(e.key, 10) - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switchChannel]);
};
