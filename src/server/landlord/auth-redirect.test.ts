import { describe, expect, it } from "vitest";
import { isSafeRedirectTarget } from "./auth-redirect";

describe("isSafeRedirectTarget", () => {
  it.each(["/", "/dashboard", "/rent?month=2026-02"])(
    "accepts internal path %s",
    (target) => {
      expect(isSafeRedirectTarget(target)).toBe(true);
    },
  );

  it.each([
    "//evil.com",
    "https://evil.com",
    "http://evil.com/",
    "relative/path",
    "",
  ])("rejects unsafe or non-internal target %s", (target) => {
    expect(isSafeRedirectTarget(target)).toBe(false);
  });
});
