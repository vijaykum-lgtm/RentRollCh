import { describe, expect, it } from "vitest";

import {
  BOTTOM_BAR_ITEMS,
  MORE_SHEET_ITEMS,
  SETTINGS_ITEM,
  SIDEBAR_ITEMS,
} from "./nav-items";

describe("sidebar nav order", () => {
  it("matches the canonical spec order — spec/foundations.md § A3", () => {
    expect(SIDEBAR_ITEMS.map((item) => item.label)).toEqual([
      "Dashboard",
      "Rent",
      "Maintenance",
      "Units",
      "Tenants",
      "Agreements",
      "Deposits",
      "Documents",
    ]);
  });

  it("keeps Settings out of the eight sidebar sections", () => {
    expect(SIDEBAR_ITEMS.some((item) => item.id === "settings")).toBe(false);
    expect(SETTINGS_ITEM.label).toBe("Settings");
  });
});

describe("bottom bar", () => {
  it("carries exactly five items — spec/foundations.md § A3", () => {
    // The fifth ("More") is rendered separately by BottomBar itself.
    expect(BOTTOM_BAR_ITEMS).toHaveLength(4);
    expect(BOTTOM_BAR_ITEMS.map((item) => item.label)).toEqual([
      "Dashboard",
      "Rent",
      "Maintenance",
      "Units",
    ]);
  });

  it("puts everything else, plus Settings, in the More sheet", () => {
    expect(MORE_SHEET_ITEMS.map((item) => item.label)).toEqual([
      "Tenants",
      "Agreements",
      "Deposits",
      "Documents",
      "Settings",
    ]);
  });

  it("never drops or duplicates a sidebar section across bottom bar + more sheet", () => {
    const covered = [...BOTTOM_BAR_ITEMS, ...MORE_SHEET_ITEMS].filter(
      (item) => item.id !== "settings",
    );
    expect(covered.map((item) => item.id).sort()).toEqual(
      SIDEBAR_ITEMS.map((item) => item.id).sort(),
    );
  });
});
