import { HabitEntityWeekRpc } from "@/app/types";

export function calculateWeeklyTotal(habit: HabitEntityWeekRpc): number {
  return Object.values(habit.habit_statuses || {}).reduce(
    (total, status) => total + (status?.completion_count || 0) + (status?.skipped_count || 0),
    0,
  );
}
