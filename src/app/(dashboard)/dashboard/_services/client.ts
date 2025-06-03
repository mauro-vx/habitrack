import { DefinedUseQueryResult, useQuery, QueryClient } from "@tanstack/react-query";

import { HabitEntities, HabitEntitiesRpc } from "@/app/types";
import { createClient } from "@/lib/supabase/client";
import { getDateSeries } from "@/lib/utils";

export async function fetchDayDataClient(year: number, week: number, day: number): Promise<HabitEntities> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fetch_day_data", { _year: year, _week: week, _day: day });

  if (error) {
    console.error("Error fetching day data:", error);
    throw new Error(error.message || "Failed to fetch day data");
  }

  return data as HabitEntities;
}

export function useDayData(dayStartDate: Date): DefinedUseQueryResult<HabitEntities> {
  if (!dayStartDate) {
    throw new Error("Date parameter is required");
  }

  const  { year, week, day } = getDateSeries(dayStartDate, "week").current;
  

  return useQuery({
    queryKey: ["dayData", year, week, day],
    queryFn: () => fetchDayDataClient(year, week, day),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}

export async function prefetchDay(queryClient: QueryClient, date: Date) {
  if (!queryClient) {
    throw new Error("QueryClient instance is required");
  }

  if (!date) {
    throw new Error("Date parameter is required for prefetchDay");
  }

  const { year, week, day } = getDateSeries(date, "week").current;

  return queryClient.prefetchQuery({
    queryKey: ["dayData", year, week, day],
    queryFn: () => fetchDayDataClient(year, week, day),
  });
}

export async function fetchWeekDataClient(year: number, week: number): Promise<HabitEntitiesRpc> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fetch_week_data", { _year: year, _week: week });

  if (error) {
    console.error("Error fetching week data:", error);
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data as HabitEntitiesRpc;
}

export function useWeekData(weekStartDate: Date): DefinedUseQueryResult<HabitEntitiesRpc> {
  if (!weekStartDate) {
    throw new Error("Date parameter is required");
  }

  const  { year, week } = getDateSeries(weekStartDate, "week").current;

  return useQuery({
    queryKey: ["weekData", year, week],
    queryFn: () => fetchWeekDataClient(year, week),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}

export async function prefetchMonth(queryClient: QueryClient, date: Date) {
  if (!queryClient) {
    throw new Error("QueryClient instance is required");
  }

  if (!date) {
    throw new Error("Date parameter is required for prefetchDay");
  }

  const  { year, month } = getDateSeries(date, "week").current;

  return queryClient.prefetchQuery({
    queryKey: ["monthData", year, month],
    queryFn: () => fetchMonthDataClient(year, month),
  });
}

export async function fetchMonthDataClient(year: number, month: number): Promise<HabitEntitiesRpc> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fetch_month_data", { _year: year, _month: month });

  if (error) {
    throw new Error(error.message || "Failed to fetch month data");
  }

  return data as HabitEntitiesRpc;
}

export function useMonthData(monthStartDate: Date): DefinedUseQueryResult<HabitEntitiesRpc> {
  if (!monthStartDate) {
    throw new Error("Date parameter is required");
  }

  const { year, month } = getDateSeries(monthStartDate, "week").current;
  

  return useQuery({
    queryKey: ["monthData", year, month],
    queryFn: () => fetchMonthDataClient(year, month),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}

export async function getLocalizedHabitsClient() {
  const supabase = createClient();

  const now = new Date();

  const {
    current: { year: currentYear, week: currentWeek },
    next: { year: nextWeekYear, week: nextWeekISOWeek },
  } = getDateSeries(now, "week");

  const [activeHabits, futureHabits, pastHabits] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .or(
        `and(start_year.lte.${currentYear},start_week.lte.${currentWeek},end_year.is.null,end_week.is.null),and(start_year.lte.${currentYear},start_week.lte.${currentWeek},end_year.gte.${currentYear},end_week.gte.${currentWeek})`,
      ),

    supabase.from("habits").select("*").or(`and(start_year.gte.${nextWeekYear},start_week.gte.${nextWeekISOWeek})`),

    supabase.from("habits").select("*").or(`and(end_year.lte.${currentYear},end_week.lt.${currentWeek})`),
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