import * as React from "react";

import { Medal } from "lucide-react";

import { HabitEntitiesRpc, HabitEntityRpc, ShowHabitState } from "@/app/types";
import { Tables } from "@/lib/supabase/database.types";
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
  weeklyCompletion: number,
  weeklySkip: number,
): {
  shouldRender: boolean;
  habitState: ShowHabitState;
  habitDayValues: Tables<"habit_statuses">;
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
    }
  }

  if (habit.type === HabitType.WEEKLY) {
    const habitStatuses = Object.values(habit.habit_statuses || {});
    const lastEntry = habitStatuses.at(-1);

    switch (true) {
      case isCurrentDay:
        shouldRender = !!habitDayStatus || weeklyCompletion + weeklySkip < habit.target_count;
        habitState =
          !habitDayStatus && !weeklyCompletion && !weeklySkip
            ? HabitState.PENDING
            : weeklyCompletion + weeklySkip < habit.target_count
              ? HabitState.PROGRESS
              : HabitState.DONE;
        habitDayValues = habitDayStatus;
        break;

      case isPastDay:
        shouldRender = !!habitDayStatus || weeklyCompletion + weeklySkip < habit.target_count;
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : weeklyCompletion + weeklySkip < habit.target_count || habitDayStatus !== lastEntry
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
    }
  }

  return { shouldRender, habitState, habitDayValues };
};

export function HabitGrid({ weekData }: { weekData: { year: number; week: number } }) {
  const { data: habits }: { data: HabitEntitiesRpc } = useWeekDataMapped(weekData.year, weekData.week);

  return React.useMemo(
    () =>
      habits.map((habit) => {
        const { weeklyCompletion, weeklySkip } = Object.values(habit.habit_statuses || {}).reduce(
          (acc, status) => {
            acc.weeklyCompletion += status.completion_count || 0;
            acc.weeklySkip += status.skipped_count || 0;
            return acc;
          },
          { weeklyCompletion: 0, weeklySkip: 0 },
        );

        return (
          <React.Fragment key={habit.id}>
            <div className="col-start-1 truncate text-xs lg:text-lg lg:font-semibold">{habit.name}</div>

            {dayNames.map((dayName, idx) => {
              const dayNumber = idx + 1;
              const isCurrentDay = isToday(weekData.year, weekData.week, dayNumber);
              const isPastDay = isBeforeToday(weekData.year, weekData.week, dayNumber);

              const cumulativeCountUntilToday = Object.keys(habit.habit_statuses || {})
                .filter((dayKey) => +dayKey <= dayNumber)
                .reduce((cumulativeCount, dayKey) => {
                  const status = habit.habit_statuses?.[+dayKey];
                  return cumulativeCount + (status?.completion_count || 0) + (status?.skipped_count || 0);
                }, 0);

              const { shouldRender, habitState, habitDayValues } = getStatusForRender(
                habit,
                dayNumber,
                isCurrentDay,
                isPastDay,
                weeklyCompletion,
                weeklySkip,
              );

              if (!shouldRender) return null;

              return (
                <SelectDayStatus
                  key={`${habit.id}-${dayName}`}
                  habitId={habit.id}
                  habitType={habit.type}
                  habitTarget={habit.target_count}
                  habitState={habitState}
                  dailyCompletion={habitDayValues?.completion_count}
                  dailySkip={habitDayValues?.skipped_count}
                  weeklyCompletion={weeklyCompletion}
                  weeklySkip={weeklySkip}
                  cumulativeCountUntilToday={cumulativeCountUntilToday}
                  habitStatusId={habitDayValues?.id}
                  year={weekData.year}
                  week={weekData.week}
                  dayNumber={dayNumber}
                  isPast={isPastDay}
                />
              );
            })}

            <Medal className="col-start-9 size-5 stroke-yellow-500" />
          </React.Fragment>
        );
      }),
    [habits, weekData.week, weekData.year],
  );
}
