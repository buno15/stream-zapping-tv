import { atom } from 'jotai';
import type { PlaybackState } from '@/types';

// Primitive Atoms
export const playerStateAtom = atom<PlaybackState>('uninitialized');
export const isPanelVisibleAtom = atom<boolean>(true);
