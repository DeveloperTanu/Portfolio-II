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
          <h2 data-reveal="blur" className="h2">I learn by <em>building things</em> people can use.</h2>
          <p data-reveal className="mx-auto mt-8 max-w-lg text-lg text-ivory/90 md:mx-0">I&rsquo;m a B.Tech student in Computer Science and Engineering, working as a full stack product builder.</p>
          <p data-reveal className="mx-auto mt-5 max-w-lg text-stone md:mx-0">I move between design and development: shaping interfaces in Figma and Framer, then building them with React and Node. I&rsquo;m equally curious about backend systems and about AI and data work in Python. I prefer practical projects over theory alone.</p>
          <a data-reveal href="#contact" className="link-line mt-8">Say hello <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
