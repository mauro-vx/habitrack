import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function authenticateUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return { authSupabase: supabase, user };
}
