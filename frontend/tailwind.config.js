/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        linen: {
          DEFAULT: 'var(--color-page)',
          50: 'var(--color-surface)',
        },
        surface: 'var(--color-surface)',
        stone: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-900)',
        },
        sage: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
        },
        normal: {
          DEFAULT: 'var(--color-normal)',
        },
        borderline: {
          DEFAULT: 'var(--color-borderline)',
        },
        critical: {
          DEFAULT: 'var(--color-critical)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
        },
        'normal-tint': 'var(--color-normal-tint)',
        'borderline-tint': 'var(--color-borderline-tint)',
        'critical-tint': 'var(--color-critical-tint)',
        'info-tint': 'var(--color-info-tint)',
      },
      boxShadow: {
        lift: '0 12px 28px -16px var(--color-shadow)',
      },
    },
  },
  plugins: [],
};
