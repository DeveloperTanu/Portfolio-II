import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div ref={bar} aria-hidden="true" className="scroll-progress" />;
}
