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
 * YouTube埋め込みURLを生成
 */
const getYouTubeEmbedUrl = (channelId: string, idType?: string): string => {
  const baseParams = 'autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1';

  // ビデオID形式の場合は直接埋め込み
  if (idType === 'video') {
    return `https://www.youtube.com/embed/${channelId}?${baseParams}`;
  }

  // チャンネルのライブ配信埋め込み
  // @ハンドル形式の場合もchannelパラメータで指定可能
  if (idType === 'handle') {
    // @handleの場合、@を含めてchannelパラメータに渡す
    return `https://www.youtube.com/embed/live_stream?channel=@${channelId}&${baseParams}`;
  }

  // チャンネルID形式（UC...で始まる）またはその他
  return `https://www.youtube.com/embed/live_stream?channel=${channelId}&${baseParams}`;
};

/**
 * YouTube プレイヤーを初期化（iframeを直接作成）
 */
export const createYouTubePlayer = (
  elementId: string,
  channelId: string,
  idType?: string,
  onReady?: (player: YouTubePlayer) => void
): Promise<YouTubePlayer> => {
  return new Promise((resolve, reject) => {
    try {
      const container = document.getElementById(elementId);
      if (!container) {
        reject(new Error(`Element with id ${elementId} not found`));
        return;
      }

      // iframeを直接作成してチャンネルのライブ配信を表示
      const iframe = document.createElement('iframe');
      iframe.src = getYouTubeEmbedUrl(channelId, idType);
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';

      container.appendChild(iframe);

      // 簡易的なプレイヤーオブジェクトを作成
      const player = {
        loadVideoById: (videoId: string, videoIdType?: string) => {
          iframe.src = getYouTubeEmbedUrl(videoId, videoIdType);
        },
        playVideo: () => { },
        pauseVideo: () => { },
        stopVideo: () => { },
        destroy: () => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        },
        getPlayerState: () => 1,
        addEventListener: () => { },
        removeEventListener: () => { },
      } as YouTubePlayer;

      // 少し待ってからonReadyを呼び出す
      setTimeout(() => {
        if (onReady) onReady(player);
        resolve(player);
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * チャンネルを読み込む（リトライ機能付き）
 */
export const loadYouTubeVideo = async (
  player: YouTubePlayer,
  channelId: string,
  idType?: string,
  retryCount = 0
): Promise<void> => {
  try {
    player.loadVideoById(channelId, idType);
  } catch (error) {
    // リトライ処理
    if (retryCount < PLAYER.MAX_RETRY_COUNT) {
      await new Promise((resolve) =>
        setTimeout(resolve, PLAYER.ERROR_RETRY_DELAY_MS)
      );
      return loadYouTubeVideo(player, channelId, idType, retryCount + 1);
    }
    throw error;
  }
};
