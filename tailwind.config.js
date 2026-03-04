/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#062767',
          50: '#e8eef8',
          100: '#c5d4ed',
          200: '#9eb4de',
          300: '#7694ce',
          400: '#4e74bf',
          500: '#2654af',
          600: '#062767',
          700: '#051f52',
          800: '#04183e',
          900: '#03102a',
        },
        gold: {
          DEFAULT: '#b19763',
          50: '#f9f5ed',
          100: '#f0e6d0',
          200: '#e3cfa7',
          300: '#d6b87e',
          400: '#c9a170',
          500: '#b19763',
          600: '#9a824f',
          700: '#7a673e',
          800: '#5a4c2e',
          900: '#3a311e',
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'opensans': ['"Open Sans"', 'sans-serif'],
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
        '110': '1.10',
      },
      backdropBlur: {
        '10': '10px',
      },
      letterSpacing: {
        tighter: '-0.025em',
      },
      strokeWidth: {
        '2': '2',
      },
      boxShadow: {
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '7xl': '80rem',
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
  safelist: [
    'transform',
    'transition-all',
    'duration-300',
    'hover:scale-105',
    'hover:-translate-y-1',
    'hover:-translate-y-2',
    'hover:-translate-y-4',
    'scale-105',
    'rotate-180',
    {
      pattern: /bg-(red|green|blue|yellow|purple|indigo|pink|orange|teal|cyan|emerald|slate|gray|navy|gold)-(50|100|500|600|700|800|900)/,
    },
    {
      pattern: /border-(red|green|blue|yellow|purple|indigo|pink|orange|teal|cyan|emerald|slate|gray|navy|gold)-(200|300|500)/,
    },
    {
      pattern: /text-(red|green|blue|yellow|purple|indigo|pink|orange|teal|cyan|emerald|slate|gray|navy|gold)-(100|600|700|800|900)/,
    },
    {
      pattern: /from-(red|green|blue|yellow|purple|indigo|pink|orange|teal|cyan|emerald|slate|gray|navy|gold)-(400|500|600|700)/,
    },
    {
      pattern: /to-(red|green|blue|yellow|purple|indigo|pink|orange|teal|cyan|emerald|slate|gray|navy|gold)-(400|500|600|700)/,
    },
    {
      pattern: /via-(red|green|blue|yellow|purple|indigo|pink|orange|teal|cyan|emerald|slate|gray|navy|gold)-(500|600)/,
    }
  ]
}
