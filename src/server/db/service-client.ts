import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client -- bypasses RLS entirely. Only ever use
 * this for trusted server code that has already decided, in application
 * logic, exactly what it is allowed to hand back to the caller (see
 * src/server/tokens/resolve-token.ts). Tenant routes have no RLS
 * policies of their own (see the init migration) precisely so that the
 * only way to reach their data is through code like this that curates
 * the response by hand.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
