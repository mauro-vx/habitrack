import * as React from "react";

import { HabitEntitiesWeekRpc } from "@/app/types";
import { calculateWeeklyTotal } from "./week-records/utils";
import { HabitName } from "./week-records/habit-name";
import { DayStatusCells } from "./week-records/day-status-cells";
import { WeekProgressBadge } from "./week-records/week-progress-badge";
import { Separator } from "@/components/ui/separator";

export function WeekRecords({ habits, weekStartDate }: { habits: HabitEntitiesWeekRpc; weekStartDate: Date }) {
  const habitElements = React.useMemo(() => {
    return (
      <>
        <Separator />

        <div className="grid auto-rows-[minmax(50px,auto)] grid-cols-9 place-items-center gap-0 overflow-y-auto py-2 lg:auto-rows-[minmax(56px,auto)] lg:py-4">
          {habits.map((habit) => {
            const weeklyTotalCount = calculateWeeklyTotal(habit);

            return (
              <React.Fragment key={habit.id}>
                <HabitName name={habit.name} />
                <DayStatusCells habit={habit} weeklyTotalCount={weeklyTotalCount} weekStartDate={weekStartDate} />
                <WeekProgressBadge habit={habit} weeklyTotalCount={weeklyTotalCount} />
              </React.Fragment>
            );
          })}
        </div>
      </>
    );
  }, [habits, weekStartDate]);

  return <>{habitElements}</>;
}
