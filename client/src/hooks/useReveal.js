import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '../context/MotionContext.jsx';

gsap.registerPlugin(ScrollTrigger);

const FROM = {
  up: { y: 36 },
  left: { x: -56 },
  right: { x: 56 },
  scale: { scale: 0.92, y: 24 },
  blur: { y: 44, filter: 'blur(14px)' },
};

export default function useReveal(ref) {
  const { motion } = useMotion();
  useLayoutEffect(() => {
    if (!motion || !ref.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const variant = FROM[el.dataset.reveal] || FROM.up;
        gsap.from(el, { ...variant, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      gsap.utils.toArray('[data-stagger]').forEach((group) => {
        gsap.from(group.querySelectorAll('[data-item]'), {
          y: 48,
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [motion, ref]);
}
