import { defineConfig, devices } from '@playwright/test';

// Uses the already-running local preview so the exhaustive language/typography
// audit can be repeated without replacing the user's preview process.
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'english-typography.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.GISA_PREVIEW_URL || 'http://127.0.0.1:3004',
    trace: 'retain-on-failure',
  },
});
