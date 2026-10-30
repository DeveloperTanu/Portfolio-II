import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortraitParticles from '../effects/PortraitParticles.jsx';
import { siteConfig } from '../../data/siteConfig.js';
import { useMotion } from '../../context/MotionContext.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef(null);
  const stage = useRef(null);
  const photo = useRef(null);
  const progress = useRef(0);
  const [particlesOk, setParticlesOk] = useState(true);
  const onParticlesFail = useCallback(() => setParticlesOk(false), []);
  const { motion } = useMotion();

  useLayoutEffect(() => {
    if (!motion) return undefined;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero="portrait"]', { opacity: 0, scale: 0.94, duration: 1.6 })
        .from('[data-hero="label"]', { opacity: 0, y: 12, duration: 0.8 }, 0.2)
        .from('[data-hero="name"] span, [data-hero="name"] em', { yPercent: 60, opacity: 0, filter: 'blur(16px)', duration: 1.4, stagger: 0.14 }, 0.5)
        .from('[data-hero="rest"]', { opacity: 0, y: 24, duration: 1, stagger: 0.12 }, '-=0.8')
        .from('[data-hero="hint"]', { opacity: 0, duration: 1 }, '-=0.4');
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 } })
        .to('[data-hero="name"]', { yPercent: -22, scale: 0.92, opacity: 0.15, ease: 'none' }, 0);
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.7}`,
        onUpdate: (self) => { progress.current = self.progress; },
      });
    }, root);
    return () => ctx.revert();
  }, [motion]);

  return (
    <section id="top" ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pb-10 pt-36 md:px-16">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />

      <div ref={stage} data-hero="portrait" className="pointer-events-none relative z-0 mx-auto aspect-square h-[clamp(260px,40svh,460px)]">
        <div ref={photo} className="portrait-photo absolute left-0 top-0 w-full" style={{ aspectRatio: '1 / 1.1636' }}>
          <img src="/images/portrait-cutout.png" alt={`Portrait of ${siteConfig.name}`} width="900" height="1047" className="h-full w-full object-cover" />
        </div>
      </div>
      {particlesOk && <PortraitParticles anchorRef={stage} progressRef={progress} photoRef={photo} onFail={onParticlesFail} />}

      <p data-hero="label" className="label-amber absolute left-1/2 top-28 -translate-x-1/2 whitespace-nowrap md:left-16 md:translate-x-0">
        <span className="pulse-dot" aria-hidden="true" /> {siteConfig.role}
      </p>

      <h1 data-hero="name" className="display relative z-10 -mt-[0.34em] text-center text-[clamp(3.25rem,14.5vw,15rem)]">
        <span className="inline-block">Tanu</span> <em className="inline-block pr-[0.05em]">Sharma</em>
      </h1>

      <div className="relative z-10 mt-8 text-center">
        <p data-hero="rest" className="mx-auto max-w-md text-lg text-ivory/90">I design and build digital experiences, full-stack applications, and thoughtful products.</p>
        <div data-hero="rest" className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <a href="#projects" className="btn-pill">Explore My Work <span aria-hidden="true">↓</span></a>
          <a href="#contact" className="link-line">Contact Me <span aria-hidden="true">↗</span></a>
        </div>
      </div>

      <p data-hero="hint" className="label relative z-10 mt-12 text-center"><span className="scroll-hint" aria-hidden="true" /> Scroll to discover</p>
    </section>
  );
}
