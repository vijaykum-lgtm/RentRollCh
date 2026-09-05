import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Entry point for landlord-only server logic (data access, mutations —
 * anything that must never execute inside a tenant request).
 *
 * Everything under `src/server/landlord/**` is private to the
 * `(landlord)` route group. `npm run check:boundaries` fails the build if
 * any file under `src/app/(tenant)/**` imports from here, directly or
 * transitively through a relative path.
 */
export async function getLandlordSupabaseClient() {
  return createClient();
}
