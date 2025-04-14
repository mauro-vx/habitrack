import * as React from "react";

import { HabitEntities } from "@/app/types";
import { cn } from "@/lib/utils";
import { useWeekData } from "@/app/(dashboard)/dashboard/_utils/client";
import SelectDayStatus from "./weekly-habit-grid/select-day-status";

const getColStartClass = (dayIndex: number) => {
  const colStartClasses: Record<number, string> = {
    1: "col-start-2",
    2: "col-start-3",
    3: "col-start-4",
    4: "col-start-5",
    5: "col-start-6",
    6: "col-start-7",
    7: "col-start-8",
  };
  return colStartClasses[dayIndex];
};

export function HabitGrid({ weekData }: { weekData: { year: number; week: number } }) {
  const { data: habits }: { data: HabitEntities } = useWeekData(weekData.year, weekData.week);

  return React.useMemo(
    () =>
      habits.map((habit) => (
        <React.Fragment key={habit.id}>
          <div className="col-start-1 p-2 text-xl font-bold">{habit.name}</div>

          {habit.habit_statuses.map((habit_status) => {
            if (!habit_status.day_number) return null;

            return (
              <SelectDayStatus
                key={habit_status.id}
                status={habit_status.status}
                className={cn(getColStartClass(habit_status.day_number), "place-self-center")}
              />
            );
          })}
        </React.Fragment>
      )),
    [habits],
  );
}
