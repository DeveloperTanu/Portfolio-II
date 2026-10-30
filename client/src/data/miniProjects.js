export const miniFilters = ['All', 'JavaScript', 'React', 'Python'];

export const miniProjects = [
  {
    id: 'debounced-search',
    name: 'Debounced Search',
    language: 'JavaScript',
    description: 'A search box that waits for you to stop typing before it fires a request.',
    tags: ['Vanilla JS', 'Performance'],
    live: '',
    source: '',
    code: `function debounce(fn, wait = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}`,
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    language: 'JavaScript',
    description: 'Generates strong passwords with adjustable length and character sets.',
    tags: ['Vanilla JS', 'Crypto API'],
    live: '',
    source: '',
    code: `const pool = 'abcXYZ123!@#';
function generate(len = 16) {
  const bytes = crypto.getRandomValues(new Uint32Array(len));
  return [...bytes].map((b) => pool[b % pool.length]).join('');
}`,
  },
  {
    id: 'todo-board',
    name: 'Todo Board',
    language: 'React',
    description: 'A small task board with add, complete and remove, built on hooks.',
    tags: ['React', 'Hooks'],
    live: '',
    source: '',
    code: `const [todos, setTodos] = useState([]);
const add = (text) =>
  setTodos((t) => [...t, { id: Date.now(), text, done: false }]);
const toggle = (id) =>
  setTodos((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));`,
  },
  {
    id: 'theme-switcher',
    name: 'Theme Switcher',
    language: 'React',
    description: 'Light and dark mode that remembers your choice and respects system settings.',
    tags: ['React', 'Context'],
    live: '',
    source: '',
    code: `const ThemeContext = createContext('dark');
export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) };
}`,
  },
  {
    id: 'expense-splitter',
    name: 'Expense Splitter',
    language: 'Python',
    description: 'Works out who owes whom after a group trip, with the fewest transfers.',
    tags: ['Python', 'Algorithms'],
    live: '',
    source: '',
    code: `def split(paid: dict[str, float]) -> dict[str, float]:
    share = sum(paid.values()) / len(paid)
    return {name: round(amount - share, 2) for name, amount in paid.items()}`,
  },
  {
    id: 'csv-cleaner',
    name: 'CSV Cleaner',
    language: 'Python',
    description: 'Drops duplicates, trims whitespace and fixes types in messy CSV files.',
    tags: ['Python', 'pandas'],
    live: '',
    source: '',
    code: `import pandas as pd

df = pd.read_csv('data.csv')
df = df.drop_duplicates().apply(lambda c: c.str.strip() if c.dtype == 'object' else c)
df.to_csv('clean.csv', index=False)`,
  },
];
