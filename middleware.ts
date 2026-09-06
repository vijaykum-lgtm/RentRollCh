import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  requiresSignIn,
  signInRedirectTarget,
} from "@/server/landlord/route-guard";

/**
 * spec/cross-cutting.md § E4 row 6: reaching any landlord route while
 * signed out redirects to L-01, then returns to the intended screen
 * after signing in. `public-paths.ts` names which paths this guard must
 * not apply to (sign-in/up/reset and the public tenant routes); the
 * `redirect` query param round-trips through signin/page.tsx and
 * server/landlord/auth.ts's `isSafeRedirectTarget`.
 *
 * Also refreshes the Supabase session cookie on every request — the
 * `src/lib/supabase/server.ts` client relies on this rather than trying
 * to set cookies itself from a Server Component.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (requiresSignIn(request.nextUrl.pathname, Boolean(user))) {
    const target = signInRedirectTarget(
      request.nextUrl.pathname,
      request.nextUrl.search,
    );
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
