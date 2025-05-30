import { cn } from "@/lib/utils";
import { useDayData } from "@/app/(dashboard)/dashboard/_utils/client";

export function DayView({ selectedDate }: { selectedDate: Date }) {
  const { data: dayData } = useDayData(selectedDate);

  return (
    <div className="mt-1 lg:mt-2 flex flex-col gap-2 lg:gap-4">
      {!dayData.length ? (
        <div className="flex items-center rounded border p-4 min-h-20 text-sm lg:text-lg">
          <p>No data for this day</p>
        </div>
      ) : (
        dayData.map(({ id, name, description, target_count, habit_status }) => {
          const sum = (habit_status?.skipped_count || 0) + (habit_status?.completion_count || 0);

          return (
            <div
              key={id}
              className={cn(
                "flex flex-col gap-0.5 rounded border p-4 lg:gap-1",
                sum === target_count && "border-brand bg-brand/5",
                sum < target_count && "border-violet-800 bg-violet-600/5",
                !sum && "border-gray-800 bg-gray-600/5",
              )}
            >
              <h2 className="text-md underline underline-offset-6 lg:text-xl">{name}</h2>
              <p>{description}</p>

              {habit_status && (
                <div className="text-sm lg:text-lg">
                  <p>
                    Completion: {habit_status.completion_count || 0}/{target_count}
                  </p>
                  <p>Skipped: {habit_status.skipped_count || 0}</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
