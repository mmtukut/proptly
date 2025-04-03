/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
      extend: {
          screens: {
              'xs': '640px',
              'sm': '768px',
              'md': '1024px',
              'lg': '1280px',
              'xl': '1536px',
          },
          colors: {
              brand: {
                  DEFAULT: '#0e109f',
                  light: '#0e109f/10',
                  dark: '#0c0d8a',
              },
          },
          fontFamily: {
              sans: ['Poppins', 'system-ui', 'sans-serif'],
              display: ['Poppins', 'system-ui', 'sans-serif'],
          },
      },
  },
  plugins: [
    require('@tailwindcss/typography'),

  ],
};