import * as React from "react";

import { HabitEntityWeekRpc } from "@/app/types";
import { DayIcon } from "./day-summary-badge/day-icon";
import { calculateDailyTarget } from "./day-summary-badge/utils";
import { Separator } from "@/components/ui/separator";

export function DaySummaryBadge({ habits }: { habits: HabitEntityWeekRpc[] }) {
  const dailyTargets = React.useMemo(() => calculateDailyTarget(habits), [habits]);

  if (!habits.length) {
    return null;
  }

  return (
    <>
      <Separator />

      <div className="grid grid-cols-9 place-items-center gap-1 py-2 lg:gap-4 lg:py-4">
        <span className="text-extra-tiny col-start-1 justify-self-start font-semibold lg:text-xs lg:font-bold">
          Ideal Day
        </span>

        {Object.entries(dailyTargets).map(([day, result], idx) => {
          return <DayIcon key={day} result={result} idx={idx} />;
        })}

        <div className="col-start-9"></div>
      </div>
    </>
  );
}
