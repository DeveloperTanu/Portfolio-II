import { useRef } from 'react';
import useThreeScene from '../../hooks/useThreeScene.js';
import { createParticleTorusKnot } from '../../lib/scenes.js';

export default function ParticleTorusKnot({ className = '' }) {
  const ref = useRef(null);
  useThreeScene(ref, createParticleTorusKnot);
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
