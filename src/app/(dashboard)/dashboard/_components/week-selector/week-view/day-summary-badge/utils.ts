import { HabitEntityWeekRpc } from "@/app/types";
import { DAYS_OF_WEEK } from "@/app/(dashboard)/dashboard/constants";
import { HabitType } from "@/app/enums";

export function calculateDailyTarget(habits: HabitEntityWeekRpc[]): Record<number, boolean> {
  return DAYS_OF_WEEK.reduce((acc: Record<number, boolean>, day: number) => {
    acc[day] = habits.every((habit) => isHabitCompletedForDay(habit, day));
    return acc;
  }, {});
}

function isHabitCompletedForDay(habit: HabitEntityWeekRpc, day: number): boolean {
  const statusForDay = habit.habit_statuses[day];

  if (habit.type === HabitType.WEEKLY) {
    return true;
  }

  if (habit.type === HabitType.CUSTOM && !habit.days_of_week?.[day as keyof typeof habit.days_of_week]) {
    return true;
  }

  if (!statusForDay) {
    return false;
  }

  const totalProgress = (statusForDay?.completion_count || 0) + (statusForDay?.skipped_count || 0);

  return totalProgress === habit.target_count;
}