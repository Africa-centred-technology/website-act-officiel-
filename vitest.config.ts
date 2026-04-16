import { defineConfig } from "vitest/config";
import { resolve } from "path";

/**
 * Vitest config — unit & data-consistency tests
 *
 * Tests live in tests/unit/.
 * No DOM / React renderer needed — pure TypeScript data files.
 */
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/unit/**/*.test.ts"],
    reporters: ["verbose"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
