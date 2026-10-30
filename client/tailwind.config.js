export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        ivory: 'rgb(var(--ivory) / <alpha-value>)',
        stone: 'rgb(var(--stone) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Instrument Serif"', '"Bodoni Moda"', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
};
