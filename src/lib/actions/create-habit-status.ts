"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import { TablesInsert } from "@/lib/supabase/database.types";
import { HabitEntity } from "@/app/types";
import { HabitState, Status } from "@/app/enums";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import { endOfWeek } from "date-fns";

export async function createHabitStatus(
  prevstate: { status: Status; message: string } | null,
  payload:

  {
    habitId: HabitEntity["id"];
    weekStartDate: Date;
    statusDate: Date;
    dayNumber: number;
    initialState: HabitState;
  },
): Promise<{
  status: Status;
  message: string;
}> {
  const { authSupabase } = await authenticateUser();

  const { data: existingStatus, error: dbError } = await authSupabase
    .from("habit_statuses")
    .select("*")
    .eq("habit_id", payload.habitId)
    .gte("status_date", payload.weekStartDate.toISOString())
    .lte("status_date", endOfWeek(payload.weekStartDate, { weekStartsOn: 1 }).toISOString())
    .eq("day_number", payload.dayNumber)
    .maybeSingle();

  if (dbError) {
    return { status: Status.DATABASE_ERROR, message: `Error fetching habit status: ${dbError.message}` };
  }

  if (existingStatus) {
    return { status: Status.DATABASE_ERROR, message: "Habit status already exists." };
  }

  const newHabitStatus: TablesInsert<"habit_statuses"> = {
    id: uuidv4(),
    habit_id: payload.habitId,
    day_number: payload.dayNumber,
    status_date: payload.statusDate.toISOString(),
    completion_count: payload.initialState === HabitState.DONE ? 1 : 0,
    skipped_count: payload.initialState === HabitState.SKIP ? 1 : 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error: insertError } = await authSupabase.from("habit_statuses").insert([newHabitStatus]).select();

  if (insertError) {
    return { status: Status.DATABASE_ERROR, message: insertError.message };
  }

  revalidatePath("/dashboard", "page");

  return { status: Status.SUCCESS, message: "Habit status created successfully." };
}
