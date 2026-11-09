import viteReact from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [viteReact()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/**/*.test.ts"],
          name: "web:node",
        },
      },
      {
        extends: true,
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
            provider: playwright(),
          },
          include: ["src/**/*.test.tsx"],
          name: "web:browser",
        },
      },
    ],
  },
});
