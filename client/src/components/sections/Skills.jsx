import { useRef, useState } from 'react';
import WaveField from '../effects/WaveField.jsx';
import useReveal from '../../hooks/useReveal.js';
import { skillCategories } from '../../data/skills.js';

export default function Skills() {
  const ref = useRef(null);
  const [active, setActive] = useState('all');
  useReveal(ref);
  const shown = active === 'all' ? skillCategories : skillCategories.filter((c) => c.id === active);
  return (
    <section id="skills" ref={ref} className="section relative overflow-hidden">
      <WaveField className="absolute inset-0 opacity-20" />
      <div className="wrap relative z-10">
        <p data-reveal className="label-amber">03 / Skills</p>
        <h2 data-reveal="blur" className="h2 max-w-4xl">Different tools. <em>One goal:</em> building useful products.</h2>
        <div role="tablist" aria-label="Skill categories" data-reveal className="mt-12 flex flex-wrap justify-center gap-2 md:justify-start">
          {[{ id: 'all', title: 'All' }, ...skillCategories].map((c) => (
            <button key={c.id} role="tab" aria-selected={active === c.id} onClick={() => setActive(c.id)} className={`chip-tab ${active === c.id ? 'chip-tab-on' : ''}`}>{c.title}</button>
          ))}
        </div>
        <div key={active} className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {shown.map((c, ci) => (
            <div key={c.id} className="skill-group border-t border-line pt-5" style={{ animationDelay: `${ci * 90}ms` }}>
              <h3 className="label !text-ivory">{c.title}</h3>
              <ul className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                {c.items.map(({ name, icon: Icon, color }) => (
                  <li key={name} className="skill-chip" style={{ '--brand': color }}>
                    <Icon aria-hidden="true" className="skill-icon text-2xl" />
                    <span className="text-sm">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
