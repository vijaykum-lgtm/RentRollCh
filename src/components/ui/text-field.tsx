"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { InputHTMLAttributes } from "react";

/**
 * A2 text field — spec/foundations.md § A2. Label above, helper text
 * below, error replaces helper in danger colour. Validation display is
 * entirely caller-driven via `error` — this component never validates on
 * keystroke itself, matching "Validates on blur, not on keystroke."
 */
interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  helperText?: string;
  error?: string;
  type?: "text" | "email" | "password" | "tel";
  /** Autofocus on desktop only — spec/screens/landlord/L-01-sign-in.md. */
  autoFocusOnDesktop?: boolean;
}

export function TextField({
  label,
  helperText,
  error,
  type = "text",
  autoFocusOnDesktop = false,
  className = "",
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helperId = `${fieldId}-helper`;
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  useEffect(() => {
    if (
      autoFocusOnDesktop &&
      window.matchMedia("(min-width: 768px)").matches
    ) {
      inputRef.current?.focus();
    }
  }, [autoFocusOnDesktop]);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="type-label text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={fieldId}
          type={inputType}
          aria-invalid={error ? true : undefined}
          aria-describedby={helperText || error ? helperId : undefined}
          className={[
            "h-10 w-full rounded-sm border bg-surface px-3 type-body text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary",
            error ? "border-danger" : "border-line",
            isPassword ? "pr-14" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-14 items-center justify-center type-small text-muted hover:text-body"
          >
            {revealed ? "Hide" : "Show"}
          </button>
        )}
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
