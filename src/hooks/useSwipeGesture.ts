import { useState, useCallback } from 'react';
import { useChannelNavigation } from './useChannelNavigation';

const SWIPE_THRESHOLD = 50; // 50px 以上のスワイプで切り替え

/**
 * タッチジェスチャー Hook
 * 
 * - 左スワイプ: 次のチャンネル
 * - 右スワイプ: 前のチャンネル
 */
export const useSwipeGesture = () => {
  const { switchChannel } = useChannelNavigation();
  const [touchStart, setTouchStart] = useState<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart - touchEnd;

      // 50px 以上のスワイプで切り替え
      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) {
          switchChannel('next'); // 左スワイプ
        } else {
          switchChannel('prev'); // 右スワイプ
        }
      }
    },
    [touchStart, switchChannel]
  );

  return { handleTouchStart, handleTouchEnd };
};
