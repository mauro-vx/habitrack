"use client";

import * as React from "react";

import { format, getDaysInMonth, setDate, startOfMonth, getDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useMonthDataMapped } from "../_utils/client";
import { getAdjacentMonths, getMonthAndYear } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getDayNamesByFormat } from "@/app/(dashboard)/dashboard/_utils/date";
import { HabitEntityWeekRpc } from "@/app/types";
import { Tables } from "@/lib/supabase/database.types";

export function MonthSelector() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const { month, year } = getMonthAndYear(selectedDate);

  const { data: monthData = [] } = useMonthDataMapped(year, month);

  const goToPreviousMonth = () => {
    const { prevMonth } = getAdjacentMonths(year, month);
    setSelectedDate(new Date(prevMonth.year, prevMonth.month - 1, 1));
  };

  const goToNextMonth = () => {
    const { nextMonth } = getAdjacentMonths(year, month);
    setSelectedDate(new Date(nextMonth.year, nextMonth.month - 1, 1));
  };

  const daysInMonth = getDaysInMonth(selectedDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDayOfMonth = getDay(startOfMonth(selectedDate));
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
        <span className="min-w-32 text-center">{format(selectedDate, "MMMM yyyy")}</span>
        <Button variant="ghost" size="icon" onClick={goToNextMonth} aria-label="Next month">
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-7 gap-1">
        {dayNamesArray.map((day) => (
          <div key={day} className="p-2 text-center font-bold">
            {day}
          </div>
        ))}

        {emptyCells}

        {days.map((day) => {
          const habitsForDay = monthData.filter((habit) => isHabitScheduledForDay(habit, day, month, year));

          return (
            <div
              key={day}
              className="h-24 cursor-pointer overflow-y-auto rounded border p-2 hover:bg-gray-50"
              onClick={() => setSelectedDate(setDate(selectedDate, day))}
            >
              <div className="font-bold">{day}</div>
              {habitsForDay.length > 0 ? (
                habitsForDay.map((habit) => {
                  const status = habit.habit_statuses && habit.habit_statuses[day.toString()];
                  const hasStatus = !!status;

                  return (
                    <div
                      key={habit.id}
                      className={`mb-1 truncate rounded p-1 text-xs ${hasStatus ? "bg-blue-500" : "bg-gray-500"}`}
                    >
                      {habit.name} {hasStatus ? `(${status.completion_count || 0}/${habit.target_count})` : "(pending)"}
                    </div>
                  );
                })
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

const isHabitScheduledForDay = (habit: Tables<"habits">, dayOfMonth: number, month: number, year: number) => {
  const date = new Date(year, month - 1, dayOfMonth);

  const habitStartDate = new Date(habit.start_year!, habit.start_month! - 1, habit.start_day!);

  if (date < habitStartDate) {
    return false;
  }

  if (habit.end_year) {
    const habitEndDate = new Date(habit.end_year, habit.end_month! - 1, habit.end_day!);

    if (date > habitEndDate) {
      return false;
    }
  }

  const dayNumber = date.getDay() === 0 ? 7 : date.getDay();

  return habit.days_of_week && habit.days_of_week[dayNumber as keyof HabitEntityWeekRpc["days_of_week"]];
};
