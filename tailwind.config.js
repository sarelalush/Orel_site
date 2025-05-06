/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF8C00',
          light: '#FFA533',
          dark: '#CC7000'
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#333333'
        }
      }
    },
  },
  plugins: [],
}