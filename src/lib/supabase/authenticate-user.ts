import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { getWeekNumberAndYear } from "@/lib/utils";

export function generateCacheKey(user: User | null, date: Date) {
  if (!user || !user.id) {
    console.error("Invalid user object. User must contain an 'id' property.");
  }

  const { week, year } = getWeekNumberAndYear(date);
  return `cache-${user?.id}-${year}-${week}`;
}

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
