import { create } from 'zustand';
import type { AudioItem } from '../types/audio';

type PlayerState = {
  queue: AudioItem[];
  current: AudioItem | null;
  isOpen: boolean;
  setQueue: (items: AudioItem[], current?: AudioItem) => void;
  play: (item: AudioItem) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  current: null,
  isOpen: false,
  setQueue: (items, current) => set({ queue: items, current: current ?? items[0] ?? null, isOpen: true }),
  play: (item) => set({ current: item, isOpen: true }),
  close: () => set({ isOpen: false }),
  next: () => {
    const { queue, current } = get();
    if (!current || queue.length === 0) return;
    const index = queue.findIndex((item) => item.id === current.id);
    set({ current: queue[(index + 1) % queue.length] });
  },
  previous: () => {
    const { queue, current } = get();
    if (!current || queue.length === 0) return;
    const index = queue.findIndex((item) => item.id === current.id);
    set({ current: queue[(index - 1 + queue.length) % queue.length] });
  }
}));
