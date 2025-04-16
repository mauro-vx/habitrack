import { Database } from "@/lib/supabase/database.types";

export type HabitInfo = Database["public"]["Tables"]["habits"]["Row"];

export type HabitStatus = Database["public"]["Tables"]["habit_statuses"]["Row"];
export type HabitStatuses = HabitStatus[];

export type HabitEntity = HabitInfo & { habit_statuses: HabitStatuses };
export type HabitEntities = HabitEntity[];

export type HabitStatusesMapped = Record<number, HabitStatus> | Record<number, never>;
export type HabitEntityRpc = HabitInfo & { habit_statuses: HabitStatusesMapped };
export type HabitEntitiesRpc = HabitEntityRpc[];