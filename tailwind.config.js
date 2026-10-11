/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF8F5',
          200: '#F4EFEB',
          300: '#EBE3DC',
          400: '#DFD4CA',
        },
        blush: {
          50: '#FCF8F6',
          100: '#F8EDE7',
          200: '#F0DDD3',
          300: '#E4C7B8',
          400: '#D5AD9B',
          500: '#C28F79',
        },
        plum: {
          50: '#F7F1F3',
          100: '#EDDFE4',
          200: '#DEC2CC',
          300: '#C59AA9',
          400: '#A4687F',
          600: '#6C2540',
          700: '#541D32',
          800: '#421627',
          900: '#32111E',
          950: '#200A13',
        },
        espresso: {
          50: '#F6F4F3',
          100: '#E7E3E1',
          200: '#CFC7C4',
          300: '#AEA29D',
          400: '#887771',
          500: '#685954',
          600: '#514541',
          700: '#3E3431',
          800: '#2C2523',
          900: '#1F1A18',
          950: '#14100F',
        },
        champagne: {
          100: '#F6EEDB',
          200: '#EBDCB9',
          300: '#DEC591',
          400: '#CBA868',
          500: '#B8924B',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(66, 22, 39, 0.05)',
        'elevated': '0 10px 30px -4px rgba(31, 26, 24, 0.08), 0 4px 10px -2px rgba(31, 26, 24, 0.04)',
        'modal': '0 20px 45px -10px rgba(32, 10, 19, 0.25)',
      }
    },
  },
  plugins: [],
}
