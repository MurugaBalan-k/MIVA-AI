/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        miva: {
          navy: '#06183D',
          royal: '#0759D9',
          electric: '#008CFF',
          cyan: '#00CFFF',
          sky: '#8DD9FF',
          pale: '#F2F9FF',
          white: '#FFFFFF',
          darkBlue: '#0A2558',
          cardBorder: '#D8ECFF',
          cardBg: 'rgba(255, 255, 255, 0.85)',
          muted: '#5A6F8C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'miva-soft': '0 10px 30px -10px rgba(0, 140, 255, 0.12), 0 4px 12px rgba(6, 24, 61, 0.04)',
        'miva-glow': '0 0 25px rgba(0, 207, 255, 0.35)',
        'miva-hover': '0 16px 36px -12px rgba(7, 89, 217, 0.22)',
        'phone-frame': '0 25px 60px -15px rgba(6, 24, 61, 0.35), 0 0 40px rgba(0, 140, 255, 0.15)'
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem'
      }
    },
  },
  plugins: [],
}
