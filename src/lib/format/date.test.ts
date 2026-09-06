import { describe, expect, it } from "vitest";
import { formatDate, formatMonthYear } from "./date";

describe("formatDate", () => {
  it("formats an ISO date string as DD MMM YYYY", () => {
    expect(formatDate("2026-09-06")).toBe("06 Sep 2026");
  });

  it("formats a Date object as DD MMM YYYY", () => {
    expect(formatDate(new Date(2026, 8, 6))).toBe("06 Sep 2026");
  });

  it("pads single-digit days", () => {
    expect(formatDate("2026-01-01")).toBe("01 Jan 2026");
  });

  it("does not roll the day back a day for an ISO date-only string", () => {
    // A naive `new Date("2026-01-01")` reads as UTC midnight, which is
    // 31 Dec 2025 in any timezone west of UTC — this must not happen.
    expect(formatDate("2026-01-01")).toBe("01 Jan 2026");
  });
});

describe("formatMonthYear", () => {
  it("formats a month and year with the full month name", () => {
    expect(formatMonthYear("2026-02-01")).toBe("February 2026");
  });
});
