import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import MotionToggle from './components/ui/MotionToggle.jsx';
import Hero from './components/sections/Hero.jsx';
import Projects from './components/sections/Projects.jsx';
import MiniProjects from './components/sections/MiniProjects.jsx';
import Skills from './components/sections/Skills.jsx';
import About from './components/sections/About.jsx';
import Contact from './components/sections/Contact.jsx';
import ScrollProgress from './components/ui/ScrollProgress.jsx';
import CursorGlow from './components/ui/CursorGlow.jsx';
import Marquee from './components/ui/Marquee.jsx';
import useMagnetic from './hooks/useMagnetic.js';
import { useMotion } from './context/MotionContext.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { motion } = useMotion();
  useMagnetic();
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!motion) { root.style.setProperty('--grain-y', '0px'); return undefined; }
    const st = ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => root.style.setProperty('--grain-y', `${self.progress * -300}px`),
    });
    return () => st.kill();
  }, [motion]);

  return (
    <>
      <a href="#projects" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:p-3">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <MiniProjects />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
      <MotionToggle />
    </>
  );
}
