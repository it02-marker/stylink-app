/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#0a192f',     // Deep Enterprise Navy
          navyDark: '#060f1c',
          orange: '#ea580c',   // Burnt Orange/Yellow accent
          slate: '#f8fafc',    // Very light slate for backgrounds
          border: '#e2e8f0'    // Crisp border color
        }
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
      }
    },
  },
  plugins: [],
}

