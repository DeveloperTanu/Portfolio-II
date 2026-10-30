import { socials } from '../../data/siteConfig.js';

export default function SocialLinks({ size = 'md', className = '', labels = false }) {
  const box = size === 'lg' ? 'h-14 w-14 text-2xl' : 'h-11 w-11 text-lg';
  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {socials.map(({ label, href, icon: Icon, color, external }) => (
        <li key={label}>
          <a href={href} aria-label={label} title={label} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            style={{ '--brand': color }}
            className={`social-icon inline-flex items-center justify-center gap-3 rounded-full border border-stone/30 bg-ivory/5 text-stone ${labels ? 'px-5 py-3 text-sm' : box}`}>
            <Icon aria-hidden="true" className={labels ? 'text-lg' : ''} />
            {labels && <span>{label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
