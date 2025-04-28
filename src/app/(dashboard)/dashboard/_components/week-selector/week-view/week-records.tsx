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
      <div className="grid grid-cols-9 place-items-center gap-1 overflow-y-scroll py-2 lg:gap-2 lg:pt-4">
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
