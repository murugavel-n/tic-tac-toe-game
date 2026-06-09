import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? '/',
  server: {
    port: 1111,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/tests-smart/**'],
    reporters: ['default', ['junit', { outputFile: 'test-results/vitest-junit.xml' }]],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
