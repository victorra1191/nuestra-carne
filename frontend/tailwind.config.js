/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Rústico-Moderna para Carnicería
        primary: {
          50: '#fef7f3',
          100: '#fdeee6', 
          200: '#fbd6c5',
          300: '#f7b89d',
          400: '#f28c6b',
          500: '#ed6737', // Rojo cálido principal
          600: '#de5429',
          700: '#b94124',
          800: '#943624',
          900: '#783022',
        },
        rustic: {
          50: '#faf9f7',
          100: '#f2efeb',
          200: '#e6ddd4',
          300: '#d4c5b5',
          400: '#bfa48f',
          500: '#a68968', // Marrón cálido
          600: '#8f7355',
          700: '#755e47',
          800: '#5f4d3d',
          900: '#4d3f34',
        },
        accent: {
          50: '#f9f7f4',
          100: '#f0ebe3',
          200: '#e0d4c2',
          300: '#ccb798',
          400: '#b59867',
          500: '#a57c3c', // Dorado cálido
          600: '#8f6730',
          700: '#77542a',
          800: '#614528',
          900: '#4f3a24',
        }
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'rustic': '0 4px 20px rgba(139, 69, 19, 0.15)',
        'meat': '0 8px 32px rgba(237, 103, 55, 0.2)',
      },
      backgroundImage: {
        'wood-texture': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23d4c5b5\" fill-opacity=\"0.1\"%3E%3Cpath d=\"m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }
    },
  },
  plugins: [],
};