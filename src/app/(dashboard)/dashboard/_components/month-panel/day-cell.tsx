import { addDays, getDay, isSameDay, startOfMonth } from "date-fns";
import { cn, getWeekDateSeries } from "@/lib/utils";
import { Tables } from "@/lib/supabase/database.types";
import { ListDisplay } from "./list-display";

type DayCellProps = {
  dayNumber: number;
  selectedMonth: Date;
  monthData: Tables<"habits">[];
};

export function DayCell({ dayNumber, selectedMonth, monthData }: DayCellProps) {
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

// const isHabitScheduledForDay = (habit: Tables<"habits">, dayDate: Date): boolean => {
//   // Get the week number for the target day
//   const {
//     current: { year, week },
//   } = getWeekDateSeries(dayDate);
//
//   if (!habit.start_year || !habit.start_week) {
//     return false;
//   }
//
//   // Check start year and week: must be the same year (and <= week) or a previous year
//   const isBeforeStart = habit.start_year > year || (habit.start_year === year && habit.start_week > week);
//
//   if (isBeforeStart) return false;
//
//   // Check end year and week: must be >= target week, or a later year, or null (ongoing)
//   const isAfterEnd =
//     habit.end_year !== null &&
//     habit.end_week !== null &&
//     (habit.end_year < year || (habit.end_year === year && habit.end_week < week));
//
//   if (isAfterEnd) return false;
//
//   // Determine the target day of the week (ISO standard: Monday = 1, Sunday = 7)
//   const dayOfWeek = getDay(dayDate) === 0 ? 7 : getDay(dayDate);
//
//   // Verify if the habit is scheduled for this day of the week
//   return habit.days_of_week?.[dayOfWeek as keyof typeof habit.days_of_week] || false;
// };

const isHabitScheduledForDay = (habit: Tables<"habits">, dayDate: Date): boolean => {
  const { year, week } = getWeekDateSeries(dayDate).current;

  if (!habit.start_year || !habit.start_week) return false;

  if (habit.start_year > year || (habit.start_year === year && habit.start_week > week)) return false;

  if (habit.end_year && habit.end_week && (habit.end_year < year || (habit.end_year === year && habit.end_week < week)))
    return false;

  const dayOfWeek = getDay(dayDate) || 7;

  return !!habit.days_of_week?.[dayOfWeek as keyof typeof habit.days_of_week];
};
