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
  const initializingRef = useRef<boolean>(false);
  const pendingChannelRef = useRef<Channel | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const lastChannelIdRef = useRef<string | null>(null);

  // プレイヤー初期化
  useEffect(() => {
    setPlayerState('loading');

    // クリーンアップ
    return () => {
      // デバウンスタイマーのクリア
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // プレイヤー参照のクリア
      youtubePlayerRef.current = null;
      twitchPlayerRef.current = null;
    };
  }, [setPlayerState]);

  const switchToChannel = useCallback(
    async (channel: Channel) => {
      // デバウンス処理: 前回のタイマーをキャンセル
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // 同じチャンネルへの重複リクエストを防止
      const channelKey = `${channel.platform}:${channel.id}`;
      if (lastChannelIdRef.current === channelKey) {
        console.log('Same channel requested, skipping');
        return;
      }

      // デバウンス: 200ms待機してから実行
      debounceTimerRef.current = setTimeout(async () => {
        // プレイヤー初期化中またはチャンネル切り替え中の場合はキューイング
        if (switchingRef.current || initializingRef.current) {
          console.warn('Player busy, queuing request');
          pendingChannelRef.current = channel;
          return;
        }

        switchingRef.current = true;
        lastChannelIdRef.current = channelKey;

        try {
          // レート制限を適用
          await channelSwitchLimiter.throttle();

          setPlayerState('loading');

        // プラットフォームが切り替わる場合は古いプレイヤーを破棄
        if (currentPlatform && currentPlatform !== channel.platform) {
          // DOM要素をクリア
          const container = document.getElementById(elementId);
          if (container) {
            container.innerHTML = '';
          }

          // プレイヤー参照をクリア
          if (currentPlatform === 'youtube' && youtubePlayerRef.current) {
            try {
              youtubePlayerRef.current.destroy();
            } catch (e) {
              console.warn('Failed to destroy YouTube player:', e);
            }
            youtubePlayerRef.current = null;
          } else if (currentPlatform === 'twitch' && twitchPlayerRef.current) {
            twitchPlayerRef.current = null;
          }
        }

        if (channel.platform === 'youtube') {
          // YouTube プレイヤー
          if (!youtubePlayerRef.current) {
            initializingRef.current = true;
            try {
              // DOM要素をクリア（新規作成時）
              const container = document.getElementById(elementId);
              if (container) {
                container.innerHTML = '';
              }

              // プレイヤーを初期化
              youtubePlayerRef.current = await createYouTubePlayer(
                elementId,
                channel.id,
                channel.idType,
                () => {
                  setPlayerState('ready');
                  setPlayerState('playing'); // 自動再生するので即座にplaying状態に
                }
              );
              setCurrentPlatform('youtube');
            } finally {
              initializingRef.current = false;
            }
          } else {
            // 既存プレイヤーでチャンネルを変更
            await loadYouTubeVideo(youtubePlayerRef.current, channel.id, channel.idType);
          }
        } else if (channel.platform === 'twitch') {
          // Twitch プレイヤー
          if (!twitchPlayerRef.current) {
            initializingRef.current = true;
            try {
              // DOM要素をクリア（新規作成時）
              const container = document.getElementById(elementId);
              if (container) {
                container.innerHTML = '';
              }

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
            } finally {
              initializingRef.current = false;
            }
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
          lastChannelIdRef.current = null; // エラー時はリセット
        } finally {
          switchingRef.current = false;

          // キューイングされたリクエストを処理
          if (pendingChannelRef.current) {
            const pendingChannel = pendingChannelRef.current;
            pendingChannelRef.current = null;
            // 非同期で次のリクエストを処理
            setTimeout(() => switchToChannel(pendingChannel), 300);
          }
        }
      }, 200); // デバウンス: 200ms
    },
    [elementId, setPlayerState, currentPlatform]
  );

  return {
    playerState,
    currentPlatform,
    switchToChannel,
  };
};
