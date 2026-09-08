import { useContext } from 'react';
import { ThemeModeContext } from './themeModeContextInstance';

// Shared by the dashboard and the public timeline (same localStorage key,
// same resolution rule).
export default function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within a ThemeModeProvider');
  return ctx;
}
