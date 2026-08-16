import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        lift: 'var(--shadow-lift)',
      },
      borderRadius: {
        panel: '20px',
        card: '20px',
        pill: '9999px',
      },
      transitionTimingFunction: {
        primary: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      colors: {
        // Semantic tokens resolved from CSS variables in app/globals.css, so a
        // single utility covers light and dark. See the header comment there.
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--c-accent-ink) / <alpha-value>)',
        positive: 'rgb(var(--c-positive) / <alpha-value>)',
        critical: 'rgb(var(--c-critical) / <alpha-value>)',
        // Literal brand blue, kept for the few places that need a fixed value
        // (focus rings on tinted fills, gradients).
        'electric-blue': '#0066FF',
      },
    },
  },
  plugins: [],
};

export default config;
