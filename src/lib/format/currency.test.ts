import { describe, expect, it } from "vitest";
import { formatINR } from "./currency";

describe("formatINR", () => {
  it("groups under 1,000 with no separators", () => {
    expect(formatINR(500)).toBe("₹500");
  });

  it("groups thousands with a single comma", () => {
    expect(formatINR(12000)).toBe("₹12,000");
  });

  it("groups lakhs — 1,86,000, not 186,000", () => {
    expect(formatINR(186000)).toBe("₹1,86,000");
  });

  it("groups crores — 1,00,00,000", () => {
    expect(formatINR(10000000)).toBe("₹1,00,00,000");
  });

  it("rounds off decimals — money has none", () => {
    expect(formatINR(1860.6)).toBe("₹1,861");
  });

  it("renders a leading minus for negative amounts", () => {
    expect(formatINR(-4000)).toBe("-₹4,000");
  });

  it("renders zero plainly", () => {
    expect(formatINR(0)).toBe("₹0");
  });
});
