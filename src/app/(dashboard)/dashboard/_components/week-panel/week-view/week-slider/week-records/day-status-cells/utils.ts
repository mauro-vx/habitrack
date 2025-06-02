import { HabitEntityRpc } from "@/app/types";

export function calculateCountUntilDay(habit: HabitEntityRpc, dayNumber: number): number {
  return Object.values(habit.habit_statuses || {})
    .filter((_, idx) => +Object.keys(habit.habit_statuses || {})[idx] <= dayNumber)
    .reduce((total, status) => total + (status?.completion_count || 0) + (status?.skipped_count || 0), 0);
}

export function getDayStatusCount(habit: HabitEntityRpc, dayNumber: number): number {
  const status = habit.habit_statuses?.[dayNumber];
  return (status?.completion_count || 0) + (status?.skipped_count || 0);
}
