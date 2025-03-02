/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#2383E2',
        dark: {
          bg: '#121314',
          text: '#FFFEFC',
          border: '#434343',
          secondary: '#9A9A9A',
        },
        light: {
          bg: '#FFFEFC',
          text: '#040404',
          border: '#E6E3DE',
          secondary: '#ADABA9',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

