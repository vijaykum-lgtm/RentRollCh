import type { ReactNode } from "react";

/**
 * A2 stat card — spec/foundations.md § A2. Uppercase label, display-size
 * number, optional comparison line. Clickable when it has a destination —
 * the whole card is the target, not just the number, so a destination
 * renders the card as a single `<a>` rather than a div with an inner link.
 */
interface StatCardProps {
  label: string;
  value: ReactNode;
  comparison?: string;
  href?: string;
}

export function StatCard({ label, value, comparison, href }: StatCardProps) {
  const content = (
    <>
      <span className="type-label text-muted">{label}</span>
      <span className="type-display text-ink tabular-nums">{value}</span>
      {comparison && <span className="type-small text-muted">{comparison}</span>}
    </>
  );

  const className =
    "flex flex-col gap-1 rounded-md border border-line bg-surface p-4 shadow-card md:p-6";

  if (href) {
    return (
      <a href={href} className={`${className} transition-colors hover:bg-canvas`}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
