import { Tables } from "@/lib/supabase/database.types";

type HabitListProps = {
  habits: Tables<"habits">[];
  dayNumber: number;
};

export function ListDisplay({ habits, dayNumber }: HabitListProps) {
  return (
    <div className="no-scrollbar flex flex-col gap-y-1 overflow-y-auto">
      {habits.map((habit) => {
        const status = habit.habit_statuses?.[dayNumber.toString()];
        const hasStatus = !!status;

        return (
          <div
            key={habit.id}
            className={`flex min-h-8 items-center rounded p-1 ${
              hasStatus ? "bg-blue-500" : "bg-gray-500"
            }`}
          >
            <span className="truncate text-xs">
              {habit.name} {hasStatus && `(${status.completion_count || 0}/${habit.target_count})`}
            </span>
          </div>
        );
      })}
    </div>
  );
}