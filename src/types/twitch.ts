// Twitch Embed API の型定義
// 参考: https://dev.twitch.tv/docs/embed/

export interface TwitchPlayer {
  setChannel(channel: string): void;
  play(): void;
  pause(): void;
  getChannel(): string;
  addEventListener(event: string, callback: () => void): void;
  removeEventListener(event: string, callback: () => void): void;
}

export interface TwitchEmbedOptions {
  width?: string | number;
  height?: string | number;
  channel?: string;
  video?: string;
  collection?: string;
  layout?: 'video' | 'video-with-chat';
  autoplay?: boolean;
  muted?: boolean;
  parent?: string[];
}

declare global {
  interface Window {
    Twitch: {
      Embed: new (elementId: string, options: TwitchEmbedOptions) => {
        getPlayer(): TwitchPlayer;
      };
      Player: {
        READY: string;
        PLAY: string;
        PAUSE: string;
        ENDED: string;
      };
    };
  }
}
