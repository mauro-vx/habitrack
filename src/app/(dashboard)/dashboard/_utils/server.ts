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

export async function fetchHabitsByTimezone(timezone: string) {
  const { authSupabase } = await authenticateUser();

  const now = new Date();
  const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

  const { year, week } = getWeekNumberAndYear(localTime);

  if (year == null || week == null) {
    throw new Error("Both `year` and `week` are required for fetching habits.");
  }

  const [activeHabits, futureHabits, pastHabits] = await Promise.all([
    authSupabase
      .from("habits")
      .select("*, habit_statuses(*)")
      .or(`start_year.lt.${year},and(start_year.eq.${year},start_week.lte.${week})`)
      .or(`end_year.gte.${year},and(end_year.eq.${year},end_week.gte.${week})`),

    authSupabase
      .from("habits")
      .select("*, habit_statuses(*)")
      .or(`start_year.gt.${year},and(start_year.eq.${year},start_week.gt.${week})`),

    authSupabase
      .from("habits")
      .select("*, habit_statuses(*)")
      .or(`end_year.lt.${year},and(end_year.eq.${year},end_week.lt.${week})`),
  ]);

  if (activeHabits.error || futureHabits.error || pastHabits.error) {
    throw new Error(
      activeHabits.error?.message ||
        futureHabits.error?.message ||
        pastHabits.error?.message ||
        "Failed to fetch habits",
    );
  }

  return {
    active: activeHabits.data || [],
    future: futureHabits.data || [],
    past: pastHabits.data || [],
  };
}
