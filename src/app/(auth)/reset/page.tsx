import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { ResetForm } from "./reset-form";

// spec/screens/landlord/L-01-sign-in.md — Route also covers /reset.
export default async function ResetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <ResetForm />;
}
