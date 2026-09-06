import type { ReactNode } from "react";

/**
 * Shell for the public, pre-sign-in landlord routes (L-01: /signin,
 * /signup, /reset). Not part of `(landlord)` — those routes require an
 * existing session; these must work without one.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-sm rounded-md bg-surface p-6 shadow-card">
        {children}
      </div>
    </div>
  );
}
