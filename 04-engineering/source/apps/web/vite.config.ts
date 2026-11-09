import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // React's plugin must come after TanStack Start's.
  plugins: [tanstackStart(), nitro(), viteReact()],
  server: {
    port: 3000,
  },
});
