import type { PostgrestError } from "@supabase/supabase-js";

import { HabitType } from "./enums";

type Status = string;

interface EditFormErrors {
  name?: string[];
  description?: string[];
  type?: string[];
  days_of_week?: string[];
  frequency?: string[];
  start_date?: string[];
  end_date?: string[];
}

export interface CreateHabitState {
  name: string;
  description?: string;
  type: HabitType;
  days_of_week: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, boolean>;
  frequency: number;
  start_date: Date;
  end_date: Date | null;
  status?: Status;
  formErrors?: EditFormErrors;
  serverError?: PostgrestError | null;
}
