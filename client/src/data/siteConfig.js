import { FaGithub, FaLinkedinIn, FaDiscord } from 'react-icons/fa';

export const siteConfig = {
  name: 'Tanu Sharma',
  role: 'Full Stack Product Builder',
  github: 'https://github.com/DeveloperTanu',
  linkedin: 'https://www.linkedin.com/in/tanu-sharma-1b9b36417/',
  discordId: '1480430529844220038',
  portrait: '/images/tanu-portrait.jpg',
  nav: [
    { label: 'Projects', href: '#projects' },
    { label: 'Mini Projects', href: '#mini-projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
};

export const socials = [
  { label: 'GitHub', href: siteConfig.github, icon: FaGithub, color: 'rgb(var(--ivory))', external: true },
  { label: 'LinkedIn', href: siteConfig.linkedin, icon: FaLinkedinIn, color: '#0A66C2', external: true },
  { label: 'Discord', href: `https://discord.com/users/${siteConfig.discordId}`, icon: FaDiscord, color: '#5865F2', external: true },
];
