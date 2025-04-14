import * as React from "react";

import { cn } from "@/lib/utils";
import { getDayNumbersOfWeek } from "@/app/(dashboard)/dashboard/_utils/date";

export function DayNumberRow({ weekData }: { weekData: { year: number; week: number } }) {
  const dayNumbers = getDayNumbersOfWeek(weekData.year, weekData.week);

  return dayNumbers.map((dayNumber, idx) => (
    <div key={dayNumber} className={cn("p-2 font-medium", !idx && "col-start-2")}>
      {dayNumber}
    </div>
  ));
}