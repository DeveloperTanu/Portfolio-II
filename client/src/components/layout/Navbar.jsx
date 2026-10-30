import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { siteConfig } from '../../data/siteConfig.js';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useMotion } from '../../context/MotionContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const ref = useRef(null);
  const { motion } = useMotion();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!motion) return undefined;
    const ctx = gsap.context(() => gsap.from(ref.current, { y: -40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 }), ref);
    return () => ctx.revert();
  }, [motion]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const els = siteConfig.nav.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(`#${e.target.id}`); }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header ref={ref} className="fixed inset-x-0 top-4 z-50 mx-auto w-[min(94%,1100px)]">
      <nav aria-label="Primary" className="rounded-3xl border border-stone/25 bg-ink/70 px-5 py-3 backdrop-blur-md md:rounded-full md:px-8">
        <div className="relative flex items-center justify-center md:justify-between">
          <a href="#top" className="font-display text-2xl italic">{siteConfig.name}</a>
          <ul className="hidden items-center gap-7 text-sm md:flex">
            {siteConfig.nav.map((l) => (
              <li key={l.href}><a href={l.href} className={`nav-link transition hover:text-ivory ${active === l.href ? 'text-ivory nav-link-on' : 'text-stone'}`}>{l.label}</a></li>
            ))}
          </ul>
          <button type="button" onClick={toggle} className="theme-toggle absolute left-0 md:static" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title={theme === 'dark' ? 'Light theme' : 'Dark theme'}>
            {theme === 'dark' ? <FiSun key="sun" aria-hidden="true" /> : <FiMoon key="moon" aria-hidden="true" />}
          </button>
          <button className="label absolute right-0 md:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
        {open && (
          <ul id="mobile-nav" className="mt-4 grid gap-1 border-t border-line pt-3 text-center md:hidden">
            {siteConfig.nav.map((l) => (
              <li key={l.href}><a href={l.href} onClick={() => setOpen(false)} className={`block py-2 text-lg ${active === l.href ? 'text-amber' : ''}`}>{l.label}</a></li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
