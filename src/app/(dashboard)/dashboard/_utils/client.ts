import { DefinedUseQueryResult, useQuery, useQueryClient } from "@tanstack/react-query";

import { HabitEntities } from "@/app/types";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function fetchWeekDataClient(
  year: number,
  week: number,
): Promise<HabitEntities> {
  const { data, error } = await supabase
    .from("habits")
    .select("*, habit_statuses(*)")
    .or(`start_year.lt.${year},and(start_year.eq.${year},start_week.lte.${week})`)
    .eq("habit_statuses.start_year", year)
    .eq("habit_statuses.start_week", week);

  if (error) {
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data;
}

export function usePrefetchWeekData(): { (year: number, week: number): Promise<void> } {
  const queryClient = useQueryClient();

  return async (year: number, week: number) => {
    const queryKey = ["weekData", { year, week }];

    if (!queryClient.getQueryData(queryKey)) {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: () => fetchWeekDataClient(year, week),
      });
    }
  };
}

export function useWeekData(year: number, week: number): DefinedUseQueryResult<HabitEntities> {
  const queryKey = ["weekData", { year, week }];

  return useQuery({
    queryKey,
    queryFn: () => fetchWeekDataClient(year, week),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}
