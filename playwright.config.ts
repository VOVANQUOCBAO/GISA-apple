import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }
    },
    {
      name: 'firefox',
      testMatch: /cross-browser\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } }
    },
    {
      name: 'webkit',
      testMatch: /cross-browser\.spec\.ts/,
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } }
    },
    {
      name: 'chromium-mobile',
      testMatch: /cross-browser\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        hasTouch: true,
        isMobile: true,
        viewport: { width: 390, height: 844 }
      }
    },
    {
      name: 'chromium-tablet',
      testMatch: /cross-browser\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        hasTouch: true,
        viewport: { width: 768, height: 1024 }
      }
    },
    {
      name: 'chromium-compact',
      testMatch: /cross-browser\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 900 } }
    }
  ],
  webServer: {
    command: 'pnpm build && pnpm start --hostname 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000
  }
});
