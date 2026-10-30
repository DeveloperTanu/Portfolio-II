import {
  SiHtml5, SiCss3, SiJavascript, SiReact, SiNextdotjs, SiTailwindcss, SiNodedotjs, SiExpress,
  SiMongodb, SiMysql, SiFigma, SiFramer, SiAdobeillustrator, SiPython, SiNumpy, SiPandas,
  SiScikitlearn, SiLangchain, SiC, SiLinux, SiGnubash,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

export const skillCategories = [
  { id: 'frontend', title: 'Frontend Development', items: [
    { name: 'HTML', icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS', icon: SiCss3, color: '#1572B6' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'React.js', icon: SiReact, color: '#61DAFB' },
    { name: 'Next.js', icon: SiNextdotjs, color: 'rgb(var(--ivory))' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  ] },
  { id: 'backend', title: 'Backend Development', items: [
    { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
    { name: 'Express.js', icon: SiExpress, color: 'rgb(var(--ivory))' },
  ] },
  { id: 'databases', title: 'Databases', items: [
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
  ] },
  { id: 'design', title: 'Product Design and Prototyping', items: [
    { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
    { name: 'Framer', icon: SiFramer, color: 'rgb(var(--ivory))' },
    { name: 'Adobe Illustrator', icon: SiAdobeillustrator, color: '#FF9A00' },
  ] },
  { id: 'data', title: 'Python, AI and Data Science', items: [
    { name: 'Python', icon: SiPython, color: '#3776AB' },
    { name: 'NumPy', icon: SiNumpy, color: '#4DABCF' },
    { name: 'pandas', icon: SiPandas, color: '#A78BFA' },
    { name: 'scikit-learn', icon: SiScikitlearn, color: '#F7931E' },
    { name: 'LangChain', icon: SiLangchain, color: '#1C9C8C' },
  ] },
  { id: 'systems', title: 'Programming Languages and Systems', items: [
    { name: 'Java', icon: FaJava, color: '#ED8B00' },
    { name: 'C', icon: SiC, color: '#A8B9CC' },
    { name: 'Linux OS', icon: SiLinux, color: '#FCC624' },
    { name: 'Shell scripting', icon: SiGnubash, color: '#4EAA25' },
  ] },
];
