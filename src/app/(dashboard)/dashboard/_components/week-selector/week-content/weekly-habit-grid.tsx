import * as React from "react";

import { Medal } from "lucide-react";

import { HabitEntitiesRpc, HabitEntityRpc } from "@/app/types";
import { HabitType } from "@/app/enums";
import { useWeekDataMapped } from "@/app/(dashboard)/dashboard/_utils/client";
import { getDayNamesByFormat, isAfterToday } from "@/app/(dashboard)/dashboard/_utils/date";
import SelectDayStatus from "./weekly-habit-grid/select-day-status";

const dayNames = getDayNamesByFormat("full");

export function HabitGrid({ weekData }: { weekData: { year: number; week: number } }) {
  const { data: habits }: { data: HabitEntitiesRpc } = useWeekDataMapped(weekData.year, weekData.week);

  return React.useMemo(
    () =>
      habits.map((habit) => {
        const cumulativeCountWeekly = Object.values(habit.habit_statuses || {}).reduce(
          (total, status) => total + (status.completion_count || 0) + (status.skipped_count || 0),
          0,
        );

        return (
          <React.Fragment key={habit.id}>
            <div className="col-start-1 truncate text-xs lg:text-lg lg:font-semibold">{habit.name}</div>

            {dayNames.map((dayName, idx) => {
              const dayNumber = idx + 1;

              const cumulativeCountUntilToday = Object.keys(habit.habit_statuses || {})
                .filter((dayKey) => +dayKey <= dayNumber)
                .reduce((cumulativeCount, dayKey) => {
                  const status = habit.habit_statuses?.[+dayKey];
                  return cumulativeCount + (status?.completion_count || 0) + (status?.skipped_count || 0);
                }, 0);

              const isFutureDay = isAfterToday(weekData.year, weekData.week, dayNumber);

              if (habit.type === HabitType.WEEKLY) {
                if (!(habit.habit_statuses?.[dayNumber] || cumulativeCountWeekly < habit.target_count) || isFutureDay) {
                  return null;
                }
              }

              if (
                habit.type === HabitType.CUSTOM &&
                !habit.days_of_week?.[dayNumber as keyof HabitEntityRpc["days_of_week"]]
              )
                return null;

              const cumulativeCountDay =
                (habit.habit_statuses[dayNumber]?.completion_count || 0) +
                (habit.habit_statuses[dayNumber]?.skipped_count || 0);

              return (
                <SelectDayStatus
                  key={`${habit.id}-${dayName}`}
                  habit={habit}
                  habitDayStatus={habit.habit_statuses[dayNumber]}
                  cumulativeCountWeekly={cumulativeCountWeekly}
                  cumulativeCountUntilToday={cumulativeCountUntilToday}
                  cumulativeCountDay={cumulativeCountDay}
                  year={weekData.year}
                  week={weekData.week}
                  dayNumber={dayNumber}
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
