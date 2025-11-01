import { useState, useEffect } from 'react';

/**
 * 画面向き検出 Hook
 * 
 * 横向き・縦向きの検出とオリエンテーション変更イベントのハンドリング
 */
export const useOrientation = () => {
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia('(orientation: landscape)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: landscape)');
    const handleChange = (e: MediaQueryListEvent) => setIsLandscape(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isLandscape;
};
