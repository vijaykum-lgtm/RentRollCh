import { describe, expect, it } from "vitest";
import { passwordStrength } from "./password-strength";

describe("passwordStrength", () => {
  it("is 'Too short' under 8 characters", () => {
    expect(passwordStrength("Ab1!")).toBe("Too short");
  });

  it("is 'Weak' for a plain 8-character lowercase password", () => {
    expect(passwordStrength("abcdefgh")).toBe("Weak");
  });

  it("is 'Fair' with mixed case and a digit", () => {
    expect(passwordStrength("abcdefgH1")).toBe("Fair");
  });

  it("is 'Strong' for a long password with mixed case, a digit and a symbol", () => {
    expect(passwordStrength("Abcdefghijkl1!")).toBe("Strong");
  });
});
