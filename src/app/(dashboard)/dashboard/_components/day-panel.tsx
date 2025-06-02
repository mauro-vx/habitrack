"use client";

import * as React from "react";

import { DaySelector } from "./day-panel/day-selector";
import { DayView } from "./day-panel/day-view";
import { addDays, format, startOfDay, subDays } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchDay } from "@/app/(dashboard)/dashboard/_services/client";

export function DayPanel() {
  const [selectedDate, setSelectedDate] = React.useState(startOfDay(new Date()));
  const queryClient = useQueryClient();

  const prefetchAdjacentDay = React.useCallback(
    async (date: Date) => {
      try {
        await prefetchDay(queryClient, date);
      } catch (err) {
        console.error("Error prefetching day:", err);
      }
    },
    [queryClient],
  );

  const goToPreviousDay = React.useCallback(() => {
    const newDate = subDays(selectedDate, 1);

    prefetchAdjacentDay(subDays(newDate, 1));
    setSelectedDate(newDate);
  }, [selectedDate, prefetchAdjacentDay]);

  const goToNextDay = React.useCallback(() => {
    const newDate = addDays(selectedDate, 1);

    prefetchAdjacentDay(addDays(newDate, 1));
    setSelectedDate(newDate);
  }, [selectedDate, prefetchAdjacentDay]);

  return (
    <>
      <DaySelector selectedDate={selectedDate} onClickPrevious={goToPreviousDay} onClickNext={goToNextDay} />
      <React.Suspense fallback={<div>Loading for {format(selectedDate, "EEEE, MMMM do yyyy")}...</div>}>
        <DayView selectedDate={selectedDate} />
      </React.Suspense>
    </>
  );
}
