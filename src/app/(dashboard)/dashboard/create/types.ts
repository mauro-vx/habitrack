import type { PostgrestError } from "@supabase/supabase-js";
import { Status, HabitType } from "@/app/enums";

interface CreateValidationErrors {
  name?: string[];
  description?: string[];
  type?: string[];
  days_of_week?: string[];
  target_count?: string[];
  date_range?: string[];
}

export interface CreateHabitState {
  name: string;
  description?: string;
  type: HabitType;
  days_of_week: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, boolean>;
  target_count: number;
  date_range: {
    start_date: Date;
    end_date: Date | null;
  };
  status?: Status;
  validationErrors?: CreateValidationErrors;
  dbError?: PostgrestError | null;
}
