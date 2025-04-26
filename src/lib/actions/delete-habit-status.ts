"use server";

import { revalidatePath } from "next/cache";

import { Tables } from "@/lib/supabase/database.types";
import { Status } from "@/app/enums";
import { authenticateUser } from "@/lib/supabase/authenticate-user";

export async function deleteHabitStatus(
  prevstate: { status: Status; message: string } | null,
  habitStatusId: Tables<"habit_statuses">["id"],
): Promise<{
  status: Status;
  message: string;
}> {
  const { authSupabase } = await authenticateUser();

  const { error: deleteError } = await authSupabase.from("habit_statuses").delete().eq("id", habitStatusId);

  if (deleteError) {
    return {
      status: Status.DATABASE_ERROR,
      message: `Error deleting habit status: ${deleteError.message}`,
    };
  }

  revalidatePath("/dashboard", "page");

  return {
    status: Status.SUCCESS,
    message: "Habit status successfully removed.",
  };
}
