import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Don't auto-generate AGENTS.md / CLAUDE.md on dev server startup.
  agentRules: false,

  // Dev-only routes are written as `page.dev.tsx` (see src/app/dev/**).
  // Restricting `pageExtensions` in production means Next.js does not
  // even recognise those files as routes when building for production —
  // they are excluded from the build output, not merely hidden behind a
  // runtime check.
  pageExtensions: isProduction
    ? ["tsx", "ts"]
    : ["dev.tsx", "dev.ts", "tsx", "ts"],
};

export default nextConfig;
