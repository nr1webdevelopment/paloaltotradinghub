import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          0: 'var(--bg-0)',
          1: 'var(--bg-1)',
          2: 'var(--bg-2)',
          3: 'var(--bg-3)',
        },
        line: { DEFAULT: 'var(--line)', soft: 'var(--line-soft)' },
        ink: {
          0: 'var(--text-0)',
          1: 'var(--text-1)',
          2: 'var(--text-2)',
          3: 'var(--text-3)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
          glow: 'var(--accent-glow)',
        },
        blue: {
          DEFAULT: 'var(--blue)',
          soft: 'var(--blue-soft)',
          glow: 'var(--blue-glow)',
        },
        warn: 'var(--warn)',
        danger: 'var(--danger)',
        gold: 'var(--gold)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Archivo Black"', 'Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '18px',
      },
      boxShadow: {
        glow: '0 0 24px -6px var(--accent-glow)',
      },
    },
  },
  plugins: [],
};

export default config;
