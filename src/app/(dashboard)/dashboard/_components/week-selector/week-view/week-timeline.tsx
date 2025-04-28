import * as React from "react";

import { DayNameRow } from "./week-timeline/day-name-row";
import { DayNumberRow } from "./week-timeline/day-number-row";

export function WeekTimeline({ weekData }: { weekData: { year: number; week: number } }) {
  return React.useMemo(
    () => (
      <div className="grid grid-cols-9 place-content-start place-items-center gap-2 lg:gap-4">
        <DayNameRow />
        <DayNumberRow weekData={weekData} />
      </div>
    ),
    [weekData],
  );
}
