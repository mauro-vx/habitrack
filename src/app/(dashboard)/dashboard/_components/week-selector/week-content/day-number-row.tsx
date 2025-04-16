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
    <div
      key={dayNumber}
      className={cn(
        "p-2 font-medium",
        !idx && "col-start-2",
        isCurrentWeekAndYear && dayNumber === currentDay && "rounded-full border-2 border-blue-500"
      )}
    >
      {dayNumber}
    </div>
  ));
}