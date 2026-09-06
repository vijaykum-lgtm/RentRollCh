/**
 * Guards the post-sign-in `redirect` target against open redirects. The
 * target comes from a query param an attacker can set
 * (`/signin?redirect=...`), so only an internal, path-relative URL is
 * ever honoured — see spec/cross-cutting.md § E4 (signed-out landlord
 * routes redirect to L-01, then return to the intended screen).
 */
export function isSafeRedirectTarget(target: string): boolean {
  return target.startsWith("/") && !target.startsWith("//");
}
