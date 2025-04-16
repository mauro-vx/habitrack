import * as React from "react";

import { HabitEntitiesRpc } from "@/app/types";
import { cn } from "@/lib/utils";
import { useWeekDataMapped } from "@/app/(dashboard)/dashboard/_utils/client";
import SelectDayStatus from "./weekly-habit-grid/select-day-status";
import { getDayNamesByFormat, isBeforeToday, isToday } from "@/app/(dashboard)/dashboard/_utils/date";
import { HabitStatus, HabitType } from "@/app/enums";

const dayNames = getDayNamesByFormat("full");

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
  const { data: habits }: { data: HabitEntitiesRpc } = useWeekDataMapped(weekData.year, weekData.week);

  return React.useMemo(
    () =>
      habits.map((habit) => {
        return (
          <React.Fragment key={habit.id}>
            <div className="col-start-1 p-2 text-xl font-bold">{habit.name}</div>

            {dayNames.map((dayName, idx) => {
              const dayNumber = idx + 1;

              const dayStatus = habit.habit_statuses[dayNumber];
              const isCurrentDay = isToday(weekData.year, weekData.week, dayNumber);
              const isPastDay = isBeforeToday(weekData.year, weekData.week, dayNumber);
              const baseClassName = cn(getColStartClass(dayNumber), "place-self-center");

              if (habit.type === HabitType.DAILY) {
                let status: HabitStatus;

                if (!dayStatus) {
                  status = isPastDay ? HabitStatus.INCOMPLETE : HabitStatus.PENDING;
                } else {
                  const { skipped_count, completion_count } = dayStatus;
                  const totalCount = (skipped_count || 0) + (completion_count || 0);

                  if (skipped_count === habit.target_count) {
                    status = HabitStatus.SKIP;
                  } else if (totalCount === habit.target_count) {
                    status = HabitStatus.DONE;
                  } else if (totalCount < habit.target_count) {
                    status = HabitStatus.PROGRESS;
                  } else {
                    status = HabitStatus.PENDING;
                  }
                }

                const keyPrefix = dayStatus ? "daily-with-status" : "daily-no-status";
                return (
                  <SelectDayStatus
                    key={`${keyPrefix}-${dayName}`}
                    status={status}
                    className={baseClassName}
                    habitTarget={habit.target_count}
                    dailyCompletion={dayStatus?.completion_count}
                    dailySkip={dayStatus?.skipped_count}
                  />
                );
              }

              if (habit.type === HabitType.WEEKLY) {
                const lastKnownStatus = Object.values(habit.habit_statuses).at(-1);
                const currentDayStatus = isCurrentDay && !dayStatus ? lastKnownStatus : dayStatus;

                if (!currentDayStatus && !isCurrentDay) {
                  return null;
                }

                let status: HabitStatus;

                const skipped_count = currentDayStatus?.skipped_count || 0;
                const completion_count = currentDayStatus?.completion_count || 0;
                const totalCount = skipped_count + completion_count;

                if (skipped_count === habit.target_count) {
                  status = HabitStatus.SKIP;
                } else if (totalCount === habit.target_count) {
                  status = HabitStatus.DONE;
                } else if (totalCount < habit.target_count) {
                  status = HabitStatus.PROGRESS;
                } else {
                  status = HabitStatus.PENDING;
                }

                return (
                  <SelectDayStatus
                    key={`weekly-${dayName}`}
                    status={status}
                    className={baseClassName}
                    habitTarget={habit.target_count}
                    dailyCompletion={completion_count}
                    dailySkip={skipped_count}
                  />
                );
              }

              if (habit.type === HabitType.CUSTOM) {
                const isHabitActiveToday = habit.days_of_week?.[dayNumber as keyof typeof habit.days_of_week];

                if (!isHabitActiveToday) {
                  return null;
                }

                let status: HabitStatus;

                if (!dayStatus) {
                  status = isPastDay ? HabitStatus.INCOMPLETE : HabitStatus.PENDING;
                } else {
                  const { skipped_count, completion_count } = dayStatus;
                  const totalCount = (skipped_count || 0) + (completion_count || 0);

                  if (skipped_count === habit.target_count) {
                    status = HabitStatus.SKIP;
                  } else if (totalCount === habit.target_count) {
                    status = HabitStatus.DONE;
                  } else if (totalCount < habit.target_count) {
                    status = HabitStatus.PROGRESS;
                  } else {
                    status = HabitStatus.PENDING;
                  }
                }

                const keyPrefix = dayStatus ? "daily-with-status" : "daily-no-status";

                return (
                  <SelectDayStatus
                    key={`${keyPrefix}-${dayName}`}
                    status={status}
                    className={baseClassName}
                    habitTarget={habit.target_count}
                    dailyCompletion={dayStatus?.completion_count}
                    dailySkip={dayStatus?.skipped_count}
                  />
                );
              }

              return null;
            })}
          </React.Fragment>
        );
      }),
    [habits, weekData.week, weekData.year],
  );
}
