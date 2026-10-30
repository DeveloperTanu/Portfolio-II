import { useEffect } from 'react';
import gsap from 'gsap';
import { useMotion } from '../context/MotionContext.jsx';

export default function useMagnetic() {
  const { motion } = useMotion();
  useEffect(() => {
    if (!motion || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const cleanups = [...document.querySelectorAll('.btn-pill, .social-icon')].map((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.3, ease: 'power2.out' });
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.set(el, { x: 0, y: 0 }); };
    });
    return () => cleanups.forEach((c) => c());
  }, [motion]);
}
