import type { ReactNode } from "react";

/**
 * Shell for every signed-in landlord route. Global navigation (sidebar /
 * bottom bar, see spec/foundations.md § A3) lands here once real screens
 * are built.
 */
export default function LandlordLayout({ children }: { children: ReactNode }) {
  return <div data-scope="landlord">{children}</div>;
}
