import type { TwitchPlayer } from '@/types';
import { PLAYER } from '@/constants';

let scriptLoaded = false;
let scriptLoading = false;
const scriptLoadCallbacks: (() => void)[] = [];

/**
 * Twitch Embed API スクリプトを非同期で読み込む
 */
export const loadTwitchAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 既に読み込み済み
    if (scriptLoaded) {
      resolve();
      return;
    }

    // 読み込み中
    if (scriptLoading) {
      scriptLoadCallbacks.push(resolve);
      return;
    }

    scriptLoading = true;

    // スクリプトタグを追加
    const script = document.createElement('script');
    script.src = 'https://embed.twitch.tv/embed/v1.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();

      // 待機中のコールバックを実行
      scriptLoadCallbacks.forEach((cb) => cb());
      scriptLoadCallbacks.length = 0;
    };
    script.onerror = () => {
      scriptLoading = false;
      reject(new Error('Failed to load Twitch Embed API'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Twitch プレイヤーを初期化
 */
export const createTwitchPlayer = (
  elementId: string,
  channel: string,
  onReady?: (player: TwitchPlayer) => void,
  onError?: (error: Error) => void
): Promise<TwitchPlayer> => {
  return new Promise((resolve, reject) => {
    loadTwitchAPI()
      .then(() => {
        try {
          const embed = new window.Twitch.Embed(elementId, {
            width: '100%',
            height: '100%',
            channel,
            layout: 'video',
            autoplay: true,
            muted: false,
            parent: [window.location.hostname],
          });

          const player = embed.getPlayer();

          // READY イベントを待機
          player.addEventListener(window.Twitch.Player.READY, () => {
            if (onReady) onReady(player);
            resolve(player);
          });
        } catch (error) {
          if (onError) onError(error as Error);
          reject(error);
        }
      })
      .catch(reject);
  });
};

/**
 * チャンネルを設定（リトライ機能付き）
 */
export const setTwitchChannel = async (
  player: TwitchPlayer,
  channel: string,
  retryCount = 0
): Promise<void> => {
  try {
    player.setChannel(channel);
  } catch (error) {
    // リトライ処理
    if (retryCount < PLAYER.MAX_RETRY_COUNT) {
      await new Promise((resolve) =>
        setTimeout(resolve, PLAYER.ERROR_RETRY_DELAY_MS)
      );
      return setTwitchChannel(player, channel, retryCount + 1);
    }
    throw error;
  }
};
