"use client";

import * as React from "react";

import { Suspense, useEffect, useCallback } from "react";
import { format, addDays, subDays, startOfDay } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

import { useDayData, fetchDayDataClient } from "../_utils/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DaySelector() {
  const [selectedDate, setSelectedDate] = React.useState(startOfDay(new Date()));
  const queryClient = useQueryClient();

  const prefetchAdjacentDay = useCallback(
    (date: Date) => {
      const normalizedDate = startOfDay(date).toISOString();
      queryClient.prefetchQuery({
        queryKey: ["dayData", normalizedDate],
        queryFn: () => fetchDayDataClient(date),
      });
    },
    [queryClient],
  );

  const goToPreviousDay = useCallback(() => {
    const newDate = subDays(selectedDate, 1);
    prefetchAdjacentDay(subDays(newDate, 1));
    setSelectedDate(newDate);
  }, [selectedDate, prefetchAdjacentDay]);

  const goToNextDay = useCallback(() => {
    const newDate = addDays(selectedDate, 1);
    prefetchAdjacentDay(addDays(newDate, 1));
    setSelectedDate(newDate);
  }, [selectedDate, prefetchAdjacentDay]);

  useEffect(() => {
    prefetchAdjacentDay(subDays(selectedDate, 1));
    prefetchAdjacentDay(addDays(selectedDate, 1));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DaySelectorContent selectedDate={selectedDate} goToPreviousDay={goToPreviousDay} goToNextDay={goToNextDay} />
    </Suspense>
  );
}

function DaySelectorContent({
  selectedDate,
  goToPreviousDay,
  goToNextDay,
}: {
  selectedDate: Date;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
}) {
  const { data: dayData } = useDayData(selectedDate);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-center">
        <Button variant="ghost" size="icon" onClick={goToPreviousDay} aria-label="Previous day">
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-64 text-center">{format(selectedDate, "PPPP")}</span>
        <Button variant="ghost" size="icon" onClick={goToNextDay} aria-label="Next day">
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {!dayData.length ? (
          <div className="flex flex-col rounded border p-4">
          <p>No data for this day</p>
          </div>
        ) : (
          dayData.map((habit) => (
            <div key={habit.id} className="flex flex-col gap-0.5 rounded border p-4 lg:gap-1">
              <h2 className="text-md underline underline-offset-6 lg:text-xl">{habit.name}</h2>
              <p>{habit.description}</p>

              {habit.habit_status && (
                <div className="text-sm lg:text-lg">
                  <p>
                    Completion: {habit.habit_status.completion_count || 0}/{habit.target_count}
                  </p>
                  <p>Skipped: {habit.habit_status.skipped_count}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
