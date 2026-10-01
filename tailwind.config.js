/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        '3d-green': '0 4px 0 #059669',
        '3d-indigo': '0 4px 0 #4338ca',
        '3d-amber': '0 4px 0 #d97706',
        '3d-rose': '0 4px 0 #e11d48',
        '3d-slate': '0 4px 0 #334155',
        '3d-white': '0 4px 0 #cbd5e1',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        pop: 'pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        bounceShort: 'bounceShort 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
