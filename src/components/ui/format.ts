/**
 * Money and date formatting — CLAUDE.md § Money and dates. Indian digit
 * grouping (lakh/crore, e.g. ₹1,00,000), no decimals; dates as
 * `DD MMM YYYY`. Shared by the money field and any display component that
 * shows a rupee amount or a date.
 */

/** Digits only, grouped as 2s after the first 3 from the right (Indian numbering). */
export function formatIndianDigits(digitsOnly: string): string {
  if (digitsOnly === "") return "";
  const lastThree = digitsOnly.slice(-3);
  const rest = digitsOnly.slice(0, -3);
  if (rest === "") return lastThree;
  const groupedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${groupedRest},${lastThree}`;
}

export function formatRupees(amount: number): string {
  return `₹${formatIndianDigits(String(Math.round(Math.abs(amount))))}`;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS[date.getMonth()];
  return `${day} ${month} ${date.getFullYear()}`;
}
