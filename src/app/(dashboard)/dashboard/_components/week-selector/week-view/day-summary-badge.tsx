import * as React from "react";

import { HabitEntityRpc } from "@/app/types";
import { DayIcon } from "./day-summary-badge/day-icon";
import { calculateDailyTarget } from "./day-summary-badge/utils";

export function DaySummaryBadge({ habits }: { habits: HabitEntityRpc[] }) {
  const dailyTargets = React.useMemo(() => calculateDailyTarget(habits), [habits]);

  return (
    <div className="grid grid-cols-9 place-items-center">
      <span className="col-start-1 text-xs">Ideal Day</span>

      {Object.entries(dailyTargets).map(([day, result], idx) => {
        return <DayIcon key={day} result={result} idx={idx} />;
      })}

      <div className="col-start-9"></div>
    </div>
  );
}
