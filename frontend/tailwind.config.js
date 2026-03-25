/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        socieco: {
          primary: '#D9ED92',
          secondary: '#F9A482',
          dark: '#2D4635',
          bg: '#FDFBF7',
          text: '#1A2F23',
          muted: '#4A5568',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], 
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
