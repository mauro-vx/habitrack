import * as React from "react";

import { HabitEntitiesRpc } from "@/app/types";
import { calculateWeeklyTotal } from "./week-records/utils";
import { HabitName } from "./week-records/habit-name";
import { DayStatusCells } from "./week-records/day-status-cells";
import { WeekProgressBadge } from "./week-records/week-progress-badge";

export function WeekRecords({
  habits,
  weekData,
}: {
  habits: HabitEntitiesRpc;
  weekData: { year: number; week: number };
}) {
  const habitElements = React.useMemo(() => {
    return (
      <div className="grid grid-cols-9 auto-rows-[minmax(50px,auto)] lg:auto-rows-[minmax(80px,auto)] place-items-center gap-0 overflow-y-auto py-2 lg:py-4">

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

  return <>{habitElements}</>;
}
