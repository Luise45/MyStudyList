import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'smoke.spec.ts',

  retries: 0,
  reporter: 'list',

  projects: [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
    },
  },
],
});