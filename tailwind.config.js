/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: { DEFAULT: '#D9480F', tint: '#FFEDE4' },
        ink: '#0E1A2B',
        muted: '#5A6676',
        canvas: '#F6F7F9',
        surface: '#FFFFFF',
        success: '#14663B',
        danger: '#B42318',
        wash: '#FFD8C2',
      },


      fontFamily: {
        sans: ['PlusJakartaSans_500Medium'],
        'sans-semibold': ['PlusJakartaSans_600SemiBold'],
        'sans-bold': ['PlusJakartaSans_700Bold'],
      },

      fontSize: {
        h1: ['30px', { lineHeight: '35px', letterSpacing: '-0.6px' }],
        h2: ['20px', { lineHeight: '24px' }],
        body: ['14px', { lineHeight: '20px' }],
        caption: ['14px', { lineHeight: '20px' }],
      },

      borderRadius: {
        pill: '999px',
        card: '24px',
        field: '20px',
        chip: '999px',
      },


      boxShadow: {
        soft: '0 10px 30px rgba(20, 20, 40, 0.08)',
        cta: '0 8px 20px rgba(217, 72, 15, 0.28)',
      },
    },
  },
  plugins: [],
};