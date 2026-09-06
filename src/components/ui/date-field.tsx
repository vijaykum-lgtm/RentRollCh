"use client";

import { useId } from "react";
import type { InputHTMLAttributes } from "react";

import { formatDate } from "./format";

/**
 * A2 date field — spec/foundations.md § A2. Native date picker; displays
 * as `DD MMM YYYY` everywhere else in the product (this input itself still
 * uses the browser's native `date` control while focused/open — the
 * formatted display is what's shown alongside it and wherever the value is
 * read back, per CLAUDE.md § Money and dates).
 */
interface DateFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  label: string;
  helperText?: string;
  error?: string;
  /** ISO date string (yyyy-mm-dd), or "" for empty. */
  value: string;
  onValueChange: (value: string) => void;
}

export function DateField({
  label,
  helperText,
  error,
  value,
  onValueChange,
  className = "",
  id,
  ...props
}: DateFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helperId = `${fieldId}-helper`;
  const parsed = value ? new Date(`${value}T00:00:00`) : null;
  const displayValue =
    parsed && !Number.isNaN(parsed.getTime()) ? formatDate(parsed) : null;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="type-label text-muted">
        {label}
      </label>
      <input
        id={fieldId}
        type="date"
        aria-invalid={error ? true : undefined}
        aria-describedby={helperText || error ? helperId : undefined}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={[
          "h-10 w-full rounded-sm border bg-surface px-3 type-body text-ink focus:outline-none focus:ring-2 focus:ring-primary",
          error ? "border-danger" : "border-line",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {displayValue && (
        <p className="type-small text-muted">Displays as {displayValue}</p>
      )}
      {(error || helperText) && (
        <p
          id={helperId}
          className={error ? "type-small text-danger" : "type-small text-muted"}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
