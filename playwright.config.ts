import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'vite preview --port 3008',
    port: 3008,
    reuseExistingServer: !process.env.CI,
  },
  testDir: './tests',
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: true,
  timeout: 30000,
  reporter: [['list'], ['html']],
  use: {
    baseURL: 'http://localhost:3008',
    contextOptions: {
      reducedMotion: 'reduce',
    },
    // Retry on CI only
    // retries: process.env.CI ? 2 : 0,
  },
})
