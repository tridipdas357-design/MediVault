/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 10px 30px -12px rgba(34, 211, 238, 0.25)',
      },
    },
  },
  plugins: [],
};
