import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  action?: ReactNode;
  filters?: ReactNode;
}

/**
 * Page header — spec/foundations.md § A3: title left, primary action
 * right, filters on the row beneath, and it "persists while the table
 * scrolls." It relies on the shell's content area (see
 * `app/(landlord)/layout.tsx`) being the scrolling container — this
 * component only needs to stick to that container's top edge.
 */
export function PageHeader({ title, action, filters }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <h1 className="type-h1 text-ink">{title}</h1>
        {action}
      </div>
      {filters && <div className="px-4 pb-4 lg:px-8">{filters}</div>}
    </div>
  );
}
