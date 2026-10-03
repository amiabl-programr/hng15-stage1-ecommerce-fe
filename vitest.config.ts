/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  // Mirrors vite.config.ts so components resolve the same `~/` alias in
  // tests as they do in the app.
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["app/**/*.test.{ts,tsx}"],
    css: false,
    pool: "forks",
  },
});