"use client";

import { useId } from "react";
import type { InputHTMLAttributes } from "react";

/**
 * A2 phone field — spec/foundations.md § A2. Prefixed +91, accepts 10
 * digits, strips spaces and dashes on save. Validates on blur, not on
 * keystroke.
 */
interface PhoneFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  label: string;
  helperText?: string;
  error?: string;
  /** Raw 10-digit number, no country code. */
  value: string;
  onValueChange: (value: string) => void;
}

export function PhoneField({
  label,
  helperText,
  error,
  value,
  onValueChange,
  className = "",
  id,
  ...props
}: PhoneFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helperId = `${fieldId}-helper`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="type-label text-muted">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center type-body text-muted">
          +91
        </span>
        <input
          id={fieldId}
          type="tel"
          inputMode="numeric"
          aria-invalid={error ? true : undefined}
          aria-describedby={helperText || error ? helperId : undefined}
          value={value}
          onChange={(event) => {
            const digitsOnly = event.target.value
              .replace(/[\s-]/g, "")
              .replace(/\D/g, "")
              .slice(0, 10);
            onValueChange(digitsOnly);
          }}
          className={[
            "h-10 w-full rounded-sm border bg-surface pl-12 pr-3 type-body tabular-nums text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary",
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
