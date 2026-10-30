import { siteConfig } from '../../data/siteConfig.js';
import SocialLinks from '../ui/SocialLinks.jsx';

export default function Footer() {
  return (
    <footer className="relative border-t border-line px-6 pb-10 pt-20 text-center md:px-16 md:text-left">
      <div className="wrap">
        <p className="display text-[clamp(2.5rem,8vw,7rem)]">Let&rsquo;s build <em>something.</em></p>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl italic">{siteConfig.name}</p>
            <p className="label mt-2">{siteConfig.role}</p>
          </div>
          <ul className="grid gap-2 text-sm text-stone">
            {siteConfig.nav.map((l) => <li key={l.href}><a className="transition hover:text-ivory" href={l.href}>{l.label}</a></li>)}
          </ul>
          <div><p className="label mb-4">Connect</p><SocialLinks className="justify-center md:justify-start" /></div>
        </div>
        <p className="label mt-14">&copy; {new Date().getFullYear()} {siteConfig.name}</p>
      </div>
    </footer>
  );
}
