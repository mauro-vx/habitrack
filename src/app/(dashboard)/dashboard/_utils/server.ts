import { dehydrate, QueryClient } from "@tanstack/react-query";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { HabitEntitiesWeekRpc, HabitEntitiesMonthRpc, HabitEntitiesDayRpc } from "@/app/types";
import { authenticateUser } from "@/lib/supabase/authenticate-user";

const { authSupabase } = await authenticateUser();

export async function fetchDayDataServer(dayDate: Date): Promise<HabitEntitiesDayRpc> {
  const isoDateFormatted = dayDate.toISOString().split("T")[0];

  const { data, error } = await authSupabase.rpc("fetch_day_data", { _date: isoDateFormatted });

  if (error) {
    console.error("Error fetching day data:", error);
    throw new Error(error.message || "Failed to fetch day data");
  }

  return data as HabitEntitiesDayRpc;
}

export async function fetchWeekDataServer(weekDate: Date): Promise<HabitEntitiesWeekRpc> {
  const isoDateFormatted = weekDate.toISOString().split("T")[0];

  const { data, error } = await authSupabase.rpc("fetch_week_data", { _week_start: isoDateFormatted });

  if (error) {
    console.error("Error fetching week data:", error);
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data as HabitEntitiesWeekRpc;
}

export async function fetchMonthDataServer(monthDate: Date): Promise<HabitEntitiesMonthRpc> {
  const isoMonthFormatted = monthDate.toISOString().split("T")[0];

  const { data, error } = await authSupabase.rpc("fetch_month_data", { _month_start: isoMonthFormatted });

  if (error) {
    throw new Error(error.message || "Failed to fetch month data");
  }

  return data as HabitEntitiesMonthRpc;
}

export async function prefetchDataForDashboardRpc(timezone: string) {
  const queryClient = new QueryClient();

  const now = new Date();
  const localTime = fromZonedTime(now, timezone);

  const yesterday = subDays(localTime, 1);
  const today = startOfDay(localTime);
  const tomorrow = addDays(localTime, 1);

  const startOfWeekCurrent = startOfWeek(localTime, { weekStartsOn: 1 });
  const startOfWeekPast = subWeeks(startOfWeekCurrent, 1);
  const startOfWeekNext = addWeeks(startOfWeekCurrent, 1);

  const startOfMonthCurrent = startOfMonth(localTime);
  const startOfMonthPast = subMonths(startOfMonthCurrent, 1);
  const startOfMonthNext = addMonths(startOfMonthCurrent, 1);

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["dayData", yesterday.toISOString()],
      queryFn: () => fetchDayDataServer(yesterday),
    }),
    queryClient.prefetchQuery({
      queryKey: ["dayData", today.toISOString()],
      queryFn: () => fetchDayDataServer(today),
    }),
    queryClient.prefetchQuery({
      queryKey: ["dayData", tomorrow.toISOString()],
      queryFn: () => fetchDayDataServer(tomorrow),
    }),

    queryClient.prefetchQuery({
      queryKey: ["weekData", startOfWeekPast.toISOString()],
      queryFn: () => fetchWeekDataServer(startOfWeekPast),
    }),
    queryClient.prefetchQuery({
      queryKey: ["weekData", startOfWeekCurrent.toISOString()],
      queryFn: () => fetchWeekDataServer(startOfWeekCurrent),
    }),
    queryClient.prefetchQuery({
      queryKey: ["weekData", startOfWeekNext.toISOString()],
      queryFn: () => fetchWeekDataServer(startOfWeekNext),
    }),

    queryClient.prefetchQuery({
      queryKey: ["monthData", startOfMonthPast.toISOString()],
      queryFn: () => fetchMonthDataServer(startOfMonthPast),
    }),
    queryClient.prefetchQuery({
      queryKey: ["monthData", startOfMonthCurrent.toISOString()],
      queryFn: () => fetchMonthDataServer(startOfMonthCurrent),
    }),
    queryClient.prefetchQuery({
      queryKey: ["monthData", startOfMonthNext.toISOString()],
      queryFn: () => fetchMonthDataServer(startOfMonthNext),
    }),
  ]);

  return dehydrate(queryClient);
}

export async function getLocalizedHabits(timezone: string) {
  const { authSupabase } = await authenticateUser();

  const now = new Date();
  const localTime = fromZonedTime(now, timezone);

  const currentWeekStart = startOfWeek(localTime, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(localTime, { weekStartsOn: 1 });
  const nextWeekStart = startOfWeek(addWeeks(localTime, 1), { weekStartsOn: 1 });

  const [activeHabits, futureHabits, pastHabits] = await Promise.all([
    authSupabase
      .from("habits")
      .select("*")
      .or(
        `and(start_date.lte.${currentWeekStart.toISOString()},end_date.is.null),and(start_date.lte.${currentWeekStart.toISOString()},end_date.gte.${currentWeekEnd.toISOString()})`,
      ),
    authSupabase.from("habits").select("*").gte("start_date", nextWeekStart.toISOString()),
    authSupabase.from("habits").select("*").lt("end_date", currentWeekStart.toISOString()),
  ]);

  if (activeHabits.error || futureHabits.error || pastHabits.error) {
    throw new Error(
      activeHabits.error?.message ||
        futureHabits.error?.message ||
        pastHabits.error?.message ||
        "Failed to fetch habits",
    );
  }

  const all = [...(activeHabits.data || []), ...(futureHabits.data || []), ...(pastHabits.data || [])];

  return {
    active: activeHabits.data || [],
    future: futureHabits.data || [],
    past: pastHabits.data || [],
    all: all,
  };
}
