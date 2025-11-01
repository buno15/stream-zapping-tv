import type { Platform } from '@/types';
import { URL_PATTERNS } from '@/constants';

export interface ParsedChannel {
  id: string;
  platform: Platform;
  url: string;
  displayName: string;
}

/**
 * YouTube/Twitch の URL を解析し、チャンネル情報を取得する
 * @param url - チャンネルURL
 * @returns パース結果、無効な URL の場合は null
 */
export const parseChannelUrl = (url: string): ParsedChannel | null => {
  // 空文字列チェック
  if (!url || url.trim().length === 0) {
    return null;
  }

  // YouTube URL のパース
  for (const [, pattern] of Object.entries(URL_PATTERNS.YOUTUBE)) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const id = match[1];
      return {
        id,
        platform: 'youtube',
        url,
        displayName: id,
      };
    }
  }

  // Twitch URL のパース
  const twitchMatch = url.match(URL_PATTERNS.TWITCH);
  if (twitchMatch && twitchMatch[1]) {
    const id = twitchMatch[1];
    return {
      id,
      platform: 'twitch',
      url,
      displayName: id,
    };
  }

  // マッチしない場合は null を返す
  return null;
};
