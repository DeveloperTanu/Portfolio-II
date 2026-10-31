import { useRef } from 'react';
import ParticleSphere from '../effects/ParticleSphere.jsx';
import useReveal from '../../hooks/useReveal.js';

export default function About() {
  const ref = useRef(null);
  useReveal(ref);
  return (

    <section id="about" ref={ref} className="section relative overflow-x-clip">
      <div className="wrap grid items-center gap-12 md:grid-cols-[1fr_1.1fr]">
        <ParticleSphere className="h-[46vh] w-full md:h-[64vh]" />
        <div className="relative z-10">
          <p data-reveal className="label-amber">04 / About</p>
          <h2 data-reveal="blur" className="h2">I’m a student <em>who learns by building real things.</em></h2>
          <p data-reveal className="mx-auto mt-8 max-w-lg text-lg text-ivory/90 md:mx-0">I&rsquo;m a Computer Science and Engineering student interested in turning ideas into useful digital products. <span className="font-medium text-amber">Currently I&rsquo;m pursuing my BTECH degree at VGUJ College.</span></p>
          <p data-reveal className="mx-auto mt-5 max-w-lg text-stone md:mx-0">I enjoy working across design and development — from creating interfaces in Figma to building applications with React and Node.js. I'm also exploring backend engineering, AI automation, and Python to understand how things work beyond the user interface.</p>
          <a data-reveal href="#contact" className="link-line mt-8">Say hello <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
