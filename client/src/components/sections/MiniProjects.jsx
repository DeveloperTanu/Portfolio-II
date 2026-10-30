import { Fragment, useRef, useState } from 'react';
import gsap from 'gsap';
import useReveal from '../../hooks/useReveal.js';
import { useMotion } from '../../context/MotionContext.jsx';
import { miniFilters, miniProjects } from '../../data/miniProjects.js';

const TOKEN = /(\b(?:const|let|function|return|import|from|def|for|in|if|else|export|as)\b|=>|'[^']*'|"[^"]*"|`[^`]*`|\b\d+\b)/g;

function Code({ source }) {
  return (
    <pre className="code-body">
      <code>
        {source.split(TOKEN).map((part, i) => {
          if (!part) return null;
          if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
          const kind = /^['"`]/.test(part) ? 'tok-str' : /^\d/.test(part) ? 'tok-num' : 'tok-key';
          return <span key={i} className={kind}>{part}</span>;
        })}
      </code>
    </pre>
  );
}

export default function MiniProjects() {
  const ref = useRef(null);
  const [filter, setFilter] = useState('All');
  const [touched, setTouched] = useState(false);
  const { motion } = useMotion();
  useReveal(ref);

  const visible = miniProjects.filter((p) => filter === 'All' || p.language === filter);

  const onMove = (e) => {
    const card = e.target.closest('.tilt-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
    if (motion && window.matchMedia('(pointer: fine)').matches) {
      gsap.to(card, { rotateY: (px - 0.5) * 8, rotateX: (0.5 - py) * 8, duration: 0.4, ease: 'power2.out', transformPerspective: 900 });
    }
  };
  const onLeave = (e) => {
    const card = e.target.closest('.tilt-card');
    if (card) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
  };

  return (
    <section id="mini-projects" ref={ref} className="section">
      <div className="wrap">
        <p data-reveal className="label-amber">02 / Mini Projects</p>
        <h2 data-reveal="blur" className="h2">Small builds, <em>sharp code.</em></h2>
        <p data-reveal className="mt-5 max-w-md text-stone md:mx-0">Little experiments and code pieces I build to practise one idea at a time.</p>

        <div data-reveal role="tablist" aria-label="Filter mini projects" className="mt-12 flex flex-wrap justify-center gap-2 md:justify-start">
          {miniFilters.map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} onClick={() => { setFilter(f); setTouched(true); }} className={`chip-tab ${filter === f ? 'chip-tab-on' : ''}`}>{f}</button>
          ))}
        </div>

        <div key={filter} data-stagger onPointerMove={onMove} onPointerLeave={onLeave} className="mt-10 grid gap-5 text-left md:grid-cols-2 xl:grid-cols-3">
          {visible.map((p, i) => (
            <article key={p.id} data-item className={`tilt-card ${touched ? 'card-pop' : ''}`} style={touched ? { animationDelay: `${i * 80}ms` } : undefined}>
              <div className="flex items-center justify-between">
                <span className="label">0{i + 1}</span>
                <span className="label-amber">{p.language}</span>
              </div>
              <h3 className="display mt-4 text-3xl">{p.name}</h3>
              <p className="mt-3 text-sm text-stone">{p.description}</p>
              <div className="code-window">
                <div className="code-bar" aria-hidden="true"><i /><i /><i /></div>
                <Code source={p.code} />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-2">
                  {p.tags.map((t) => <li key={t} className="tag">{t}</li>)}
                </ul>
                <div className="flex gap-4">
                  {p.live && <a className="link-line" href={p.live} target="_blank" rel="noreferrer">Demo ↗</a>}
                  {p.source && <a className="link-line" href={p.source} target="_blank" rel="noreferrer">Code ↗</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
