"use client";

import * as React from 'react';

import { format, addDays, subDays } from "date-fns";

import { useDayDataMapped } from "../_utils/client";
import { getDayMonthYear } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DaySelector() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const { day, month, year } = getDayMonthYear(selectedDate);

  const { data: dayData } = useDayDataMapped(year, month, day);

  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <Button variant="ghost" size="icon"  onClick={goToPreviousDay} aria-label="Previous day">
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-center min-w-64">
         {format(selectedDate, 'PPPP')}
        </span>
        <Button variant="ghost" size="icon" onClick={goToNextDay} aria-label="Next day">
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {dayData.map(habit => (
          <div key={habit.id} className="border p-4 rounded">
            <h3>{habit.name}</h3>
            <p>{habit.description}</p>

            {habit.habit_status ? (
              <div>
                <p>Completion: {habit.habit_status.completion_count || 0}/{habit.target_count}</p>
                <p>Skipped: {habit.habit_status.skipped_count}</p>
              </div>
            ) : (
              <p>No data for this day</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
