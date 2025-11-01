import type { YouTubePlayer } from '@/types';
import { PLAYER } from '@/constants';

let scriptLoaded = false;
let scriptLoading = false;
const scriptLoadCallbacks: (() => void)[] = [];

/**
 * YouTube IFrame API スクリプトを非同期で読み込む（タイムアウト付き）
 */
export const loadYouTubeAPI = (): Promise<void> => {
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

    // タイムアウト設定（10秒）
    const timeout = setTimeout(() => {
      scriptLoading = false;
      reject(new Error('YouTube APIの読み込みがタイムアウトしました。ネットワーク接続を確認してください。'));
    }, 10000);

    // グローバルコールバックを設定
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      scriptLoaded = true;
      scriptLoading = false;
      resolve();

      // 待機中のコールバックを実行
      scriptLoadCallbacks.forEach((cb) => cb());
      scriptLoadCallbacks.length = 0;
    };

    // スクリプトタグを追加
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      clearTimeout(timeout);
      scriptLoading = false;
      reject(new Error('YouTube APIの読み込みに失敗しました。ネットワーク接続を確認してください。'));
    };

    document.head.appendChild(script);
  });
};

/**
 * YouTube プレイヤーを初期化
 */
export const createYouTubePlayer = (
  elementId: string,
  onReady?: (player: YouTubePlayer) => void,
  onStateChange?: (state: number) => void,
  onError?: (error: number) => void
): Promise<YouTubePlayer> => {
  return new Promise((resolve, reject) => {
    loadYouTubeAPI()
      .then(() => {
        new window.YT.Player(elementId, {
          height: '100%',
          width: '100%',
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              if (onReady) onReady(event.target);
              resolve(event.target);
            },
            onStateChange: (event) => {
              if (onStateChange) onStateChange(event.data);
            },
            onError: (event) => {
              if (onError) onError(event.data);
            },
          },
        });
      })
      .catch(reject);
  });
};

/**
 * 動画を読み込む（リトライ機能付き）
 */
export const loadYouTubeVideo = async (
  player: YouTubePlayer,
  videoId: string,
  retryCount = 0
): Promise<void> => {
  try {
    player.loadVideoById(videoId);
  } catch (error) {
    // リトライ処理
    if (retryCount < PLAYER.MAX_RETRY_COUNT) {
      await new Promise((resolve) =>
        setTimeout(resolve, PLAYER.ERROR_RETRY_DELAY_MS)
      );
      return loadYouTubeVideo(player, videoId, retryCount + 1);
    }
    throw error;
  }
};
