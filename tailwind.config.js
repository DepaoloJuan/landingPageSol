/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: '#F5F5F7',
          light: '#FAF9F6' // Even softer
        },
        cream: {
          DEFAULT: '#FDFCF0'
        },
        pearl: {
          DEFAULT: '#FDFDFD'
        },
        charcoal: {
          DEFAULT: '#2A2A2A',
          light: '#4A4A4A'
        },
        gold: {
          DEFAULT: '#C5A880',
          light: '#D4BC9B'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(197, 168, 128, 0.4)'
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px'
      }
    },
  },
  plugins: [],
}
