import * as React from "react";

import { format, getISOWeek, getYear } from "date-fns";

import { cn } from "@/lib/utils";
import { getDayNumbersOfWeek } from "@/app/(dashboard)/dashboard/_utils/date";

export function DayNumberRow({ weekData }: { weekData: { year: number; week: number } }) {
  const dayNumbers = getDayNumbersOfWeek(weekData.year, weekData.week);

  const now = new Date();
  const currentDay = Number(format(now, "d"));
  const currentWeek = getISOWeek(now);
  const currentYear = getYear(now);

  const isCurrentWeekAndYear = weekData.week === currentWeek && weekData.year === currentYear;

  return dayNumbers.map((dayNumber, idx) => (
    <span
      key={dayNumber}
      className={cn(
        "flex size-8 lg:size-12 items-center justify-center text-sm lg:text-base lg:font-medium",
        !idx && "col-start-2",
        isCurrentWeekAndYear && dayNumber === currentDay && "rounded-md border-2 border-blue-500",
      )}
    >
      {dayNumber}
    </span>
  ));
}
