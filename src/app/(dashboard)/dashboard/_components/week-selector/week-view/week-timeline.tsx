import * as React from "react";

import { DayNameRow } from "./week-timeline/day-name-row";
import { DayNumberRow } from "./week-timeline/day-number-row";

export function WeekTimeline({ weekStartDate }: { weekStartDate: Date }) {
  return React.useMemo(
    () => (
      <div className="grid grid-cols-9 place-content-start place-items-center gap-1 lg:gap-4 py-2 lg:py-4">
        <DayNameRow />
        <DayNumberRow weekStartDate={weekStartDate} />
      </div>
    ),
    [weekStartDate],
  );
}
