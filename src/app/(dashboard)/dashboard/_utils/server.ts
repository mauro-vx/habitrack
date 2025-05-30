import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

import { HabitEntitiesWeekRpc, HabitEntitiesMonthRpc, HabitEntitiesDayRpc } from "@/app/types";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import { getDateSeries, getWeekDateSeries } from "@/lib/utils";

export async function fetchDayDataServer(year: number, week: number, day: number): Promise<HabitEntitiesDayRpc> {
  const { authSupabase } = await authenticateUser();

  const { data, error } = await authSupabase.rpc("fetch_day_data", { _year: year, _week: week, _day: day });

  if (error) {
    console.error("Error fetching day data:", error);
    throw new Error(error.message || "Failed to fetch day data");
  }

  return data as HabitEntitiesDayRpc;
}

export async function fetchWeekDataServer(year: number, week: number): Promise<HabitEntitiesWeekRpc> {
  const { authSupabase } = await authenticateUser();

  const { data, error } = await authSupabase.rpc("fetch_week_data", { _year: year, _week: week });

  if (error) {
    console.error("Error fetching week data:", error);
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data as HabitEntitiesWeekRpc;
}

export async function fetchMonthDataServer(year: number, month: number): Promise<HabitEntitiesMonthRpc> {
  const { authSupabase } = await authenticateUser();

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

// export async function getLocalizedHabits(timezone: string) {
//   const { authSupabase } = await authenticateUser();
//
//   const now = new Date();
//   const localTime = toZonedTime(now, timezone);
//
//   const currentWeekStart = startOfWeek(localTime, { weekStartsOn: 1 }).toISOString();
//   const currentWeekEnd = endOfWeek(localTime, { weekStartsOn: 1 }).toISOString();
//   const nextWeekStart = startOfWeek(addWeeks(localTime, 1), { weekStartsOn: 1 }).toISOString();
//
//   const [activeHabits, futureHabits, pastHabits] = await Promise.all([
//     authSupabase
//       .from("habits")
//       .select("*")
//       .or(
//         `and(start_date.lte.${currentWeekStart},end_date.is.null),and(start_date.lte.${currentWeekStart},end_date.gte.${currentWeekEnd})`,
//       ),
//     authSupabase.from("habits").select("*").gte("start_date", nextWeekStart),
//     authSupabase.from("habits").select("*").lt("end_date", currentWeekStart),
//   ]);
//
//   if (activeHabits.error || futureHabits.error || pastHabits.error) {
//     throw new Error(
//       activeHabits.error?.message ||
//         futureHabits.error?.message ||
//         pastHabits.error?.message ||
//         "Failed to fetch habits",
//     );
//   }
//
//   const all = [...(activeHabits.data || []), ...(futureHabits.data || []), ...(pastHabits.data || [])];
//
//   return {
//     active: activeHabits.data || [],
//     future: futureHabits.data || [],
//     past: pastHabits.data || [],
//     all: all,
//   };
// }

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

// export async function getLocalizedHabits(timezone: string) {
//   const { authSupabase } = await authenticateUser();
//
//   const now = new Date();
//   const localTime = toZonedTime(now, timezone);
//
//   // Break down the current date into its components (year, month, week, and day)
//   const currentYear = getYear(localTime);
//   const currentMonth = getMonth(localTime) + 1; // getMonth is zero-based
//   const currentWeek = getISOWeek(localTime); // Get ISO week number
//   const currentDay = getDate(localTime); // Day of the month
//
//   // Calculate start and end of the current week
//   const currentWeekStart = startOfWeek(localTime, { weekStartsOn: 1 });
//   const currentWeekEnd = endOfWeek(localTime, { weekStartsOn: 1 });
//
//   // Determine next week's start and its components
//   const nextWeekStart = addWeeks(currentWeekStart, 1);
//   const nextWeekYear = getYear(nextWeekStart);
//   const nextWeekISOWeek = getISOWeek(nextWeekStart);
//
//   // Query the habits based on the new structure
//   const [activeHabits, futureHabits, pastHabits] = await Promise.all([
//     // Active habits: ongoing from current week
//     authSupabase
//       .from("habits")
//       .select("*")
//       .or(
//         `and(start_year.lte.${currentYear},start_week.lte.${currentWeek},end_year.is.null,end_week.is.null),and(start_year.lte.${currentYear},start_week.lte.${currentWeek},end_year.gte.${currentYear},end_week.gte.${currentWeek})`,
//       ),
//
//     // Future habits: starting after the current week
//     authSupabase.from("habits").select("*").or(`and(start_year.gte.${nextWeekYear},start_week.gte.${nextWeekISOWeek})`),
//
//     // Past habits: ended before the current week
//     authSupabase.from("habits").select("*").or(`and(end_year.lte.${currentYear},end_week.lt.${currentWeek})`),
//   ]);
//
//   // Handle errors in any of the queries
//   if (activeHabits.error || futureHabits.error || pastHabits.error) {
//     throw new Error(
//       activeHabits.error?.message ||
//         futureHabits.error?.message ||
//         pastHabits.error?.message ||
//         "Failed to fetch habits",
//     );
//   }
//
//   return {
//     active: activeHabits.data || [],
//     future: futureHabits.data || [],
//     past: pastHabits.data || [],
//     all: [...(activeHabits.data || []), ...(futureHabits.data || []), ...(pastHabits.data || [])],
//   };
// }
