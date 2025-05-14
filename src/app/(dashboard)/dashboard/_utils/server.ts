import { dehydrate, QueryClient } from "@tanstack/react-query";

import { HabitEntitiesWeekRpc, HabitEntitiesMonthRpc, HabitEntitiesDayRpc } from "@/app/types";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import { getAdjacentWeeksNumber, getWeekNumberAndYear, getMonthAndYear, getDayMonthYear } from "@/lib/utils";

export async function fetchWeekDataServerRpc(year: number, week: number): Promise<HabitEntitiesWeekRpc> {
  const { authSupabase } = await authenticateUser();

  if (year == null || week == null) {
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

  if (year == null || month == null) {
    throw new Error("Both `month` and `year` parameters are required.");
  }

  const { data, error } = await authSupabase.rpc("fetch_month_data", { _year: year, _month: month });

  if (error) {
    throw new Error(error.message || "Failed to fetch month data");
  }

  return data as HabitEntitiesMonthRpc;
}

export async function fetchDayDataServerRpc(year: number, month: number, day: number): Promise<HabitEntitiesDayRpc> {
  const { authSupabase } = await authenticateUser();

  if (year == null || month == null || day == null) {
    throw new Error("`year`, `month`, and `day` parameters are all required.");
  }

  const { data, error } = await authSupabase.rpc("fetch_day_data", { _year: year, _month: month, _day: day });

  if (error) {
    throw new Error(error.message || "Failed to fetch day data");
  }

  return data as HabitEntitiesDayRpc;
}

export async function prefetchDataForDashboardRpc(date: Date, timezone: string) {
  const queryClient = new QueryClient();
  const localTime = new Date(date.toLocaleString("en-US", { timeZone: timezone }));

  const { year, week } = getWeekNumberAndYear(localTime);
  const { prevWeek, nextWeek } = getAdjacentWeeksNumber(year, week);

  const { year: monthYear, month } = getMonthAndYear(localTime);
  const prevMonth = month === 1 ? { year: monthYear - 1, month: 12 } : { year: monthYear, month: month - 1 };
  const nextMonth = month === 12 ? { year: monthYear + 1, month: 1 } : { year: monthYear, month: month + 1 };

  const { year: dayYear, month: dayMonth, day } = getDayMonthYear(localTime);

  const prevDayDate = new Date(localTime);
  prevDayDate.setDate(prevDayDate.getDate() - 1);
  const prevDay = {
    year: prevDayDate.getFullYear(),
    month: prevDayDate.getMonth() + 1,
    day: prevDayDate.getDate(),
  };

  const nextDayDate = new Date(localTime);
  nextDayDate.setDate(nextDayDate.getDate() + 1);
  const nextDay = {
    year: nextDayDate.getFullYear(),
    month: nextDayDate.getMonth() + 1,
    day: nextDayDate.getDate(),
  };

  await queryClient.prefetchQuery({
    queryKey: ["dayData", prevDay.year, prevDay.month, prevDay.day],
    queryFn: () => fetchDayDataServerRpc(prevDay.year, prevDay.month, prevDay.day),
  });
  await queryClient.prefetchQuery({
    queryKey: ["dayData", dayYear, dayMonth, day],
    queryFn: () => fetchDayDataServerRpc(dayYear, dayMonth, day),
  });
  await queryClient.prefetchQuery({
    queryKey: ["dayData", nextDay.year, nextDay.month, nextDay.day],
    queryFn: () => fetchDayDataServerRpc(nextDay.year, nextDay.month, nextDay.day),
  });

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

  await queryClient.prefetchQuery({
    queryKey: ["monthData", prevMonth.year, prevMonth.month],
    queryFn: () => fetchMonthDataServerRpc(prevMonth.year, prevMonth.month),
  });
  await queryClient.prefetchQuery({
    queryKey: ["monthData", monthYear, month],
    queryFn: () => fetchMonthDataServerRpc(monthYear, month),
  });
  await queryClient.prefetchQuery({
    queryKey: ["monthData", nextMonth.year, nextMonth.month],
    queryFn: () => fetchMonthDataServerRpc(nextMonth.year, nextMonth.month),
  });

  return dehydrate(queryClient);
}

export async function fetchHabitsByTimezone(timezone: string) {
  const { authSupabase } = await authenticateUser();

  const now = new Date();
  const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

  const { year, week } = getWeekNumberAndYear(localTime);
  const { month, day } = { month: localTime.getMonth() + 1, day: localTime.getDate() };

  if (year === null || week === null || month === null || day === null) {
    throw new Error("Year, week, month, and day information are required for fetching habits.");
  }
  const [activeHabits, futureHabits, pastHabits] = await Promise.all([
    authSupabase
      .from("habits")
      .select("*, habit_statuses(*)")
      .or(`start_year.lt.${year},and(start_year.eq.${year},start_week.lte.${week}),and(start_year.eq.${year},start_month.lt.${month}),and(start_year.eq.${year},start_month.eq.${month},start_day.lte.${day})`)
      .or(`end_year.is.null,end_year.gt.${year},and(end_year.eq.${year},end_week.gte.${week}),and(end_year.eq.${year},end_month.gt.${month}),and(end_year.eq.${year},end_month.eq.${month},end_day.gte.${day})`),

    authSupabase
      .from("habits")
      .select("*, habit_statuses(*)")
      .or(`start_year.gt.${year},and(start_year.eq.${year},start_week.gt.${week}),and(start_year.eq.${year},start_month.gt.${month}),and(start_year.eq.${year},start_month.eq.${month},start_day.gt.${day})`),

    authSupabase
      .from("habits")
      .select("*, habit_statuses(*)")
      .or(`end_year.lt.${year},and(end_year.eq.${year},end_week.lt.${week}),and(end_year.eq.${year},end_month.lt.${month}),and(end_year.eq.${year},end_month.eq.${month},end_day.lt.${day})`),
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
