import { cn, getWeekDateSeries } from "@/lib/utils";
import { HabitEntitiesWeekRpc } from "@/app/types";

export function ListDisplay({ habits, dayDate }: { habits: HabitEntitiesWeekRpc; dayDate: Date }) {
  const { year, week, day } = getWeekDateSeries(dayDate).current;

  return (
    <div className="no-scrollbar flex flex-col gap-y-1 overflow-y-auto">
      {habits.map((habit) => {
        const habitStatus = habit.habit_statuses?.[day];

        if (habitStatus?.year_number === year && habitStatus?.week_number === week && habitStatus?.day_number === day) {
          const totalProgress = (habitStatus.skipped_count || 0) + (habitStatus.completion_count || 0);
          const isCompleted = totalProgress === habit.target_count;
          const isInProgress = totalProgress < habit.target_count && totalProgress > 0;
          const isNotStarted = totalProgress === 0;

          return (
            <div
              key={habit.id}
              className={cn(
                "flex rounded border p-1",
                isCompleted && "border-brand",
                isInProgress && "border-violet-800",
                isNotStarted && "border-gray-800",
              )}
            >
              <span className="overflow-x-auto text-xs whitespace-nowrap">
                {habit.name} ({totalProgress}/{habit.target_count})
              </span>
            </div>
          );
        }

        return (
          <div key={habit.id} className={cn("flex rounded border border-gray-800 p-1")}>
            <span className="overflow-x-auto text-xs whitespace-nowrap">{habit.name}</span>
          </div>
        );
      })}
    </div>
  );
}
