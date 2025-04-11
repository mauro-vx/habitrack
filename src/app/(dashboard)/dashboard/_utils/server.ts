import { authenticateUser } from "@/lib/supabase/authenticate-user";
import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";
import { fetchWeekDataClient } from "@/app/(dashboard)/dashboard/_utils/client";
import { getAdjacentWeeksNumber, getWeekNumberAndYear } from "@/lib/utils";

/**
 * Fetch data for a given week/year from Supabase
 */
export async function fetchWeekDataServer(week: number, year: number) {
  const { authSupabase } = await authenticateUser();

  if (week == null || year == null) {
    throw new Error("Both `week` and `year` parameters are required.");
  }

  const { data, error } = await authSupabase
    .from("habits")
    .select("*, habit_statuses(id, date, start_week, start_year, status, completion_count)")
    .or(`start_year.lt.${year},and(start_year.eq.${year},start_week.lte.${week})`);

  // todo: handle with component
  if (error) {
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data;
}



export async function prefetchDataForDashboard(timezone: string) {
  const queryClient = new QueryClient(); // Temporary server cache
  const now = new Date();
  const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const { year, week } = getWeekNumberAndYear(localTime);
  const { prevWeek, nextWeek } = getAdjacentWeeksNumber(year, week);

  // Prefetch and populate query cache
  await queryClient.prefetchQuery({
    queryKey: ["weekData", { week: prevWeek.weekNumber, year: prevWeek.year }],
    queryFn: () => fetchWeekDataServer(prevWeek.weekNumber, prevWeek.year),
  });

  await queryClient.prefetchQuery({
    queryKey: ["weekData", { week, year }],
    queryFn: () => fetchWeekDataServer(week, year),
  });

  await queryClient.prefetchQuery({
    queryKey: ["weekData", { week: nextWeek.weekNumber, year: nextWeek.year }],
    queryFn: () => fetchWeekDataServer(nextWeek.weekNumber, nextWeek.year),
  });


  return dehydrate(queryClient); // Serialize the cache for hydration
}
