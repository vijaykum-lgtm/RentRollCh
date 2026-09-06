import { describe, expect, it } from "vitest";

import { requiresSignIn, signInRedirectTarget } from "./route-guard";

describe("requiresSignIn", () => {
  it("is true for a landlord route with no session", () => {
    expect(requiresSignIn("/units", false)).toBe(true);
  });

  it("is false for a landlord route with a session", () => {
    expect(requiresSignIn("/units", true)).toBe(false);
  });

  it("is false for public auth routes regardless of session", () => {
    expect(requiresSignIn("/signin", false)).toBe(false);
    expect(requiresSignIn("/signup", false)).toBe(false);
    expect(requiresSignIn("/reset", false)).toBe(false);
  });

  it("is false for public tenant routes regardless of session", () => {
    expect(requiresSignIn("/u/some-token", false)).toBe(false);
  });
});

describe("signInRedirectTarget", () => {
  it("preserves the intended path and query string", () => {
    expect(signInRedirectTarget("/units/42", "?tab=history")).toBe(
      "/signin?redirect=%2Funits%2F42%3Ftab%3Dhistory",
    );
  });

  it("round-trips back to the original path when decoded", () => {
    const target = signInRedirectTarget("/units/42", "");
    const params = new URL(`http://example.com${target}`).searchParams;
    expect(params.get("redirect")).toBe("/units/42");
  });
});
