import type { DoorQrPrintProps } from "./door-qr-print-view";

/**
 * Stand-in for a real query (bulk selection from `L-08`, or a single
 * unit from `L-09`) — the data layer isn't ready yet, see this lane's
 * ticket. `page.tsx` renders from this until a real lookup replaces it.
 */
export const doorQrFixture: DoorQrPrintProps = {
  baseUrl: "https://app.rentroll.in",
  landlordPhone: "+91 98765 43210",
  units: [
    { unitNumber: "Flat 1A", propertyName: "Sunshine Apartments", doorToken: "d7f2a1c9e8b6" },
    { unitNumber: "Flat 2A", propertyName: "Sunshine Apartments", doorToken: "9a3e5f1d0c72" },
    { unitNumber: "Flat 2B", propertyName: "Sunshine Apartments", doorToken: "1b6c8e4a2f95" },
    { unitNumber: "Flat 3A", propertyName: "Sunshine Apartments", doorToken: "e2d9b7f3a1c4" },
    { unitNumber: "Flat 3B", propertyName: "Sunshine Apartments", doorToken: "5f8a2d6e9b13" },
  ],
};
