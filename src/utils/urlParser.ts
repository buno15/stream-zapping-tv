import type { Platform } from '@/types';
import { URL_PATTERNS } from '@/constants';

export interface ParsedChannel {
  id: string;
  platform: Platform;
  url: string;
  displayName: string;
  idType?: 'channel' | 'handle' | 'custom' | 'video'; // YouTubeのID形式
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
  // ビデオURL形式を最優先でチェック（ライブ配信を含む）
  const videoMatch = url.match(URL_PATTERNS.YOUTUBE.VIDEO);
  if (videoMatch && videoMatch[1]) {
    const videoId = videoMatch[1];
    return {
      id: videoId,
      platform: 'youtube',
      url,
      displayName: `Video: ${videoId.substring(0, 8)}...`,
      idType: 'video',
    };
  }

  // @ハンドル形式
  const atMatch = url.match(URL_PATTERNS.YOUTUBE.AT);
  if (atMatch && atMatch[1]) {
    const id = atMatch[1];
    return {
      id,
      platform: 'youtube',
      url,
      displayName: `@${id}`,
      idType: 'handle',
    };
  }

  // チャンネルID形式
  const channelMatch = url.match(URL_PATTERNS.YOUTUBE.CHANNEL);
  if (channelMatch && channelMatch[1]) {
    const id = channelMatch[1];
    return {
      id,
      platform: 'youtube',
      url,
      displayName: id,
      idType: 'channel',
    };
  }

  // カスタムURL形式
  const customMatch = url.match(URL_PATTERNS.YOUTUBE.C);
  if (customMatch && customMatch[1]) {
    const id = customMatch[1];
    return {
      id,
      platform: 'youtube',
      url,
      displayName: id,
      idType: 'custom',
    };
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
