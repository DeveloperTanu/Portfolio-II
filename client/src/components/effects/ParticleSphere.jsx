import { useEffect, useRef, useState } from 'react';
import useThreeScene from '../../hooks/useThreeScene.js';
import { createParticleMesh } from '../../lib/scenes.js';
import { useMotion } from '../../context/MotionContext.jsx';

const BLEED = 0.3;
const MODES = [
  { id: 'I', label: 'Sphere' },
  { id: 'II', label: 'Tunnel' },
  { id: 'III', label: 'Galaxy' },
];

export default function ParticleSphere({ className = '' }) {
  const ref = useRef(null);
  const instRef = useRef(null);
  const [mode, setMode] = useState(0);
  const { motion } = useMotion();
  useThreeScene(ref, createParticleMesh, { zoom: 1 + BLEED * 2, hitRadius: 2.3, instRef });

  useEffect(() => { setMode(0); }, [motion]);

  const pick = (i) => {
    setMode(i);
    if (instRef.current) instRef.current.setMode(i);
  };

  return (
    <div className={`pointer-events-none relative ${className}`}>
      <div className="absolute" aria-hidden="true" style={{ inset: `-${BLEED * 100}%` }}>
        <canvas ref={ref} className="block h-full w-full" />
      </div>
      {motion && (
        <div role="group" aria-label="Mesh shape" className="pointer-events-auto absolute -bottom-11 left-1/2 flex -translate-x-1/2 gap-2">
          {MODES.map((m, i) => (
            <button key={m.id} type="button" aria-label={m.label} aria-pressed={mode === i} title={m.label} onClick={() => pick(i)} className={`chip-tab min-w-[2.75rem] font-mono ${mode === i ? 'chip-tab-on' : ''}`}>{m.id}</button>
          ))}
        </div>
      )}
    </div>
  );
}
