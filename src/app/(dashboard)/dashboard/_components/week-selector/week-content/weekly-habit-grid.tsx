import * as React from "react";

import { HabitEntitiesRpc, HabitEntityRpc } from "@/app/types";
import { HabitState, HabitType } from "@/app/enums";
import { useWeekDataMapped } from "@/app/(dashboard)/dashboard/_utils/client";
import { getDayNamesByFormat, isBeforeToday, isToday } from "@/app/(dashboard)/dashboard/_utils/date";
import SelectDayStatus from "./weekly-habit-grid/select-day-status";

const dayNames = getDayNamesByFormat("full");

const getStatusForRender = (
  habit: HabitEntityRpc,
  dayNumber: number,
  isCurrentDay: boolean,
  isPastDay: boolean,
): {
  shouldRender: boolean;
  habitState: HabitState;
  habitDayValues: HabitEntityRpc["habit_statuses"][0]
} => {
  const habitDayStatus = habit.habit_statuses?.[dayNumber];
  const completionCount = habitDayStatus?.completion_count ?? 0;
  const skippedCount = habitDayStatus?.skipped_count ?? 0;
  const totalAttempts = completionCount + skippedCount;

  let shouldRender = false;
  let habitState = HabitState.PENDING;
  let habitDayValues = habitDayStatus;

  if (habit.type === HabitType.DAILY) {
    switch (true) {
      case isCurrentDay:
        shouldRender = true;
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : totalAttempts < habit.target_count
            ? HabitState.PROGRESS
            : HabitState.DONE;
        habitDayValues = habitDayStatus;
        break;

      case isPastDay:
        shouldRender = true;
        habitState = !habitDayStatus
          ? HabitState.INCOMPLETE
          : totalAttempts < habit.target_count
            ? HabitState.INCOMPLETE
            : HabitState.DONE;
        habitDayValues = habitDayStatus;
        break;

      default:
        shouldRender = true;
    }
  }

  if (habit.type === HabitType.WEEKLY) {
    const statesSum = Object.values(habit.habit_statuses || {}).reduce(
      (acc, status) => {
        acc.completion_count += status.completion_count || 0;
        acc.skipped_count += status.skipped_count || 0;
        return acc;
      },
      { completion_count: 0, skipped_count: 0 },
    );

    const aggregatedValues = {
      ...(habitDayStatus || {}),
      completion_count: statesSum.completion_count,
      skipped_count: statesSum.skipped_count,
    };

    switch (true) {
      case isCurrentDay:
        shouldRender = !!habitDayStatus || totalAttempts < habit.target_count;
        habitState = !habitDayStatus && !statesSum.completion_count && !statesSum.skipped_count
          ? HabitState.PENDING
          : totalAttempts < habit.target_count
            ? HabitState.PROGRESS
            : HabitState.DONE;
        habitDayValues = aggregatedValues;
        break;

      case isPastDay:
        shouldRender = !!habitDayStatus;
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : totalAttempts < habit.target_count
            ? HabitState.PROGRESS
            : HabitState.DONE;
        habitDayValues = habitDayStatus;
        break;
    }
  }

  if (habit.type === HabitType.CUSTOM) {
    const isHabitActiveToday = !!habit.days_of_week?.[dayNumber as keyof HabitEntityRpc["days_of_week"]];

    switch (true) {
      case isCurrentDay:
        shouldRender = isHabitActiveToday;
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : totalAttempts < habit.target_count
            ? HabitState.PROGRESS
            : HabitState.DONE;
        habitDayValues = habitDayStatus;
        break;

      case isPastDay:
        shouldRender = isHabitActiveToday;
        habitState = !habitDayStatus
          ? HabitState.INCOMPLETE
          : totalAttempts < habit.target_count
            ? HabitState.INCOMPLETE
            : HabitState.DONE;
        habitDayValues = habitDayStatus;
        break;

      default:
        shouldRender = isHabitActiveToday;
    }
  }

  return { shouldRender, habitState, habitDayValues };
};

export function HabitGrid({ weekData }: { weekData: { year: number; week: number } }) {
  const { data: habits }: { data: HabitEntitiesRpc } = useWeekDataMapped(weekData.year, weekData.week);

  return React.useMemo(
    () =>
      habits.map((habit) => (
        <React.Fragment key={habit.id}>
          <div className="col-start-1 p-2 text-xl font-bold">{habit.name}</div>

          {dayNames.map((dayName, idx) => {
            const dayNumber = idx + 1;
            const isCurrentDay = isToday(weekData.year, weekData.week, dayNumber);
            const isPastDay = isBeforeToday(weekData.year, weekData.week, dayNumber);

            const { shouldRender, habitState, habitDayValues } = getStatusForRender(
              habit,
              dayNumber,
              isCurrentDay,
              isPastDay,
            );

            if (!shouldRender) return null;

            return (
              <SelectDayStatus
                key={`${habit.id}-${dayName}`}
                habitState={habitState}
                habitType={habit.type}
                habitTarget={habit.target_count}
                dailyCompletion={habitDayValues?.completion_count}
                dailySkip={habitDayValues?.skipped_count}
                dayNumber={dayNumber}
              />
            );
          })}
        </React.Fragment>
      )),
    [habits, weekData.week, weekData.year],
  );
}
