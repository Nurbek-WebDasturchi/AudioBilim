import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/audio';

type AuthState = {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null })
    }),
    {
      name: 'audio-library-auth'
    }
  )
);
