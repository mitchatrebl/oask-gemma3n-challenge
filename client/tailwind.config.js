/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'text-xs',
    'text-sm', 
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'px-2',
    'px-3',
    'px-4',
    'px-5',
    'px-6',
    'px-8',
    'py-1',
    'py-2',
    'py-3',
    'py-4',
    'py-5',
    // Add all combinations that might be used
    'px-2 py-1',
    'px-3 py-2',
    'px-4 py-2',
    'px-4 py-3',
    'px-5 py-3',
    'px-6 py-3',
    'px-6 py-4',
    'px-8 py-4'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
