import { getDay } from "date-fns";

import { cn } from "@/lib/utils";
import { useDayData } from "@/app/(dashboard)/dashboard/_utils/client";
import { HabitType } from "@/app/enums";

export function DayView({ selectedDate }: { selectedDate: Date }) {
  const { data: dayData } = useDayData(selectedDate);

  return (
    <div className="mt-1 flex flex-col gap-2 lg:mt-2 lg:gap-4">
      {!dayData.length ? (
        <div className="flex min-h-20 items-center rounded border p-4 text-sm lg:text-lg">
          <p>No data for this day</p>
        </div>
      ) : (
        dayData.map(({ id, name, description, target_count, habit_statuses, days_of_week, type }) => {
          const totalProgress = (habit_statuses?.skipped_count || 0) + (habit_statuses?.completion_count || 0);

          const isCompleted = totalProgress !== null && totalProgress === target_count;
          const isInProgress = totalProgress !== null && totalProgress < target_count && totalProgress > 0;
          const isNotStarted = totalProgress !== null && totalProgress === 0;

          const isHabitScheduledForDay =
            days_of_week && days_of_week[(getDay(selectedDate) || 7) as keyof typeof days_of_week];

          if (!isHabitScheduledForDay) {
            return null;
          }

          return (
            <div
              key={id}
              className={cn(
                "flex flex-col gap-0.5 rounded border p-4 lg:gap-1",
                isCompleted && "border-brand bg-brand/5",
                isInProgress && "border-violet-800 bg-violet-600/5",
                isNotStarted && "border-gray-800 bg-gray-600/5",
              )}
            >
              <h2
                className={cn(
                  "text-md w-fit underline underline-offset-6 lg:text-xl",
                  type === HabitType.DAILY && "bg-blue-600/5 text-blue-600",
                  type === HabitType.WEEKLY && "bg-orange-600/5 text-orange-600",
                  type === HabitType.CUSTOM && "bg-yellow-600/5 text-yellow-600",
                )}
              >
                {name}
              </h2>
              <p>{description}</p>

              {habit_statuses && (
                <div className="text-sm lg:text-lg">
                  <p>
                    Completion: {habit_statuses.completion_count || 0}/{target_count}
                  </p>
                  <p>Skipped: {habit_statuses.skipped_count || 0}</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
