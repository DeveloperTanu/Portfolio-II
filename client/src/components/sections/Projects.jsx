import { useRef, useState } from 'react';
import useReveal from '../../hooks/useReveal.js';
import { projects } from '../../data/projects.js';

function Preview({ index }) {
  const hue = ['#E8894A', '#A7A097', '#C96F35', '#F1EDE5'][index % 4];
  return (
    <div aria-hidden="true" className="relative h-28 w-full overflow-hidden border border-line md:h-full md:min-h-[8rem]" style={{ background: `radial-gradient(circle at ${30 + index * 15}% 60%, ${hue}33, transparent 60%), radial-gradient(rgb(var(--ivory) / .13) 1px, transparent 1.4px) 0 0/10px 10px` }}>
      <span className="display absolute bottom-2 left-3 text-5xl italic text-ivory/30">0{index + 1}</span>
    </div>
  );
}

function Link({ href, label }) {
  return href ? <a className="link-line" href={href} target="_blank" rel="noreferrer">{label} ↗</a> : null;
}

export default function Projects() {
  const ref = useRef(null);
  const [open, setOpen] = useState(projects[0].id);
  useReveal(ref);
  return (
    <section id="projects" ref={ref} className="section">
      <div className="wrap">
        <p data-reveal className="label-amber">01 / Projects</p>
        <h2 data-reveal="blur" className="h2">Selected <em>work.</em></h2>
        <p data-reveal className="mt-5 max-w-md text-stone">A few of the products I am building, from first sketch to working code.</p>
        <ul className="mt-14 border-t border-line">
          {projects.map((p, i) => {
            const isOpen = open === p.id;
            return (
              <li key={p.id} data-reveal className="project-row border-b border-line">
                <button className="flex w-full flex-col items-center gap-2 py-7 text-center md:flex-row md:items-baseline md:gap-8 md:text-left" aria-expanded={isOpen} aria-controls={`proj-${p.id}`} onClick={() => setOpen(isOpen ? '' : p.id)}>
                  <span className="label md:w-8">0{i + 1}</span>
                  <span className={`display project-name flex-1 text-[clamp(1.8rem,4.5vw,4rem)] transition-colors ${isOpen ? 'text-amber italic' : ''}`}>{p.name}</span>
                  <span className="label hidden md:inline">{p.category}</span>
                  <span className="label-amber">{p.status}</span>
                </button>
                {isOpen && (
                  <div id={`proj-${p.id}`} className="open-panel grid gap-8 pb-10 text-center md:grid-cols-[1fr_1.4fr] md:pl-16 md:text-left">
                    <Preview index={i} />
                    <div>
                      <p className="mx-auto max-w-xl text-lg md:mx-0">{p.description}</p>
                      <p className="label mt-5">{p.stack.join(' / ')}</p>
                      {p.caseStudy && (
                        <dl className="mt-8 grid gap-5 text-sm text-stone">
                          {[['Problem', p.caseStudy.problem], ['Solution', p.caseStudy.solution], ['Approach', p.caseStudy.approach]].map(([k, v]) => (
                            <div key={k}><dt className="label-amber">{k}</dt><dd className="mx-auto mt-1 max-w-xl md:mx-0">{v}</dd></div>
                          ))}
                        </dl>
                      )}
                      <div className="mt-8 flex flex-wrap justify-center gap-6 md:justify-start">
                        <Link href={p.live} label="Live demo" />
                        <Link href={p.source} label="Source" />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
