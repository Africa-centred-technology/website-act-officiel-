import { defineConfig } from "vitest/config";
import { resolve } from "path";

/**
 * Vitest config — unit & data-consistency tests
 *
 * Tests live in tests/unit/.
 * DOM environment enabled for React component tests.
 */
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
    reporters: ["verbose"],
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
