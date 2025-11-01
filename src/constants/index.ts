// チャンネル関連定数
export const CHANNEL = {
  MAX_CHANNELS: 100,
  MIN_DISPLAY_NAME_LENGTH: 1,
  MAX_DISPLAY_NAME_LENGTH: 50,
} as const;

// プレイヤー関連定数
export const PLAYER = {
  SWITCH_TIMEOUT_MS: 500,
  ERROR_RETRY_DELAY_MS: 2000, // エラー時のリトライ待機時間
  MAX_RETRY_COUNT: 1, // リトライ最大回数
  CHANNEL_INFO_DISPLAY_DURATION_MS: 3000,
  TRANSITION_DURATION_MS: 200,
} as const;

// キーボードショートカット
export const KEYBOARD = {
  MAX_DIRECT_CHANNEL_NUMBER: 9,
} as const;

// localStorage キー
export const STORAGE_KEYS = {
  CHANNELS: 'stream-zapping-tv:channels',
  CURRENT_INDEX: 'stream-zapping-tv:currentIndex',
  PANEL_VISIBLE: 'stream-zapping-tv:panelVisible',
} as const;

// ブレークポイント（Tailwind CSS デフォルトと一致）
// アプリでは Mobile/Tablet/Desktop の 3 段階を使用
export const BREAKPOINTS = {
  // Mobile: 0-767px (デフォルト、ブレークポイント指定なし)
  MD: 768, // Tablet (768px-1023px)
  LG: 1024, // Desktop (1024px+)
  XL: 1280, // Large Desktop (1280px+)
} as const;

// URL パターン
export const URL_PATTERNS = {
  YOUTUBE: {
    // ビデオURL（ライブ配信を含む）
    VIDEO: /(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // チャンネルURL
    AT: /youtube\.com\/@([^/?]+)/,
    CHANNEL: /youtube\.com\/channel\/([^/?]+)/,
    C: /youtube\.com\/c\/([^/?]+)/,
  },
  TWITCH: /twitch\.tv\/([^/?]+)/,
} as const;
