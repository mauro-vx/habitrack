import { Database } from "@/lib/supabase/database.types";

export type Habit = Database["public"]["Tables"]["habits"]["Row"] & {
  habit_statuses: Database["public"]["Tables"]["habit_statuses"]["Row"][];
};

export type Habits = Habit[];