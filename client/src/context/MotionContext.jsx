import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const MotionContext = createContext({ motion: true, toggle: () => {} });
export const useMotion = () => useContext(MotionContext);

export function MotionProvider({ children }) {
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off';
  }, [motion]);
  const value = useMemo(() => ({ motion, toggle: () => setMotion((m) => !m) }), [motion]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
