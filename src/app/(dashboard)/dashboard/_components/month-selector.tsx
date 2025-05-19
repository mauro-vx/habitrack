"use client";

import * as React from "react";

import { format, getDaysInMonth, setDate, startOfMonth, getDay, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useMonthData } from "../_utils/client";
import { Button } from "@/components/ui/button";
import { getDayNamesByFormat } from "@/app/(dashboard)/dashboard/_utils/date";
import { Tables } from "@/lib/supabase/database.types";

export function MonthSelector() {
  const [selectedMonth, setSelectedMonth] = React.useState(startOfMonth(new Date()));

  const { data: monthData = [] } = useMonthData(selectedMonth);

  const goToPreviousMonth = () => {
    setSelectedMonth(startOfMonth(subMonths(selectedMonth, 1)));
  };

  const goToNextMonth = () => {
    setSelectedMonth(startOfMonth(addMonths(selectedMonth, 1)));
  };

  const daysInMonth = getDaysInMonth(selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDayOfMonth = getDay(startOfMonth(selectedMonth));
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const emptyCells = Array.from({ length: adjustedFirstDay }, (_, i) => (
    <div key={`empty-${i}`} className="h-24 rounded border bg-gray-800 p-2"></div>
  ));

  const dayNamesArray = getDayNamesByFormat("short");

  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth} aria-label="Previous month">
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-32 text-center">{format(selectedMonth, "MMMM yyyy")}</span>
        <Button variant="ghost" size="icon" onClick={goToNextMonth} aria-label="Next month">
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-7 gap-1">
        {dayNamesArray.map((dayName) => (
          <div key={dayName} className="p-2 text-center font-bold">
            {dayName}
          </div>
        ))}

        {emptyCells}

        {days.map((dayNumber) => {
          const habitsForDay = monthData.filter((habit) => isHabitScheduledForDay(habit, selectedMonth, dayNumber));

          return (
            <div
              key={dayNumber}
              className="h-24 cursor-pointer overflow-y-auto rounded border p-2 hover:bg-gray-50 flex flex-col justify-between"
              onClick={() => setSelectedMonth(setDate(selectedMonth, dayNumber))}
            >
              <span className="font-bold">{dayNumber}</span>
              {!!habitsForDay.length ? (
                <div className="flex flex-col gap-y-1">
                  {habitsForDay.map((habit) => {
                    const status = habit.habit_statuses && habit.habit_statuses[dayNumber.toString()];
                    const hasStatus = !!status;

                    return (
                      <div
                        key={habit.id}
                        className={`truncate rounded p-1 text-xs ${hasStatus ? "bg-blue-500" : "bg-gray-500"}`}
                      >
                        {habit.name} {hasStatus && `(${status.completion_count || 0}/${habit.target_count})`}
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
    </div>
  );
}

const isHabitScheduledForDay = (habit: Tables<"habits">, selectedMonth: Date, day: number) => {
  const targetDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day).toISOString();

  if (habit.start_date && targetDate < habit.start_date) {
    return false;
  }

  if (habit.end_date && targetDate > habit.end_date) {
    return false;
  }

  const dayOfWeekISO = getDay(targetDate);
  const adjustedDayOfWeek = dayOfWeekISO === 0 ? 7 : dayOfWeekISO;

  return habit.days_of_week?.[adjustedDayOfWeek as keyof typeof habit.days_of_week] || false;
};
