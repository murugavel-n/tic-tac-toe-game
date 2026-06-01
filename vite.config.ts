import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    reporters: ['default', ['junit', { outputFile: 'test-results/vitest-junit.xml' }]],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
