import { useEffect, useState, type ReactNode } from 'react';
import { ThemeModeContext, type ThemeMode } from './themeModeContextInstance';

const STORAGE_KEY = 'naon-theme-mode';

function readStoredMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    // private mode / blocked storage - fall back to system
  }
  return 'system';
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Mount once at each app's root (see App.tsx) - NOT per-consumer. The live
// OS-preference subscription and the effect that syncs `data-theme` onto
// <html> both need to keep running for the app's entire lifetime, not just
// while some particular page happens to render a <ThemeSelector> (e.g. the
// mobile nav drawer, which unmounts its <Sidebar> - and with it any
// selector inside - whenever it's closed).
export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && systemDark);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  function setMode(next: ThemeMode) {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // private mode / blocked storage - the choice just won't persist
    }
  }

  return <ThemeModeContext.Provider value={{ mode, isDark, setMode }}>{children}</ThemeModeContext.Provider>;
}
