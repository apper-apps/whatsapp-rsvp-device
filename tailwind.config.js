/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        basecamp: {
          primary: '#F5F5DC',
          secondary: '#8B4513',
          tertiary: '#9CAF88',
          blue: '#6B7280',
          green: '#9CAF88',
          orange: '#D2691E',
          red: '#CD5C5C',
          yellow: '#DAA520',
          purple: '#9370DB',
          teal: '#5F9EA0',
          background: '#FEFDF8',
          light: '#F9F7F4',
          dark: '#5D4E37'
        },
        primary: {
          50: '#FEFDF8',
          100: '#F9F7F4',
          200: '#F5F5DC',
          300: '#E6E6D1',
          400: '#D4D4B8',
          500: '#C2C2A0',
          600: '#A8A887',
          700: '#8B8B6E',
          800: '#6D6D56',
          900: '#5D4E37'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }
    },
  },
  plugins: [],
}