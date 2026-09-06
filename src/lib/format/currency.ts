/**
 * Indian digit grouping — spec/CLAUDE.md § 5 ("₹1,00,000", no decimals).
 * The last three digits stand alone; everything above that groups in
 * pairs (lakh, crore), unlike the Western thousands-only grouping.
 */
function groupIndianDigits(digits: string): string {
  if (digits.length <= 3) return digits;

  const last3 = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const groups: string[] = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) groups.unshift(rest);

  return `${groups.join(",")},${last3}`;
}

/** `₹1,86,000` — Indian grouping, no decimals, per CLAUDE.md § 5. */
export function formatINR(amount: number): string {
  const rounded = Math.round(Math.abs(amount));
  const grouped = groupIndianDigits(String(rounded));
  return `${amount < 0 ? "-" : ""}₹${grouped}`;
}
