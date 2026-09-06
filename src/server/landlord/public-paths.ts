/**
 * Which paths `middleware.ts` must NOT force through the landlord sign-in
 * guard — spec/cross-cutting.md § E4: "Reach any landlord route while
 * signed out → Redirect to L-01." Everything not listed here is treated
 * as a signed-in-only landlord route.
 */
const PUBLIC_EXACT_PATHS = ["/signin", "/signup", "/reset"];
const PUBLIC_PATH_PREFIXES = ["/u/", "/dev"];

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT_PATHS.includes(pathname)) return true;
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
