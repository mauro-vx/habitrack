"use server";

import { revalidatePath } from "next/cache";

import { TablesUpdate } from "@/lib/supabase/database.types";
import { SelectHabitState } from "@/app/types";
import { HabitState, Status } from "@/app/enums";
import { authenticateUser } from "@/lib/supabase/authenticate-user";

export async function updateHabitStatus(
  prevstate: { status: Status; message: string } | null,
  payload: { habitStatusId: string; action: SelectHabitState }
): Promise<{
  status: Status;
  message: string;
}> {
  const { authSupabase } = await authenticateUser();

  const { data: habitStatus, error: fetchError } = await authSupabase
    .from("habit_statuses")
    .select("*")
    .eq("id", payload.habitStatusId)
    .single();

  if (fetchError || !habitStatus) {
    return { status: Status.DATABASE_ERROR, message: `Habit status not found: ${fetchError.message}` };
  }

  const updatePayload: TablesUpdate<"habit_statuses"> = {
    updated_at: new Date().toISOString(),
  };

  if (payload.action === HabitState.DONE) {
    updatePayload.completion_count = habitStatus.completion_count! + 1;
  } else if (payload.action === HabitState.SKIP) {
    updatePayload.skipped_count = habitStatus.skipped_count! + 1;
  } else if (payload.action === HabitState.UNDONE) {
    updatePayload.completion_count = !!habitStatus.completion_count ? habitStatus.completion_count - 1 : 0;
  } else if (payload.action === HabitState.UNSKIP) {
    updatePayload.skipped_count = !!habitStatus.skipped_count ? habitStatus.skipped_count - 1 : 0;
  }

  const { error: updateError } = await authSupabase
    .from("habit_statuses")
    .update(updatePayload)
    .eq("id", payload.habitStatusId);

  if (updateError) {
    return { status: Status.DATABASE_ERROR, message: updateError.message };
  }

  revalidatePath("/dashboard", "page");

  return { status: Status.SUCCESS, message: "Habit status successfully updated." };
}
