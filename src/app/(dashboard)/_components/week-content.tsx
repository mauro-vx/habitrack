import { useWeekData } from "@/app/(dashboard)/dashboard/_utils/client";
import * as React from "react";

export default function WeekContent({ weekNumber, year }: { weekNumber: number; year: number }) {
  const { data } = useWeekData(weekNumber, year);

  return (
    <div className="text-center">
      <h3 className="mb-4 text-2xl font-bold">Year: {year} Week: {weekNumber}</h3>
      {data.map((habit: { id: string; name: string }) => (
        <h3 key={habit.id} className="mb-4 text-xl font-bold">
          {habit.name}
        </h3>
      ))}
    </div>
  );
}
