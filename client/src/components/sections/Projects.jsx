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

function ProjectAction({ href, label }) {
  if (href) {
    return <a className="project-action" href={href} target="_blank" rel="noreferrer">{label} <span aria-hidden="true">↗</span></a>;
  }

  return <span className="project-action project-action-disabled" aria-disabled="true">{label} <span className="normal-case tracking-normal">Coming soon</span></span>;
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
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
                        <ProjectAction href={p.live} label="Live Project" />
                        <ProjectAction href={p.source} label="GitHub" />
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
