import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        beige: {
          50:  '#faf8f5',
          100: '#f5f0e8',
          200: '#ede4d3',
          300: '#dfd1b8',
          400: '#cdb897',
          500: '#b99b75',
          600: '#a07f5a',
          700: '#86654a',
          800: '#6e5140',
          900: '#5a4236',
        },
        earth: {
          50:  '#f7f5f2',
          100: '#edeae4',
          200: '#d9d3c8',
          300: '#c0b6a6',
          400: '#a49383',
          500: '#8d7a6a',
          600: '#7a6759',
          700: '#65544a',
          800: '#534540',
          900: '#453a37',
        },
        sage: {
          50:  '#f2f5f2',
          100: '#e1eae1',
          200: '#c4d5c5',
          300: '#9bb99d',
          400: '#6e9870',
          500: '#4d7a50',
          600: '#3b613e',
          700: '#304e33',
          800: '#283f2b',
          900: '#213424',
        },
        bark: '#3d2b1f',
        cream: '#faf8f5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};
export default config;
