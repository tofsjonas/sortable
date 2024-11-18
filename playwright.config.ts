import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined,
  reporter: process.env.CI ? [['list'], ['html'], ['github']] : [['list'], ['html']],

  timeout: 30000,
  expect: {
    timeout: 5000,
  },

  use: {
    baseURL: 'http://localhost:3008',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },

  webServer: {
    command: 'vite preview --port 3008',
    port: 3008,
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add more browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    /* Test against mobile viewports */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
})
