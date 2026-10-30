import { useMotion } from '../../context/MotionContext.jsx';

export default function MotionToggle() {
  const { motion, toggle } = useMotion();
  return (
    <button onClick={toggle} aria-pressed={motion} className="label fixed bottom-4 right-4 z-50 border border-stone/30 bg-ink/80 px-4 py-3 backdrop-blur hover:border-amber hover:text-amber">
      Motion {motion ? 'On' : 'Off'}
    </button>
  );
}
