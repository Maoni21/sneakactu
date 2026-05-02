/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Archivo Black', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['Archivo', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Bricolage Grotesque', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        // Brand
        ink:    '#0A0A0A',
        paper:  '#F7F5F0',
        orange: '#C8102E',
        'orange-dark': '#8E0A20',
        yellow: '#FFD400',
        blue:   '#1A3DFF',
        // Neutrals
        'n-0':   '#FFFFFF',
        'n-50':  '#F7F5F0',
        'n-100': '#EFECE5',
        'n-200': '#DDD8CD',
        'n-300': '#BDB6A8',
        'n-400': '#8E8778',
        'n-500': '#5F584C',
        'n-600': '#3D362C',
        'n-700': '#1F1B14',
        'n-900': '#0A0A0A',
      },
      borderRadius: {
        none: '0',
        sm:   '2px',
        DEFAULT: '4px',
        lg:   '8px',
        pill: '999px',
      },
    },
  },
  plugins: [],
}
