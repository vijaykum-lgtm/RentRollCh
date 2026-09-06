/**
 * Relative-date helpers. Every demo date is computed as an offset from a
 * `runDate` (defaulting to "now") rather than hardcoded, so that
 * scenarios like "18 days overdue" stay true no matter when the seed is
 * generated — see scripts/seed/SPEC.md § Why dates are relative.
 */

export function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** "YYYY-MM", derived from a due date for grouping rent entries by cycle. */
export function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
