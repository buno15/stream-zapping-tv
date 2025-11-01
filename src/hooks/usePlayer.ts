import { useEffect, useRef, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { playerStateAtom } from '@/store';
import type { YouTubePlayer, TwitchPlayer, Channel } from '@/types';
import {
  createYouTubePlayer,
  loadYouTubeVideo,
  createTwitchPlayer,
  setTwitchChannel,
} from '@/services';
import { RateLimiter } from '@/utils';
import { PLAYER } from '@/constants';

const channelSwitchLimiter = new RateLimiter(PLAYER.SWITCH_TIMEOUT_MS);

export const usePlayer = (elementId: string) => {
  const [playerState, setPlayerState] = useAtom(playerStateAtom);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const twitchPlayerRef = useRef<TwitchPlayer | null>(null);
  const [currentPlatform, setCurrentPlatform] = useState<
    'youtube' | 'twitch' | null
  >(null);
  const switchingRef = useRef<boolean>(false);
  const pendingChannelRef = useRef<Channel | null>(null);

  // プレイヤー初期化
  useEffect(() => {
    setPlayerState('loading');

    // クリーンアップ
    return () => {
      youtubePlayerRef.current = null;
      twitchPlayerRef.current = null;
    };
  }, [setPlayerState]);

  const switchToChannel = useCallback(
    async (channel: Channel) => {
      // プレイヤー状態競合の処理（キューイング）
      if (switchingRef.current) {
        console.warn('Channel switch already in progress, queuing request');
        pendingChannelRef.current = channel;
        return;
      }

      switchingRef.current = true;

      try {
        // レート制限を適用
        await channelSwitchLimiter.throttle();

        setPlayerState('loading');

        if (channel.platform === 'youtube') {
          // YouTube プレイヤー
          if (!youtubePlayerRef.current) {
            // プレイヤーを初期化
            youtubePlayerRef.current = await createYouTubePlayer(
              elementId,
              () => {
                setPlayerState('ready');
              },
              (state) => {
                // 状態変更ハンドラ
                if (state === 1) setPlayerState('playing');
                else if (state === 2) setPlayerState('paused');
                else if (state === 3) setPlayerState('buffering');
                else if (state === 0) setPlayerState('ended');
              },
              (error) => {
                console.error('YouTube player error:', error);
                setPlayerState('error');
              }
            );
          }

          // 動画を読み込む
          await loadYouTubeVideo(youtubePlayerRef.current, channel.id);
          setCurrentPlatform('youtube');
        } else if (channel.platform === 'twitch') {
          // Twitch プレイヤー
          if (!twitchPlayerRef.current) {
            // プレイヤーを初期化
            twitchPlayerRef.current = await createTwitchPlayer(
              elementId,
              channel.id,
              () => {
                setPlayerState('ready');
              },
              (error) => {
                console.error('Twitch player error:', error);
                setPlayerState('error');
              }
            );
          } else {
            // チャンネルを変更
            await setTwitchChannel(twitchPlayerRef.current, channel.id);
          }

          setCurrentPlatform('twitch');
          setPlayerState('playing');
        }
      } catch (error) {
        console.error('Failed to switch channel:', error);
        setPlayerState('error');
      } finally {
        switchingRef.current = false;

        // キューイングされたリクエストを処理
        if (pendingChannelRef.current) {
          const pendingChannel = pendingChannelRef.current;
          pendingChannelRef.current = null;
          // 非同期で次のリクエストを処理
          setTimeout(() => switchToChannel(pendingChannel), 0);
        }
      }
    },
    [elementId, setPlayerState]
  );

  return {
    playerState,
    currentPlatform,
    switchToChannel,
  };
};
