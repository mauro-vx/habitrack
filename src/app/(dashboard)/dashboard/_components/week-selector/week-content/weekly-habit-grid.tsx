import * as React from "react";

import { HabitEntitiesRpc, HabitEntityRpc } from "@/app/types";
import { HabitType } from "@/app/enums";
import { useWeekDataMapped } from "@/app/(dashboard)/dashboard/_utils/client";
import { getDayNamesByFormat, isAfterToday } from "@/app/(dashboard)/dashboard/_utils/date";
import { SelectDayStatus } from "./weekly-habit-grid/select-day-status";
import { MedalIcon } from "./weekly-habit-grid/medal-icon";

const dayNames = getDayNamesByFormat("full");

export function WeeklyHabitGrid({ weekData }: { weekData: { year: number; week: number } }) {
  const { data: habits = [] }: { data: HabitEntitiesRpc } = useWeekDataMapped(weekData.year, weekData.week);

  return React.useMemo(() => {
    return habits.map((habit) => {
      const weeklyTotalCount = calculateWeeklyTotal(habit);
      const weeklyTarget = calculateWeeklyTarget(habit);

      return (
        <React.Fragment key={habit.id}>
          <div className="col-start-1 truncate text-xs lg:text-lg lg:font-semibold">{habit.name}</div>

          {renderDayCells(habit, weekData, weeklyTotalCount)}

          <MedalIcon weeklyTotalCount={weeklyTotalCount} targetCount={weeklyTarget} className="col-start-9" />
        </React.Fragment>
      );
    });
  }, [habits, weekData]);
}

function calculateWeeklyTotal(habit: HabitEntityRpc): number {
  return Object.values(habit.habit_statuses || {}).reduce(
    (total, status) => total + (status?.completion_count || 0) + (status?.skipped_count || 0),
    0,
  );
}

function calculateWeeklyTarget(habit: HabitEntityRpc): number {
  if (habit.type === HabitType.WEEKLY) {
    return habit.target_count;
  } else if (habit.type === HabitType.DAILY) {
    return habit.target_count * 7;
  } else if (habit.type === HabitType.CUSTOM) {
    const activeDays = Object.values(habit.days_of_week || {}).filter(Boolean).length;
    return habit.target_count * activeDays;
  }
  return 0;
}

// function calculateCountUntilDay(habit: HabitEntityRpc, dayNumber: number): number {
//   return Object.entries(habit.habit_statuses || {})
//     .filter(([day]) => +day <= dayNumber)
//     .reduce((total, [_, status]) => total + (status?.completion_count || 0) + (status?.skipped_count || 0), 0);
// }

function calculateCountUntilDay(habit: HabitEntityRpc, dayNumber: number): number {
  return Object.values(habit.habit_statuses || {})
    .filter((_, idx) => +Object.keys(habit.habit_statuses || {})[idx] <= dayNumber)
    .reduce((total, status) => total + (status?.completion_count || 0) + (status?.skipped_count || 0), 0);
}

function getDayStatusCount(habit: HabitEntityRpc, dayNumber: number): number {
  const status = habit.habit_statuses?.[dayNumber];
  return (status?.completion_count || 0) + (status?.skipped_count || 0);
}

function renderDayCells(habit: HabitEntityRpc, weekData: { year: number; week: number }, weeklyTotalCount: number) {
  return dayNames.map((dayName, idx) => {
    const dayNumber = idx + 1;
    const isFutureDay = isAfterToday(weekData.year, weekData.week, dayNumber);

    if (habit.type === HabitType.WEEKLY) {
      const hasStatusForDay = !!habit.habit_statuses?.[dayNumber];
      const isUnderTarget = weeklyTotalCount < habit.target_count;

      if ((!hasStatusForDay && !isUnderTarget) || isFutureDay) return null;
    }

    if (habit.type === HabitType.CUSTOM && !habit.days_of_week?.[dayNumber as keyof HabitEntityRpc["days_of_week"]]) {
      return null;
    }

    const countUntilToday = calculateCountUntilDay(habit, dayNumber);
    const countForDay = getDayStatusCount(habit, dayNumber);

    return (
      <SelectDayStatus
        key={`${habit.id}-${dayName}`}
        habit={habit}
        habitDayStatus={habit.habit_statuses?.[dayNumber]}
        cumulativeCountWeekly={weeklyTotalCount}
        cumulativeCountUntilToday={countUntilToday}
        cumulativeCountDay={countForDay}
        year={weekData.year}
        week={weekData.week}
        dayNumber={dayNumber}
      />
    );
  });
}
