"use client";

import { useId } from "react";
import type { InputHTMLAttributes } from "react";

import { formatIndianDigits } from "./format";

/**
 * A2 money field — spec/foundations.md § A2. Prefixed ₹, digits only,
 * Indian thousands separators shown as the user types, no decimals.
 * Validates on blur, not on keystroke — like `TextField`, error display is
 * entirely caller-driven via `error`.
 */
interface MoneyFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  label: string;
  helperText?: string;
  error?: string;
  /** Raw integer rupee amount, not the formatted display string. */
  value: number | null;
  onValueChange: (value: number | null) => void;
}

export function MoneyField({
  label,
  helperText,
  error,
  value,
  onValueChange,
  className = "",
  id,
  ...props
}: MoneyFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helperId = `${fieldId}-helper`;
  const display = value === null ? "" : formatIndianDigits(String(value));

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="type-label text-muted">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center type-body text-muted">
          ₹
        </span>
        <input
          id={fieldId}
          type="text"
          inputMode="numeric"
          aria-invalid={error ? true : undefined}
          aria-describedby={helperText || error ? helperId : undefined}
          value={display}
          onChange={(event) => {
            const digitsOnly = event.target.value.replace(/\D/g, "");
            onValueChange(digitsOnly === "" ? null : Number(digitsOnly));
          }}
          className={[
            "h-10 w-full rounded-sm border bg-surface pl-7 pr-3 text-right type-body tabular-nums text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary",
            error ? "border-danger" : "border-line",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </div>
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
