import { skillCategories } from '../../data/skills.js';

const all = skillCategories.flatMap((c) => c.items);

export default function Marquee() {
  const row = (hidden) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {all.map(({ name, icon: Icon, color }) => (
        <li key={name} className="marquee-item" style={{ '--brand': color }}>
          <Icon className="text-2xl" /><span className="label">{name}</span>
        </li>
      ))}
    </ul>
  );
  return <div className="marquee border-t border-line py-6" role="presentation">{row(false)}{row(true)}</div>;
}
