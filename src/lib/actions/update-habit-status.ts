"use server";

import { revalidatePath } from "next/cache";

import { TablesUpdate } from "@/lib/supabase/database.types";
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

  const updatePayload: TablesUpdate<"habit_statuses"> = {
    updated_at: new Date().toISOString(),
  };

  if (action === HabitState.DONE) {
    updatePayload.completion_count = habitStatus.completion_count! + 1;
  } else if (action === HabitState.SKIP) {
    updatePayload.skipped_count = habitStatus.skipped_count! + 1;
  } else if (action === HabitState.UNDONE) {
    updatePayload.completion_count = !!habitStatus.completion_count ? habitStatus.completion_count - 1 : 0;
  } else if (action === HabitState.UNSKIP) {
    updatePayload.skipped_count = !!habitStatus.skipped_count ? habitStatus.skipped_count - 1 : 0;
  }

  const { error: updateError } = await authSupabase
    .from("habit_statuses")
    .update(updatePayload)
    .eq("id", habitStatusId);

  if (updateError) {
    return { status: Status.DATABASE_ERROR, message: updateError.message };
  }

  revalidatePath("/dashboard", "page");

  return { status: Status.SUCCESS };
}
