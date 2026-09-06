import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirrors tsconfig.json's "@/*" -> "./src/*" path alias, which
    // Next.js resolves natively but Vitest needs told about explicitly.
    alias: { "@": path.resolve(__dirname, "./src") },
    // Resolves `import "server-only"` to its no-op build instead of the
    // build that unconditionally throws — Next.js's webpack config does
    // the equivalent aliasing for real server bundles; Vitest has no
    // bundler layer of its own to do it, so tests importing
    // server-only-gated modules need this condition to run at all.
    // Vitest runs test files through Vite's SSR pipeline, so the
    // condition has to be set for `ssr.resolve` too, not just `resolve`.
    conditions: ["react-server"],
  },
  ssr: {
    resolve: {
      conditions: ["react-server"],
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
