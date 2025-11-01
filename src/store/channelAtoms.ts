import { atom } from 'jotai';
import type { Channel } from '@/types';

// Primitive Atoms
export const channelsAtom = atom<Channel[]>([]);
export const currentIndexAtom = atom<number>(-1);

// Derived Atoms
export const currentChannelAtom = atom((get) => {
  const channels = get(channelsAtom);
  const index = get(currentIndexAtom);
  return index >= 0 && index < channels.length ? channels[index] : null;
});

export const isEmptyAtom = atom((get) => get(channelsAtom).length === 0);

export const channelCountAtom = atom((get) => get(channelsAtom).length);
