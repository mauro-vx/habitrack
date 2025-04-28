import * as React from "react";

import { StarOff, Star } from "lucide-react";

import { HabitEntityRpc } from "@/app/types";
import { HabitType } from "@/app/enums";
import { DAYS_OF_WEEK } from "@/app/(dashboard)/dashboard/constants";
import { COL_START_CLASSES } from "@/app/(dashboard)/dashboard/_components/week-selector/week-content/_utils/grid-column-utils";
import { cn } from "@/lib/utils";

export function DaySummaryBadge({ habits }: { habits: HabitEntityRpc[] }) {
  return (
    <div className="grid grid-cols-9 place-items-center">
      <span className="col-start-1 text-xs">Ideal Day</span>

      {Object.entries(calculateDailyTarget(habits)).map(([day, result], idx) => {
        const Comp = result ? Star : StarOff;

        return (
          <Comp key={day} className={cn(`size-4 ${COL_START_CLASSES[idx + 1]}, ${result ? "text-yellow-500" : "text-pink-600"}`)}>
            {result ? "Ok" : "Ko"}
          </Comp>
        );
      })}

      <div className="col-start-9"></div>
    </div>
  );
}

function calculateDailyTarget(habits: HabitEntityRpc[]): Record<number, boolean> {
  return DAYS_OF_WEEK.reduce((acc: Record<number, boolean>, day: number) => {
    acc[day] = habits.every((habit) => isHabitCompletedForDay(habit, day));
    return acc;
  }, {});
}

function isHabitCompletedForDay(habit: HabitEntityRpc, day: number): boolean {
  const statusForDay = habit.habit_statuses[day];

  if (habit.type === HabitType.WEEKLY) {
    return true;
  }

  if (habit.type === HabitType.CUSTOM && !habit.days_of_week?.[day as keyof typeof habit.days_of_week]) {
    return true;
  }

  if (!statusForDay) {
    return false;
  }

  const totalProgress = (statusForDay?.completion_count || 0) + (statusForDay?.skipped_count || 0);

  return totalProgress === habit.target_count;
}
