import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

import { HabitEntities, HabitEntitiesRpc } from "@/app/types";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import { getDateSeries, getWeekDateSeries } from "@/lib/utils";

export async function fetchDayDataServer(year: number, week: number, day: number): Promise<HabitEntities> {
  const { authSupabase } = await authenticateUser();

  const { data, error } = await authSupabase.rpc("fetch_day_data", { _year: year, _week: week, _day: day });

  if (error) {
    console.error("Error fetching day data:", error);
    throw new Error(error.message || "Failed to fetch day data");
  }

  return data as HabitEntities;
}

export async function fetchWeekDataServer(year: number, week: number): Promise<HabitEntitiesRpc> {
  const { authSupabase } = await authenticateUser();

  const { data, error } = await authSupabase.rpc("fetch_week_data", { _year: year, _week: week });

  if (error) {
    console.error("Error fetching week data:", error);
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data as HabitEntitiesRpc;
}

export async function fetchMonthDataServer(year: number, month: number): Promise<HabitEntitiesRpc> {
  const { authSupabase } = await authenticateUser();

  const { data, error } = await authSupabase.rpc("fetch_month_data", { _year: year, _month: month });

  if (error) {
    throw new Error(error.message || "Failed to fetch month data");
  }

  return data as HabitEntitiesRpc;
}

export async function prefetchDataForDashboardRpc(timezone: string) {
  const queryClient = new QueryClient();

  const now = new Date();
  const localTime = fromZonedTime(now, timezone);

  const {
    previous: { year: prevDayYear, week: prevDayWeek, day: prevDay },
    current: { year: currentYear, week: currentWeek, day: currentDay },
    next: { year: nextDayYear, week: nextDayWeek, day: nextDay },
  } = getDateSeries(localTime, "day");

  const {
    previous: { year: prevWeekYear, week: prevWeek },
    current: { year: currentWeekYear, week: currentWeekToFetch },
    next: { year: nextWeekYear, week: nextWeek },
  } = getDateSeries(localTime, "week");

  const {
    previous: { year: prevMonthYear, month: prevMonth },
    current: { year: currentMonthYear, month: currentMonth },
    next: { year: nextMonthYear, month: nextMonth },
  } = getDateSeries(localTime, "month");

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["dayData", prevDayYear, prevDayWeek, prevDay],
      queryFn: () => fetchDayDataServer(prevDayYear, prevDayWeek, prevDay),
    }),
    queryClient.prefetchQuery({
      queryKey: ["dayData", currentYear, currentWeek, currentDay],
      queryFn: () => fetchDayDataServer(currentYear, currentWeek, currentDay),
    }),
    queryClient.prefetchQuery({
      queryKey: ["dayData", nextDayYear, nextDayWeek, nextDay],
      queryFn: () => fetchDayDataServer(nextDayYear, nextDayWeek, nextDay),
    }),

    queryClient.prefetchQuery({
      queryKey: ["weekData", prevWeekYear, prevWeek],
      queryFn: () => fetchWeekDataServer(prevWeekYear, prevWeek),
    }),
    queryClient.prefetchQuery({
      queryKey: ["weekData", currentWeekYear, currentWeekToFetch],
      queryFn: () => fetchWeekDataServer(currentWeekYear, currentWeekToFetch),
    }),
    queryClient.prefetchQuery({
      queryKey: ["weekData", nextWeekYear, nextWeek],
      queryFn: () => fetchWeekDataServer(nextWeekYear, nextWeek),
    }),

    queryClient.prefetchQuery({
      queryKey: ["monthData", prevMonthYear, prevMonth],
      queryFn: () => fetchMonthDataServer(prevMonthYear, prevMonth),
    }),
    queryClient.prefetchQuery({
      queryKey: ["monthData", currentMonthYear, currentMonth],
      queryFn: () => fetchMonthDataServer(currentMonthYear, currentMonth),
    }),
    queryClient.prefetchQuery({
      queryKey: ["monthData", nextMonthYear, nextMonth],
      queryFn: () => fetchMonthDataServer(nextMonthYear, nextMonth),
    }),
  ]);

  return dehydrate(queryClient);
}

export async function getLocalizedHabits(timezone: string) {
  const { authSupabase } = await authenticateUser();

  const now = new Date();
  const localTime = toZonedTime(now, timezone);

  const {
    current: { year: currentYear, week: currentWeek },
    next: { year: nextWeekYear, week: nextWeekISOWeek },
  } = getWeekDateSeries(localTime);

  const [activeHabits, futureHabits, pastHabits] = await Promise.all([
    authSupabase
      .from("habits")
      .select("*")
      .or(
        `and(start_year.lte.${currentYear},start_week.lte.${currentWeek},end_year.is.null,end_week.is.null),and(start_year.lte.${currentYear},start_week.lte.${currentWeek},end_year.gte.${currentYear},end_week.gte.${currentWeek})`,
      ),

    authSupabase.from("habits").select("*").or(`and(start_year.gte.${nextWeekYear},start_week.gte.${nextWeekISOWeek})`),

    authSupabase.from("habits").select("*").or(`and(end_year.lte.${currentYear},end_week.lt.${currentWeek})`),
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
    all: [...(activeHabits.data || []), ...(futureHabits.data || []), ...(pastHabits.data || [])],
  };
}
