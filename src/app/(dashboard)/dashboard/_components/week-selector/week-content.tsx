import * as React from "react";

import { HabitGrid } from "./week-content/weekly-habit-grid";
import { DayNameRow } from "./week-content/day-name-row";
import { DayNumberRow } from "./week-content/day-number-row";

export default function WeekContent({ weekData }: { weekData: { year: number; week: number } }) {
  return (
    <div className="h-full text-center">
      <h3 className="mb-4 text-2xl font-bold">{`Year: ${weekData.year} Week: ${weekData.week}`}</h3>

      <div className="grid h-full grid-cols-8 place-content-start gap-4">
        <DayNameRow />
        <DayNumberRow weekData={weekData} />
        <HabitGrid weekData={weekData} />
      </div>
    </div>
  );
}
