// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: "#F5F5F7",
          light: "#FAF9F6",
        },
        cream: {
          DEFAULT: "#FDFCF0",
        },
        pearl: {
          DEFAULT: "#FDFDFD",
        },
        charcoal: {
          DEFAULT: "#2A2A2A",
          light: "#4A4A4A",
        },
        gold: {
          DEFAULT: "#C5A880",
          light: "#D4BC9B",
        },
        rose: {
          DEFAULT: "#E8A0B0",
          light: "#F2C4CE",
          dark: "#D4748A",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ["Montserrat", "sans-serif"],
        brand: ["BingoDilan", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(0,0,0,0.08)",
        glow: "0 0 20px rgba(197, 168, 128, 0.4)",
        rose: "0 0 20px rgba(249, 187, 209, 0.45)", // Para hover states con rosa
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};
