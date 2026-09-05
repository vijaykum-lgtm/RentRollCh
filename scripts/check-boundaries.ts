import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  findForbiddenImports,
  isUnderRoot,
  type BoundaryRule,
  type SourceFile,
} from "../src/tooling/import-boundaries";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const SOURCE_EXTENSIONS = [".ts", ".tsx"];

function walk(dirAbsPath: string): SourceFile[] {
  const results: SourceFile[] = [];
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
    } else if (SOURCE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      results.push({
        path: relative(repoRoot, abs).split("\\").join("/"),
        content: readFileSync(abs, "utf8"),
      });
    }
  }

  return results;
}

const rule: BoundaryRule = {
  scannedRoots: ["src/app/(tenant)"],
  forbiddenRoots: ["src/server/landlord", "src/app/(landlord)"],
};

const aliases: Record<string, string> = { "@/*": "src/*" };

const files = walk(join(repoRoot, "src"));
const violations = findForbiddenImports(files, rule, aliases);
const scannedFileCount = files.filter((file) =>
  rule.scannedRoots.some((root) => isUnderRoot(file.path, root)),
).length;

if (violations.length > 0) {
  console.error(
    "Boundary check failed — tenant code must not import private landlord modules:\n",
  );
  for (const v of violations) {
    console.error(
      `  ${v.file}\n    imports "${v.specifier}" -> resolves under forbidden root "${v.forbiddenRoot}"`,
    );
  }
  process.exit(1);
}

console.log(
  `Boundary check passed — scanned ${scannedFileCount} file(s) under src/app/(tenant), 0 forbidden imports found.`,
);
