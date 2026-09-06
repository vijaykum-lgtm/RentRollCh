/** Fields for a UPI deep link — https://www.npci.org.in UPI intent spec. */
export interface UpiPaymentLink {
  /** The landlord's saved UPI ID / VPA, e.g. "landlord@okhdfcbank". */
  vpa: string;
  payeeName: string;
  /** Rupees, no decimals elsewhere in the app — this is the one place a
   * fractional value is accepted, since UPI apps expect "am" as a decimal
   * string; whole-rupee amounts still render as e.g. "12000.00". */
  amount: number;
  note?: string;
}

/** `upi://pay?pa=...&pn=...&am=...&cu=INR` for a payment QR / link. */
export function buildUpiPaymentUri({
  vpa,
  payeeName,
  amount,
  note,
}: UpiPaymentLink): string {
  const params = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: "INR",
  });
  if (note) params.set("tn", note);
  return `upi://pay?${params.toString()}`;
}
