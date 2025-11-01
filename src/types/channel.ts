import type { Platform } from './platform';

export interface Channel {
  id: string;
  platform: Platform;
  url: string;
  displayName: string;
  addedAt: Date;
}
