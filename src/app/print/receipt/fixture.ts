import type { ReceiptPrintProps } from "./receipt-print-view";

/**
 * Stand-in for a real query. The data layer isn't ready yet — see this
 * lane's ticket — so `page.tsx` renders from this fixture until a real
 * `payment`/`rent_entry`/`tenant`/`unit`/`landlord` lookup replaces it.
 */
export const receiptFixture: ReceiptPrintProps = {
  landlord: {
    name: "Vijay Kumar",
    businessName: "Kumar Properties",
    pan: "ABCDE1234F",
    upiId: "vijaykumar@okhdfcbank",
  },
  tenant: {
    name: "Rohan Mehta",
  },
  unit: {
    unitNumber: "Flat 2A",
    propertyName: "Sunshine Apartments",
  },
  receiptNumber: "RR-2026-0142",
  rentMonth: "2026-02-01",
  amount: 18600,
  dateReceived: "2026-02-05",
  paymentReference: "UPI/402917563812",
};
