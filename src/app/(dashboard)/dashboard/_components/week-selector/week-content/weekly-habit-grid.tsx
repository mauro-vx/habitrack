import * as React from "react";

import { HabitEntitiesRpc, HabitEntityRpc } from "@/app/types";
import { Database } from "@/lib/supabase/database.types";
import { HabitStatus, HabitType } from "@/app/enums";
import { useWeekDataMapped } from "@/app/(dashboard)/dashboard/_utils/client";
import { getDayNamesByFormat, isBeforeToday, isToday } from "@/app/(dashboard)/dashboard/_utils/date";
import SelectDayStatus from "./weekly-habit-grid/select-day-status";

const dayNames = getDayNamesByFormat("full");

const getHabitStatus = (
  dayStatus: HabitEntityRpc["habit_statuses"][0],
  targetCount: HabitEntityRpc["target_count"],
  isPastDay: boolean,
): HabitStatus => {
  if (!dayStatus) {
    return isPastDay ? HabitStatus.INCOMPLETE : HabitStatus.PENDING;
  }

  const { skipped_count = 0, completion_count = 0 } = dayStatus;
  const totalCount = (skipped_count || 0) + (completion_count || 0);

  if (skipped_count === targetCount) return HabitStatus.SKIP;
  if (totalCount === targetCount) return HabitStatus.DONE;
  if (totalCount < targetCount) return HabitStatus.PROGRESS;

  return HabitStatus.PENDING;
};

const shouldRenderHabitType = (
  habit: HabitEntityRpc,
  habitType: Database["public"]["Enums"]["habit_type"],
  dayStatus: HabitEntityRpc["habit_statuses"][0],
  dayNumber: number,
  isCurrentDay: boolean,
): boolean => {
  if (habitType === HabitType.DAILY) {
    return true;
  }

  if (habitType === HabitType.WEEKLY) {
    const lastKnownStatus = Object.values(habit.habit_statuses).at(-1);
    const currentDayStatus = isCurrentDay && !dayStatus ? lastKnownStatus : dayStatus;
    return !!currentDayStatus || isCurrentDay;
  }

  if (habitType === HabitType.CUSTOM) {
    return !!habit.days_of_week?.[dayNumber as keyof typeof habit.days_of_week];
  }

  return false;
};

export function HabitGrid({ weekData }: { weekData: { year: number; week: number } }) {
  const { data: habits }: { data: HabitEntitiesRpc } = useWeekDataMapped(weekData.year, weekData.week);

  return React.useMemo(
    () =>
      habits.map((habit) => (
        <React.Fragment key={habit.id}>
          <div className="col-start-1 p-2 text-xl font-bold">{habit.name}</div>

          {dayNames.map((dayName, idx) => {
            const dayNumber = idx + 1; // Day number (1-based)
            const dayStatus = habit.habit_statuses[dayNumber];
            const isCurrentDay = isToday(weekData.year, weekData.week, dayNumber);
            const isPastDay = isBeforeToday(weekData.year, weekData.week, dayNumber);

            const status = getHabitStatus(dayStatus, habit.target_count, isPastDay);
            const shouldRender = shouldRenderHabitType(habit, habit.type, dayStatus, dayNumber, isCurrentDay);

            if (!shouldRender) return null;

            return (
              <SelectDayStatus
                key={`${habit.id}-${dayName}`}
                status={status}
                habitTarget={habit.target_count}
                dailyCompletion={dayStatus?.completion_count}
                dailySkip={dayStatus?.skipped_count}
                dayNumber={dayNumber}
              />
            );
          })}
        </React.Fragment>
      )),
    [habits, weekData.week, weekData.year],
  );
}
