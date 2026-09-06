import { useId } from "react";
import type { ReactNode } from "react";

/**
 * A2 tooltip primitive — spec/foundations.md § A5: icon-only buttons and
 * disabled buttons carry an accessible label and a visible tooltip on
 * hover/focus, not just a native `title` attribute (unreliable with
 * screen readers). Shown via CSS on hover/focus-within, not JS state, so
 * it never fights keyboard focus.
 */
interface TooltipProps {
  label: string;
  children: (describedById: string) => ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
  const id = useId();

  return (
    <span className="group/tooltip relative inline-flex">
      {children(id)}
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-2 py-1 type-small text-white opacity-0 shadow-card transition-opacity group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
