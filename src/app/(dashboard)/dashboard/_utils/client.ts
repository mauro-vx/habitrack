import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getAdjacentWeeksNumber, getWeekNumberAndYear } from "@/lib/utils";
import { authenticateUser } from "@/lib/supabase/authenticate-user";

// Initialize Supabase client
const supabase = createClient();

/**
 * Fetch data for a given week/year from Supabase
 */
export async function fetchWeekDataClient(week: number, year: number) {
  const { data, error } = await supabase
    .from("habits")
    .select("*, habit_statuses(id, date, start_week, start_year, status, completion_count)")
    .or(`start_year.lt.${year},and(start_year.eq.${year},start_week.lte.${week})`);

  if (error) {
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data;
}

export function usePrefetchWeekData() {
  const queryClient = useQueryClient();

  return async (week: number, year: number) => {
    const queryKey = ["weekData", { week, year }]; // Unique cache key

    // Check if data is already cached based on the query key
    if (!queryClient.getQueryData(queryKey)) {
      // If not available in cache, prefetch it
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: () => fetchWeekDataClient(week, year),
      });
    }
  };
}

/**
 * React Query hook to access week data
 */
export function useWeekData(week: number, year: number, initialState?: any) {
  const queryKey = ["weekData", { week, year }];

  return useQuery({
    queryKey,
    queryFn: () => fetchWeekDataClient(week, year),
    staleTime: 1000 * 60 * 5, // Cache is valid for 5 minutes
    refetchOnWindowFocus: false,
    initialData: initialState, // Use server-prefetched data if available
    suspense: true,
  });
}


export async function prefetchDataForDashboard(timezone = "Europe/Prague") {
  // Create a new QueryClient instance for server-side
  const queryClient = new QueryClient();

  const now = new Date();
  const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const { year, week } = getWeekNumberAndYear(localTime);
  const { prevWeek, nextWeek } = getAdjacentWeeksNumber(year, week);

  // Prefetch previous, current, and next weeks' data
  const queries = [
    await queryClient.prefetchQuery({
      queryKey: ["weekData", { week: prevWeek.weekNumber, year: prevWeek.year }],
      queryFn: () => fetchWeekDataClient(prevWeek.weekNumber, prevWeek.year),
    }),
    await queryClient.prefetchQuery({
      queryKey: ["weekData", { week, year }],
      queryFn: () => fetchWeekDataClient(week, year),
    }),
    await queryClient.prefetchQuery({
      queryKey: ["weekData", { week: nextWeek.weekNumber, year: nextWeek.year }],
      queryFn: () => fetchWeekDataClient(nextWeek.weekNumber, nextWeek.year),
    }),
  ];

  // Wait for all queries to prefetch
  await Promise.all(queries);

  // Return the hydrated state for React Query
  return dehydrate(queryClient);
}
