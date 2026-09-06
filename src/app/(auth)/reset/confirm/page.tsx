import { ConfirmResetForm } from "./confirm-reset-form";

// Completes the reset flow started on /reset. spec/screens/landlord/L-01
// doesn't name IDs for this step — it only specifies the request-a-reset
// screen — so this page follows the same A2 form conventions without a
// new spec ID.
//
// Supabase's emailed reset link lands here as `?code=...` (PKCE flow,
// the @supabase/ssr default). That code is a one-time credential that
// proves the email click — it gets exchanged for a session inside the
// confirmPasswordReset Server Action itself (Server Actions, unlike
// Server Components, are allowed to write the session cookie), not here.
export default async function ResetConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  return <ConfirmResetForm code={code} />;
}
