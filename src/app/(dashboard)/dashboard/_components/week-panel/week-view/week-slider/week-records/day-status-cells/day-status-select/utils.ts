import { HabitEntityRpc, ShowHabitState } from "@/app/types";
import { Tables } from "@/lib/supabase/database.types";
import { HabitState, HabitType } from "@/app/enums";

export function getHabitState(
  habit: HabitEntityRpc,
  habitDayStatus: Tables<"habit_statuses">,
  cumulativeCountWeekly: number,
  cumulativeCountDay: number,
  dayNumber: number,
  isCurrentDay: boolean,
  isPastDay: boolean,
): ShowHabitState {
  let habitState = HabitState.PENDING;

  if (habit.type === HabitType.DAILY) {
    switch (true) {
      case isCurrentDay:
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : cumulativeCountDay < habit.target_count
            ? HabitState.PROGRESS
            : HabitState.DONE;
        break;

      case isPastDay:
        habitState = !habitDayStatus
          ? HabitState.INCOMPLETE
          : cumulativeCountDay < habit.target_count
            ? HabitState.INCOMPLETE
            : HabitState.DONE;
        break;
    }
  }

  if (habit.type === HabitType.WEEKLY) {
    const habitStatuses = Object.keys(habit.habit_statuses || {});
    const lastEntry = Number(habitStatuses.at(-1));

    switch (true) {
      case isCurrentDay:
        habitState =
          !habitDayStatus && !cumulativeCountWeekly
            ? HabitState.PENDING
            : cumulativeCountWeekly < habit.target_count
              ? HabitState.PROGRESS
              : HabitState.DONE;
        break;

      case isPastDay:
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : cumulativeCountWeekly < habit.target_count || dayNumber !== lastEntry
            ? HabitState.PROGRESS
            : HabitState.DONE;
        break;
    }
  }

  if (habit.type === HabitType.CUSTOM) {
    switch (true) {
      case isCurrentDay:
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : cumulativeCountDay < habit.target_count
            ? HabitState.PROGRESS
            : HabitState.DONE;
        break;

      case isPastDay:
        habitState = !habitDayStatus
          ? HabitState.INCOMPLETE
          : cumulativeCountDay < habit.target_count
            ? HabitState.INCOMPLETE
            : HabitState.DONE;
        break;
    }
  }

  return habitState;
}
