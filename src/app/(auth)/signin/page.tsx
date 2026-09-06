import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isSafeRedirectTarget } from "@/server/landlord/auth-redirect";

import { SignInForm } from "./sign-in-form";

// spec/screens/landlord/L-01-sign-in.md
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectParam } = await searchParams;
  const destination =
    redirectParam && isSafeRedirectTarget(redirectParam) ? redirectParam : "/";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // "A signed-in user hitting this route is redirected to L-03" — L-03
  // isn't built yet, so this lands on the landlord home in the meantime.
  if (user) {
    redirect(destination);
  }

  return <SignInForm redirectTo={destination} />;
}
