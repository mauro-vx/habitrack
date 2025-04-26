import * as React from "react";

import { WeeklyHabitGrid } from "./week-content/weekly-habit-grid";
import { DayNameRow } from "./week-content/day-name-row";
import { DayNumberRow } from "./week-content/day-number-row";

export function WeekContent({ weekData }: { weekData: { year: number; week: number } }) {
  return (
    <>
      <div className="grid grid-cols-9 place-content-start place-items-center gap-2 lg:gap-4">
        <DayNameRow />
        <DayNumberRow weekData={weekData} />
      </div>

      <div className="grid grid-cols-9 place-items-center gap-2 overflow-y-scroll lg:gap-4 py-2 lg:pt-4">
        <WeeklyHabitGrid weekData={weekData} />
      </div>
    </>
  );
}
