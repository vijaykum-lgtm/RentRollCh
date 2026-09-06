import type { ReactNode } from "react";

/**
 * A2 empty state — spec/foundations.md § A2. One line explaining what
 * would appear here, and the button that creates the first one. Never
 * just "No data" — `description` and `action` are both required.
 */
interface EmptyStateProps {
  description: string;
  action: ReactNode;
}

export function EmptyState({ description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-6 text-center md:p-8">
      <p className="type-body text-muted">{description}</p>
      {action}
    </div>
  );
}
