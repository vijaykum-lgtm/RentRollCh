"use client";

import { useId } from "react";
import type { SelectHTMLAttributes } from "react";

/**
 * A2 dropdown — spec/foundations.md § A2. Native select on mobile. Always
 * has a placeholder that is not a valid choice — enforced here by always
 * rendering a disabled, value-less first option.
 */
interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  label: string;
  helperText?: string;
  error?: string;
  placeholder: string;
  options: DropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
}

export function Dropdown({
  label,
  helperText,
  error,
  placeholder,
  options,
  value,
  onValueChange,
  className = "",
  id,
  ...props
}: DropdownProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helperId = `${fieldId}-helper`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="type-label text-muted">
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={helperText || error ? helperId : undefined}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={[
          "h-10 w-full rounded-sm border bg-surface px-3 type-body text-ink focus:outline-none focus:ring-2 focus:ring-primary",
          value === "" ? "text-muted" : "",
          error ? "border-danger" : "border-line",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
