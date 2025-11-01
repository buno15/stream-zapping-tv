// ユニオン型のため type を使用
export type PlaybackState =
  | 'uninitialized'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'ended'
  | 'error';
