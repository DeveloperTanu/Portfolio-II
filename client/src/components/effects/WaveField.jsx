import { useRef } from 'react';
import useThreeScene from '../../hooks/useThreeScene.js';
import { createWaveField } from '../../lib/scenes.js';

export default function WaveField({ className = '' }) {
  const ref = useRef(null);
  useThreeScene(ref, createWaveField);
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
