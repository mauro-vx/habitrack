import { DefinedUseQueryResult, useQuery } from "@tanstack/react-query";
import { startOfWeek, addWeeks, endOfWeek } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { HabitEntitiesWeekRpc, HabitEntitiesDayRpc, HabitEntitiesMonthRpc } from "@/app/types";
import { createClient } from "@/lib/supabase/client";

export async function fetchDayDataClient(dayDate: Date): Promise<HabitEntitiesDayRpc> {
  const supabase = createClient();

  const isoDateFormatted = dayDate.toISOString().split("T")[0];

  const { data, error } = await supabase.rpc("fetch_day_data", { _date: isoDateFormatted });

  if (error) {
    console.error("Error fetching day data:", error);
    throw new Error(error.message || "Failed to fetch day data");
  }

  return data as HabitEntitiesDayRpc;
}

export function useDayData(dayStartDate: Date): DefinedUseQueryResult<HabitEntitiesDayRpc> {
  if (!dayStartDate) {
    throw new Error("Date parameter is required");
  }

  const isoDay = dayStartDate.toISOString();
  const queryKey = ["dayData", isoDay];

  return useQuery({
    queryKey,
    queryFn: () => fetchDayDataClient(dayStartDate),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}

export async function fetchWeekDataClient(weekDate: Date): Promise<HabitEntitiesWeekRpc> {
  const supabase = createClient();

  const isoDateFormatted = weekDate.toISOString().split("T")[0];

  const { data, error } = await supabase.rpc("fetch_week_data", { _week_start: isoDateFormatted });

  if (error) {
    console.error("Error fetching week data:", error);
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data as HabitEntitiesWeekRpc;
}

export function useWeekData(weekStartDate: Date): DefinedUseQueryResult<HabitEntitiesWeekRpc> {
  if (!weekStartDate) {
    throw new Error("Date parameter is required");
  }

  const isoWeek = weekStartDate.toISOString();
  const queryKey = ["weekData", isoWeek];

  return useQuery({
    queryKey,
    queryFn: () => fetchWeekDataClient(weekStartDate),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}

export async function fetchMonthDataClient(monthDate: Date): Promise<HabitEntitiesMonthRpc> {
  const supabase = createClient();

  const isoMonthFormatted = monthDate.toISOString().split("T")[0];

  const { data, error } = await supabase.rpc("fetch_month_data", { _month_start: isoMonthFormatted });

  if (error) {
    throw new Error(error.message || "Failed to fetch month data");
  }

  return data as HabitEntitiesMonthRpc;
}

export function useMonthData(monthStartDate: Date): DefinedUseQueryResult<HabitEntitiesMonthRpc> {
  if (!monthStartDate) {
    throw new Error("Date parameter is required");
  }

  const isoMonth = monthStartDate.toISOString();
  const queryKey = ["monthData", isoMonth];

  return useQuery({
    queryKey,
    queryFn: () => fetchMonthDataClient(monthStartDate),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}

export async function getLocalizedHabitsClient(timezone: string) {
  const supabase = createClient();

  const now = new Date();
  const localTime = fromZonedTime(now, timezone);

  const currentWeekStart = startOfWeek(localTime, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(localTime, { weekStartsOn: 1 });
  const nextWeekStart = startOfWeek(addWeeks(localTime, 1), { weekStartsOn: 1 });

  const [activeHabits, futureHabits, pastHabits] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .or(
        `and(start_date.lte.${currentWeekStart.toISOString()},end_date.is.null),and(start_date.lte.${currentWeekStart.toISOString()},end_date.gte.${currentWeekEnd.toISOString()})`,
      ),
    supabase.from("habits").select("*").gte("start_date", nextWeekStart.toISOString()),
    supabase.from("habits").select("*").lt("end_date", currentWeekStart.toISOString()),
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