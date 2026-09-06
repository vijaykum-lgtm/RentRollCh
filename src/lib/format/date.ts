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
] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Pulls year/month/day out of a plain `YYYY-MM-DD` string without going
 * through `Date` parsing, which reads the string as UTC midnight and can
 * roll the calendar day back a day in timezones west of UTC.
 */
function parseCalendarParts(input: Date | string): {
  year: number;
  month: number;
  day: number;
} {
  if (typeof input === "string") {
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    if (isoMatch) {
      return {
        year: Number(isoMatch[1]),
        month: Number(isoMatch[2]) - 1,
        day: Number(isoMatch[3]),
      };
    }
    const parsed = new Date(input);
    return {
      year: parsed.getFullYear(),
      month: parsed.getMonth(),
      day: parsed.getDate(),
    };
  }

  return { year: input.getFullYear(), month: input.getMonth(), day: input.getDate() };
}

/** `06 Sep 2026` — the one date format used everywhere, per CLAUDE.md § 5. */
export function formatDate(input: Date | string): string {
  const { year, month, day } = parseCalendarParts(input);
  return `${String(day).padStart(2, "0")} ${MONTHS[month]} ${year}`;
}

/** `February 2026` — for a rent month/period, not a specific day. */
export function formatMonthYear(input: Date | string): string {
  const { year, month } = parseCalendarParts(input);
  return `${MONTH_NAMES[month]} ${year}`;
}
