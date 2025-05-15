import { dehydrate, QueryClient } from "@tanstack/react-query";
import { addDays, addMonths, getDate, getISOWeek, getMonth, getYear, startOfDay, subDays } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { HabitEntitiesWeekRpc, HabitEntitiesMonthRpc, HabitEntitiesDayRpc } from "@/app/types";
import { authenticateUser } from "@/lib/supabase/authenticate-user";

export async function fetchDayDataServerRpc(year: number, month: number, day: number): Promise<HabitEntitiesDayRpc> {
  const { authSupabase } = await authenticateUser();

  if (!year || !month || !day) {
    throw new Error("`year`, `month`, and `day` parameters are all required.");
  }

  const { data, error } = await authSupabase.rpc("fetch_day_data", { _year: year, _month: month, _day: day });

  if (error) {
    throw new Error(error.message || "Failed to fetch day data");
  }

  return data as HabitEntitiesDayRpc;
}

export async function fetchWeekDataServerRpc(year: number, week: number): Promise<HabitEntitiesWeekRpc> {
  const { authSupabase } = await authenticateUser();

  if (!year || !week) {
    throw new Error("Both `week` and `year` parameters are required.");
  }

  const { data, error } = await authSupabase.rpc("fetch_week_data", { _year: year, _week: week });

  if (error) {
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data as HabitEntitiesWeekRpc;
}

export async function fetchMonthDataServerRpc(year: number, month: number): Promise<HabitEntitiesMonthRpc> {
  const { authSupabase } = await authenticateUser();

  if (!year || !month) {
    throw new Error("Both `month` and `year` parameters are required.");
  }

  const { data, error } = await authSupabase.rpc("fetch_month_data", { _year: year, _month: month });

  if (error) {
    throw new Error(error.message || "Failed to fetch month data");
  }

  return data as HabitEntitiesMonthRpc;
}

export async function prefetchDataForDashboardRpc(timezone: string) {
  const queryClient = new QueryClient();

  const now = new Date();
  const localTime = fromZonedTime(now, timezone);

  const year = getYear(localTime);
  const week = getISOWeek(localTime);
  const month = getMonth(localTime) + 1;
  const day = getDate(localTime);

  const prevWeekDate = subDays(localTime, 7);
  const prevWeek = { year: getYear(prevWeekDate), week: getISOWeek(prevWeekDate) };

  const nextWeekDate = addDays(localTime, 7);
  const nextWeek = { year: getYear(nextWeekDate), week: getISOWeek(nextWeekDate) };

  const prevMonth = addMonths(localTime, -1);
  const prevMonthData = { year: getYear(prevMonth), month: getMonth(prevMonth) + 1 };

  const nextMonth = addMonths(localTime, 1);
  const nextMonthData = { year: getYear(nextMonth), month: getMonth(nextMonth) + 1 };

  const prevDayDate = subDays(localTime, 1);
  const prevDay = { year: getYear(prevDayDate), month: getMonth(prevDayDate) + 1, day: getDate(prevDayDate) };

  const nextDayDate = addDays(localTime, 1);
  const nextDay = { year: getYear(nextDayDate), month: getMonth(nextDayDate) + 1, day: getDate(nextDayDate) };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["dayData", prevDay.year, prevDay.month, prevDay.day],
      queryFn: () => fetchDayDataServerRpc(prevDay.year, prevDay.month, prevDay.day),
    }),
    queryClient.prefetchQuery({
      queryKey: ["dayData", year, month, day],
      queryFn: () => fetchDayDataServerRpc(year, month, day),
    }),
    queryClient.prefetchQuery({
      queryKey: ["dayData", nextDay.year, nextDay.month, nextDay.day],
      queryFn: () => fetchDayDataServerRpc(nextDay.year, nextDay.month, nextDay.day),
    }),

    queryClient.prefetchQuery({
      queryKey: ["weekData", prevWeek.year, prevWeek.week],
      queryFn: () => fetchWeekDataServerRpc(prevWeek.year, prevWeek.week),
    }),
    queryClient.prefetchQuery({
      queryKey: ["weekData", year, week],
      queryFn: () => fetchWeekDataServerRpc(year, week),
    }),
    queryClient.prefetchQuery({
      queryKey: ["weekData", nextWeek.year, nextWeek.week],
      queryFn: () => fetchWeekDataServerRpc(nextWeek.year, nextWeek.week),
    }),

    queryClient.prefetchQuery({
      queryKey: ["monthData", prevMonthData.year, prevMonthData.month],
      queryFn: () => fetchMonthDataServerRpc(prevMonthData.year, prevMonthData.month),
    }),
    queryClient.prefetchQuery({
      queryKey: ["monthData", year, month],
      queryFn: () => fetchMonthDataServerRpc(year, month),
    }),
    queryClient.prefetchQuery({
      queryKey: ["monthData", nextMonthData.year, nextMonthData.month],
      queryFn: () => fetchMonthDataServerRpc(nextMonthData.year, nextMonthData.month),
    }),
  ]);

  return dehydrate(queryClient);
}

export async function fetchHabitsByTimezone(timezone: string) {
  const { authSupabase } = await authenticateUser();

  const now = new Date();
  const localTime = fromZonedTime(now, timezone);
  const todayStart = startOfDay(localTime);
  const isoDate = todayStart.toISOString();

  const [activeHabits, futureHabits, pastHabits] = await Promise.all([
    authSupabase
      .from("habits")
      .select("*, habit_statuses(*)")
      .or(`start_date.is.null,start_date.lte.${isoDate},end_date.is.null,end_date.gte.${isoDate}`),

    authSupabase.from("habits").select("*, habit_statuses(*)").gt("start_date", isoDate),

    authSupabase.from("habits").select("*, habit_statuses(*)").lt("end_date", isoDate),
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
