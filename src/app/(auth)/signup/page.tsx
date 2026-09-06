import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { SignUpForm } from "./sign-up-form";

// spec/screens/landlord/L-01-sign-in.md — Route also covers /signup.
export default async function SignUpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <SignUpForm />;
}
