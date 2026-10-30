import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { setSceneTheme } from '../lib/scenes.js';

const ThemeContext = createContext({ theme: 'dark', toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

const read = () => {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(read);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    setSceneTheme(theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#F6F3ED' : '#050505');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      return;
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
