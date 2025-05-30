import { addDays, getDay, getDaysInMonth, isSameDay, startOfMonth } from "date-fns";

import { Tables } from "@/lib/supabase/database.types";
import { cn, getWeekDateSeries } from "@/lib/utils";
import { getDayNamesByFormat } from "@/app/(dashboard)/dashboard/_utils/date";
import { useMonthData } from "@/app/(dashboard)/dashboard/_utils/client";

export function MonthViewOriginal({ selectedMonth }: { selectedMonth: Date }) {
  const { data: monthData = [] } = useMonthData(selectedMonth);

  const daysInMonth = getDaysInMonth(selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);

  const firstDayOfMonth = getDay(selectedMonth);
  const emptyCellCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const emptyCells = Array.from({ length: emptyCellCount });

  const dayNamesArray = getDayNamesByFormat("short");

  return (
    <div className="mb-4 grid grid-cols-7 gap-1">
      {dayNamesArray.map((dayName) => (
        <div key={dayName} className="p-2 text-center font-bold">
          {dayName}
        </div>
      ))}

      {emptyCells.map((idx) => (
        <div key={`empty-${idx}`} className="h-24 rounded border bg-gray-800 p-2" />
      ))}

      {days.map((dayNumber) => {
        const dayDate = addDays(startOfMonth(selectedMonth), dayNumber - 1);

        const habitsForDay = monthData.filter((habit) => isHabitScheduledForDay(habit, selectedMonth, dayNumber));

        return (
          <div
            key={dayNumber}
            className={cn(
              "flex h-24 flex-col justify-between gap-1 rounded border p-2 hover:bg-gray-600 lg:gap-2",
              isSameDay(selectedMonth, dayDate) && "border-brand",
            )}
          >
            <span className="text-xs font-bold lg:text-sm">{dayNumber}</span>

            {!!habitsForDay.length ? (
              <div className="no-scrollbar flex flex-col gap-y-1 overflow-y-auto">
                {habitsForDay.map((habit) => {
                  const status = habit.habit_statuses && habit.habit_statuses[dayNumber.toString()];
                  const hasStatus = !!status;

                  return (
                    <div
                      key={habit.id}
                      className={`flex min-h-8 items-center rounded p-1 ${hasStatus ? "bg-blue-500" : "bg-gray-500"}`}
                    >
                      <span className="truncate text-xs">
                        {habit.name} {hasStatus && `(${status.completion_count || 0}/${habit.target_count})`}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-400">No habits</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const isHabitScheduledForDay = (habit: Tables<"habits">, selectedMonth: Date, day: number): boolean => {
  const { year, month } = getWeekDateSeries(selectedMonth).current;

  const targetDate = new Date(year, month - 1, day);
  const { week: targetWeek } = getWeekDateSeries(targetDate).current;

  const isBeforeStart =
    (habit.start_year! > year) ||
    (habit.start_year === year && habit.start_week! > targetWeek);

  if (isBeforeStart) return false;

  const isAfterEnd =
    habit.end_year !== null &&
    habit.end_week !== null &&
    (habit.end_year < year || (habit.end_year === year && habit.end_week < targetWeek));

  if (isAfterEnd) return false;

  const dayOfWeek = getDay(targetDate) === 0 ? 7 : getDay(targetDate);

  return habit.days_of_week?.[dayOfWeek as keyof typeof habit.days_of_week] || false;
};
