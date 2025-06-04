"use server";

import { revalidatePath } from "next/cache";

import { Tables } from "@/lib/supabase/database.types";
import { Status } from "@/app/enums";
import { authenticateUser } from "@/lib/supabase/authenticate-user";

export async function deleteHabitStatus(
  prevState: { status: Status; message: string } | null,
  habitStatusId: Tables<"habit_statuses">["id"],
): Promise<{
  status: Status;
  message: string;
}> {
  const { authSupabase } = await authenticateUser();

  const { error: deleteError } = await authSupabase.from("habit_statuses").delete().eq("id", habitStatusId);

  if (deleteError) {
    console.error("Error deleting habit status:", deleteError);
    return {
      status: Status.DATABASE_ERROR,
      message: "An error occurred while removing the habit status. Please try again later.",
    };
  }

  try {
    revalidatePath("/dashboard", "page");
  } catch (error) {
    console.error("Failed to revalidate path after deleting habit status:", error);
  }

  return {
    status: Status.SUCCESS,
    message: "Habit status successfully removed.",
  };
}
