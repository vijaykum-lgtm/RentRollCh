import { describe, expect, it } from "vitest";
import { isPublicPath } from "./public-paths";

describe("isPublicPath", () => {
  it.each([
    "/signin",
    "/signup",
    "/reset",
    "/reset/confirm",
    "/u/abc123",
    "/dev/components",
  ])(
    "treats %s as public",
    (pathname) => {
      expect(isPublicPath(pathname)).toBe(true);
    },
  );

  it.each(["/", "/rent", "/units/42", "/signin-not-really"])(
    "treats %s as a guarded landlord route",
    (pathname) => {
      expect(isPublicPath(pathname)).toBe(false);
    },
  );
});
