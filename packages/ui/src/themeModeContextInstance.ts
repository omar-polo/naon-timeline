import { createContext } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);
