import type { DemoUnit } from "../lib/types";

function unit(
  id: string,
  propertyId: string,
  unitNumber: string,
  type: string,
  rent: number,
  depositAmount: number,
  occupied: boolean,
): DemoUnit {
  return {
    id,
    propertyId,
    unitNumber,
    type,
    rent,
    depositAmount,
    occupied,
    reportingLinkToken: `demo-token-${id}`,
  };
}

/**
 * Static unit roster: 2 properties, 15 units, 13 occupied, 2 vacant
 * (see SPEC.md § Unit counts for why occupied is 13, not the ~11 in the
 * ticket). Tenants, rent history, and every other scenario detail live
 * in scenarios.ts, keyed by unit id.
 */
export const units: DemoUnit[] = [
  // Kothrud Residency (9 units)
  unit("unit-kr-g01", "property-kothrud", "G-01", "1BHK", 14000, 42000, true),
  unit("unit-kr-g02", "property-kothrud", "G-02", "1BHK", 14500, 43500, true),
  unit("unit-kr-101", "property-kothrud", "101", "2BHK", 19000, 57000, true),
  unit("unit-kr-102", "property-kothrud", "102", "2BHK", 19500, 58500, true),
  unit("unit-kr-103", "property-kothrud", "103", "2BHK", 20000, 60000, true),
  unit("unit-kr-201", "property-kothrud", "201", "2BHK", 20500, 61500, true),
  unit("unit-kr-202", "property-kothrud", "202", "3BHK", 26000, 78000, true),
  unit("unit-kr-203", "property-kothrud", "203", "3BHK", 27000, 81000, true),
  // Never occupied — brand-new unit, no tenant history at all.
  unit("unit-kr-301", "property-kothrud", "301", "3BHK", 28000, 84000, false),

  // Baner Greenview (6 units)
  unit("unit-bg-101", "property-baner", "101", "1BHK", 15000, 45000, true),
  unit("unit-bg-102", "property-baner", "102", "1BHK", 15500, 46500, true),
  unit("unit-bg-201", "property-baner", "201", "2BHK", 21000, 63000, true),
  unit("unit-bg-202", "property-baner", "202", "2BHK", 21500, 64500, true),
  unit("unit-bg-301", "property-baner", "301", "3BHK", 29000, 87000, true),
  // Vacant after a completed move-out/settlement — has tenant history.
  unit("unit-bg-302", "property-baner", "302", "3BHK", 30000, 90000, false),
];
