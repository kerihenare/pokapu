import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const isCI = Boolean(process.env["CI"]);

export default defineConfig({
  forbidOnly: isCI,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  retries: isCI ? 2 : 0,
  testDir: "./tests",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  // Runs the production build of @pokapu/web. Build it first with `pnpm build`.
  webServer: {
    command: "pnpm --filter @pokapu/web start",
    env: { PORT: String(port) },
    reuseExistingServer: !isCI,
    url: `http://localhost:${port}`,
  },
});
