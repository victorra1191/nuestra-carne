/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Nueva Paleta Roja - Nuestra Carne
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#c53030', // Rojo principal (similar a FOLDCOTONE 1082)
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#651c1c',
        },
        wine: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#8b2635', // Vino (similar a FOLDCOTONE 3344)
          600: '#7c1f2a',
          700: '#6d1b25',
          800: '#5e1720',
          900: '#4f141b',
        },
        accent: {
          50: '#fef7f3',
          100: '#feeee8',
          200: '#fdd5c4',
          300: '#fcba9f',
          400: '#fa8f56',
          500: '#e6b3b8', // Rojo 20% (similar a FOLDCOTONE 1054)
          600: '#d19ca3',
          700: '#bc858e',
          800: '#a76e79',
          900: '#925764',
        },
        rustic: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373', // Neutro cálido
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
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