import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:3020", channel: "chrome" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: { command: "npm run start -- --port 3020", url: "http://localhost:3020", reuseExistingServer: true, timeout: 120_000 },
});
