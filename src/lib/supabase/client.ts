import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Safe to call from Client Components — it
 * only ever sees the public URL and anon key, never a service role key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
