// YouTube IFrame Player API の型定義
// 参考: https://developers.google.com/youtube/iframe_api_reference

export interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data?: number;
}

export interface YouTubePlayer {
  loadVideoById(videoId: string, idType?: string): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  destroy(): void;
  getPlayerState(): number;
  addEventListener(event: string, listener: (event: YouTubePlayerEvent) => void): void;
  removeEventListener(event: string, listener: (event: YouTubePlayerEvent) => void): void;
}

export interface YouTubePlayerVars {
  autoplay?: 0 | 1;
  controls?: 0 | 1;
  modestbranding?: 0 | 1;
  rel?: 0 | 1;
  // その他の playerVars オプション
  enablejsapi?: 0 | 1;
  origin?: string;
  playsinline?: 0 | 1;
  start?: number;
  end?: number;
}

export interface YouTubePlayerOptions {
  height?: string | number;
  width?: string | number;
  videoId?: string;
  playerVars?: YouTubePlayerVars;
  events?: {
    onReady?: (event: { target: YouTubePlayer }) => void;
    onStateChange?: (event: { target: YouTubePlayer; data: number }) => void;
    onError?: (event: { target: YouTubePlayer; data: number }) => void;
  };
}

// YouTube Player States
export const YT_PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

// YouTube Player Errors
export const YT_PLAYER_ERROR = {
  INVALID_PARAM: 2,
  HTML5_ERROR: 5,
  NOT_FOUND: 100,
  NOT_EMBEDDABLE: 101,
  NOT_EMBEDDABLE_IN_DISGUISE: 150,
} as const;

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: YouTubePlayerOptions
      ) => YouTubePlayer;
      PlayerState: typeof YT_PLAYER_STATE;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
