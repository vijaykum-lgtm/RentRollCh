import { describe, expect, it } from "vitest";

import {
  extractImportSpecifiers,
  findForbiddenImports,
  isUnderRoot,
  resolveSpecifier,
} from "./import-boundaries";

describe("extractImportSpecifiers", () => {
  it("finds static, bare, dynamic and require imports", () => {
    const source = `
      import Foo from "react";
      import { a, b } from "./local";
      import "./side-effect";
      export { c } from "../shared";
      const mod = await import("@/server/landlord");
      const req = require("node:fs");
    `;

    expect(extractImportSpecifiers(source)).toEqual(
      expect.arrayContaining([
        "react",
        "./local",
        "./side-effect",
        "../shared",
        "@/server/landlord",
        "node:fs",
      ]),
    );
  });
});

describe("resolveSpecifier", () => {
  const aliases = { "@/*": "src/*" };

  it("resolves relative imports against the importing file's directory", () => {
    expect(
      resolveSpecifier("src/app/(tenant)/page.tsx", "../../lib/x", aliases),
    ).toBe("src/lib/x");
  });

  it("resolves alias imports", () => {
    expect(
      resolveSpecifier("src/app/foo.tsx", "@/server/landlord", aliases),
    ).toBe("src/server/landlord");
  });

  it("returns null for external packages", () => {
    expect(resolveSpecifier("src/app/foo.tsx", "react", aliases)).toBeNull();
  });
});

describe("isUnderRoot", () => {
  it("matches exact and nested paths, not path prefixes that aren't a directory boundary", () => {
    expect(isUnderRoot("src/server/landlord", "src/server/landlord")).toBe(
      true,
    );
    expect(
      isUnderRoot("src/server/landlord/index.ts", "src/server/landlord"),
    ).toBe(true);
    expect(isUnderRoot("src/server/landlording", "src/server/landlord")).toBe(
      false,
    );
  });
});

describe("findForbiddenImports", () => {
  const rule = {
    scannedRoots: ["src/app/(tenant)"],
    forbiddenRoots: ["src/server/landlord"],
  };
  const aliases = { "@/*": "src/*" };

  it("flags a tenant file importing the private landlord module via an alias", () => {
    const files = [
      {
        path: "src/app/(tenant)/u/[token]/page.tsx",
        content: `import { getLandlordSupabaseClient } from "@/server/landlord";`,
      },
    ];

    const violations = findForbiddenImports(files, rule, aliases);
    expect(violations).toHaveLength(1);
    expect(violations[0].resolvedPath).toBe("src/server/landlord");
  });

  it("flags a tenant file importing the private landlord module via a relative path", () => {
    const files = [
      {
        path: "src/app/(tenant)/u/[token]/page.tsx",
        content: `import x from "../../../../server/landlord";`,
      },
    ];

    expect(findForbiddenImports(files, rule, aliases)).toHaveLength(1);
  });

  it("ignores files outside the scanned roots", () => {
    const files = [
      {
        path: "src/app/(landlord)/page.tsx",
        content: `import { getLandlordSupabaseClient } from "@/server/landlord";`,
      },
    ];

    expect(findForbiddenImports(files, rule, aliases)).toHaveLength(0);
  });

  it("allows tenant files to import shared, non-forbidden modules", () => {
    const files = [
      {
        path: "src/app/(tenant)/u/[token]/page.tsx",
        content: `import { createClient } from "@/lib/supabase/server";`,
      },
    ];

    expect(findForbiddenImports(files, rule, aliases)).toHaveLength(0);
  });
});
