import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMotion } from '../../context/MotionContext.jsx';

export default function CursorGlow() {
  const el = useRef(null);
  const { motion } = useMotion();
  useEffect(() => {
    if (!motion || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const x = gsap.quickTo(el.current, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el.current, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e) => { x(e.clientX); y(e.clientY); el.current.style.opacity = 1; };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [motion]);
  return motion ? <div ref={el} aria-hidden="true" className="cursor-glow" /> : null;
}
