import type { ReactNode } from "react";

/**
 * Shell for every tenant link route. Tenant screens carry no navigation
 * and never surface rent amounts, repair costs, other units, or other
 * tenants — see spec/cross-cutting.md § The two universal rules.
 *
 * Nothing in this route group may import from `src/server/landlord/**`
 * (enforced by `npm run check:boundaries`).
 */
export default function TenantLayout({ children }: { children: ReactNode }) {
  return <div data-scope="tenant">{children}</div>;
}
