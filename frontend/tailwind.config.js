/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#050509',
          midnight: '#080B16',
          navy: '#0B1020',
          card: '#11162B',
          cardGlass: 'rgba(17, 22, 43, 0.72)',
          cardGlassHover: 'rgba(23, 30, 58, 0.85)'
        },
        brand: {
          purple: '#7C3AED',
          violet: '#A855F7',
          blue: '#2563EB',
          cyan: '#22D3EE',
          magenta: '#D946EF',
          emerald: '#10B981',
          amber: '#F59E0B',
          coral: '#F43F5E'
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(124, 58, 237, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.45)',
        'glow-magenta': '0 0 25px -5px rgba(217, 70, 239, 0.45)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
