"use client";

import { useId, useRef } from "react";
import type { TextareaHTMLAttributes } from "react";

/**
 * A2 text area — spec/foundations.md § A2. Auto-grows to 8 lines then
 * scrolls. Character counter appears past 400 characters.
 */
const MAX_VISIBLE_LINES = 8;
const COUNTER_THRESHOLD = 400;

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  label: string;
  helperText?: string;
  error?: string;
  value: string;
  onValueChange: (value: string) => void;
}

export function TextArea({
  label,
  helperText,
  error,
  value,
  onValueChange,
  className = "",
  id,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helperId = `${fieldId}-helper`;
  const ref = useRef<HTMLTextAreaElement>(null);

  const autoGrow = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || "20");
    const maxHeight = lineHeight * MAX_VISIBLE_LINES;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="type-label text-muted">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={helperText || error ? helperId : undefined}
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
          autoGrow();
        }}
        className={[
          "w-full resize-none overflow-y-auto rounded-sm border bg-surface px-3 py-2 type-body text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary",
          error ? "border-danger" : "border-line",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      <div className="flex items-start justify-between gap-2">
        {(error || helperText) && (
          <p
            id={helperId}
            className={error ? "type-small text-danger" : "type-small text-muted"}
          >
            {error ?? helperText}
          </p>
        )}
        {value.length > COUNTER_THRESHOLD && (
          <p className="ml-auto type-small text-muted tabular-nums">
            {value.length}
          </p>
        )}
      </div>
    </div>
  );
}
