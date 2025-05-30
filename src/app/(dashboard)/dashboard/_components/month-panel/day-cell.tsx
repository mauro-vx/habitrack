import { addDays, getDay, isSameDay, startOfMonth } from "date-fns";

import { HabitEntitiesWeekRpc, HabitEntityWeekRpc } from "@/app/types";
import { cn, getWeekDateSeries } from "@/lib/utils";
import { ListDisplay } from "./list-display";

export function DayCell({
  dayNumber,
  selectedMonth,
  monthData,
}: {
  dayNumber: number;
  selectedMonth: Date;
  monthData: HabitEntitiesWeekRpc;
}) {
  const dayDate = addDays(startOfMonth(selectedMonth), dayNumber - 1);

  const habitsForDay = monthData.filter((habit) => isHabitScheduledForDay(habit, dayDate));

  return (
    <div
      className={cn(
        "flex h-24 flex-col justify-between gap-1 rounded border p-2 hover:bg-gray-600 lg:gap-2",
        isSameDay(new Date(), dayDate) && "border-brand",
      )}
    >
      <span className="text-xs font-bold lg:text-sm">{dayNumber}</span>

      {habitsForDay.length > 0 ? (
        <ListDisplay habits={habitsForDay} dayNumber={dayNumber} />
      ) : (
        <div className="text-xs text-gray-400">No habits</div>
      )}
    </div>
  );
}

const isHabitScheduledForDay = (habit: HabitEntityWeekRpc, dayDate: Date): boolean => {
  const { year, week } = getWeekDateSeries(dayDate).current;

  if (!habit.start_year || !habit.start_week) return false;

  if (habit.start_year > year || (habit.start_year === year && habit.start_week > week)) return false;

  if (habit.end_year && habit.end_week && (habit.end_year < year || (habit.end_year === year && habit.end_week < week)))
    return false;

  const dayOfWeek = getDay(dayDate) || 7;

  return !!habit.days_of_week?.[dayOfWeek as keyof typeof habit.days_of_week];
};
