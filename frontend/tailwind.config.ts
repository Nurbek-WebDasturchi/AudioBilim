import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#080810',
        panel: '#11111d',
        panelSoft: '#171724',
        line: 'rgba(255,255,255,0.1)',
        brand: '#7dd3fc',
        coral: '#fb7185',
        mint: '#34d399',
        gold: '#fbbf24'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(125, 211, 252, 0.18)',
        card: '0 18px 60px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
