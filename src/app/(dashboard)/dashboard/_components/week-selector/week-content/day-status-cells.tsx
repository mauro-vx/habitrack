import * as React from "react";

import { HabitEntityRpc } from "@/app/types";
import { HabitType } from "@/app/enums";
import { isAfterToday } from "@/app/(dashboard)/dashboard/_utils/date";
import { DayStatusSelect } from "@/app/(dashboard)/dashboard/_components/week-selector/week-content/day-status-cells/day-status-select";
import { COL_START_CLASSES } from "@/app/(dashboard)/dashboard/_components/week-selector/week-content/_utils/grid-column-utils";
import { DAYS_OF_WEEK } from "@/app/(dashboard)/dashboard/constants";

export function DayStatusCells({
  habit,
  weekData,
  weeklyTotalCount,
}: {
  habit: HabitEntityRpc;
  weekData: { year: number; week: number };
  weeklyTotalCount: number;
}) {
  return DAYS_OF_WEEK.map((dayNumber) => {
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
      <DayStatusSelect
        key={`${habit.id}-${dayNumber}`}
        habit={habit}
        habitDayStatus={habit.habit_statuses?.[dayNumber]}
        cumulativeCountWeekly={weeklyTotalCount}
        cumulativeCountUntilToday={countUntilToday}
        cumulativeCountDay={countForDay}
        year={weekData.year}
        week={weekData.week}
        dayNumber={dayNumber}
        className={COL_START_CLASSES[dayNumber]}
      />
    );
  });
}

function calculateCountUntilDay(habit: HabitEntityRpc, dayNumber: number): number {
  return Object.values(habit.habit_statuses || {})
    .filter((_, idx) => +Object.keys(habit.habit_statuses || {})[idx] <= dayNumber)
    .reduce((total, status) => total + (status?.completion_count || 0) + (status?.skipped_count || 0), 0);
}

function getDayStatusCount(habit: HabitEntityRpc, dayNumber: number): number {
  const status = habit.habit_statuses?.[dayNumber];
  return (status?.completion_count || 0) + (status?.skipped_count || 0);
}
