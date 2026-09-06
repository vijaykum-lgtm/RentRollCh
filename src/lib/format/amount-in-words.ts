/**
 * Amount-in-words for printed receipts, using the Indian numbering
 * system (lakh, crore) — see CLAUDE.md's print ticket: a generic
 * number-to-words library defaults to the Western short scale
 * (thousand, million) and gets this wrong.
 */

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

/** 0–99 */
function twoDigitsToWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  const tens = TENS[Math.floor(n / 10)];
  const ones = n % 10;
  return ones ? `${tens} ${ONES[ones]}` : tens;
}

/** 0–999 */
function threeDigitsToWords(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest) parts.push(twoDigitsToWords(rest));
  return parts.join(" ");
}

function integerToIndianWords(n: number): string {
  if (n === 0) return "Zero";

  let remaining = n;
  const crore = Math.floor(remaining / 1_00_00_000);
  remaining %= 1_00_00_000;
  const lakh = Math.floor(remaining / 1_00_000);
  remaining %= 1_00_000;
  const thousand = Math.floor(remaining / 1_000);
  remaining %= 1_000;
  const hundreds = remaining;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigitsToWords(crore)} Crore`);
  if (lakh) parts.push(`${twoDigitsToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigitsToWords(thousand)} Thousand`);
  if (hundreds) parts.push(threeDigitsToWords(hundreds));

  return parts.join(" ");
}

/** "One Lakh Eighty Six Thousand Rupees Only" — whole rupees, no paise. */
export function amountInWordsIndian(amount: number): string {
  const rounded = Math.round(Math.abs(amount));
  return `${integerToIndianWords(rounded)} Rupees Only`;
}
