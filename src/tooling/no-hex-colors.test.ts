import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

import { findHexColorLiterals } from "./no-hex-colors";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const COMPONENT_ROOTS = ["src/components/ui", "src/app/dev/components"];

function walk(dirAbsPath: string): { path: string; content: string }[] {
  const results: { path: string; content: string }[] = [];
  let entries;
  try {
    entries = readdirSync(dirAbsPath, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const abs = join(dirAbsPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(abs));
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      results.push({
        path: relative(repoRoot, abs).split("\\").join("/"),
        content: readFileSync(abs, "utf8"),
      });
    }
  }

  return results;
}

describe("no raw hex colours in component files", () => {
  test("src/components/ui and src/app/dev/components contain no #hex literals", () => {
    const files = COMPONENT_ROOTS.flatMap((root) => walk(join(repoRoot, root)));
    expect(files.length).toBeGreaterThan(0);

    const violations = findHexColorLiterals(files);

    if (violations.length > 0) {
      const message = violations
        .map((v) => `  ${v.file}:${v.line} — ${v.match}`)
        .join("\n");
      throw new Error(
        `Found raw hex colour literal(s). Use an A1 token utility (bg-ink, text-primary, border-line, ...) instead — see spec/foundations.md § A1:\n${message}`,
      );
    }
  });
});
