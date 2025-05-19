import * as React from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils";

export function DayNumberRow({ weekStartDate }: { weekStartDate: Date }) {
  // Generate all days of the given week
  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(weekStartDate, { weekStartsOn: 1 }),
    end: endOfWeek(weekStartDate, { weekStartsOn: 1 }),
  });


  // Get current date info
  const now = new Date();
  const currentDay = Number(format(now, "d"));
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const isCurrentWeek = weekStartDate.getTime() === currentWeekStart.getTime();

  return daysOfWeek.map((date, idx) => (
    <span
      key={date.toISOString()}
      className={cn(
        "flex size-8 lg:size-12 items-center justify-center text-sm lg:text-base lg:font-medium",
        !idx && "col-start-2",
        isCurrentWeek && Number(format(date, "d")) === currentDay && "rounded-md border-2 border-blue-500",
      )}
    >
      {format(date, "d")}
    </span>
  ));
}
