import { HabitEntitiesRpc, HabitEntityRpc } from "@/app/types";
import { HabitType } from "@/app/enums";
import { cn, getWeekDateSeries } from "@/lib/utils";

export function ListDisplay({ habits, dayDate }: { habits: HabitEntitiesRpc; dayDate: Date }) {
  const { year, week, day } = getWeekDateSeries(dayDate).current;

  return (
    <div className="no-scrollbar flex flex-col gap-y-1 overflow-y-auto">
      {habits.map((habit) => {
        const habitStatus = habit.habit_statuses?.[day];

        if (habitStatus?.year_number === year && habitStatus?.week_number === week && habitStatus?.day_number === day) {
          const totalProgress = (habitStatus.skipped_count || 0) + (habitStatus.completion_count || 0);
          return <HabitNameStatus key={habit.id} habit={habit} totalProgress={totalProgress} />;
        }

        return <HabitNameStatus key={habit.id} habit={habit} totalProgress={0} />;
      })}
    </div>
  );
}

function HabitNameStatus({ habit, totalProgress }: { habit: HabitEntityRpc; totalProgress: number | null }) {
  const isCompleted = totalProgress !== null && totalProgress === habit.target_count;
  const isInProgress = totalProgress !== null && totalProgress < habit.target_count && totalProgress > 0;
  const isNotStarted = totalProgress !== null && totalProgress === 0;

  return (
    <div
      className={cn(
        "flex lg:rounded border-b-3 lg:border lg:p-1",
        isCompleted && "border-brand",
        isInProgress && "border-violet-500",
        isNotStarted && "border-gray-500",
      )}
    >
      <span
        className={cn(
          "overflow-x-auto text-xs whitespace-nowrap no-scrollbar",
          habit.type === HabitType.DAILY && "text-blue-600",
          habit.type === HabitType.WEEKLY && "text-orange-600",
          habit.type === HabitType.CUSTOM && "text-yellow-600",
        )}
      >
        {habit.name}
        {totalProgress !== null && ` (${totalProgress}/${habit.target_count})`}
      </span>
    </div>
  );
}
