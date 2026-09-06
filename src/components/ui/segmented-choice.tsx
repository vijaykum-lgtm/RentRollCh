"use client";

import { useId } from "react";

/**
 * A2 segmented choice — spec/foundations.md § A2. 2-4 options shown as
 * adjacent buttons, used for urgency and status filters. Rendered as a
 * radiogroup so a screen reader announces it as one control with a
 * selected value, not a row of unrelated buttons.
 */
interface SegmentedChoiceOption {
  value: string;
  label: string;
}

interface SegmentedChoiceProps {
  label: string;
  options: SegmentedChoiceOption[];
  value: string;
  onValueChange: (value: string) => void;
}

export function SegmentedChoice({
  label,
  options,
  value,
  onValueChange,
}: SegmentedChoiceProps) {
  const groupId = useId();

  return (
    <div className="flex flex-col gap-1">
      <span id={groupId} className="type-label text-muted">
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={groupId} className="flex gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onValueChange(option.value)}
              className={[
                "h-10 flex-1 rounded-sm border type-body transition-colors",
                selected
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-line bg-surface text-body hover:bg-canvas",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
