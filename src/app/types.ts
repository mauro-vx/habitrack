import { Tables } from "@/lib/supabase/database.types";
import { HabitState } from "@/app/enums";

export type HabitInfo = Tables<"habits">;
export type HabitStatus = Tables<"habit_statuses">;

export type HabitEntity = HabitInfo & { habit_statuses: HabitStatus | null } ;
export type HabitEntities = HabitEntity[];

export type HabitStatusesMapped = Record<number, HabitStatus> | Record<number, never>;

export type HabitEntityRpc = HabitInfo & { habit_statuses: HabitStatusesMapped };
export type HabitEntitiesRpc = HabitEntityRpc[];

export type ShowHabitState = Extract<
  HabitState,
  HabitState.PENDING | HabitState.PROGRESS | HabitState.DONE | HabitState.SKIP | HabitState.INCOMPLETE
>;

export type SelectHabitState = Extract<
  HabitState,
  HabitState.DONE | HabitState.UNDONE | HabitState.SKIP | HabitState.UNSKIP
>;
