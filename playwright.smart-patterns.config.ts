import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/smart-tests',
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['junit', { outputFile: 'test-results/playwright-smart-junit.xml' }]],
  use: {
    baseURL: 'http://localhost:1111',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:1111',
    reuseExistingServer: true,
  },
})
