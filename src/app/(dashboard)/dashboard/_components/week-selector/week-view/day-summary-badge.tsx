import * as React from "react";

import { HabitEntityRpc } from "@/app/types";
import { DayIcon } from "./day-summary-badge/day-icon";
import { calculateDailyTarget } from "./day-summary-badge/utils";

export function DaySummaryBadge({ habits }: { habits: HabitEntityRpc[] }) {
  const dailyTargets = React.useMemo(() => calculateDailyTarget(habits), [habits]);

  return (
    <div className="grid grid-cols-9 place-items-center gap-1 lg:gap-4 py-2 lg:py-4">
      <span className="text-extra-tiny col-start-1 justify-self-start lg:text-xs font-semibold lg:font-bold">Ideal Day</span>

      {Object.entries(dailyTargets).map(([day, result], idx) => {
        return <DayIcon key={day} result={result} idx={idx} />;
      })}

      <div className="col-start-9"></div>
    </div>
  );
}
