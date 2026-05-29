import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'uz' | 'ru' | 'en';
export type ThemeMode = 'dark' | 'light';

type SettingsState = {
  language: Language;
  theme: ThemeMode;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'uz',
      theme: 'dark',
      setLanguage: (language) => set({ language }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }))
    }),
    {
      name: 'audio-library-settings'
    }
  )
);
