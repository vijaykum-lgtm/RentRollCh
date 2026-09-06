import type { ReactNode } from "react";
import "./print.css";

/**
 * Shell for every print view (P-01–P-03) — cross-cutting.md § Print-view
 * contract: no navigation, no app chrome, white background only. The
 * root layout already has no nav to hide (it doesn't exist yet), so this
 * only needs to override the app's off-white canvas background with the
 * `surface` token.
 */
export default function PrintLayout({ children }: { children: ReactNode }) {
  return <div className="bg-surface min-h-dvh text-ink">{children}</div>;
}
