import { isPublicPath } from "./public-paths";

/**
 * Pure decision logic for `middleware.ts` — spec/cross-cutting.md § E4
 * row 6: reaching any landlord route while signed out redirects to L-01,
 * then returns to the intended screen after signing in. Kept
 * framework-free (no NextRequest/NextResponse) so it can be unit tested
 * directly, matching the existing `isSafeRedirectTarget`/`isPublicPath`
 * pattern.
 */
export function requiresSignIn(pathname: string, hasSession: boolean): boolean {
  return !hasSession && !isPublicPath(pathname);
}

/** Builds the `/signin?redirect=...` target that preserves the original screen. */
export function signInRedirectTarget(pathname: string, search: string): string {
  const target = new URLSearchParams({ redirect: pathname + search });
  return `/signin?${target.toString()}`;
}
