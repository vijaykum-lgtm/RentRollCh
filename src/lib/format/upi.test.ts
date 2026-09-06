import { describe, expect, it } from "vitest";
import { buildUpiPaymentUri } from "./upi";

describe("buildUpiPaymentUri", () => {
  it("builds a upi://pay link with the required fields", () => {
    const uri = buildUpiPaymentUri({
      vpa: "landlord@okhdfcbank",
      payeeName: "Vijay Kumar",
      amount: 12000,
    });
    expect(uri.startsWith("upi://pay?")).toBe(true);
    const params = new URLSearchParams(uri.slice("upi://pay?".length));
    expect(params.get("pa")).toBe("landlord@okhdfcbank");
    expect(params.get("pn")).toBe("Vijay Kumar");
    expect(params.get("am")).toBe("12000.00");
    expect(params.get("cu")).toBe("INR");
    expect(params.has("tn")).toBe(false);
  });

  it("includes an optional note", () => {
    const uri = buildUpiPaymentUri({
      vpa: "landlord@okhdfcbank",
      payeeName: "Vijay Kumar",
      amount: 500,
      note: "Rent for February 2026",
    });
    const params = new URLSearchParams(uri.slice("upi://pay?".length));
    expect(params.get("tn")).toBe("Rent for February 2026");
  });
});
