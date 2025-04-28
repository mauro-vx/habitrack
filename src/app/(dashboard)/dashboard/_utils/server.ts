import { dehydrate, QueryClient } from "@tanstack/react-query";

import { HabitEntitiesRpc } from "@/app/types";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import { getAdjacentWeeksNumber, getWeekNumberAndYear } from "@/lib/utils";

export async function fetchWeekDataServerRpc(year: number, week: number): Promise<HabitEntitiesRpc> {
  const { authSupabase } = await authenticateUser();

  if (year == null || week == null) {
    throw new Error("Both `week` and `year` parameters are required.");
  }

  const { data, error } = await authSupabase.rpc("fetch_week_data", { _year: year, _week: week });

  if (error) {
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data as HabitEntitiesRpc;
}

export async function prefetchDataForDashboardRpc(timezone: string) {
  const queryClient = new QueryClient();
  const now = new Date();
  const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const { year, week } = getWeekNumberAndYear(localTime);
  const { prevWeek, nextWeek } = getAdjacentWeeksNumber(year, week);

  await queryClient.prefetchQuery({
    queryKey: ["weekData", prevWeek.year, prevWeek.week],
    queryFn: () => fetchWeekDataServerRpc(prevWeek.year, prevWeek.week),
  });

  await queryClient.prefetchQuery({
    queryKey: ["weekData", year, week],
    queryFn: () => fetchWeekDataServerRpc(year, week),
  });

  await queryClient.prefetchQuery({
    queryKey: ["weekData", nextWeek.year, nextWeek.week],
    queryFn: () => fetchWeekDataServerRpc(nextWeek.year, nextWeek.week),
  });

  return dehydrate(queryClient);
}

