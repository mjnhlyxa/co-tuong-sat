/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#1A1210',
        'surface': '#2C1810',
        'board': '#8B5A2B',
        'board-lines': '#5C3D1E',
        'gold': '#D4AF37',
        'gold-hover': '#E5C145',
        'red': '#C41E3A',
        'red-dark': '#8B1528',
        'black-piece': '#1A1A1A',
        'black-light': '#3A3A3A',
        'river': '#4A90D9',
        'text-primary': '#F5E6D3',
        'text-secondary': '#A89080',
        'text-muted': '#6B5D50',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};