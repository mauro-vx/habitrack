"use client";

import * as React from "react";

import { addMonths, format, startOfMonth, subMonths } from "date-fns";

import { MonthSelector } from "./month-panel/month-selector";
import { MonthView } from "@/app/(dashboard)/dashboard/_components/month-panel/month-view";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchMonth } from "@/app/(dashboard)/dashboard/_services/client";

export function MonthPanel() {
  const [selectedMonth, setSelectedMonth] = React.useState(startOfMonth(new Date()));
  const queryClient = useQueryClient();

  const prefetchAdjacentMonth = React.useCallback(
    (month: Date) => {
      prefetchMonth(queryClient, month).catch((err) => {
        console.error("Error prefetching month:", err);
      });
    },
    [queryClient],
  );

  const handlePreviousMonth = React.useCallback(() => {
    const newMonth = subMonths(selectedMonth, 1);

    prefetchAdjacentMonth(subMonths(newMonth, 1));
    setSelectedMonth(newMonth);
  }, [selectedMonth, prefetchAdjacentMonth]);

  const handleNextMonth = React.useCallback(() => {
    const newMonth = addMonths(selectedMonth, 1);

    prefetchAdjacentMonth(addMonths(newMonth, 1));
    setSelectedMonth(newMonth);
  }, [selectedMonth, prefetchAdjacentMonth]);

  return (
    <>
      <MonthSelector
        selectedMonth={selectedMonth}
        handlePreviousMonth={handlePreviousMonth}
        handleNextMonth={handleNextMonth}
      />
      <React.Suspense fallback={<div>Loading for {format(selectedMonth, "MMMM yyyy")}...</div>}>
        <MonthView selectedMonth={selectedMonth} />
      </React.Suspense>
    </>
  );
}