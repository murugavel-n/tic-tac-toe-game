import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        x: {
          DEFAULT: '#1d4ed8',
          light: '#dbeafe',
        },
        o: {
          DEFAULT: '#b91c1c',
          light: '#fee2e2',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
