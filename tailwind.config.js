/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          sakura: {
            50: '#fff1f3',
            100: '#ffe4e8',
            200: '#fecdd6',
            300: '#fda4b7',
            400: '#fb7195',
            500: '#f6366f',
            600: '#e11d5e',
            700: '#be124f',
            800: '#9f1148',
            900: '#861141',
          },
          sky: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
          night: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        },
        fontFamily: {
          'japanese': ['Noto Sans JP', 'sans-serif'],
        },
        animation: {
          'float': 'float 3s ease-in-out infinite',
          'float-delayed': 'float 3s ease-in-out 0.5s infinite',
          'float-slow': 'float 6s ease-in-out infinite',
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.4s ease-out',
          'glow': 'glow 2s ease-in-out infinite alternate',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'spin-slow': 'spin 3s linear infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          slideUp: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          glow: {
            '0%': { boxShadow: '0 0 5px rgba(251, 113, 149, 0.5)' },
            '100%': { boxShadow: '0 0 20px rgba(251, 113, 149, 0.8), 0 0 30px rgba(251, 113, 149, 0.4)' },
          }
        }
      },
    },
    plugins: [],
  }