import * as React from "react";

import { HabitEntitiesRpc, HabitEntityRpc } from "@/app/types";
import { useWeekDataMapped } from "@/app/(dashboard)/dashboard/_utils/client";
import { DayNameRow } from "./week-content/day-name-row";
import { DayNumberRow } from "./week-content/day-number-row";
import { HabitName } from "./week-content/habit-name";
import { DayStatusCells } from "./week-content/day-status-cells";
import { WeekProgressBadge } from "./week-content/week-progress-badge";
import { DaySummaryBadge } from "./week-content/day-summary-badge";

export function WeekView({ weekData }: { weekData: { year: number; week: number } }) {
  const { data: habits = [] }: { data: HabitEntitiesRpc } = useWeekDataMapped(weekData.year, weekData.week);

  const dayHeaderElement = React.useMemo(
    () => (
      <div className="grid grid-cols-9 place-content-start place-items-center gap-2 lg:gap-4">
        <DayNameRow />
        <DayNumberRow weekData={weekData} />
      </div>
    ),
    [weekData],
  );

  const habitElements = React.useMemo(() => {
    return (
      <div className="grid grid-cols-9 place-items-center gap-2 overflow-y-scroll py-2 lg:gap-4 lg:pt-4">
        {habits.map((habit) => {
          const weeklyTotalCount = calculateWeeklyTotal(habit);

          return (
            <React.Fragment key={habit.id}>
              <HabitName name={habit.name} />
              <DayStatusCells habit={habit} weeklyTotalCount={weeklyTotalCount} weekData={weekData} />
              <WeekProgressBadge habit={habit} weeklyTotalCount={weeklyTotalCount} />
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [habits, weekData]);

  const daySummaryElement = React.useMemo(() => (
    <DaySummaryBadge habits={habits} />
  ), [habits]);


  return (
    <>
      {dayHeaderElement}
      {habitElements}
      {daySummaryElement}
    </>
  );
}

function calculateWeeklyTotal(habit: HabitEntityRpc): number {
  return Object.values(habit.habit_statuses || {}).reduce(
    (total, status) => total + (status?.completion_count || 0) + (status?.skipped_count || 0),
    0,
  );
}
