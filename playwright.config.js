// Dev-only: the site itself has no build step. `npm test` serves this folder and drives it in Chromium.
const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: 'tests',
  timeout: 30000,
  retries: 1, // the page is animated; one retry absorbs rare timing misses
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:8791', serviceWorkers: 'block' },
  webServer: { command: 'node tests/serve.js 8791', url: 'http://127.0.0.1:8791', reuseExistingServer: false, timeout: 20000 }
});
