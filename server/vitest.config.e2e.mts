import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: "./",
    include: ["**/*.e2e-spec.ts"],

    coverage: {
      exclude: ["**/dto/**", "**/entities/**"],
    },
  },
});
