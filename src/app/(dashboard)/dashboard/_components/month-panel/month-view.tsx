import { useMemo } from "react";
import { getDay, getDaysInMonth } from "date-fns";

import { getDayNamesByFormat } from "@/app/(dashboard)/dashboard/_utils/date";
import { useMonthData } from "@/app/(dashboard)/dashboard/_utils/client";
import { DayCell } from "./month-view/day-cell";

export function MonthView({ selectedMonth }: { selectedMonth: Date }) {
  const { data: monthData = [] } = useMonthData(selectedMonth);

  const daysInMonth = getDaysInMonth(selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);

  const firstDayOfMonth = getDay(selectedMonth);
  const emptyCellCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const emptyCells = Array.from({ length: emptyCellCount });

  const dayNamesArray = useMemo(() => getDayNamesByFormat("short"), []);

  return (
    <div className="mb-4 grid grid-cols-7 gap-1">
      {dayNamesArray.map((dayName) => (
        <div key={dayName} className="p-2 text-center font-bold">
          {dayName}
        </div>
      ))}

      {emptyCells.map((_, idx) => (
        <div key={`empty-${idx}`} className="h-24 rounded border bg-dark p-2" />
      ))}

      {days.map((dayNumber) => (
        <DayCell key={dayNumber} dayNumber={dayNumber} selectedMonth={selectedMonth} monthData={monthData} />
      ))}
    </div>
  );
}
