"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import { Database } from "@/lib/supabase/database.types";
import { HabitEntity } from "@/app/types";
import { HabitState, Status } from "@/app/enums";
import { authenticateUser } from "@/lib/supabase/authenticate-user";

export async function createHabitStatus(
  habitId: HabitEntity["id"],
  week: number,
  year: number,
  dayNumber: number,
  initialState: HabitState,
) {
  const { authSupabase } = await authenticateUser();

  const { data: existingStatus, error: dbError } = await authSupabase
    .from("habit_statuses")
    .select("*")
    .eq("habit_id", habitId)
    .eq("year", year)
    .eq("week", week)
    .eq("day_number", dayNumber)
    .maybeSingle();

  if (dbError) {
    return { status: Status.DATABASE_ERROR, message: `Error fetching habit status: ${dbError.message}` };
  }

  if (existingStatus) {
    return { status: "EXISTS", data: existingStatus };
  }

  const newHabitStatus: Database["public"]["Tables"]["habit_statuses"]["Insert"] = {
    id: uuidv4(),
    habit_id: habitId,
    week: week,
    year: year,
    day_number: dayNumber,
    completion_count: initialState === HabitState.DONE ? 1 : 0,
    skipped_count: initialState === HabitState.SKIP ? 1 : 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error: insertError, data: insertedData } = await authSupabase
    .from("habit_statuses")
    .insert([newHabitStatus])
    .select();

  if (insertError) {
    return { status: Status.DATABASE_ERROR, message: insertError.message };
  }

  revalidatePath("/dashboard", "page");

  return { status: Status.SUCCESS, data: insertedData };
}
