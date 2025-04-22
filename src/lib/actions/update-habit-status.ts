"use server";

import { revalidatePath } from "next/cache";

import { Database } from "@/lib/supabase/database.types";
import { HabitState, Status } from "@/app/enums";
import { authenticateUser } from "@/lib/supabase/authenticate-user";

export async function updateHabitStatus(habitStatusId: string, action: HabitState) {
  const { authSupabase } = await authenticateUser();

  const { data: habitStatus, error: fetchError } = await authSupabase
    .from("habit_statuses")
    .select("*")
    .eq("id", habitStatusId)
    .single();

  if (fetchError || !habitStatus) {
    return { status: Status.DATABASE_ERROR, message: `Habit status not found: ${fetchError.message}` };
  }

  const updatePayload: Partial<Database["public"]["Tables"]["habit_statuses"]["Update"]> = {
    updated_at: new Date().toISOString(),
  };

  if (action === HabitState.DONE) {
    updatePayload.completion_count = (habitStatus.completion_count || 0) + 1;
  } else if (action === HabitState.SKIP) {
    updatePayload.skipped_count = (habitStatus.skipped_count || 0) + 1;
  }

  const { error: updateError } = await authSupabase
    .from("habit_statuses")
    .update(updatePayload)
    .eq("id", habitStatusId);

  if (updateError) {
    return { status: Status.DATABASE_ERROR, message: updateError.message };
  }

  revalidatePath("/dashboard", "page");

  return { status: "SUCCESS" };
}
