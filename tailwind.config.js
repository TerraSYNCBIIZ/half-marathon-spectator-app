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
          DEFAULT: '#6D28D9',
          dark: '#5B21B6',
        },
        secondary: {
          DEFAULT: '#EDE9FE',
        },
        background: {
          DEFAULT: '#F9FAFB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        },
        error: {
          DEFAULT: '#EF4444',
        },
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        h2: ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        body: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        caption: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
      borderRadius: {
        small: '0.25rem',
        medium: '0.5rem',
        large: '0.75rem',
      },
      boxShadow: {
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },
    },
  },
  plugins: [],
}

