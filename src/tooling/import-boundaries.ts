/**
 * Static import-boundary checker. Used by scripts/check-boundaries.ts to
 * guarantee nothing under a "scanned" root (e.g. the tenant route group)
 * imports, directly or via a relative path, anything under a "forbidden"
 * root (e.g. private server-only landlord modules).
 *
 * This is a lightweight regex-based scanner, not a full parser — it is
 * deliberately the minimum needed to catch real import statements
 * (static, bare, dynamic, and `require`), not every syntactic edge case.
 */

const STATIC_IMPORT_EXPORT_RE =
  /\b(?:import|export)\b[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]/g;
const BARE_IMPORT_RE = /\bimport\s*['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT_RE = /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;
const REQUIRE_RE = /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g;

export function extractImportSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  for (const re of [
    STATIC_IMPORT_EXPORT_RE,
    BARE_IMPORT_RE,
    DYNAMIC_IMPORT_RE,
    REQUIRE_RE,
  ]) {
    for (const match of source.matchAll(re)) {
      if (match[1]) specifiers.push(match[1]);
    }
  }
  return specifiers;
}

/**
 * Resolves an import specifier written in `fromFileRelPath` to a
 * repo-root-relative, forward-slash path. Returns `null` for anything
 * that isn't a relative or alias import (i.e. an external package).
 */
export function resolveSpecifier(
  fromFileRelPath: string,
  specifier: string,
  aliases: Record<string, string>,
): string | null {
  if (specifier.startsWith(".")) {
    const fromDir = fromFileRelPath.split("/").slice(0, -1);
    const parts = [...fromDir, ...specifier.split("/")];
    const resolved: string[] = [];
    for (const part of parts) {
      if (part === "" || part === ".") continue;
      if (part === "..") resolved.pop();
      else resolved.push(part);
    }
    return resolved.join("/");
  }

  for (const [aliasPrefix, target] of Object.entries(aliases)) {
    const prefix = aliasPrefix.replace(/\*$/, "");
    if (specifier.startsWith(prefix)) {
      const rest = specifier.slice(prefix.length);
      const targetBase = target.replace(/\*$/, "");
      return `${targetBase}${rest}`;
    }
  }

  return null;
}

export function isUnderRoot(resolvedPath: string, root: string): boolean {
  const normalizedRoot = root.replace(/\/$/, "");
  return (
    resolvedPath === normalizedRoot ||
    resolvedPath.startsWith(`${normalizedRoot}/`)
  );
}

export interface BoundaryRule {
  /** Repo-root-relative directories to scan for forbidden imports. */
  scannedRoots: string[];
  /** Repo-root-relative directories scanned files may never import from. */
  forbiddenRoots: string[];
}

export interface SourceFile {
  /** Repo-root-relative, forward-slash path. */
  path: string;
  content: string;
}

export interface Violation {
  file: string;
  specifier: string;
  resolvedPath: string;
  forbiddenRoot: string;
}

export function findForbiddenImports(
  files: SourceFile[],
  rule: BoundaryRule,
  aliases: Record<string, string>,
): Violation[] {
  const violations: Violation[] = [];

  for (const file of files) {
    const isScanned = rule.scannedRoots.some((root) =>
      isUnderRoot(file.path, root),
    );
    if (!isScanned) continue;

    for (const specifier of extractImportSpecifiers(file.content)) {
      const resolved = resolveSpecifier(file.path, specifier, aliases);
      if (!resolved) continue;

      const forbiddenRoot = rule.forbiddenRoots.find((root) =>
        isUnderRoot(resolved, root),
      );
      if (forbiddenRoot) {
        violations.push({
          file: file.path,
          specifier,
          resolvedPath: resolved,
          forbiddenRoot,
        });
      }
    }
  }

  return violations;
}
