import { Tables } from "@/lib/supabase/database.types";
import { HabitState } from "@/app/enums";

export type HabitInfo = Tables<"habits">;

export type HabitStatus = Tables<"habit_statuses">;
export type HabitStatuses = HabitStatus[];

export type HabitEntity = HabitInfo & { habit_statuses: HabitStatuses };
export type HabitEntities = HabitEntity[];

export type HabitEntitiesDayRpc = (HabitEntity & { habit_status: HabitStatus | null })[];

export type HabitStatusesMapped = Record<number, HabitStatus> | Record<number, never>;
export type HabitEntityWeekRpc = HabitInfo & { habit_statuses: HabitStatusesMapped };
export type HabitEntitiesWeekRpc = HabitEntityWeekRpc[];

export type HabitEntitiesMonthRpc = (HabitEntity & { habit_statuses: Record<string, HabitStatus> | null })[];

export type ShowHabitState = Extract<
  HabitState,
  HabitState.PENDING | HabitState.PROGRESS | HabitState.DONE | HabitState.SKIP | HabitState.INCOMPLETE
>;

export type SelectHabitState = Extract<
  HabitState,
  HabitState.DONE | HabitState.UNDONE | HabitState.SKIP | HabitState.UNSKIP
>;
