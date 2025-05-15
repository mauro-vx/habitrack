import { DefinedUseQueryResult, useQuery } from "@tanstack/react-query";

import { HabitEntitiesWeekRpc, HabitEntitiesDayRpc, HabitEntitiesMonthRpc } from "@/app/types";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function fetchDayDataMapped(year: number, month: number, day: number): Promise<HabitEntitiesDayRpc> {
  const { data, error } = await supabase.rpc("fetch_day_data", { _year: year, _month: month, _day: day });

  if (error) {
    throw new Error(error.message || "Failed to fetch day data");
  }

  return data as HabitEntitiesDayRpc;
}

export function useDayDataMapped(year: number, month: number, day: number): DefinedUseQueryResult<HabitEntitiesDayRpc> {
  const queryKey = ["dayData", year, month, day];

  return useQuery({
    queryKey,
    queryFn: () => fetchDayDataMapped(year, month, day),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}

export async function fetchWeekDataMapped(year: number, week: number): Promise<HabitEntitiesWeekRpc> {
  const { data, error } = await supabase.rpc("fetch_week_data", { _year: year, _week: week });

  if (error) {
    throw new Error(error.message || "Failed to fetch week data");
  }

  return data as HabitEntitiesWeekRpc;
}

export function useWeekDataMapped(year: number, week: number): DefinedUseQueryResult<HabitEntitiesWeekRpc> {
  const queryKey = ["weekData", year, week];

  return useQuery({
    queryKey,
    queryFn: () => fetchWeekDataMapped(year, week),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}

export async function fetchMonthDataMapped(year: number, month: number): Promise<HabitEntitiesMonthRpc> {
  const { data, error } = await supabase.rpc("fetch_month_data", { _year: year, _month: month });

  if (error) {
    throw new Error(error.message || "Failed to fetch month data");
  }

  return data as HabitEntitiesMonthRpc;
}

export function useMonthDataMapped(year: number, month: number): DefinedUseQueryResult<HabitEntitiesMonthRpc> {
  const queryKey = ["monthData", year, month];

  return useQuery({
    queryKey,
    queryFn: () => fetchMonthDataMapped(year, month),
    // @ts-expect-error: TypeScript doesn't recognize 'suspense' as a valid property
    suspense: true,
  });
}
