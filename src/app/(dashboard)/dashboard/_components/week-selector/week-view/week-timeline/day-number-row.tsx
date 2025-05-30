import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

import { cn } from "@/lib/utils";

export function DayNumberRow({ weekStartDate }: { weekStartDate: Date }) {
  
  const weekDates = eachDayOfInterval({
    start: startOfWeek(weekStartDate, { weekStartsOn: 1 }),
    end: endOfWeek(weekStartDate, { weekStartsOn: 1 }),
  });

  const now = new Date();

  return weekDates.map((dayDate, idx) => (
    <span
      key={dayDate.toISOString()}
      className={cn(
        "flex size-8 lg:size-12 items-center justify-center text-sm lg:text-base lg:font-medium",
        !idx && "col-start-2",
        isSameDay(now, dayDate) &&"rounded-md border-2 border-brand",
      )}
    >
      {format(dayDate, "d")}
    </span>
  ));
}
