import * as React from "react";

import { HabitEntitiesRpc, HabitEntityRpc } from "@/app/types";
import { HabitState, HabitType } from "@/app/enums";
import { useWeekDataMapped } from "@/app/(dashboard)/dashboard/_utils/client";
import { getDayNamesByFormat, isBeforeToday, isToday } from "@/app/(dashboard)/dashboard/_utils/date";
import SelectDayStatus from "./weekly-habit-grid/select-day-status";

const dayNames = getDayNamesByFormat("full");

const getDailyValues = (habit: HabitEntityRpc, dayNumber: number, isCurrentDay: boolean, isPastDay: boolean) => {
  const shouldRender = true;

  const statusValues = habit.habit_statuses?.[dayNumber] || null;
  const completionCount = statusValues?.completion_count ?? 0;
  const skippedCount = statusValues?.skipped_count ?? 0;
  const totalAttempts = completionCount + skippedCount;

  let habitState: HabitState;

  switch (true) {
    case isCurrentDay:
      habitState = !statusValues
        ? HabitState.PENDING
        : totalAttempts < habit.target_count
          ? HabitState.PROGRESS
          : HabitState.DONE;
      break;

    case isPastDay:
      habitState = !statusValues
        ? HabitState.INCOMPLETE
        : totalAttempts < habit.target_count
          ? HabitState.INCOMPLETE
          : HabitState.DONE;
      break;

    default:
      habitState = HabitState.PENDING;
      break;
  }

  return { shouldRender, habitState, statusValues };
};

const getWeeklyValues = (habit: HabitEntityRpc, dayNumber: number, isCurrentDay: boolean, isPastDay: boolean) => {
  const dayStatusValues = habit.habit_statuses?.[dayNumber] || null;

  const statesSum = Object.values(habit.habit_statuses || {}).reduce(
    (acc, status) => {
      acc.completion_count += status.completion_count || 0;
      acc.skipped_count += status.skipped_count || 0;
      return acc;
    },
    { completion_count: 0, skipped_count: 0 },
  );

  const totalAttempts = statesSum.completion_count + statesSum.skipped_count;

  const aggregatedValues = {
    ...(dayStatusValues || {}),
    completion_count: statesSum.completion_count,
    skipped_count: statesSum.skipped_count,
  };

  let habitState: HabitState;
  let shouldRender = true;

  switch (true) {
    case isCurrentDay:
      habitState = !dayStatusValues
        ? HabitState.PENDING
        : totalAttempts < habit.target_count
          ? HabitState.PROGRESS
          : HabitState.DONE;
      break;

    case isPastDay:
      habitState = !dayStatusValues
        ? HabitState.INCOMPLETE
        : totalAttempts < habit.target_count
          ? HabitState.INCOMPLETE
          : HabitState.DONE;
      break;

    default:
      habitState = HabitState.PENDING;
      shouldRender = false;
  }

  return { shouldRender, habitState, statusValues: aggregatedValues };
};

const getCustomValues = (habit: HabitEntityRpc, dayNumber: number, isCurrentDay: boolean, isPastDay: boolean) => {
  const isHabitActiveToday = !!habit.days_of_week?.[dayNumber as keyof HabitEntityRpc["days_of_week"]];

  if (!isHabitActiveToday) return { shouldRender: false, habitState: undefined, statusValues: undefined };

  const statusValues = habit.habit_statuses?.[dayNumber] || null;
  const completionCount = statusValues?.completion_count ?? 0;
  const skippedCount = statusValues?.skipped_count ?? 0;
  const totalAttempts = completionCount + skippedCount;

  let habitState: HabitState;

  switch (true) {
    case isCurrentDay:
      habitState = !statusValues
        ? HabitState.PENDING
        : totalAttempts < habit.target_count
          ? HabitState.PROGRESS
          : HabitState.DONE;
      break;

    case isPastDay:
      habitState = !statusValues
        ? HabitState.INCOMPLETE
        : totalAttempts < habit.target_count
          ? HabitState.INCOMPLETE
          : HabitState.DONE;
      break;

    default:
      habitState = HabitState.PENDING;
  }

  return { shouldRender: true, habitState, statusValues };
};

const getStatusForRender = (habit: HabitEntityRpc, dayNumber: number, isCurrentDay: boolean, isPastDay: boolean) => {
  switch (habit.type) {
    case HabitType.DAILY:
      return getDailyValues(habit, dayNumber, isCurrentDay, isPastDay);

    case HabitType.WEEKLY:
      return getWeeklyValues(habit, dayNumber, isCurrentDay, isPastDay);

    case HabitType.CUSTOM:
      return getCustomValues(habit, dayNumber, isCurrentDay, isPastDay);

    default:
      throw new Error(`Unsupported habit type: ${habit.type}`);
  }
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

            const { shouldRender, habitState, statusValues } = getStatusForRender(
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
                dailyCompletion={statusValues?.completion_count}
                dailySkip={statusValues?.skipped_count}
                dayNumber={dayNumber}
              />
            );
          })}
        </React.Fragment>
      )),
    [habits, weekData.week, weekData.year],
  );
}
